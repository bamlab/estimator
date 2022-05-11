import { Col, Link, Spacer } from "@nextui-org/react";
import React from "react";

type Props = {
  projectId: string;
};

export const NavBar = ({ projectId }: Props) => {
  return (
    <Col
      span={1}
      style={{
        borderRadius: 10,
        backgroundColor: "#CBECFE",
        padding: "1rem",
        marginTop: "2rem",
      }}
    >
      <Link href="/projects">Projets</Link>
      <Spacer y={1} />
      <Link href={`/projects/${projectId}/versions`}>Versions</Link>
      <Spacer y={1} />
      <Link href={`/projects/${projectId}/ressources`}>Ressources</Link>
    </Col>
  );
};
