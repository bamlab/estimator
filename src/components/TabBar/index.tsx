import styled from "@emotion/styled";
import React from "react";
import { TabSelector } from "./TabSelector";

type Props = {
  options: { label: string; id: string }[];
  activeId: string;
  onChange: (id: string) => void;
};

export const TabBar = ({ options, activeId, onChange }: Props) => {
  return (
    <Container>
      {options.map((option) => (
        <TabSelector
          key={option.id}
          label={option.label}
          isActive={activeId === option.id}
          onClick={() => onChange(option.id)}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
