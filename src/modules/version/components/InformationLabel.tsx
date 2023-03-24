import React from "react";
import { Text } from "@nextui-org/react";
import styled from "@emotion/styled";

interface Props {
  label: string;
  value: string | number | undefined;
}
export const InformationLabel: React.FC<Props> = ({ label, value }) => {
  return (
    <LabelContainer>
      <Text size={15}>{label}</Text>
      <Text size={15}>{value}</Text>
    </LabelContainer>
  );
};

const LabelContainer = styled.div`
  display: flex;
  background-color: #6c99f2;
  border-radius: 10px;
  justify-content: space-between;
  height: 33px;
  align-items: center;
  padding: 0px 8px;
`;
