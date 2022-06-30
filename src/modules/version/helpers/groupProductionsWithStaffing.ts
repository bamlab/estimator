import { Developer, Production, Staffing } from "@prisma/client";
import { formatISO } from "date-fns";
import { TeamWithDevelopersAndStaffing } from "../../ressources/initializeRessourcesData";
import { developerWithStaffingAdapter } from "./developerWithStaffingAdapter";

type ISODate = string;
export interface ProductionsWithStaffing {
  isoDate: string;
  totalDateStaffing: number;
  productionValue: number;
}

export type DeveloperWithDateIndexedStaffings = Developer & {
  staffings: Record<ISODate, Staffing>;
};

export const groupProductionsWithStaffing = (
  productions: Production[],
  team: TeamWithDevelopersAndStaffing
): ProductionsWithStaffing[] => {
  const developersWithStaffings: DeveloperWithDateIndexedStaffings[] =
    developerWithStaffingAdapter(team);

  return productions.map((production) => {
    const isoDate: ISODate = formatISO(production.date);
    return {
      isoDate: isoDate,
      totalDateStaffing: developersWithStaffings.reduce(
        (sum, developer) =>
          sum +
          (developer.staffings[isoDate]?.value ??
            developer.defaultStaffingValue),
        0
      ),
      productionValue: production.done,
    };
  });
};
