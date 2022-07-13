import { groupBy } from "lodash";
import { ChartPoint } from "../../../types/charts";

export const computeChartPoints = (
  standardPoints: Partial<ChartPoint>[],
  doneChartPoints: Partial<ChartPoint>[]
): ChartPoint[] => {
  const points: Partial<ChartPoint>[] = standardPoints.concat(doneChartPoints);
  const groupedChartPointsByName = groupBy(points, (point) => point.name);

  return Object.values(groupedChartPointsByName).map(
    (ChartPointsWithSameName) => {
      const mergedChartPoint = ChartPointsWithSameName.reduce(
        (accPoint, currentChartPoint) => ({
          ...accPoint,
          ...currentChartPoint,
        }),
        ChartPointsWithSameName[0]
      );

      const name = mergedChartPoint.name ?? "";
      const standard =
        mergedChartPoint.standard !== undefined
          ? mergedChartPoint.standard
          : NaN;
      const total =
        mergedChartPoint.total !== undefined ? mergedChartPoint.total : NaN;
      const done =
        mergedChartPoint.done !== undefined ? mergedChartPoint.done : NaN;

      return {
        name,
        standard,
        total,
        done,
        remaining: total - done,
      };
    }
  );
};
