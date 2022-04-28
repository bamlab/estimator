import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Select from "react-select";
import { Project, Version } from "@prisma/client";
import {
  Button,
  Col,
  Container,
  Input,
  Row,
  Spacer,
  Textarea,
  useInput,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

import { toast } from "react-toastify";
import wretch from "wretch";
import { ROOT_URL } from "../../../../src/constants";
import { GetServerSideProps } from "next";

type Props = { project: Project; versions: Version[] };

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
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`
  ).then((res) => res.json());

  const versions: Version[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/versions`
  ).then((res) => res.json());

  return {
    props: { versions, project },
  };
};

export default function VersionPage({ versions, project }: Props) {
  const [versionId, setVersionId] = useState("");
  const router = useRouter();
  const { bindings: versionNameBindings, value: versionName } = useInput("");
  const { bindings: startDateBindings, value: startDate } = useInput("");
  const { bindings: scopeBindings, value: scope } = useInput("");
  const { bindings: volumeBindings, value: volume } = useInput("");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewVersion = async () => {
    if (!versionName) {
      setErrorMessage("Remplis tous les champs");
      return;
    }
    const version = await wretch(`${ROOT_URL}/versions`)
      .post({
        projectId: project.id,
        name: versionName,
        startDate,
        scope,
        volume,
      })
      .json();

    console.log(" version", version);

    if (version) {
      toast(`La version ${version.name} a bien été crée`);
      router.push(`/projects/${project.id}/versions/${version.id}`);
    } else {
      toast(`Une erreur s'est porduite`, { type: "error" });
    }
  };

  const options = useMemo(
    () =>
      versions
        ? versions.map((project) => ({
            value: project.id,
            label: project.name,
          }))
        : [],
    []
  );

  return (
    <Container>
      <Header>
        <h1>{project.name}</h1>
      </Header>

      <h2>Choisir une version</h2>
      <Select
        options={options}
        onChange={(option) => {
          if (option) {
            setVersionId(option.value);
          }
        }}
      />
      <Spacer y={1} />
      <Link href={`/projects/${project.id}/versions/${versionId}`}>
        <Button>{"Suivant"}</Button>
      </Link>
      <Spacer y={2} />
      <h2>Créer une version</h2>

      <Col>
        <Input
          label="Nom de la version"
          placeholder="Version 1"
          {...versionNameBindings}
          color={errorMessage ? "error" : "default"}
          status={errorMessage ? "error" : "default"}
        />
        <Spacer y={1} />
        <Input label="Date de début" type="date" {...startDateBindings} />
        <Spacer y={1} />
        <Textarea label="Scope" {...scopeBindings} />
        <Spacer y={1} />
        <Input label="Volume" type="number" {...volumeBindings} />
        <Spacer y={1} />

        <Button onClick={createNewVersion} color={"success"}>
          Créer une nouvelle version
        </Button>
        <Spacer y={2} />
      </Col>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
