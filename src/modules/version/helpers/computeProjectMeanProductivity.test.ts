import { parseISO } from "date-fns";
import { productionsMock } from "../mocks/productions.mock";
import { teamMock } from "../mocks/team.mock";
import { computeProjectMeanProductivity } from "./computeProjectMeanProductivity";
import { groupProductionsWithStaffing } from "./groupProductionsWithStaffing";

const productionWithStaffingMock = groupProductionsWithStaffing(
  productionsMock,
  teamMock
);
describe("computeProjectMeanProductivity", () => {
  it("should return projectProductivity if productions param is empty", () => {
    const actual = computeProjectMeanProductivity({
      productionsWithStaffing: [],
      defaultStaffing: 1.5,
      projectProductivity: 1,
    });
    expect(actual).toEqual(1);
  });
  it("should return the mean of productions param if there are 15 productions", () => {
    const actual = computeProjectMeanProductivity({
      productionsWithStaffing: productionWithStaffingMock,
      defaultStaffing: 1.5,
      projectProductivity: 1,
    });
    expect(actual).toEqual(8.0);
  });
  it("should return the mean of productions param and projectProductivity for missing days if there are less than 15 productions", () => {
    const actual = computeProjectMeanProductivity({
      productionsWithStaffing: productionWithStaffingMock.slice(0, 10),
      defaultStaffing: 1.5,
      projectProductivity: 2,
    });
    expect(actual).toEqual(6.2);
  });
  it("should return the mean of productions param on the 15th last days if there are more than 15 productions", () => {
    const adjustedProductionWithStaffingMock = groupProductionsWithStaffing(
      productionsMock.concat({
        id: "15",
        projectId: "0",
        date: parseISO("2022-07-19T00:00:00+0000"),
        done: 9,
      }),
      teamMock
    );
    const actual = computeProjectMeanProductivity({
      productionsWithStaffing: adjustedProductionWithStaffingMock,
      defaultStaffing: 1.5,
      projectProductivity: 2,
    });
    expect(actual).toEqual(8.4);
  });
});
