import { ChartPoint } from "../../../types/charts";
import { VersionDTO } from "../../project/types";
import { getStandardChartPointsFromVersion } from "./getStandardChartPointsFromVersion";

export const makeVersionChartData = ({
  version,
}: {
  version: VersionDTO;
}): ChartPoint[] => {
  const standardChartPoints = getStandardChartPointsFromVersion(version);

  return standardChartPoints;
};
