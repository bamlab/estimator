import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Release } from "@prisma/client";
import {
  Button,
  Col,
  Modal,
  Row,
  Spacer,
  Text,
  Textarea,
} from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../../../src/constants";
import { makeVersionChartData } from "../../../../../src/modules/bdc/helpers/makeVersionChartData";
import { parseISO } from "date-fns";
import { formatDate } from "../../../../../src/utils/formatDate";
import { CREATE_RELEASE_DTO } from "../../../../api/releases";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { MainLayout } from "../../../../../src/components/Layouts/MainLayout";
import {
  FullProjectDTO,
  ReleaseDTO,
  VersionDTO,
} from "../../../../../src/modules/project/types";
import { Chart } from "../../../../../src/modules/bdc/views/Chart";
import { getVersionStartAndEndDate } from "../../../../../src/modules/version/helpers/getVersionStartAndEndDate";
import { ProductionForm } from "../../../../../src/modules/production/views/ProductionForm";
import { AdjustmentHistoryTable } from "../../../../../src/modules/production/views/AdjustmentHistoryTable";
import { VolumeInput } from "../../../../../src/modules/version/components/VolumeInput";
import { Controller, useForm } from "react-hook-form";
import { HelperText } from "../../../../../src/modules/version/components/HelperText";
import { EndDateInput } from "../../../../../src/modules/version/components/EndDateInput";
import { InformationLabel } from "../../../../../src/modules/version/components/InformationLabel";

type Props = {
  project: FullProjectDTO;
  release: ReleaseDTO;
  version: VersionDTO;
};

type Params = {
  projectId: string;
  versionId: string;
  rcId: string;
};

export type ReleaseFormData = {
  endDate: string;
  comment: string;
  volume: string;
};

const REQUIRED_FIELD_ERROR_TEXT = "Ce champ est requis";

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
      version,
    },
  };
};

export default function VersionPage({
  release,
  version,
  project: projectInitialInfo,
}: Props) {
  const [project, setProject] = useState<FullProjectDTO>(projectInitialInfo);
  const [isReleaseModalVisible, setIsReleaseModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReleaseFormData>({
    mode: "all",
    defaultValues: {
      endDate: release.forecastEndDate.split("T")[0],
      comment: "",
      volume: release.volume.toString(),
    },
  });

  const endDate = watch("endDate");
  const comment = watch("comment");
  const volume = watch("volume");

  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const { startDate: productionStartDate, endDate: productionEndDate } =
    getVersionStartAndEndDate(version);

  const data = useMemo(
    () =>
      makeVersionChartData({
        version,
        project,
      }),
    [version, project]
  );

  const setProductionAndUpdateProject = async (
    date: Date,
    id: string,
    value: string
  ) => {
    await wretch(`${ROOT_URL}/productions`)
      .post({
        id,
        date,
        done: value,
        projectId: project.id,
      })
      .json();

    const updatedProject: FullProjectDTO = await wretch(
      `${ROOT_URL}/projects/${project.id}/full`
    )
      .get()
      .json();

    setProject(updatedProject);
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
    setValue("comment", "");
    setIsError(false);
    setIsReleaseModalVisible(false);
  };

  const handleCreateNewRelease = async (formData: ReleaseFormData) => {
    if (!comment) {
      setIsError(true);
      return;
    }
    await createNewRelease({
      comment: formData.comment,
      forecastEndDate: new Date(formData.endDate),
      volume: parseInt(formData.volume),
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

  const positiveChartPoints = data.filter((point) => !(point.remaining < 0));

  const remainingVolumeArray = data
    .filter((point) => !isNaN(point.remaining))
    .map((point) => point.remaining);
  const chartPointRemaining = Math.min(...remainingVolumeArray);

  return (
    <MainLayout projectId={project.id}>
      <Col span={12}>
        <Header>
          <h2>{project.name}</h2>
          <h3>{`${version.name} (${release.name})`}</h3>
        </Header>

        <p>
          {`Date de fin de jalon : ${formatDate(
            new Date(sortedReleases[sortedReleases.length - 1].forecastEndDate)
          )}`}
        </p>

        <Row>
          <Col>
            <Chart data={data} sortedReleases={sortedReleases}></Chart>
            <Spacer y={1} />
            {data.length - positiveChartPoints.length > 0 && (
              <Text style={{ color: "red" }}>
                {`You have completed more ${project.unit.toLocaleLowerCase()}s than expected this sprint, please edit the volume`}
              </Text>
            )}
            <Spacer y={1} />
            <Button onPress={() => setIsReleaseModalVisible(true)}>
              Créer une nouvelle release candidate
            </Button>
            <Spacer y={2} />
            <h3>Adjustment History</h3>

            <AdjustmentHistoryTable
              endDate={productionEndDate}
              releases={sortedReleases}
            />
          </Col>
          <Spacer x={3} />

          <ProductionForm
            project={project}
            startDate={productionStartDate}
            endDate={productionEndDate}
            onProductionSet={setProductionAndUpdateProject}
          />

          <Spacer y={3} />
        </Row>
      </Col>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isReleaseModalVisible}
        onClose={closeReleaseModal}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Nouvelle release
          </Text>
        </Modal.Header>
        <form onSubmit={handleSubmit(handleCreateNewRelease)}>
          <Modal.Body>
            <div>
              <FormLabel>Revised end date</FormLabel>
              {
                //original French label:
                //`Date de fin prévue`
              }
              <InformationLabel
                style={{ marginBottom: "10px" }}
                label={"Original End Date"}
                value={control._defaultValues.endDate}
              />
              <EndDateInput
                control={control}
                startDate={version.startDate}
                endDate={endDate}
                volume={volume}
                project={project}
              />
            </div>
            <FormLabel>
              Adjust volume (in {project.unit.toLocaleLowerCase()}s)
            </FormLabel>
            {
              //original French label:
              //`Volume (en ${project.unit.toLocaleLowerCase()}s)`
            }
            <VolumeInformation>
              <InformationLabel
                style={{ marginRight: "10px" }}
                label={"Original Volume"}
                value={control._defaultValues.volume}
              />
              <InformationLabel
                style={{ marginLeft: "10px" }}
                label={"Remaining Volume"}
                value={chartPointRemaining}
              />
            </VolumeInformation>

            <VolumeInput
              control={control}
              startDate={version.startDate}
              endDate={endDate}
              project={project}
            />

            <Controller
              name="comment"
              control={control}
              rules={{ required: REQUIRED_FIELD_ERROR_TEXT }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  fullWidth
                  label="Problem solving description" //"Commentaire"
                  status={isError ? "error" : undefined}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <HelperText
              color={errors.endDate ? "error" : "default"}
              text={errors.endDate?.message}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              auto
              color={"success"}
              type="submit"
              disabled={(volume && endDate && comment) === ""}
            >
              Créer la nouvelle release
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </MainLayout>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;

const VolumeInformation = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const FormLabel = styled(Text)`
  font-size: 14px;
  margin-bottom: 6px;
`;
