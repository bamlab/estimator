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
import { CREATE_VERSION_DTO } from "../../../api/projects/[projectId]/versions";
import { MainLayout } from "../../../../src/components/Layouts/MainLayout";
import { Controller, useForm } from "react-hook-form";

type Props = {
  project: Project;
  versions: (Version & { releases: Release[] })[];
};

type Params = {
  projectId: string;
};

type FormData = {
  versionName: string;
  startDate: string;
  endDate: string;
  scope: string;
  volume: string;
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      versionName: "",
      startDate: "",
      endDate: "",
      scope: "",
      volume: "",
    },
  });
  const onSubmit = handleSubmit((data) => createNewVersion(data));

  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);

  const createNewVersion = async (formData: FormData) => {
    const { versionName, startDate, endDate, scope, volume } = formData;

    const body: CREATE_VERSION_DTO = {
      projectId: project.id,
      name: versionName,
      startDate,
      endDate,
      scope,
      volume,
    };
    console.log("body", body);

    const version: Version & { releases: Release[] } = await wretch(
      `${ROOT_URL}/versions`
    )
      .post(body)
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
        <Modal open={isVersionModalVisible}>
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Créer une nouvelle version
            </Text>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={onSubmit}>
              <Controller
                name="versionName"
                control={control}
                rules={{ required: "Ce champ est requis" }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    label="Nom de la version"
                    placeholder="Version 1"
                    color={errors.versionName ? "error" : "default"}
                    helperColor={errors.versionName ? "error" : "default"}
                    status={errors.versionName ? "error" : "default"}
                    helperText={errors.versionName?.message}
                  />
                )}
              />
              <Spacer y={1} />
              <Controller
                name="startDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    label="Date de début"
                    type="date"
                  />
                )}
              />
              <Spacer y={1} />
              <Controller
                name="endDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    label="Date de fin prévue"
                    type="date"
                  />
                )}
              />
              <Spacer y={1} />
              <Controller
                name="scope"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Textarea onChange={onChange} value={value} label="Scope" />
                )}
              />
              <Spacer y={1} />
              <Controller
                name="volume"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    label="Volume"
                    type="number"
                  />
                )}
              />
              <Spacer y={1} />

              <Button color={"success"} type="submit">
                Créer une nouvelle version
              </Button>
              <Spacer y={2} />
            </form>
          </Modal.Body>
        </Modal>
      </Col>
    </MainLayout>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
