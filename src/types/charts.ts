export type StandardChartPoint = {
  name: string;
  standard: number;
  total: number;
};
export type DoneChartPoint = {
  name: string;
  done: number;
  forecastDone: number;
};
export type RemainingChartPoint = {
  name: string;
  remaining: number;
  forecastRemaining: number;
};
export type ChartPoint = StandardChartPoint &
  DoneChartPoint &
  RemainingChartPoint;
