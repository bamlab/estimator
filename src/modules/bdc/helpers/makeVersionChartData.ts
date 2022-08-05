import { addBusinessDays } from "date-fns";
import { ChartPoint } from "../../../types/charts";
import { FullProjectDTO, VersionDTO } from "../../project/types";
import { getVersionStartAndEndDate } from "../../version/helpers/getVersionStartAndEndDate";
import { getDoneChartPoints } from "./getDoneChartPoints";
import { computeChartPoints } from "./computeChartPoints";
import { getStandardChartPointsFromVersion } from "./getStandardChartPointsFromVersion";

export const makeVersionChartData = ({
  version,
  project,
}: {
  version: VersionDTO;
  project: FullProjectDTO;
}): ChartPoint[] => {
  const standardChartPoints = getStandardChartPointsFromVersion(
    project,
    version
  );

  const { startDate: versionStartDate, endDate: versionEndDate } =
    getVersionStartAndEndDate(version);
  const endDate = addBusinessDays(versionEndDate, 1);

  const doneChartPoints = getDoneChartPoints({
    project,
    startDate: versionStartDate,
    endDate,
    version,
  });

  return computeChartPoints(standardChartPoints, doneChartPoints);
};
