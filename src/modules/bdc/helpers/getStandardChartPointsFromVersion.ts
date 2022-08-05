import {
  addBusinessDays,
  differenceInBusinessDays,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import sumBy from "lodash/sumBy";
import flatten from "lodash/flatten";
import isEqual from "lodash/isEqual";
import range from "lodash/range";
import { StandardChartPoint } from "../../../types/charts";
import { formatDate } from "../../../utils/formatDate";
import { parseGMTMidnight } from "../../../utils/parseGMTMidnight";
import {
  FullProjectDTO,
  ReleaseDTO,
  StaffingDTO,
  VersionDTO,
} from "../../project/types";

export const getStandardChartPointsFromVersion = (
  project: FullProjectDTO,
  version: VersionDTO
): StandardChartPoint[] => {
  const sortedReleasesByCreationDate = version.releases.sort(
    (r1, r2) =>
      parseISO(r1.createdAt).getTime() - parseISO(r2.createdAt).getTime()
  );

  const releaseStartDates = sortedReleasesByCreationDate.map((release, idx) => {
    if (idx === 0) {
      return parseISO(version.startDate);
    }
    return addBusinessDays(parseISO(release.createdAt), 1); //Each release is printed in the chart starting from the next date it was created
  });

  const releaseEndDates = sortedReleasesByCreationDate
    .slice(1)
    .map((release) => {
      return parseISO(release.createdAt); //each release ends just before the next one starts
    });
  //For the last release we take the end date of the release
  releaseEndDates.push(
    addBusinessDays(
      parseISO(
        sortedReleasesByCreationDate[sortedReleasesByCreationDate.length - 1]
          .forecastEndDate
      ),
      1
    )
  );

  let standardVolumeToDo = 0;
  let standardChartPoints: StandardChartPoint[] = [];

  sortedReleasesByCreationDate.forEach((release, idx) => {
    const {
      chartPoints: releaseChartPoints,
      standardVolumeToDoForRelease: standardVolumeToDoForRelease,
    } = getStandardChartPointsFromSingleRelease({
      release,
      standardVolumeToDoBeforeRelease: standardVolumeToDo,
      releaseStartDate: releaseStartDates[idx],
      releaseEndDate: releaseEndDates[idx],
      project,
    });

    standardChartPoints = standardChartPoints.concat(releaseChartPoints);
    standardVolumeToDo += standardVolumeToDoForRelease;
  });

  return standardChartPoints;
};

const computeStandard = ({
  currentDayIdx,
  currentStandard,
  releaseStartDate,
  staffingsInRelease,
  standardCelerity,
  startVolume,
}: {
  currentStandard: number;
  releaseStartDate: Date;
  currentDayIdx: number;
  startVolume: number;
  staffingsInRelease: StaffingDTO[];
  standardCelerity: number;
}): number => {
  let standard = currentStandard;
  const prevDayDate = addBusinessDays(releaseStartDate, currentDayIdx - 1);

  const staffingListOfThePrevDay = staffingsInRelease.filter((staffing) =>
    isEqual(parseGMTMidnight(staffing.date), prevDayDate)
  );
  const staffingOfThePrevDay = sumBy(
    staffingListOfThePrevDay,
    (staffing) => staffing.value
  );

  const standardStaffingOfTheDay = staffingListOfThePrevDay.length;

  standard -=
    standardStaffingOfTheDay === 0
      ? standardCelerity
      : (standardCelerity * staffingOfThePrevDay) / standardStaffingOfTheDay;

  if (currentDayIdx === 0) {
    standard = startVolume;
  }

  return standard;
};

export const getStandardChartPointsFromSingleRelease = ({
  release,
  standardVolumeToDoBeforeRelease,
  releaseStartDate,
  releaseEndDate,
  project,
}: {
  release: ReleaseDTO;
  standardVolumeToDoBeforeRelease: number;
  releaseStartDate: Date;
  releaseEndDate: Date;
  project: FullProjectDTO;
}): {
  chartPoints: StandardChartPoint[];
  standardVolumeToDoForRelease: number;
} => {
  const startVolume = release.volume - standardVolumeToDoBeforeRelease;
  const numberOfDaysToDisplay =
    differenceInBusinessDays(releaseEndDate, releaseStartDate) + 1;
  const expectedNumberOfDays =
    differenceInBusinessDays(
      parseISO(release.forecastEndDate),
      releaseStartDate
    ) + 1;

  const staffingsInRelease = flatten(
    project.team?.developers.map((developer) => {
      return developer.staffing.filter(
        (staffing) =>
          isBefore(parseGMTMidnight(staffing.date), releaseEndDate) &&
          isAfter(
            parseGMTMidnight(staffing.date),
            addBusinessDays(releaseStartDate, -1)
          )
      );
    })
  );

  const totalStaffingsInRelease = sumBy(
    staffingsInRelease,
    (staffing) => staffing.value
  );

  const standardTotalStaffingsInRelease = staffingsInRelease.length;

  const standardCelerity =
    (startVolume / expectedNumberOfDays) *
    (standardTotalStaffingsInRelease / totalStaffingsInRelease);

  let standard = startVolume;
  const chartPoints = range(numberOfDaysToDisplay).map((currentDayIdx) => {
    standard = computeStandard({
      currentDayIdx,
      currentStandard: standard,
      releaseStartDate,
      staffingsInRelease,
      standardCelerity,
      startVolume,
    });

    return {
      name: formatDate(addBusinessDays(releaseStartDate, currentDayIdx)),
      standard,
      total: release.volume,
    };
  });
  const standardVolumeToDoForRelease = standard;

  return {
    chartPoints,
    standardVolumeToDoForRelease: standardVolumeToDoForRelease,
  };
};
