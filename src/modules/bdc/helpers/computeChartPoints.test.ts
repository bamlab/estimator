import { computeChartPoints } from "./computeChartPoints";

describe("computeChartPoints", () => {
  it("should merge the standard and done points and compute correctly the remaining point", () => {
    const standardPoints = [
      { name: "11/07", standard: 30, total: 30 },
      { name: "12/07", standard: 24, total: 30 },
      { name: "13/07", standard: 8, total: 20 },
      { name: "14/07", standard: 46, total: 60 },
      { name: "15/07", standard: 30.666666666666664, total: 60 },
      { name: "18/07", standard: 15.333333333333332, total: 60 },
      { name: "19/07", standard: 0, total: 60 },
    ];
    const doneChartPoints = [
      { name: "11/07", done: 0 },
      { name: "12/07", done: 8 },
      { name: "13/07", done: 16 },
      { name: "14/07", done: 22 },
      { name: "15/07", done: 26 },
      { name: "18/07", done: NaN },
      { name: "19/07", done: NaN },
    ];
    expect(computeChartPoints(standardPoints, doneChartPoints)).toEqual([
      { name: "11/07", done: 0, remaining: 30, standard: 30, total: 30 },
      { name: "12/07", done: 8, remaining: 22, standard: 24, total: 30 },
      { name: "13/07", done: 16, remaining: 4, standard: 8, total: 20 },
      { name: "14/07", done: 22, remaining: 38, standard: 46, total: 60 },
      {
        name: "15/07",
        done: 26,
        remaining: 34,
        standard: 30.666666666666664,
        total: 60,
      },
      {
        name: "18/07",
        done: NaN,
        remaining: NaN,
        standard: 15.333333333333332,
        total: 60,
      },
      { name: "19/07", done: NaN, remaining: NaN, standard: 0, total: 60 },
    ]);
  });
});
