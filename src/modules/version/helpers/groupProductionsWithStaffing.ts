import { Developer, Production, Staffing } from "@prisma/client";
import { formatISO } from "date-fns";
import sumBy from "lodash/sumBy";
import {
  ProductionDTO,
  TeamWithDevelopersAndStaffing,
} from "../../project/types";
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
  productions: ProductionDTO[],
  team: TeamWithDevelopersAndStaffing
): ProductionsWithStaffing[] => {
  const developersWithStaffings: DeveloperWithDateIndexedStaffings[] =
    developerWithStaffingAdapter(team);

  return productions.map((production) => {
    const isoDate: ISODate = production.date;
    return {
      isoDate: isoDate,
      totalDateStaffing: sumBy(
        developersWithStaffings,
        (developer) =>
          developer.staffings[isoDate]?.value ?? developer.defaultStaffingValue
      ),
      productionValue: production.done,
    };
  });
};
