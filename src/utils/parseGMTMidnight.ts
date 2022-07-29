export const parseGMTMidnight = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const midnightGMTDate = new Date(Date.UTC(year, month, day));

  return midnightGMTDate;
};
