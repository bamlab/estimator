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
import { validateStartDate } from "../../../../src/modules/version/helpers/validateStartDate";
import { HelperText } from "../../../../src/modules/version/components/HelperText";
import { VersionFormModal } from "../../../../src/modules/version/components/VersionFormModal";

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
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);

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
        <VersionFormModal
          project={project}
          isVisible={isVersionModalVisible}
          setIsVisible={setIsVersionModalVisible}
        />
      </Col>
    </MainLayout>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
