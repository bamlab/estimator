import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button, Col, Grid, Spacer, Text } from "@nextui-org/react";
import wretch from "wretch";
import { GetServerSideProps } from "next";
import { MainLayout } from "../../../../src/components/Layouts/MainLayout";
import { VersionFormModal } from "../../../../src/modules/version/components/VersionFormModal";
import { ROOT_URL } from "../../../../src/constants";
import {
  FullProjectDTO,
  VersionDTO,
} from "../../../../src/modules/project/types";
import { parseISO } from "date-fns";
import { VersionItem } from "../../../../src/modules/version/components/VersionItem";
import { useRouter } from "next/router";
import { DeleteConfirmationModal } from "../../../../src/modules/project/components/DeleteConfirmationModal";
import { toast } from "react-toastify";

type Props = {
  project: FullProjectDTO;
};

type Params = {
  projectId: string;
};

type DeleteModalState = "no" | "checked" | "all";

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

  const { projectId } = params;

  const project: FullProjectDTO = await wretch(
    `${ROOT_URL}/projects/${projectId}/full`
  )
    .get()
    .json();

  project.versions.sort(
    (v1, v2) =>
      parseISO(v2.startDate).getTime() - parseISO(v1.startDate).getTime()
  );
  project.versions.forEach((version) =>
    version.releases.sort(
      (v1, v2) =>
        parseISO(v2.createdAt).getTime() - parseISO(v1.createdAt).getTime()
    )
  );
  return {
    props: { project },
  };
};

export default function VersionPage({ project }: Props) {
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<DeleteModalState>("no");
  const router = useRouter();

  const deleteChecked = async () => {
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    const deleteList = Array.from(checked).map((x) => x.id);

    try {
      const response = await fetch(
        `/api/projects/${
          project.id
        }/versions?versionIds=${deleteList.toString()}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast(`Deleting Sprints`);
        router.reload();
      } else {
        // eslint-disable-next-line no-console
        console.log("Failed to delete versions");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const deleteAll = async () => {
    const deleteList = Array.from(project.versions).map((x) => x.id);

    try {
      const response = await fetch(
        `/api/projects/${
          project.id
        }/versions?versionIds=${deleteList.toString()}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast(`Deleting Sprints`);
        router.reload();
      } else {
        // eslint-disable-next-line no-console
        console.log("Failed to delete versions");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const navigateToVersion = (version: VersionDTO) =>
    router.push(`/projects/${project.id}/versions/${version.id}`);

  return (
    <MainLayout projectId={project.id}>
      <Col>
        <Header>
          <h1>{project.name}</h1>
        </Header>
        <Spacer y={1} />
        <Grid.Container>
          <Grid xs={6}>
            <Text h4>Sprints</Text>
          </Grid>
          <Grid xs={3}>
            <Button
              style={{ zIndex: 0 }}
              onPress={() => {
                setIsDeleteModalVisible("checked");
              }}
            >
              {"Delete selected sprints"}
            </Button>
            <Spacer x={1} />
            <Button
              style={{ zIndex: 0 }}
              onPress={() => {
                setIsDeleteModalVisible("all");
              }}
            >
              {"Delete all sprints"}
            </Button>
          </Grid>
        </Grid.Container>
        {project.versions.map((version, index) => (
          <PaddingBox key={version.id}>
            <input type="checkbox" id={version.id} />
            <Spacer x={1} />
            <VersionItem
              version={version}
              isLast={index === 0}
              onClick={() => navigateToVersion(version)}
            />
          </PaddingBox>
        ))}

        <Spacer y={2} />

        <Button
          onPress={() => {
            setIsVersionModalVisible(true);
          }}
        >
          {"Créer une nouvelle version"}
        </Button>

        <VersionFormModal
          project={project}
          isVisible={isVersionModalVisible}
          setIsVisible={setIsVersionModalVisible}
        />
        <DeleteConfirmationModal
          isVisible={isDeleteModalVisible}
          setIsVisible={setIsDeleteModalVisible}
          onDeleteConfirm={
            isDeleteModalVisible === "checked" ? deleteChecked : deleteAll
          }
        />
      </Col>
    </MainLayout>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;

const PaddingBox = styled.div`
  display: flex;
  padding-top: 25px;
  margin-left: 1rem;
`;
