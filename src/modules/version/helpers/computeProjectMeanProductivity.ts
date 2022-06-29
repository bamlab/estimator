import { Production, Project } from "@prisma/client";

const MEAN_PERIOD = 15;
//This function assumes that productions are sorted by dates and valid (ie. done property is always > 0)
export const computeProjectMeanProductivity = (
  productions: Production[],
  projectProductivity: number
) => {
  if (productions.length === 0) return projectProductivity;

  const doneProductions = productions.map((production) => production.done);

  const adjustedDoneProductions =
    doneProductions.length <= MEAN_PERIOD
      ? doneProductions.concat(
          new Array(MEAN_PERIOD - doneProductions.length).fill(
            projectProductivity
          )
        ) //We add missing days by mocking the productivity to the project productivity
      : doneProductions.slice(doneProductions.length - MEAN_PERIOD); //We only take the MEAN_PERIOD last days (productions must be sorted by dates)

  return parseFloat(
    (
      adjustedDoneProductions.reduce((acc, d) => acc + d, 0) / MEAN_PERIOD
    ).toFixed(1)
  );
};
