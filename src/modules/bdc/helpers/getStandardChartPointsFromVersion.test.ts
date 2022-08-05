import {
  mockProject,
  mockProjectWith1ReleaseAnd2DaysOff,
  mockProjectWith2ReleasesAnd2DaysOff,
} from "../mocks/mockProject";
import { mockRelease } from "../mocks/mockRelease";
import { mockVersion } from "../mocks/mockVersion";
import {
  getStandardChartPointsFromSingleRelease,
  getStandardChartPointsFromVersion,
} from "./getStandardChartPointsFromVersion";

describe("getStandardChartPointsFromVersion", () => {
  it("should return the correct total values", () => {
    expect(
      getStandardChartPointsFromVersion(mockProject, mockVersion).map(
        ({ total }) => total
      )
    ).toEqual([30, 30, 20, 60, 60, 60, 60]);
  });

  it("should return the right dates", () => {
    expect(
      getStandardChartPointsFromVersion(mockProject, mockVersion).map(
        ({ name }) => name
      )
    ).toEqual(["11/07", "12/07", "13/07", "14/07", "15/07", "18/07", "19/07"]);
  });

  it("should return the right chart points for 1 RC", () => {
    expect(
      getStandardChartPointsFromVersion(
        mockProjectWith1ReleaseAnd2DaysOff,
        mockProjectWith1ReleaseAnd2DaysOff.versions[0]
      ).map(({ standard }) => standard)
    ).toEqual([6, 4, 4, 4, 2, 0]);
  });

  it("should return the right chart points for 2 RC, with a new scope to match forecasts", () => {
    expect(
      getStandardChartPointsFromVersion(
        mockProjectWith2ReleasesAnd2DaysOff,
        mockProjectWith2ReleasesAnd2DaysOff.versions[0]
      ).map(({ standard }) => standard)
    ).toEqual([20, 12, 12, 12, 5, 0]);
  });
});

describe("getStandardChartPointsFromSingleRelease", () => {
  it("should return the right chart points for a release", () => {
    expect(
      getStandardChartPointsFromSingleRelease({
        project: mockProject,
        release: mockRelease,
        standardVolumeToDoBeforeRelease: 20,
        releaseStartDate: new Date("2022-07-11T03:24:00"),
        releaseEndDate: new Date("2022-07-13T03:24:00"),
      })
    ).toEqual({
      chartPoints: [
        { name: "11/07", standard: 20, total: 40 },
        { name: "12/07", standard: 16, total: 40 },
        { name: "13/07", standard: 12, total: 40 },
      ],
      standardVolumeToDoForRelease: 12,
    });
  });
});
