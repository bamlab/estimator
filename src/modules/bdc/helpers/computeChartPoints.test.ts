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
      {
        name: "11/07",
        total: 30,
        standard: 30,
        done: 0,
        forecastDone: 0,
        remaining: 30,
        forecastRemaining: NaN,
      },
      {
        name: "12/07",
        total: 30,
        standard: 24,
        done: 8,
        forecastDone: 0,
        remaining: 22,
        forecastRemaining: NaN,
      },
      {
        name: "13/07",
        total: 20,
        standard: 8,
        done: 16,
        forecastDone: 0,
        remaining: 4,
        forecastRemaining: NaN,
      },
      {
        name: "14/07",
        total: 60,
        standard: 46,
        done: 22,
        forecastDone: 0,
        remaining: 38,
        forecastRemaining: NaN,
      },
      {
        name: "15/07",
        total: 60,
        standard: 30.666666666666664,
        done: 26,
        forecastDone: 0,
        remaining: 34,
        forecastRemaining: NaN,
      },
      {
        name: "18/07",
        total: 60,
        standard: 15.333333333333332,
        done: NaN,
        forecastDone: 0,
        remaining: NaN,
        forecastRemaining: NaN,
      },
      {
        name: "19/07",
        total: 60,
        standard: 0,
        done: NaN,
        forecastDone: 0,
        remaining: NaN,
        forecastRemaining: NaN,
      },
    ]);
  });
});
