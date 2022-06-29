import { Project } from "@prisma/client";
import { format, isBefore, parseISO } from "date-fns";

export const validateStartDate = (
  project: Project,
  startDate: string
): boolean | string => {
  if (!project.startAt) return true;
  const parsedStartDate = parseISO(startDate);
  const projectStartDate = new Date(project.startAt);
  if (isBefore(projectStartDate, parsedStartDate)) return true;
  else
    return `Choisissez une date de début dans l'intervalle projet (début du projet : ${format(
      parseISO(projectStartDate.toISOString()),
      "dd/MM/yyyy"
    )})`;
};
