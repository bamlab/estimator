import { parseISO } from "date-fns";
import { productionsMock } from "../mocks/productions.mock";
import { computeProjectMeanProductivity } from "./computeProjectMeanProductivity";

describe("computeVolumeEstimationFromTimePeriod", () => {
  it("should return projectProductivity if productions param is empty", () => {
    const actual = computeProjectMeanProductivity([], 1);
    expect(actual).toEqual(1);
  });
  it("should return the mean of productions param if there are 15 productions", () => {
    const actual = computeProjectMeanProductivity(productionsMock, 1);
    expect(actual).toEqual(7.8);
  });
  it("should return the mean of productions param and projectProductivity for missing days if there are less than 15 productions", () => {
    const actual = computeProjectMeanProductivity(
      productionsMock.slice(0, 10),
      2
    );
    expect(actual).toEqual(6.1);
  });
  it("should return the mean of productions param og the 15th last days if there are more than 15 productions", () => {
    const actual = computeProjectMeanProductivity(
      productionsMock.concat({
        id: "15",
        projectId: "0",
        date: parseISO("2022-07-19T00:00:00+0000"),
        done: 9,
      }),
      2
    );
    expect(actual).toEqual(8.1);
  });
});
