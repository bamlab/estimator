import React, { useMemo } from "react";
import styled from "@emotion/styled";
import Select from "react-select";
import { Project } from "@prisma/client";

export const getServerSideProps = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects`
  ).then((res) => res.json());

  return {
    props: { projects: response.projects },
  };
};

type Props = { projects: Project[] };

export default function ProjectsPage({ projects }: Props) {
  const options = useMemo(
    () =>
      projects
        ? projects.map((project) => ({
            value: project.id,
            label: project.name,
          }))
        : [],
    []
  );

  return (
    <div>
      <Header>
        <h2>Projects page</h2>
      </Header>
      <h2>Choisir un projet</h2>
      <Select options={options} />
    </div>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
