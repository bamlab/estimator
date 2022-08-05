import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { range } from "lodash";
import { DoneChartPoint } from "../../../types/charts";
import { formatDate } from "../../../utils/formatDate";
import { FullProjectDTO, VersionDTO } from "../../project/types";
import { computeVolumeEstimationFromDate } from "./computeVolumeEstimationFromDate";

export const getDoneChartPoints = ({
  project,
  startDate,
  endDate,
  version,
}: {
  project: FullProjectDTO;
  startDate: Date;
  endDate: Date;
  version: VersionDTO;
}): DoneChartPoint[] => {
  const numberOfDays = differenceInBusinessDays(endDate, startDate) + 1;

  let cumulativeDone = 0;
  let cumulativeForecastDone = 0;
  let cumulativeDay = 0;
  const doneChartPoints: DoneChartPoint[] = [];

  range(numberOfDays).forEach((currentDayIdx) => {
    cumulativeDay = currentDayIdx;
    const currentDayDone = project.productions.find(
      (production) =>
        formatDate(parseISO(production.date)) ===
        formatDate(addBusinessDays(startDate, currentDayIdx))
    )?.done;
    const currentDayHasProduction = currentDayDone !== undefined;

    doneChartPoints.push({
      name: formatDate(addBusinessDays(startDate, currentDayIdx)),
      done: cumulativeDone,
      forecastDone: cumulativeForecastDone,
    });

    cumulativeDone = currentDayHasProduction
      ? cumulativeDone + (currentDayDone ?? 0)
      : NaN;

    cumulativeForecastDone = !currentDayHasProduction
      ? cumulativeForecastDone +
        computeVolumeEstimationFromDate(
          addBusinessDays(startDate, currentDayIdx),
          project
        )
      : cumulativeDone;
  });

  // extend the chart up to the forecast is equal to 0, to forecast the date of landing
  while (
    doneChartPoints[doneChartPoints.length - 1].forecastDone <
    version.releases[version.releases.length - 1].volume
  ) {
    cumulativeDay += 1;

    cumulativeForecastDone += computeVolumeEstimationFromDate(
      addBusinessDays(startDate, cumulativeDay),
      project
    );

    doneChartPoints.push({
      name: formatDate(addBusinessDays(startDate, cumulativeDay)),
      done: NaN,
      forecastDone: cumulativeForecastDone,
    });
  }

  return doneChartPoints;
};
