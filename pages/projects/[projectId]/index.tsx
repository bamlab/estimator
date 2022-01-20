import React from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Project } from "@prisma/client";
import { Link } from "@nextui-org/react";

type Props = {
  project: Project;
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
    `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`
  ).then((res) => res.json());

  return {
    props: { project },
  };
};

export default function ProjectPage({ project }: Props) {
  return (
    <div>
      <Header>
        <h2>{project.name}</h2>
      </Header>
      <Link href={`/estimation/${project.id}`}>Estimation</Link>
    </div>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
