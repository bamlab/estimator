import { differenceInBusinessDays, parseISO } from "date-fns";
import sum from "lodash/sum";
import sumBy from "lodash/sumBy";
import { formatDate } from "../../../utils/formatDate";
import {
  FullProjectDTO,
  TeamWithDevelopersAndStaffing,
} from "../../project/types";
import {
  groupProductionsWithStaffing,
  ProductionsWithStaffing,
} from "../../version/helpers/groupProductionsWithStaffing";

const MEAN_PERIOD = 15;
export const computeVolumeEstimationFromDate = (
  date: Date,
  project: FullProjectDTO
): number => {
  if (project === null || project.team === null) {
    return 0;
  }
  const teamEntity: TeamWithDevelopersAndStaffing = {
    ...project.team,
    developers: project.team.developers.map((developer) => ({
      ...developer,
      staffing: developer.staffing.map((staff) => ({
        ...staff,
        date: parseISO(staff.date),
      })),
    })),
  };

  const productionsWithStaffing: ProductionsWithStaffing[] =
    groupProductionsWithStaffing(project.productions, teamEntity);

  const threeWeeksBeforeDate = differenceInBusinessDays(date, 3);
  const productionsWithStaffingOverThreeLastWeeks =
    productionsWithStaffing.filter(
      (production) =>
        differenceInBusinessDays(
          threeWeeksBeforeDate,
          parseISO(production.isoDate)
        ) <= 0
    );
  const productionMean =
    productionsWithStaffingOverThreeLastWeeks.length > 0
      ? sumBy(
          productionsWithStaffingOverThreeLastWeeks,
          (production) =>
            production.productionValue / production.totalDateStaffing
        ) / productionsWithStaffingOverThreeLastWeeks.length
      : 0;

  const defaultProductionMean = project.productivity;

  const daysWithoutProductionOnMeanPeriod = Math.max(
    MEAN_PERIOD - productionsWithStaffing.length,
    0
  );

  const staffingListAtDate = project.team.developers.map((developer) => {
    const staffingAtDateForDev = developer.staffing.find(
      (staffing) => formatDate(parseISO(staffing.date)) === formatDate(date)
    );

    return staffingAtDateForDev?.value ?? developer.defaultStaffingValue;
  });

  const staffingAtDate = sum(staffingListAtDate);

  const productivityEstimationForDate =
    (productionMean * productionsWithStaffing.length +
      defaultProductionMean * daysWithoutProductionOnMeanPeriod) /
    MEAN_PERIOD;
  const productionEstimationForDate =
    staffingAtDate * productivityEstimationForDate;

  return productionEstimationForDate;
};
