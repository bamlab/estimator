import { Project } from "@prisma/client";
import { format, isBefore, parseISO } from "date-fns";

export const validateStartDate = (
  projectStartIsoDate: string,
  startDate: string
): boolean | string => {
  if (!projectStartIsoDate) return true;
  const parsedStartDate = parseISO(startDate);
  const projectStartDate = new Date(projectStartIsoDate);
  if (isBefore(projectStartDate, parsedStartDate)) return true;
  else
    return `Choisissez une date de début dans l'intervalle projet (début du projet : ${format(
      parseISO(projectStartDate.toISOString()),
      "dd/MM/yyyy"
    )})`;
};
