import { parseISO } from "date-fns";
import { getTeamMock, teamMock } from "../mocks/team.mock";
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
    const customTeamMock = getTeamMock({
      defaultStaffingValue: 1,
      devNumber: 2,
      startDate,
      endDate: parseISO("2022-08-20T00:00:00+0000"),
    });

    const actual = computeEndDateFromVolumeAndStaffing({
      startDate,
      volume: 30,
      meanProductivity: 2,
      team: customTeamMock,
      defaultStaffing: 2,
    });

    expect(actual).toEqual(parseISO("2022-07-19T00:00:00+0000"));
  });

  it("should return the right result for 5 days, 1 dev staffed full time", () => {
    const startDate = parseISO("2022-08-22T00:00:00+0000");
    const endDate = parseISO("2022-08-26T00:00:00+0000");

    const customTeamMock = getTeamMock({
      defaultStaffingValue: 1,
      devNumber: 1,
      startDate,
      endDate,
    });
    const actual = computeEndDateFromVolumeAndStaffing({
      startDate,
      volume: 5,
      meanProductivity: 1,
      team: customTeamMock,
      defaultStaffing: 1,
    });

    expect(actual).toEqual(endDate);
  });

  it("should return the right result for 5 days, 2 dev staffed half time", () => {
    const startDate = parseISO("2022-08-22T00:00:00+0000");
    const endDate = parseISO("2022-08-26T00:00:00+0000");

    const customTeamMock = getTeamMock({
      defaultStaffingValue: 0.5,
      devNumber: 2,
      startDate,
      endDate,
    });
    const actual = computeEndDateFromVolumeAndStaffing({
      startDate,
      volume: 5,
      meanProductivity: 2,
      team: customTeamMock,
      defaultStaffing: 2,
    });

    expect(actual).toEqual(endDate);
  });
});
