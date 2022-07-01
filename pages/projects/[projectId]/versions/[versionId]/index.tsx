import React from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Project, Release, Version } from "@prisma/client";
import { Container, Link, Spacer } from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../../../src/constants";

type Props = {
  project: Project;
  version: Version & { releases: Release[] };
};

type Params = {
  projectId: string;
  versionId: string;
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

  const { projectId, versionId } = params;

  const project = await wretch(`${ROOT_URL}/projects/${projectId}`)
    .get()
    .json();

  const version = await wretch(`${ROOT_URL}/versions/${versionId}`)
    .get()
    .json();

  return {
    props: { project, version },
  };
};

export default function VersionPage({ project, version }: Props) {
  return (
    <Container>
      <Header>
        <h2>{project.name}</h2>
        <h3>{version.name}</h3>
      </Header>

      {version.releases.map((release) => (
        <div key={release.id}>
          <Link
            href={`/projects/${project.id}/versions/${version.id}/rc/${release.id}`}
          >
            {release.name}
          </Link>
          <Spacer y={3} />
        </div>
      ))}
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
