import { SimpleColors, Text } from "@nextui-org/react";
import React from "react";

interface Props {
  text?: string;
  color?: SimpleColors;
}

export const HelperText: React.FC<Props> = ({
  text = "",
  color = "default",
}) => (
  <Text color={color} size={12}>
    {text}
  </Text>
);
