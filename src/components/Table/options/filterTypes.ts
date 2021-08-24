import { fuzzyTextFilterFn } from "../filters/fuzzyTextFilter";

// @ts-ignore
fuzzyTextFilterFn.autoRemove = (val) => !val;

export const filterTypes = {
  // Add a new fuzzyTextFilterFn filter type.
  fuzzyText: fuzzyTextFilterFn,
  // Or, override the default text filter to use
  // "startWith"
};
