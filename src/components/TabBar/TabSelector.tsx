import styled from "@emotion/styled";
import React from "react";

type Props = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export const TabSelector = ({ isActive, label, onClick }: Props) => {
  return (
    <Container className={isActive ? "active" : ""} onClick={onClick}>
      <Label className={isActive ? "active" : ""}>{label}</Label>
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
  padding: 1rem;
  border-radius: 10px;
  border-width: 1px;
  border-color: #555555;
  border-style: solid;
  margin-right: 1rem;
  &.active {
    background-color: teal;
  }
`;

const Label = styled.p`
  font-size: 17px;
  margin: 0;

  &.active {
    font-weight: bold;
  }
`;
