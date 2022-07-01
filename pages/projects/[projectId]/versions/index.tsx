import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button, Col, Link, Spacer } from "@nextui-org/react";
import wretch from "wretch";
import { GetServerSideProps } from "next";
import { MainLayout } from "../../../../src/components/Layouts/MainLayout";
import { VersionFormModal } from "../../../../src/modules/version/components/VersionFormModal";
import { ROOT_URL } from "../../../../src/constants";
import { FullProjectDTO } from "../../../../src/modules/project/types";

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

  return {
    props: { project },
  };
};

export default function VersionPage({ project }: Props) {
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);

  return (
    <MainLayout projectId={project.id}>
      <Col>
        <Header>
          <h1>{project.name}</h1>
        </Header>

        {project.versions.map((version) => (
          <>
            <h3 key={version.id}>{version.name}</h3>
            <Col>
              {version.releases.map((release) => (
                <>
                  <Link
                    key={release.id}
                    href={`/projects/${project.id}/versions/${version.id}/rc/${release.id}`}
                  >
                    <a>{release.name}</a>
                  </Link>
                  <Spacer y={1} />
                </>
              ))}
            </Col>
          </>
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
