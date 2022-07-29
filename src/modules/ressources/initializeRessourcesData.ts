import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../utils/formatDate";
import { FullProjectDTO } from "../project/types";

export type RessourceRow = Record<string, number | string> & {
  name: string;
  defaultStaffingValue: number;
};

export const initializeRessourcesData = (
  project: FullProjectDTO
): RessourceRow[] => {
  const startDate = parseISO(project.startAt);
  const days = differenceInBusinessDays(parseISO(project.endAt), startDate);

  if (!project.team) {
    return [];
  }
  return project.team?.developers.map((dev) => {
    const dates: Record<string, number> = {};

    for (let i = 0; i <= days; i++) {
      const currentDay = addBusinessDays(startDate, i);
      dates[formatDate(currentDay)] = dev.defaultStaffingValue;
    }

    dev.staffing.forEach((staffingValue) => {
      dates[formatDate(parseISO(staffingValue.date))] = staffingValue.value;
    });
    return {
      id: dev.id,
      defaultStaffingValue: dev.defaultStaffingValue,
      name: dev.name,
      ...dates,
    };
  });
};
