import {
  addBusinessDays,
  differenceInBusinessDays,
  formatISO,
  parseISO,
} from "date-fns";
import {
  ProjectWithDevelopersAndStaffingDTO,
  TeamWithDevelopersAndStaffing,
} from "../../ressources/initializeRessourcesData";
import { computeProjectMeanProductivity } from "./computeProjectMeanProductivity";
import { developerWithStaffingAdapter } from "./developerWithStaffingAdapter";
import {
  DeveloperWithDateIndexedStaffings,
  groupProductionsWithStaffing,
  ProductionsWithStaffing,
} from "./groupProductionsWithStaffing";

type ISODate = string;

interface Params {
  meanProductivity: number;
  team: TeamWithDevelopersAndStaffing;
  defaultStaffing: number;
  startDate: Date;
  endDate: Date;
}

export const computeVolumeEstimation = ({
  meanProductivity,
  team,
  defaultStaffing,
  startDate,
  endDate,
}: Params) => {
  if (meanProductivity < 0) return 0;

  const isoDates: ISODate[] = [];

  for (let i = 0; i <= differenceInBusinessDays(endDate, startDate); i++) {
    isoDates.push(formatISO(addBusinessDays(startDate, i)));
  }

  const developersWithStaffings: DeveloperWithDateIndexedStaffings[] =
    developerWithStaffingAdapter(team);

  const staffingsForTimePeriod: Record<ISODate, number> = {};
  isoDates.forEach(
    (isoDate) =>
      (staffingsForTimePeriod[isoDate] = developersWithStaffings.reduce(
        (sum, developer) =>
          sum +
          (developer.staffings[isoDate]?.value ??
            developer.defaultStaffingValue),
        0
      ))
  );

  return isoDates.reduce(
    (sum, isoDate) =>
      sum +
      meanProductivity * (staffingsForTimePeriod[isoDate] / defaultStaffing),
    0
  );
};

export const computeVolumeEstimationFromTimePeriod = (
  startDate: Date,
  endDate: Date,
  project: ProjectWithDevelopersAndStaffingDTO
) => {
  if (!project.team) return 0;

  const teamEntity: TeamWithDevelopersAndStaffing = {
    ...project.team,
    developers: project.team.developers.map((developer) => ({
      ...developer,
      staffing: developer.staffing.map((staff) => ({
        ...staff,
        date: parseISO(staff.date),
      })),
    })),
  };

  const defaultStaffing = teamEntity.developers.reduce(
    (sum, dev) => sum + dev.defaultStaffingValue,
    0
  );

  const productionsWithStaffing: ProductionsWithStaffing[] =
    groupProductionsWithStaffing(project.productions, teamEntity);

  const projectMeanProductivity = computeProjectMeanProductivity({
    productionsWithStaffing,
    defaultStaffing,
    projectProductivity: project.productivity,
  });

  return computeVolumeEstimation({
    meanProductivity: projectMeanProductivity,
    team: teamEntity,
    defaultStaffing,
    startDate,
    endDate,
  });
};
