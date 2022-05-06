import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../utils/formatDate";
import { ProjectDTO } from "../project/types";

export type RessourceRow = Record<string, number | string> & {
  name: string;
};

export const initializeRessourcesData = (
  project: ProjectDTO
): RessourceRow[] => {
  const startDate = parseISO(project.startAt);
  const days = differenceInBusinessDays(parseISO(project.endAt), startDate);

  const dates: Record<string, number> = {};

  for (let i = 0; i <= days; i++) {
    const currentDay = addBusinessDays(startDate, i);
    dates[formatDate(currentDay)] = 1;
  }
  return [
    { name: "dev1", ...dates },
    { name: "dev2", ...dates },
  ];
};
