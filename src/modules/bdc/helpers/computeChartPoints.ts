import { groupBy } from "lodash";
import {
  ChartPoint,
  DoneChartPoint,
  StandardChartPoint,
} from "../../../types/charts";

const getChartPoint = (point: number | undefined): number | typeof NaN => {
  if (point !== undefined) {
    return point;
  }
  return NaN;
};

export const computeChartPoints = (
  standardPoints: StandardChartPoint[],
  doneChartPoints: DoneChartPoint[]
): ChartPoint[] => {
  const points: (StandardChartPoint | DoneChartPoint)[] = [
    ...standardPoints,
    ...doneChartPoints,
  ];
  const groupedChartPointsByName = groupBy(points, (point) => point.name);

  let lastTotal = 0;
  return Object.values(groupedChartPointsByName).map(
    (ChartPointsWithSameName) => {
      const mergedChartPoint = ChartPointsWithSameName.reduce(
        (accPoint, currentChartPoint) => ({
          ...accPoint,
          ...currentChartPoint,
        }),
        ChartPointsWithSameName[0]
      ) as ChartPoint;

      const name = mergedChartPoint.name ?? "";
      const standard = getChartPoint(mergedChartPoint.standard);
      const total = getChartPoint(mergedChartPoint.total);
      const done = getChartPoint(mergedChartPoint.done);
      const forecastDone = getChartPoint(mergedChartPoint.forecastDone);

      lastTotal = isNaN(total) ? lastTotal : total;

      return {
        name,
        standard,
        total,
        done,
        remaining: lastTotal - done,
        forecastDone: 0,
        forecastRemaining: lastTotal - forecastDone,
      };
    }
  );
};
