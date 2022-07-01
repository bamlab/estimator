import React from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Project } from "@prisma/client";
import { Button, Container, Link, Spacer } from "@nextui-org/react";
import { ROOT_URL } from "../../../src/constants";
import wretch from "wretch";
import { Chart, People } from "react-iconly";
type Props = {
  project: Project;
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

  const project = await wretch(`${ROOT_URL}/projects/${projectId}`)
    .get()
    .json();

  return {
    props: { project },
  };
};

export default function ProjectPage({ project }: Props) {
  return (
    <Container>
      <Header>
        <h2>{project.name}</h2>
      </Header>

      <Link href={`/projects/${project.id}/versions`}>
        <Button icon={<Chart />}>Versions</Button>
      </Link>
      <Spacer y={1} />
      <Link href={`/projects/${project.id}/ressources`}>
        <Button icon={<People />}>Ressources</Button>
      </Link>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
