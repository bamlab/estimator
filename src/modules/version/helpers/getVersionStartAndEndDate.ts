import maxBy from "lodash/maxBy";
import { parseISO } from "date-fns";
import { VersionDTO } from "../../project/types";

export const getVersionStartAndEndDate = (
  version: VersionDTO
): { startDate: Date; endDate: Date } => {
  const startDate = parseISO(version.startDate);
  const lastCreatedRelease = maxBy(version.releases, (release) =>
    parseISO(release.createdAt).getTime()
  );
  const endDate = parseISO(
    lastCreatedRelease?.forecastEndDate ?? version.startDate
  );

  return { startDate, endDate };
};
