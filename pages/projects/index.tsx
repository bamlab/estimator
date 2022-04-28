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
  const { bindings: projectNameBindings, value: projectName } = useInput("");
  const { bindings: startDateBindings, value: startDate } = useInput("");
  const { bindings: endDateBindings, value: endDate } = useInput("");
  const { bindings: unitBindings, value: unit } = useInput("");
  const { bindings: productivityBindings, value: productivity } = useInput("");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewProject = async () => {
    if (!projectName || !startDate || !endDate || !unit || !productivity) {
      setErrorMessage("Remplis tous les champs");
      return;
    }
    const response = await wretch(`${ROOT_URL}/projects`)
      .post({
        name: projectName,
        startDate,
        endDate,
        unit,
        productivity,
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
        <h1>Les Projets M33</h1>
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
      <Spacer y={2} />
      <h2>Créer un projet</h2>

      <Row align="flex-end">
        <Input
          label="Nom du projet"
          placeholder="Yomoni"
          {...projectNameBindings}
          color={errorMessage ? "error" : "default"}
          status={errorMessage ? "error" : "default"}
        />
        <Spacer x={3} />
        <Input
          label="Date de début"
          placeholder="28/04/2022"
          type="date"
          {...startDateBindings}
        />
        <Spacer x={3} />
        <Input
          label="Date de fin"
          placeholder="28/04/2022"
          type="date"
          {...endDateBindings}
        />
        <Spacer x={3} />
        <Input label="Unité" placeholder="Ticket" {...unitBindings} />
        <Spacer x={3} />
        <Input
          label="Productivité initiale"
          placeholder="1"
          type="number"
          {...productivityBindings}
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
