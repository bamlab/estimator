import { FilterValue, IdType, Row } from "react-table";
import { Field } from "./database";

export type ColumnFilter = {
  column: {
    filterValue: FilterValue;
    preFilteredRows: Array<Row<Field>>;
    setFilter: (columnId: IdType<Field> | undefined) => void;
    id: string;
  };
};
