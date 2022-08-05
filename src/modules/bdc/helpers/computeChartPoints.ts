import { groupBy } from "lodash";
import { ChartPoint } from "../../../types/charts";

const getChartPoint = (point: number | undefined): number | typeof NaN => {
  if (point !== undefined) {
    return point;
  }
  return NaN;
};

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
      const standard = getChartPoint(mergedChartPoint.standard);
      const total = getChartPoint(mergedChartPoint.total);
      const done = getChartPoint(mergedChartPoint.done);
      const forecastDone = getChartPoint(mergedChartPoint.forecastDone);

      return {
        name,
        standard,
        total,
        done,
        remaining: total - done,
        forecastDone: 0,
        forecastRemaining: total - forecastDone,
      };
    }
  );
};
