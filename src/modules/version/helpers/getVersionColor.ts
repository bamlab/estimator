import { SimpleColors } from "@nextui-org/react";
import { addBusinessDays, isAfter, parseISO } from "date-fns";
import { VersionDTO } from "../../project/types";

interface Params {
  version: VersionDTO;
  isLast: boolean;
}

export const getVersionColor = ({ version, isLast }: Params): SimpleColors => {
  const isStillGoing = isAfter(
    addBusinessDays(parseISO(version.releases[0]?.forecastEndDate), 1),
    new Date()
  );

  if (isStillGoing && isLast) return "success";
  if (isStillGoing && !isLast) return "warning";
  if (!isStillGoing && isLast) return "error";
  return "secondary";
};
