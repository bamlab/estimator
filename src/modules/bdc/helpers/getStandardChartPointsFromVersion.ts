import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { range } from "lodash";
import { StandardChartPoint } from "../../../types/charts";
import { formatDate } from "../../../utils/formatDate";
import { ReleaseDTO, VersionDTO } from "../../project/types";

export const getStandardChartPointsFromVersion = (
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
    });

    standardChartPoints = standardChartPoints.concat(releaseChartPoints);
    standardVolumeToDo += standardVolumeToDoForRelease;
  });

  return standardChartPoints;
};

export const getStandardChartPointsFromSingleRelease = ({
  release,
  standardVolumeToDoBeforeRelease,
  releaseStartDate,
  releaseEndDate,
}: {
  release: ReleaseDTO;
  standardVolumeToDoBeforeRelease: number;
  releaseStartDate: Date;
  releaseEndDate: Date;
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
  const standardCelerity = startVolume / expectedNumberOfDays;

  const chartPoints = range(numberOfDaysToDisplay).map((currentDayIdx) => ({
    name: formatDate(addBusinessDays(releaseStartDate, currentDayIdx)),
    standard: startVolume - standardCelerity * currentDayIdx,
    total: release.volume,
  }));
  const standardVolumeToDoForRelease = standardCelerity * numberOfDaysToDisplay;

  return {
    chartPoints,
    standardVolumeToDoForRelease: standardVolumeToDoForRelease,
  };
};
