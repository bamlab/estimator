import { format, isBefore, parseISO } from "date-fns";

export const checkEndDate = (
  projectEndIsoDate: string,
  endDate: string
): string => {
  if (!projectEndIsoDate || !endDate) return "";
  const parsedEndDate = parseISO(endDate);
  const projectEndDate = new Date(projectEndIsoDate);
  if (isBefore(parsedEndDate, projectEndDate)) return "";
  else
    return `Attention, la date de fin prévue dépasse la date de fin du projet (fin du projet : ${format(
      parseISO(projectEndDate.toISOString()),
      "dd/MM/yyyy"
    )})`;
};
