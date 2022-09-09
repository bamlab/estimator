export const formatTwoDecimal = (number: number | string, decimal: number) => {
  let n: number;

  if (typeof number === "string") {
    n = parseFloat(number);
  } else {
    n = number;
  }

  if (isNaN(n)) {
    return 0;
  }

  const multiplicator = 10 ** decimal;
  return Math.round(n * multiplicator) / multiplicator;
};
