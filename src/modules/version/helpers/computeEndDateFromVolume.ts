import { addBusinessDays, parseISO } from "date-fns";
import { computeProjectMeanProductivity } from "./computeProjectMeanProductivity";
import { developerWithStaffingAdapter } from "./developerWithStaffingAdapter";
import {
  DeveloperWithDateIndexedStaffings,
  groupProductionsWithStaffing,
  ProductionsWithStaffing,
} from "./groupProductionsWithStaffing";
import sumBy from "lodash/sumBy";
import {
  FullProjectDTO,
  TeamWithDevelopersAndStaffing,
} from "../../project/types";
import { getStaffingThisDay } from "./getStaffingThisDay";

export const computeEndDateFromVolumeAndStaffing = ({
  startDate,
  volume,
  meanProductivity,
  team,
  defaultStaffing,
}: Params): Date => {
  if (meanProductivity < 0) return startDate;

  const developersWithStaffings: DeveloperWithDateIndexedStaffings[] =
    developerWithStaffingAdapter(team);

  let currentDone = 0;
  let lastVisitedDate = startDate;

  for (
    let currentDate = startDate;
    currentDone < volume;
    currentDate = addBusinessDays(currentDate, 1)
  ) {
    const staffingThisDay = getStaffingThisDay({
      date: currentDate,
      developersWithStaffings,
    });

    currentDone += (meanProductivity * staffingThisDay) / defaultStaffing;
    lastVisitedDate = currentDate;
  }

  return lastVisitedDate;
};

export const computeEndDateFromVolume = (
  startDate: Date,
  volume: number,
  project: FullProjectDTO
): Date => {
  if (!project.team) return startDate;

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

  return computeEndDateFromVolumeAndStaffing({
    startDate,
    volume,
    meanProductivity: projectMeanProductivity,
    team: teamEntity,
    defaultStaffing,
  });
};

interface Params {
  startDate: Date;
  volume: number;
  meanProductivity: number;
  team: TeamWithDevelopersAndStaffing;
  defaultStaffing: number;
}
