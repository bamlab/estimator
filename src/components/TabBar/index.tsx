import styled from "@emotion/styled";
import React from "react";
import { tabId } from "../../../pages/db";
import { TabSelector } from "./TabSelector";

type Props = {
  options: { label: string; id: tabId }[];
  activeId: tabId;
  onChange: (id: tabId) => void;
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
