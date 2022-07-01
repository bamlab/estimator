import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button, Col, Spacer } from "@nextui-org/react";
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
  const router = useRouter();

  const navigateToVersion = (version: VersionDTO) =>
    router.push(`/projects/${project.id}/versions/${version.id}`);

  return (
    <MainLayout projectId={project.id}>
      <Col>
        <Header>
          <h1>{project.name}</h1>
        </Header>
        {project.versions.map((version, index) => (
          <PaddingBox key={version.id}>
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
  padding-top: 25px;
  margin-left: 1rem;
`;
