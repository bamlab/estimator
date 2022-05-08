import { Developer, Staffing, Team } from "@prisma/client";
import {
  addBusinessDays,
  addDays,
  differenceInBusinessDays,
  parseISO,
} from "date-fns";
import { formatDate } from "../../utils/formatDate";
import { ProjectDTO } from "../project/types";

export type RessourceRow = Record<string, number | string> & {
  name: string;
};

export type ProjectWithDevelopersAndStaffingDTO = ProjectDTO & {
  team:
    | null
    | (Team & {
        developers: (Developer & {
          staffing: (Omit<Staffing, "date"> & { date: string })[];
        })[];
      });
};

export const initializeRessourcesData = (
  project: ProjectWithDevelopersAndStaffingDTO
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
      dates[formatDate(currentDay)] = 1;
    }

    dev.staffing.forEach((staffingValue) => {
      dates[formatDate(addDays(parseISO(staffingValue.date), -1))] =
        staffingValue.value;
    });
    return { id: dev.id, name: dev.name, ...dates };
  });
};
