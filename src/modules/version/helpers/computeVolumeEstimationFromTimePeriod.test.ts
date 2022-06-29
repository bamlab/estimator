import { parseISO } from "date-fns";
import { computeVolumeEstimationFromTimePeriod } from "./computeVolumeEstimationFromTimePeriod";

describe("computeVolumeEstimationFromTimePeriod", () => {
  it("should return meanProductivityParam if startDate is the same as endDate params", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-06-29T00:00:00+0000");

    const actual = computeVolumeEstimationFromTimePeriod(1, startDate, endDate);
    expect(actual).toEqual(1);
  });
  it("should return meanProductivity times number of business days between startDate and endDate included", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-07-01T00:00:00+0000");

    const actual = computeVolumeEstimationFromTimePeriod(1, startDate, endDate);
    expect(actual).toEqual(3);
  });
  it("should return meanProductivity times number of business days between startDate and endDate included when their are several weekends between the two dates", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-07-25T00:00:00+0000");

    const actual = computeVolumeEstimationFromTimePeriod(1, startDate, endDate);
    expect(actual).toEqual(19);
  });
  it("should return 0 if endDate is before startDate", () => {
    const startDate = parseISO("2022-06-29T00:00:00+0000");
    const endDate = parseISO("2022-06-24T00:00:00+0000");

    const actual = computeVolumeEstimationFromTimePeriod(1, startDate, endDate);
    expect(actual).toEqual(0);
  });
  it("should return 0 if meanProductivity is negative", () => {
    const startDate = parseISO("2022-06-24T00:00:00+0000");
    const endDate = parseISO("2022-06-29T00:00:00+0000");

    const actual = computeVolumeEstimationFromTimePeriod(
      -2,
      startDate,
      endDate
    );
    expect(actual).toEqual(0);
  });
});
