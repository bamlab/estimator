import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Select from "react-select";
import { Project } from "@prisma/client";
import {
  Button,
  Container,
  Input,
  Row,
  Spacer,
  useInput,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { ROOT_URL } from "../../src/constants";
import { toast } from "react-toastify";
import wretch from "wretch";

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
  const router = useRouter();
  const { bindings, value } = useInput("");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewProject = async () => {
    if (!value) {
      setErrorMessage("Choisis le nom du projet");
      return;
    }
    const response = await wretch(`${ROOT_URL}/projects`)
      .post({
        name: value,
      })
      .json();

    if (response.project) {
      toast("Super ! C'est parti pour une nouvelle aventure 🚀");
      router.push(`/projects/${response.project.id}`);
    }
  };

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
      <Spacer y={1} />
      <Row align="flex-end">
        <Input
          label="Nom du projet"
          placeholder="Yomoni"
          {...bindings}
          color={errorMessage ? "error" : "default"}
          status={errorMessage ? "error" : "default"}
        />
        <Spacer x={3} />
        <Button onClick={createNewProject} color={"success"}>
          Créer un nouveau projet
        </Button>
      </Row>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
