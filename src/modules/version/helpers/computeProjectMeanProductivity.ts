import { Production } from "@prisma/client";
import { differenceInBusinessDays, isAfter, parseISO } from "date-fns";
import { ProductionsWithStaffing } from "./groupProductionsWithStaffing";

const MEAN_PERIOD = 15;

interface Params {
  productionsWithStaffing: ProductionsWithStaffing[];
  defaultStaffing: number;
  projectProductivity: number;
}

export const computeProjectMeanProductivity = ({
  productionsWithStaffing,
  defaultStaffing,
  projectProductivity,
}: Params) => {
  if (productionsWithStaffing.length === 0) return projectProductivity;

  //Sort productions by descending dates (ex : [12/06,11/06,...])
  const sortedProductions = [...productionsWithStaffing].sort((prod1, prod2) =>
    differenceInBusinessDays(parseISO(prod2.isoDate), parseISO(prod1.isoDate))
  );

  const numberOfDays = sortedProductions.length;

  const adjustedDoneProductions: ProductionsWithStaffing[] =
    numberOfDays <= MEAN_PERIOD
      ? sortedProductions.concat(
          new Array(MEAN_PERIOD - numberOfDays).fill({
            isoDate: "",
            totalDateStaffing: defaultStaffing,
            productionValue: projectProductivity,
          })
        ) //We add missing days by mocking the productivity to the project productivity
      : sortedProductions.slice(0, MEAN_PERIOD); //We only take the MEAN_PERIOD last days

  const totalStaffing: number = adjustedDoneProductions.reduce(
    (sum, prod) => sum + prod.totalDateStaffing,
    0
  );
  return parseFloat(
    (
      adjustedDoneProductions.reduce(
        (sum, prod) => sum + prod.productionValue * prod.totalDateStaffing,
        0
      ) / totalStaffing
    ).toFixed(1)
  );
};
