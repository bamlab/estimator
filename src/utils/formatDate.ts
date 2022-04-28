import { formatTwoDigit } from "./formatTwoDigit";

export const formatDate = (date: Date): string => {
  return `${formatTwoDigit(date.getDate())}/${formatTwoDigit(
    date.getMonth() + 1
  )}`;
};
