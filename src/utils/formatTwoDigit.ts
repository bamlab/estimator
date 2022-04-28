export const formatTwoDigit = (nb: number): string => {
  if (nb < 10 && nb >= 0) {
    return `0${nb}`;
  }
  return nb.toString();
};
