import { Staffing } from "@prisma/client";
import { formatISO } from "date-fns";
import { parseGMTMidnight } from "../../../utils/parseGMTMidnight";
import { TeamWithDevelopersAndStaffing } from "../../project/types";
import { DeveloperWithDateIndexedStaffings } from "./groupProductionsWithStaffing";

type ISODate = string;

export const developerWithStaffingAdapter = (
  team: TeamWithDevelopersAndStaffing
): DeveloperWithDateIndexedStaffings[] => {
  return team.developers.map((developer) => {
    const staffings: Record<ISODate, Staffing> = {};

    developer.staffing.forEach((staffing) => {
      staffings[parseGMTMidnight(formatISO(staffing.date)).toISOString()] =
        staffing;
    });

    return {
      ...developer,
      staffings: staffings,
    };
  });
};
