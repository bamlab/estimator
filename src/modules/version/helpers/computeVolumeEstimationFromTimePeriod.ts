import {
  addBusinessDays,
  differenceInBusinessDays,
  formatISO,
  parseISO,
} from "date-fns";
import sumBy from "lodash/sumBy";
import {
  FullProjectDTO,
  TeamWithDevelopersAndStaffing,
} from "../../project/types";
import { computeProjectMeanProductivity } from "./computeProjectMeanProductivity";
import { developerWithStaffingAdapter } from "./developerWithStaffingAdapter";
import { getStaffingThisDay } from "./getStaffingThisDay";
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
}: Params): number => {
  if (meanProductivity < 0) return 0;

  const isoDates: ISODate[] = [];

  for (let i = 0; i <= differenceInBusinessDays(endDate, startDate); i++) {
    isoDates.push(formatISO(addBusinessDays(startDate, i)));
  }

  const developersWithStaffings: DeveloperWithDateIndexedStaffings[] =
    developerWithStaffingAdapter(team);

  const staffingsForTimePeriod: Record<ISODate, number> = {};
  isoDates.forEach((isoDate) => {
    staffingsForTimePeriod[isoDate] = getStaffingThisDay({
      developersWithStaffings,
      date: parseISO(isoDate),
    });
  });

  return sumBy(
    isoDates,
    (isoDate) =>
      (meanProductivity * staffingsForTimePeriod[isoDate]) / defaultStaffing
  );
};

export const computeVolumeEstimationFromTimePeriod = (
  startDate: Date,
  endDate: Date,
  project: FullProjectDTO
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

  const defaultStaffing = sumBy(teamEntity.developers, "defaultStaffingValue");

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
