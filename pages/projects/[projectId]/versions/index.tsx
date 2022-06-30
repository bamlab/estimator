import React, { useState } from "react";
import styled from "@emotion/styled";
import { Project, Release, Version } from "@prisma/client";
import { Button, Col, Link, Spacer } from "@nextui-org/react";
import wretch from "wretch";
import { GetServerSideProps } from "next";
import { MainLayout } from "../../../../src/components/Layouts/MainLayout";
import { VersionFormModal } from "../../../../src/modules/version/components/VersionFormModal";
import { ProjectWithDevelopersAndStaffingDTO } from "../../../../src/modules/ressources/initializeRessourcesData";

type Props = {
  project: ProjectWithDevelopersAndStaffingDTO;
  versions: (Version & { releases: Release[] })[];
};

type Params = {
  projectId: string;
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

  const { projectId } = params;

  const project = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/full`
  ).then((res) => res.json());

  const versions: Version[] = await wretch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/versions`
  )
    .get()
    .json();

  return {
    props: { versions, project },
  };
};

export default function VersionPage({ versions, project }: Props) {
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);

  return (
    <MainLayout projectId={project.id}>
      <Col>
        <Header>
          <h1>{project.name}</h1>
        </Header>

        {versions.map((version) => (
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
