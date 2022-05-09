import React, { useState } from "react";
import styled from "@emotion/styled";
import { Project, Release, Version } from "@prisma/client";
import {
  Button,
  Col,
  Container,
  Input,
  Link,
  Modal,
  Spacer,
  Text,
  Textarea,
  useInput,
} from "@nextui-org/react";
import { useRouter } from "next/dist/client/router";

import { toast } from "react-toastify";
import wretch from "wretch";
import { ROOT_URL } from "../../../../src/constants";
import { GetServerSideProps } from "next";

type Props = {
  project: Project;
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
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`
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
  const router = useRouter();
  const { bindings: versionNameBindings, value: versionName } = useInput("");
  const { bindings: startDateBindings, value: startDate } = useInput("");
  const { bindings: scopeBindings, value: scope } = useInput("");
  const { bindings: volumeBindings, value: volume } = useInput("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);

  const createNewVersion = async () => {
    if (!versionName) {
      setErrorMessage("Remplis tous les champs");
      return;
    }
    const version: Version & { releases: Release[] } = await wretch(
      `${ROOT_URL}/versions`
    )
      .post({
        projectId: project.id,
        name: versionName,
        startDate,
        scope,
        volume,
      })
      .json();

    setIsVersionModalVisible(false);
    if (version) {
      toast(`La version ${version.name} a bien été crée`);
      router.push(
        `/projects/${project.id}/versions/${version.id}/rc/${version.releases[0].id}`
      );
    } else {
      toast(`Une erreur s'est porduite`, { type: "error" });
    }
  };

  return (
    <Container>
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
        <Modal open={isVersionModalVisible}>
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Créer une nouvelle version
            </Text>
          </Modal.Header>

          <Modal.Body>
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
          </Modal.Body>
        </Modal>
      </Col>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
