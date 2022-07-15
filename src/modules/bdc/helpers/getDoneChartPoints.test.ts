import { mockProject } from "../mocks/mockProject";
import { getDoneChartPoints } from "./getDoneChartPoints";

describe("getDoneChartPoints", () => {
  it("should return the correct values for a project with full production", () => {
    expect(
      getDoneChartPoints({
        project: mockProject,
        startDate: new Date("2022-07-11T03:24:00"),
        endDate: new Date("2022-07-20T03:24:00"),
      })
    ).toEqual([
      { name: "11/07", done: 0, forecastDone: 0 },
      { name: "12/07", done: 8, forecastDone: 8 },
      { name: "13/07", done: 16, forecastDone: 16 },
      { name: "14/07", done: 22, forecastDone: 22 },
      { name: "15/07", done: 26, forecastDone: 26 },
      { name: "18/07", done: 29, forecastDone: 29 },
      { name: "19/07", done: 31, forecastDone: 31 },
      { name: "20/07", done: 32, forecastDone: 32 },
    ]);
  });
  it("should return the correct values for a project with no production", () => {
    expect(
      getDoneChartPoints({
        project: { ...mockProject, productions: [] },
        startDate: new Date("2022-07-11T03:24:00"),
        endDate: new Date("2022-07-20T03:24:00"),
      })
    ).toEqual([
      { name: "11/07", done: 0, forecastDone: 0 },
      { name: "12/07", done: NaN, forecastDone: 6 },
      { name: "13/07", done: NaN, forecastDone: 12 },
      { name: "14/07", done: NaN, forecastDone: 18 },
      { name: "15/07", done: NaN, forecastDone: 24 },
      { name: "18/07", done: NaN, forecastDone: 36 },
      { name: "19/07", done: NaN, forecastDone: 42 },
      { name: "20/07", done: NaN, forecastDone: 48 },
    ]);
  });
  it("should return the correct values for a project with some production", () => {
    expect(
      getDoneChartPoints({
        project: {
          ...mockProject,
          productions: mockProject.productions.slice(0, 4),
        },
        startDate: new Date("2022-07-11T03:24:00"),
        endDate: new Date("2022-07-20T03:24:00"),
      })
    ).toEqual([
      { name: "11/07", done: 0, forecastDone: 0 },
      { name: "12/07", done: 8, forecastDone: 8 },
      { name: "13/07", done: 16, forecastDone: 16 },
      { name: "14/07", done: 22, forecastDone: 22 },
      { name: "15/07", done: 26, forecastDone: 26 },
      { name: "18/07", done: NaN, forecastDone: 36.53333333333333 },
      { name: "19/07", done: NaN, forecastDone: 41.8 },
      { name: "20/07", done: NaN, forecastDone: 47.06666666666666 },
    ]);
  });
  it("should return the correct for project staffed at half time", () => {
    const mockProduction = [
      {
        id: "93f5d047-e097-4f3f-8a6f-6c5abffcd028",
        done: 3,
        date: "2022-07-11T00:00:00.000Z",
        projectId: "9ffd7e29-8cc1-4743-bcf1-6da7b2f03cab",
      },
      {
        id: "c6c74065-343b-415a-9eda-a16a4fa0fbf7",
        done: 3,
        date: "2022-07-12T00:00:00.000Z",
        projectId: "9ffd7e29-8cc1-4743-bcf1-6da7b2f03cab",
      },
    ];
    const mockStaffing = [
      {
        id: "0f482eef-724a-4640-add4-ec5ded105b88",
        date: "2022-07-11T00:00:00.000Z",
        value: 0.5,
        developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
      },
      {
        id: "7cb0b322-1bc1-44fc-bff2-913ff6b756b5",
        date: "2022-07-12T00:00:00.000Z",
        value: 0.5,
        developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
      },
      {
        id: "ee72c825-d8ef-4006-b622-1047ecdb5a6a",
        date: "2022-07-13T00:00:00.000Z",
        value: 0.5,
        developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
      },
      {
        id: "3c916518-3659-4b80-b790-e35cf71f7665",
        date: "2022-07-14T00:00:00.000Z",
        value: 0.5,
        developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
      },
      {
        id: "a51da95a-06b7-43ef-b050-9fa969c332ac",
        date: "2022-07-15T00:00:00.000Z",
        value: 0.5,
        developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
      },
    ];
    expect(
      getDoneChartPoints({
        project: {
          ...mockProject,
          productions: mockProduction,
          team: mockProject.team
            ? {
                ...mockProject.team,
                developers: [
                  {
                    ...mockProject.team?.developers[0],
                    staffing: mockStaffing,
                  },
                ],
              }
            : null,
        },
        startDate: new Date("2022-07-11T03:24:00"),
        endDate: new Date("2022-07-18T03:24:00"),
      })
    ).toEqual([
      { name: "11/07", done: 0, forecastDone: 0 },
      { name: "12/07", done: 3, forecastDone: 3 },
      { name: "13/07", done: 6, forecastDone: 6 },
      { name: "14/07", done: NaN, forecastDone: 8.7 },
      { name: "15/07", done: NaN, forecastDone: 11.399999999999999 },
      { name: "18/07", done: NaN, forecastDone: 14.099999999999998 },
    ]);
  });
});
