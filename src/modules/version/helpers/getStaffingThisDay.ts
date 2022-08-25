import { formatISO } from "date-fns";
import sumBy from "lodash/sumBy";
import { parseGMTMidnight } from "../../../utils/parseGMTMidnight";
import { DeveloperWithDateIndexedStaffings } from "./groupProductionsWithStaffing";

export const getStaffingThisDay = ({
  developersWithStaffings,
  date,
}: {
  date: Date;
  developersWithStaffings: DeveloperWithDateIndexedStaffings[];
}) => {
  return sumBy(developersWithStaffings, (developer) => {
    const isoDate = parseGMTMidnight(formatISO(date)).toISOString();

    return (
      developer.staffings[isoDate]?.value ?? developer.defaultStaffingValue
    );
  });
};
