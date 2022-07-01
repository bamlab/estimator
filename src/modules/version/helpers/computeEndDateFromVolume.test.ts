import { parseISO } from "date-fns";
import { teamMock } from "../mocks/team.mock";
import { computeEndDateFromVolumeAndStaffing } from "./computeEndDateFromVolume";

const startDate = parseISO("2022-06-29T00:00:00+0000");

describe("computeEndDateFromVolumeWithStaffing", () => {
  it("should return startDate param if volume is negative", () => {
    const actual = computeEndDateFromVolumeAndStaffing({
      startDate,
      volume: -5,
      meanProductivity: 1,
      team: teamMock,
      defaultStaffing: 1.5,
    });

    expect(actual).toEqual(startDate);
  });
  it("should return the right result for a low volume", () => {
    const actual = computeEndDateFromVolumeAndStaffing({
      startDate,
      volume: 2,
      meanProductivity: 8,
      team: teamMock,
      defaultStaffing: 1.5,
    });

    expect(actual).toEqual(startDate);
  });
  it("should return the right result for a normal volume", () => {
    const actual = computeEndDateFromVolumeAndStaffing({
      startDate,
      volume: 17,
      meanProductivity: 8,
      team: teamMock,
      defaultStaffing: 1.5,
    });

    expect(actual).toEqual(parseISO("2022-07-01T00:00:00+0000"));
  });
  it("should return the right result for a high volume", () => {
    const actual = computeEndDateFromVolumeAndStaffing({
      startDate,
      volume: 30,
      meanProductivity: 1,
      team: teamMock,
      defaultStaffing: 1.5,
    });

    expect(actual).toEqual(parseISO("2022-08-10T00:00:00+0000"));
  });
});
