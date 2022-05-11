import { addBusinessDays, differenceInBusinessDays } from "date-fns";
import { formatDate } from "../../utils/formatDate";

export const createStaffingList = (startDate: Date, endDate: Date) => {
  const days = differenceInBusinessDays(endDate, startDate);

  const dates: Record<string, number> = {};
  const datesWithISOFormat: Record<string, number> = {};

  for (let i = 0; i <= days; i++) {
    const currentDay = addBusinessDays(startDate, i);
    dates[formatDate(currentDay)] = 1;
    datesWithISOFormat[currentDay.toISOString()] = 1;
  }

  const datesList = Object.keys(datesWithISOFormat).map((date) => ({
    date,
    value: datesWithISOFormat[date],
  }));

  return { datesList, dates };
};
