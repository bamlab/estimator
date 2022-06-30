import { Developer, Production, Staffing } from "@prisma/client";
import { formatISO } from "date-fns";
import developers from "../../../../pages/api/developers";
import { TeamWithDevelopersAndStaffing } from "../../ressources/initializeRessourcesData";

type ISODate = string;
export interface ProductionsWithStaffing {
  isoDate: string;
  totalDateStaffing: number;
  productionValue: number;
}

type DeveloperWithDateIndexedStaffings = Developer & {
  staffings: Record<ISODate, Staffing>;
};

export const groupProductionsWithStaffing = (
  productions: Production[],
  team: TeamWithDevelopersAndStaffing
): ProductionsWithStaffing[] => {
  const developersWithStaffings: DeveloperWithDateIndexedStaffings[] =
    team.developers.map((developer) => {
      const staffings: Record<ISODate, Staffing> = {};

      developer.staffing.forEach(
        (staffing) => (staffings[formatISO(staffing.date)] = staffing)
      );

      return {
        ...developer,
        staffings: staffings,
      };
    });

  return productions.map((production) => {
    const isoDate: ISODate = formatISO(production.date);
    return {
      isoDate: isoDate,
      totalDateStaffing: developersWithStaffings.reduce(
        (somme, developer) =>
          somme +
          (developer.staffings[isoDate]?.value ??
            developer.defaultStaffingValue),
        0
      ),
      productionValue: production.done,
    };
  });
};
