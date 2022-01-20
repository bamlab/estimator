export type DatasheetCellProps = {
  value: string;
  row: { index: number };
  column: { id: string; width: number };
  updateMyData: (index: number, id: string, value: string | string[]) => void;
};
