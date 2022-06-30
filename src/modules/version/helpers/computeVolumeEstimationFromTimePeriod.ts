import {
  addBusinessDays,
  differenceInBusinessDays,
  formatISO,
  isBefore,
} from "date-fns";
import { TeamWithDevelopersAndStaffing } from "../../ressources/initializeRessourcesData";
import { developerWithStaffingAdapter } from "./developerWithStaffingAdapter";
import { DeveloperWithDateIndexedStaffings } from "./groupProductionsWithStaffing";

type ISODate = string;

export const computeVolumeEstimationFromTimePeriod = (
  meanProductivity: number,
  team: TeamWithDevelopersAndStaffing,
  defaultStaffing: number,
  startDate: Date,
  endDate: Date
) => {
  if (meanProductivity < 0) return 0;

  const isoDates: ISODate[] = [];

  for (let i = 0; i <= differenceInBusinessDays(endDate, startDate); i++) {
    isoDates.push(formatISO(addBusinessDays(startDate, i)));
  }

  const developersWithStaffings: DeveloperWithDateIndexedStaffings[] =
    developerWithStaffingAdapter(team);

  const staffingsForTimePeriod: Record<ISODate, number> = {};
  isoDates.forEach(
    (isoDate) =>
      (staffingsForTimePeriod[isoDate] = developersWithStaffings.reduce(
        (somme, developer) =>
          somme +
          (developer.staffings[isoDate]?.value ??
            developer.defaultStaffingValue),
        0
      ))
  );

  return isoDates.reduce(
    (somme, isoDate) =>
      somme +
      meanProductivity * (staffingsForTimePeriod[isoDate] / defaultStaffing),
    0
  );
};
