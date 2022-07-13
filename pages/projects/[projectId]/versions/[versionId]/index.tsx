import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Release } from "@prisma/client";
import {
  Button,
  Col,
  FormElement,
  Input,
  Modal,
  Row,
  Spacer,
  Text,
  Textarea,
  useInput,
} from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../../../src/constants";
import { makeVersionChartData } from "../../../../../src/modules/bdc/helpers/makeVersionChartData";
import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../../../src/utils/formatDate";
import { CREATE_RELEASE_DTO } from "../../../../api/releases";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import mean from "lodash/mean";
import { MainLayout } from "../../../../../src/components/Layouts/MainLayout";
import {
  FullProjectDTO,
  ReleaseDTO,
  TeamDTO,
  VersionDTO,
} from "../../../../../src/modules/project/types";
import { Chart } from "../../../../../src/modules/bdc/views/Chart";

type Props = {
  project: FullProjectDTO;
  release: ReleaseDTO;
  team: TeamDTO;
  version: VersionDTO;
};

type Params = {
  projectId: string;
  versionId: string;
  rcId: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | Record<string, unknown>,
  Params
> = async ({ params }) => {
  if (!params || !params.projectId) {
    return {
      redirect: "/projects",
      props: {},
    };
  }

  const { versionId, projectId } = params;

  const project: FullProjectDTO = await wretch(
    `${ROOT_URL}/projects/${projectId}/full`
  )
    .get()
    .json();
  const version: VersionDTO | undefined = project.versions.find(
    (version) => version.id === versionId
  );
  if (!version)
    return {
      redirect: "/projects",
      props: {},
    };

  const team = project.team;
  const release = version.releases[0];

  if (!release.id) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
      props: {
        release: {},
        team: {},
      },
    };
  }

  return {
    props: {
      project,
      release,
      team,
      version,
    },
  };
};

export default function VersionPage({
  release,
  team,
  version,
  project,
}: Props) {
  const [done, setDone] = useState<
    Record<string, { id: string; value: number }>
  >({});

  const productivityMean = useMemo(() => {
    const developersCount = team.developers.length;
    const productivities = Object.values(done).map(
      (doneThisDay) => doneThisDay.value / developersCount
    );

    return mean(productivities);
  }, [team, done]);

  const [isReleaseModalVisible, setIsReleaseModalVisible] = useState(false);
  const {
    value: comment,
    bindings: commentBindings,
    setValue: setComment,
  } = useInput("");
  const { value: volume, bindings: volumeBindings } = useInput(
    release.volume.toString()
  );
  const { value: endDate, bindings: endDateBindings } = useInput(
    release.forecastEndDate
  );
  const [isError, setIsError] = useState(false);

  const router = useRouter();
  const startDate = parseISO(version.startDate);

  const data = useMemo(
    () =>
      makeVersionChartData({
        version,
      }),
    [done, productivityMean, version, startDate, team.developers]
  );

  const dates = Array.from(
    Array(
      differenceInBusinessDays(parseISO(release.forecastEndDate), startDate) + 1
    ).keys()
  ).map((_, index) => addBusinessDays(startDate, index));

  useEffect(() => {
    const tmp: Record<string, { id: string; value: number }> = {};

    project.productions.forEach((production) => {
      tmp[formatDate(new Date(production.date))] = {
        id: production.id,
        value: production.done,
      };
    });

    setDone(tmp);
  }, []);

  const setProductionDay = async (
    id: string | null,
    date: Date,
    value: string
  ) => {
    const production = await wretch(`${ROOT_URL}/productions`)
      .post({
        id,
        date,
        done: value,
        projectId: project.id,
      })
      .json();

    setDone({
      ...done,
      [formatDate(date)]: {
        id: production.id,
        value: parseInt(value),
      },
    });
  };

  const createNewRelease = ({
    comment,
    forecastEndDate,
    volume,
  }: {
    volume: number;
    comment: string;
    forecastEndDate: Date;
  }) => {
    const data: CREATE_RELEASE_DTO = {
      comment,
      forecastEndDate: forecastEndDate.toISOString(),
      name: "RC" + (parseInt(release.name.split("RC")[1]) + 1),
      versionId: version.id,
      volume,
    };
    return wretch(`${ROOT_URL}/releases`).post(data).json<Release>();
  };

  const closeReleaseModal = () => {
    setComment("");
    setIsError(false);
    setIsReleaseModalVisible(false);
  };

  const handleCreateNewRelease = async () => {
    if (!comment) {
      setIsError(true);
      return;
    }
    await createNewRelease({
      comment,
      forecastEndDate: new Date(endDate),
      volume: parseInt(volume),
    });
    closeReleaseModal();
    toast("Nouvelle release créée", { type: "success" });
    router.reload();
  };

  const sortedReleases = useMemo(
    () =>
      version.releases.sort(
        (r1, r2) =>
          parseISO(r1.createdAt).getTime() - parseISO(r2.createdAt).getTime()
      ),
    [version]
  );

  return (
    <MainLayout projectId={project.id}>
      <Col span={12}>
        <Header>
          <h2>{project.name}</h2>
          <h3>{`${version.name} (${release.name})`}</h3>
        </Header>

        <p>
          {`Date de fin de jalon : ${formatDate(
            new Date(release.forecastEndDate)
          )}`}
        </p>

        <Row>
          <Col>
            <Chart data={data} sortedReleases={sortedReleases}></Chart>
            <Spacer y={3} />
            <Button onPress={() => setIsReleaseModalVisible(true)}>
              Créer une nouvelle release candidate
            </Button>
          </Col>
          <Spacer x={3} />

          <table>
            <thead>
              <tr>
                <th>{"Jour"}</th>
                <th>{"Done"}</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((day) => {
                const doneThisDay =
                  done[formatDate(day)] !== undefined
                    ? {
                        id: done[formatDate(day)].id,
                        value: done[formatDate(day)].value.toString(),
                      }
                    : { value: "", id: "" };

                const changeLocalInputValue = (
                  e: React.ChangeEvent<FormElement>
                ) => {
                  setDone({
                    ...done,
                    [formatDate(day)]: {
                      id: doneThisDay.id,
                      value: parseInt(e.target.value),
                    },
                  });
                };

                return (
                  <tr key={day.toString()}>
                    <td>{formatDate(day)}</td>
                    <td>
                      <Input
                        type="number"
                        aria-label="done"
                        value={doneThisDay.value}
                        onChange={changeLocalInputValue}
                        onBlur={(e) => {
                          setProductionDay(doneThisDay.id, day, e.target.value);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Spacer y={3} />
        </Row>
      </Col>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isReleaseModalVisible}
        onClose={() => {
          setIsReleaseModalVisible(false);
        }}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Nouvelle release
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            fullWidth
            type="date"
            label="Nouvelle date de fin prévisionnelle"
            {...endDateBindings}
          />
          <Input fullWidth label="Nouveau volume" {...volumeBindings} />
          <Textarea
            fullWidth
            label="Commentaire"
            status={isError ? "error" : undefined}
            {...commentBindings}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto onClick={handleCreateNewRelease}>
            Créer la nouvelle release
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
