import { parseISO } from "date-fns";
import { teamMock } from "../mocks/team.mock";
import { computeVolumeEstimation } from "./computeVolumeEstimationFromTimePeriod";

describe("computeVolumeEstimation", () => {
  it("should return meanProductivityParam if startDate is the same as endDate params", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-06-29T00:00:00+0000");

    const actual = computeVolumeEstimation(
      1,
      teamMock,
      1.5,
      startDate,
      endDate
    );
    expect(actual).toEqual(1);
  });
  it("should return meanProductivity times number of business days between startDate and endDate included for 3 days", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-07-01T00:00:00+0000");

    const actual = computeVolumeEstimation(
      1,
      teamMock,
      1.5,
      startDate,
      endDate
    );
    expect(actual).toEqual(3);
  });
  it("should return meanProductivity times number of business days between startDate and endDate included when their are several weekends between the two dates", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-07-25T00:00:00+0000");

    const actual = computeVolumeEstimation(
      3,
      teamMock,
      1.5,
      startDate,
      endDate
    );
    expect(actual).toEqual(55);
  });
  it("should return 0 if endDate is before startDate", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-06-24T00:00:00+0000");

    const actual = computeVolumeEstimation(
      1,
      teamMock,
      1.5,
      startDate,
      endDate
    );
    expect(actual).toEqual(0);
  });
  it("should return 0 if meanProductivity is negative", () => {
    const startDate = parseISO("2022-06-24T00:00:00+0000");
    const endDate = parseISO("2022-06-29T00:00:00+0000");

    const actual = computeVolumeEstimation(
      -2,
      teamMock,
      1.5,
      startDate,
      endDate
    );
    expect(actual).toEqual(0);
  });
});
