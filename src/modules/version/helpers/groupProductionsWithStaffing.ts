import { Developer, Staffing } from "@prisma/client";
import { formatISO } from "date-fns";
import sumBy from "lodash/sumBy";
import { formatDate } from "../../../utils/formatDate";
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
    const date = new Date(production.date);
    return {
      isoDate: formatISO(date),
      totalDateStaffing: sumBy(developersWithStaffings, (developer) => {
        return (
          developer.staffings[formatDate(date)]?.value ??
          developer.defaultStaffingValue
        );
      }),
      productionValue: production.done,
    };
  });
};
