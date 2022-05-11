import { Container, Row, Spacer } from "@nextui-org/react";
import React, { FunctionComponent } from "react";
import { NavBar } from "../NavBar/NavBar";

type Props = { projectId: string };

export const MainLayout: FunctionComponent<Props> = ({
  projectId,
  children,
}) => {
  return (
    <Container>
      <Row>
        <NavBar projectId={projectId} />
        <Spacer x={2} />
        {children}
      </Row>
    </Container>
  );
};
