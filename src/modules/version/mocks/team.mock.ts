import { addDays, differenceInDays, parseISO } from "date-fns";
import { TeamWithDevelopersAndStaffing } from "../../project/types";

export const teamMock: TeamWithDevelopersAndStaffing = {
  id: "0",
  projectId: "0",
  developers: [
    {
      id: "0",
      name: "Guillaume",
      teamId: "0",
      capacity: 6,
      defaultStaffingValue: 0.5,
      staffing: [
        {
          id: "0",
          developerId: "0",
          date: parseISO("2022-06-29T00:00:00+0000"),
          value: 0.5,
        },
        {
          id: "1",
          date: parseISO("2022-06-30T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "2",
          date: parseISO("2022-07-01T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "3",
          date: parseISO("2022-07-04T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "4",
          date: parseISO("2022-07-05T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "5",
          date: parseISO("2022-07-06T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "6",
          date: parseISO("2022-07-07T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "7",
          date: parseISO("2022-07-08T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "8",
          date: parseISO("2022-07-10T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "9",
          date: parseISO("2022-07-11T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "10",
          date: parseISO("2022-07-12T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "11",
          date: parseISO("2022-07-13T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "12",
          date: parseISO("2022-07-14T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "13",
          date: parseISO("2022-07-17T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
        {
          id: "14",
          date: parseISO("2022-07-18T00:00:00+0000"),
          value: 0.5,
          developerId: "0",
        },
      ],
    },
    {
      id: "1",
      name: "Maxime",
      teamId: "0",
      capacity: 6,
      defaultStaffingValue: 1,
      staffing: [
        {
          id: "100",
          developerId: "1",
          date: parseISO("2022-06-29T00:00:00+0000"),
          value: 1,
        },
        {
          id: "101",
          date: parseISO("2022-06-30T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "102",
          date: parseISO("2022-07-01T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "103",
          date: parseISO("2022-07-04T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "104",
          date: parseISO("2022-07-05T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "105",
          date: parseISO("2022-07-06T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "106",
          date: parseISO("2022-07-07T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "107",
          date: parseISO("2022-07-08T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "108",
          date: parseISO("2022-07-10T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "109",
          date: parseISO("2022-07-11T00:00:00+0000"),
          value: 0,
          developerId: "1",
        },
        {
          id: "1010",
          date: parseISO("2022-07-12T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "1011",
          date: parseISO("2022-07-13T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "1012",
          date: parseISO("2022-07-14T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "1013",
          date: parseISO("2022-07-17T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
        {
          id: "1014",
          date: parseISO("2022-07-18T00:00:00+0000"),
          value: 1,
          developerId: "1",
        },
      ],
    },
  ],
};

export const getTeamWith1DevMock = ({
  defaultStaffingValue,
  endDate,
  startDate,
}: {
  defaultStaffingValue: number;
  startDate: Date;
  endDate: Date;
}): TeamWithDevelopersAndStaffing => {
  const diff = Math.abs(differenceInDays(startDate, endDate)) + 1;

  const dates = new Array(diff)
    .fill(0)
    .map((_, i) => i)
    .map((value) => addDays(startDate, value));

  return {
    id: "0",
    projectId: "0",
    developers: [
      {
        id: "0",
        name: "Guillaume",
        teamId: "0",
        capacity: 6,
        defaultStaffingValue,
        staffing: dates.map((date) => ({
          id: "0",
          developerId: "0",
          date,
          value: defaultStaffingValue,
        })),
      },
    ],
  };
};

export const getTeamMock = ({
  devNumber,
  defaultStaffingValue,
  endDate,
  startDate,
}: {
  devNumber: number;
  defaultStaffingValue: number;
  startDate: Date;
  endDate: Date;
}): TeamWithDevelopersAndStaffing => {
  const diff = Math.abs(differenceInDays(startDate, endDate)) + 1;

  const dates = new Array(diff)
    .fill(0)
    .map((_, i) => i)
    .map((value) => addDays(startDate, value));

  return {
    id: "0",
    projectId: "0",
    developers: new Array(devNumber)
      .fill(0)
      .map((_, i) => i)
      .map((id) => ({
        id: id.toString(),
        name: "Guillaume-" + id.toString(),
        teamId: "0",
        capacity: 6,
        defaultStaffingValue,
        staffing: dates.map((date, index) => ({
          id: index.toString(),
          developerId: id.toString(),
          date,
          value: defaultStaffingValue,
        })),
      })),
  };
};
