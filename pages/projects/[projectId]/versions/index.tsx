import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button, Checkbox, Col, Spacer } from "@nextui-org/react";
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
import { deleteVersion } from "../../../../src/modules/version/usecases/deleteVersion";

type Props = {
  project: FullProjectDTO;
};

type Params = {
  projectId: string;
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
  const [deleteVersionList, setDeleteVersionList] = useState<string[]>([]);
  const [checkAllState, setCheckAllState] = useState<boolean>(false);
  const router = useRouter();

  const navigateToVersion = (version: VersionDTO) =>
    router.push(`/projects/${project.id}/versions/${version.id}`);

  const changeDeleteVersionList = (id: string) => {
    const indexOfId = deleteVersionList.findIndex((element) => element === id);
    if (indexOfId === -1) {
      setDeleteVersionList(deleteVersionList.concat([id]));
    } else {
      setDeleteVersionList(
        deleteVersionList.filter((element) => element !== id)
      );
    }
  };

  const selectAllDeleteAllVersions = () => {
    setCheckAllState(!checkAllState);
    if (!checkAllState) {
      setDeleteVersionList(project.versions.map((version) => version.id));
      return;
    }
    setDeleteVersionList([]);
  };

  const tryDelete = (versionIdsList: string[]) => {
    deleteVersionList.map((versionId) => deleteVersion(project.id, versionId));
    //Error in deleteVersion
    console.log("deleted: ", versionIdsList);
  };

  return (
    <MainLayout projectId={project.id}>
      <Col>
        <Header>
          <h1>{project.name}</h1>
        </Header>
        <ButtonBox>
          <Button
            onPress={() => {
              const confirmBox = window.confirm(
                "Are you sure you want to permanently delete selected sprints?"
              );
              if (confirmBox === true) {
                tryDelete(deleteVersionList);
              }
            }}
          >
            {"Delete selected versions"}
          </Button>
          <SelectAllCheckbox>
            <Checkbox
              aria-label=""
              onChange={async () => {
                selectAllDeleteAllVersions();
              }}
            />
          </SelectAllCheckbox>
        </ButtonBox>
        {project.versions.map((version, index) => (
          <PaddingBox key={version.id}>
            <VersionItem
              version={version}
              isLast={index === 0}
              onClick={() => navigateToVersion(version)}
            />
            <Checkbox
              aria-label=""
              onChange={() => {
                changeDeleteVersionList(version.id);
              }}
              checked={deleteVersionList.includes(version.id)}
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

        <Spacer y={2} />
        <VersionFormModal
          project={project}
          isVisible={isVersionModalVisible}
          setIsVisible={setIsVersionModalVisible}
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
  flex: row;
  padding-top: 25px;
  margin-left: 1rem;
`;

const ButtonBox = styled.div`
  display: flex;
  padding-top: 25px;
  margin-left: 1rem;
  justify-content: flex-end;
`;
const SelectAllCheckbox = styled.div`
  align-self: flex-end;
  padding-left: 25px;
`;
