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
      { done: 0, name: "11/07" },
      { done: 8, name: "12/07" },
      { done: 16, name: "13/07" },
      { done: 22, name: "14/07" },
      { done: 26, name: "15/07" },
      { done: 29, name: "18/07" },
      { done: 31, name: "19/07" },
      { done: 32, name: "20/07" },
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
      { done: 0, name: "11/07" },
      { done: NaN, name: "12/07" },
      { done: NaN, name: "13/07" },
      { done: NaN, name: "14/07" },
      { done: NaN, name: "15/07" },
      { done: NaN, name: "18/07" },
      { done: NaN, name: "19/07" },
      { done: NaN, name: "20/07" },
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
      { done: 0, name: "11/07" },
      { done: 8, name: "12/07" },
      { done: 16, name: "13/07" },
      { done: 22, name: "14/07" },
      { done: 26, name: "15/07" },
      { done: NaN, name: "18/07" },
      { done: NaN, name: "19/07" },
      { done: NaN, name: "20/07" },
    ]);
  });
});
