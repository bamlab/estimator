import { addBusinessDays, differenceInBusinessDays } from "date-fns";
import { ChartPoint } from "../../types/charts";
import { formatDate } from "../../utils/formatDate";

export const makeReleaseChartData = ({
  volume,
  startDate,
  endDate,
}: {
  volume: number;
  startDate: Date;
  endDate: Date;
  celerite: number;
}): ChartPoint[] => {
  const days = differenceInBusinessDays(endDate, startDate);

  const data: ChartPoint[] = [];
  const standardCelerite = volume / days;

  for (let i = 0; i <= days; i++) {
    const currentDay = addBusinessDays(startDate, i);

    data.push({
      done: 0,
      standard: volume - i * standardCelerite,
      name: formatDate(currentDay),
    });
  }

  return data;
};
