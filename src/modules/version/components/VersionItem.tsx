import { Row, Spacer, Text } from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import React from "react";
import { VersionDTO } from "../../project/types";
import { getVersionColor } from "../helpers/getVersionColor";

interface Props {
  version: VersionDTO;
  isLast?: boolean;
  onClick: () => void;
}

export const VersionItem: React.FC<Props> = ({
  version,
  isLast = false,
  onClick,
}) => {
  const color = getVersionColor({ version, isLast });

  return (
    <Row onClick={onClick} align="center" css={{ cursor: "pointer" }}>
      <Text h3 color={color}>
        {version.name}
      </Text>
      <Spacer x={1} />
      <Text size={12}>
        {`${format(parseISO(version.startDate), "dd/MM/yyyy")} - ${format(
          parseISO(version.releases[0]?.forecastEndDate),
          "dd/MM/yyyy"
        )}`}
      </Text>
    </Row>
  );
};
