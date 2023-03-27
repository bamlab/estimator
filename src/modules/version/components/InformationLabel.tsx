import React from "react";
import { Text } from "@nextui-org/react";
import styled from "@emotion/styled";

interface Props {
  label: string;
  value: string | number | undefined;
  style?: object;
}
export const InformationLabel: React.FC<Props> = ({ label, value, style }) => {
  return (
    <LabelContainer style={style}>
      <Text size={14}>{label}</Text>
      <Text size={14}>{value}</Text>
    </LabelContainer>
  );
};

const LabelContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: #6c99f2;
  border-radius: 10px;
  justify-content: space-between;
  height: 33px;
  align-items: center;
  padding: 0px 8px;
`;
