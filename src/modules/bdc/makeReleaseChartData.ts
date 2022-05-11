import { Developer, Release, Staffing } from "@prisma/client";
import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { groupBy } from "lodash";
import { ChartPoint } from "../../types/charts";
import { formatDate } from "../../utils/formatDate";

export const makeReleaseChartData = ({
  startDate,
  productions,
  productivity,
  releases,
  ressources,
}: {
  startDate: Date;
  productions: Record<string, { id: string; value: number }>;
  productivity: number;
  releases: (Omit<Release, "createdAt" | "forecastEndDate"> & {
    createdAt: string;
    forecastEndDate: string;
  })[];
  ressources: (Developer & {
    staffing: (Omit<Staffing, "date"> & { date: string })[];
  })[];
}): ChartPoint[] => {
  const sortedReleases = releases.sort(
    (r1, r2) =>
      parseISO(r1.createdAt).getTime() - parseISO(r2.createdAt).getTime()
  );

  let endDate = parseISO(sortedReleases[0].forecastEndDate);
  let volume = sortedReleases[0].volume;
  let days = differenceInBusinessDays(endDate, startDate);
  let standardCelerite = volume / days;

  const data: ChartPoint[] = [];

  let doneSum = 0;
  let lastDoneIndex = null;
  let volumeBeforeForecast = 0;
  let standard = volume;

  const staffingList = ressources.map((ressource) => ressource.staffing).flat();
  const ressourcesGroupByDate = groupBy(staffingList, (staffing) =>
    formatDate(parseISO(staffing.date))
  );

  for (let i = 0; i <= days; i++) {
    const currentDay = addBusinessDays(startDate, i);
    const previousDay = addBusinessDays(startDate, i);

    const production = productions[formatDate(previousDay)];
    let done: number;

    if (i === 0) {
      done = volume;
    } else if (i === days && production) {
      done = volume - doneSum - production.value;
    } else {
      done = volume - doneSum;
    }

    let forecast: number;
    if ((!production || isNaN(production.value)) && lastDoneIndex === null) {
      lastDoneIndex = i - 1;
      volumeBeforeForecast = done;
    }

    const forecastIndex = lastDoneIndex ? i - lastDoneIndex - 1 : i;

    if (isNaN(done)) {
      forecast =
        volumeBeforeForecast -
        forecastIndex *
          productivity *
          ressourcesGroupByDate[formatDate(currentDay)].length;
    } else {
      forecast = done;
    }

    standard = volume - i * standardCelerite;

    data.push({
      done,
      forecast,
      standard,
      name: formatDate(currentDay),
    });

    sortedReleases.forEach((release, index) => {
      if (
        index > 0 &&
        formatDate(parseISO(release.createdAt)) === formatDate(currentDay)
      ) {
        const volumeDifference = release.volume - volume;

        endDate = parseISO(release.forecastEndDate);
        volume = release.volume;
        days = differenceInBusinessDays(endDate, startDate);
        standardCelerite = volume / days;

        done += volumeDifference;
        forecast += volumeDifference;
        standard += volumeDifference;
      }
    });

    // use NaN to stop the line to render from the date which has no done filled
    doneSum += production ? production.value : NaN;
  }

  return data;
};
