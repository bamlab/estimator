import { addBusinessDays, differenceInBusinessDays } from "date-fns";
import { ChartPoint } from "../../types/charts";
import { formatDate } from "../../utils/formatDate";

export const makeReleaseChartData = ({
  volume,
  startDate,
  endDate,
  productions,
}: {
  volume: number;
  startDate: Date;
  endDate: Date;
  productions: Record<string, { id: string; value: number }>;
  productivity: number;
}): ChartPoint[] => {
  const days = differenceInBusinessDays(endDate, startDate);

  const data: ChartPoint[] = [];
  const standardCelerite = volume / days;

  let doneSum = 0;
  for (let i = 0; i <= days; i++) {
    const currentDay = addBusinessDays(startDate, i);
    const previousDay = addBusinessDays(startDate, i);

    const production = productions[formatDate(previousDay)];

    let done;
    if (i === 0) {
      done = volume;
    } else if (i === days && production) {
      done = volume - doneSum - production.value;
    } else {
      done = volume - doneSum;
    }

    data.push({
      done,
      standard: volume - i * standardCelerite,
      name: formatDate(currentDay),
    });

    // use NaN to stop the line to render from the date which has no done filled
    doneSum += production ? production.value : NaN;
  }

  return data;
};
