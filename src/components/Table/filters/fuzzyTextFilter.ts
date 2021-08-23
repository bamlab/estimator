import { matchSorter } from "match-sorter";

// @ts-ignore
export function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, {
    keys: [(row: { values: Record<string, string> }) => row.values[id]],
  });
}
