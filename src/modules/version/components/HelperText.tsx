import { SimpleColors, Text } from "@nextui-org/react";
import React from "react";

interface Props {
  text?: string;
  color?: SimpleColors;
  italic?: boolean;
}

export const HelperText: React.FC<Props> = ({
  text = "",
  color = "default",
  italic = false,
}) => (
  <Text color={color} size={12} i={italic} css={{ display: "block" }}>
    {text}
  </Text>
);
