import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import {
  Developer,
  Production,
  Project,
  Release,
  Staffing,
  Team,
  Version,
} from "@prisma/client";
import {
  Button,
  Col,
  Container,
  FormElement,
  Input,
  Link,
  Modal,
  Row,
  Spacer,
  Text,
  Textarea,
  useInput,
} from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../../../../src/constants";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { makeReleaseChartData } from "../../../../../../src/modules/bdc/makeReleaseChartData";
import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../../../../src/utils/formatDate";
import { CREATE_RELEASE_DTO } from "../../../../../api/releases";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import mean from "lodash/mean";

type FULL_TEAM_DTO = Team & {
  developers: (Developer & { staffing: Staffing[] })[];
};
type Props = {
  release: Omit<Release, "forecastEndDate"> & {
    version: Omit<Version, "starDate"> & {
      project: Project;
      startDate: string;
    };
    productions: (Omit<Production, "date"> & { date: string })[];
    forecastEndDate: string;
  };
  team: FULL_TEAM_DTO;
};

type Params = {
  projectId: string;
  versionId: string;
  rcId: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | {},
  Params
> = async ({ params }) => {
  if (!params || !params.projectId) {
    return {
      redirect: "/projects",
      props: {},
    };
  }

  const { rcId, projectId } = params;

  const release = await wretch(`${ROOT_URL}/releases/${rcId}`)
    .get()
    .json<Release>();

  const team = await wretch(`${ROOT_URL}/projects/${projectId}/ressources`)
    .get()
    .json<FULL_TEAM_DTO>();

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
      release,
      team,
    },
  };
};

export default function ReleasePage({ release, team }: Props) {
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
  const startDate = parseISO(release.version.startDate);

  const data = useMemo(
    () =>
      makeReleaseChartData({
        productivity: productivityMean,
        endDate: parseISO(release.forecastEndDate),
        startDate,
        volume: release.volume,
        productions: done,
      }),
    [release, done, productivityMean]
  );

  const dates = Array.from(
    Array(
      differenceInBusinessDays(parseISO(release.forecastEndDate), startDate) + 1
    ).keys()
  ).map((_, index) => addBusinessDays(startDate, index));

  useEffect(() => {
    const tmp: Record<string, { id: string; value: number }> = {};

    release.productions.forEach((production) => {
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
    const production = await wretch(`${ROOT_URL}/releases/${release.id}`)
      .post({
        id,
        date,
        done: value,
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
      versionId: release.version.id,
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
    const newRelease = await createNewRelease({
      comment,
      forecastEndDate: new Date(endDate),
      volume: parseInt(volume),
    });
    closeReleaseModal();
    toast("Nouvelle release créée", { type: "success" });
    router.push(
      `/projects/${release.version.projectId}/versions/${release.versionId}/rc/${newRelease.id}`
    );
  };

  return (
    <Container>
      <Row>
        <Col
          span={1}
          style={{
            borderRadius: 10,
            backgroundColor: "#CBECFE",
            padding: "1rem",
            marginTop: "2rem",
          }}
        >
          <Link href="/projects">Projets</Link>
          <Spacer y={1} />
          <Link href={`/projects/${release.version.projectId}/versions`}>
            Versions
          </Link>
        </Col>
        <Spacer x={2} />
        <Col span={12}>
          <Header>
            <h2>{release.version.project.name}</h2>
            <h3>{`${release.version.name} (${release.name})`}</h3>
          </Header>

          <p>
            {`Date de fin de jalon : ${formatDate(
              new Date(release.forecastEndDate)
            )}`}
          </p>

          <Row>
            <Col>
              <LineChart width={800} height={400} data={data} id="bdc">
                <Line type="linear" stroke="#0059ff" dataKey="done" />
                <Line
                  type="linear"
                  stroke="#0059ff"
                  dataKey="forecast"
                  strokeDasharray="5 5"
                />
                <Line type="linear" stroke="#ff0000" dataKey="standard" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
              </LineChart>
              <Spacer y={3} />
              <Button onPress={() => setIsReleaseModalVisible(true)}>
                Créer une nouvelle release
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
                            setProductionDay(
                              doneThisDay.id,
                              day,
                              e.target.value
                            );
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
      </Row>

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
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
