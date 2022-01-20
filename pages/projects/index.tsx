import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Select from "react-select";
import { Project } from "@prisma/client";
import { Button, Container, Spacer } from "@nextui-org/react";
import Link from "next/link";

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
  const [projectId, setProjectId] = useState("");

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
    <Container>
      <Header>
        <h2>Projects page</h2>
      </Header>

      <h2>Choisir un projet</h2>
      <Select
        options={options}
        onChange={(option) => {
          if (option) {
            setProjectId(option.value);
          }
        }}
      />
      <Spacer y={1} />

      <Link href={`/projects/${projectId}`}>
        <Button>{"C'est parti !"}</Button>
      </Link>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
