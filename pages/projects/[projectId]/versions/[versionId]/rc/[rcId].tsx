import React from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Project, Release, Version } from "@prisma/client";
import { Container, Link, Spacer } from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../../../../src/constants";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type Props = {
  release: Release & { version: Version & { project: Project } };
};

type Params = {
  projectId: string;
  versionId: string;
  rcId: string;
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

  const { rcId } = params;

  const release = await wretch(`${ROOT_URL}/releases/${rcId}`).get().json();

  return {
    props: { release },
  };
};

const DATA = [
  {
    name: "Lun",
    done: 12,
    standard: 12,
  },
  {
    name: "Mar",
    done: 9,
    standard: 10,
  },
  {
    name: "Mer",
    done: 10,
    standard: 6,
  },
  {
    name: "Jeu",
    done: 3,
    standard: 3,
  },
  {
    name: "Ven",
    done: 2,
    standard: 0,
  },
];

export default function ReleasePage({ release }: Props) {
  return (
    <Container>
      <Header>
        <h2>{release.version.project.name}</h2>
        <h3>{`Version ${release.version.name}, RC ${release.id}`}</h3>
      </Header>

      <p>
        {`Date de fin de jalon : ${new Date(
          release.forecastEndDate
        ).toLocaleDateString()}`}
      </p>

      <LineChart width={700} height={400} data={DATA}>
        <Line type="monotone" stroke="#0059ff" dataKey="done" />
        <Line type="monotone" stroke="#ff0000" dataKey="standard" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
