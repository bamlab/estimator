import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { range } from "lodash";
import { DoneChartPoint } from "../../../types/charts";
import { formatDate } from "../../../utils/formatDate";
import { FullProjectDTO } from "../../project/types";

export const getDoneChartPoints = ({
  project,
  startDate,
  endDate,
}: {
  project: FullProjectDTO;
  startDate: Date;
  endDate: Date;
}): DoneChartPoint[] => {
  const numberOfDays = differenceInBusinessDays(endDate, startDate) + 1;

  let cumulativeDone = 0;
  const doneChartPoints: DoneChartPoint[] = [];

  range(numberOfDays).forEach((currentDayIdx) => {
    const currentDayDone = project.productions.find(
      (production) =>
        formatDate(parseISO(production.date)) ===
        formatDate(addBusinessDays(startDate, currentDayIdx))
    )?.done;
    const currentDayHasProduction = currentDayDone !== undefined;

    doneChartPoints.push({
      name: formatDate(addBusinessDays(startDate, currentDayIdx)),
      done: cumulativeDone,
    });

    cumulativeDone = currentDayHasProduction
      ? cumulativeDone + currentDayDone
      : NaN;
  });

  return doneChartPoints;
};
