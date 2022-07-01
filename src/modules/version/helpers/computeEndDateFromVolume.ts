import { addBusinessDays, formatISO, parseISO } from "date-fns";
import { computeProjectMeanProductivity } from "./computeProjectMeanProductivity";
import { developerWithStaffingAdapter } from "./developerWithStaffingAdapter";
import {
  DeveloperWithDateIndexedStaffings,
  groupProductionsWithStaffing,
  ProductionsWithStaffing,
} from "./groupProductionsWithStaffing";
import sumBy from "lodash/sumBy";
import {
  ProjectWithDevelopersAndStaffingDTO,
  TeamWithDevelopersAndStaffing,
} from "../../project/types";

export const computeEndDateFromVolume = (
  startDate: Date,
  volume: number,
  project: ProjectWithDevelopersAndStaffingDTO
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

  let currentUnitSum = 0;
  let lastVisitedDate = startDate;

  for (
    let currentDate = startDate;
    currentUnitSum < volume;
    currentDate = addBusinessDays(currentDate, 1)
  ) {
    currentUnitSum +=
      meanProductivity *
      (sumBy(
        developersWithStaffings,
        (developer) =>
          developer.staffings[formatISO(currentDate)]?.value ??
          developer.defaultStaffingValue
      ) /
        defaultStaffing);

    lastVisitedDate = currentDate;
  }

  return lastVisitedDate;
};
