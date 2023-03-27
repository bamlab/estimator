import { ChartPoint } from "../../../types/charts";

export const getDailyProductionDifference = (data: ChartPoint[]) => {
  return data.map((day) => -(day.standard - day.remaining));
};
