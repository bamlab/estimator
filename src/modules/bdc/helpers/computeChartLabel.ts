import { ChartPoint } from "../../../types/charts";

export const getLabel = (payload: ChartPoint) => {
  if (payload.remaining) {
    const difference = payload.remaining - payload.standard;
    if (difference > 0) {
      return "-" + Math.round(difference);
    } else if (difference == 0) return 0;
    else return "+" + Math.abs(Math.round(difference));
  }
};
