import { differenceInBusinessDays, isBefore } from "date-fns";

export const computeVolumeEstimationFromTimePeriod = (
  meanProductivity: number,
  startDate: Date,
  endDate: Date
) => {
  if (isBefore(endDate, startDate)) return 0;
  if (meanProductivity < 0) return 0;
  return meanProductivity * (differenceInBusinessDays(endDate, startDate) + 1);
};
