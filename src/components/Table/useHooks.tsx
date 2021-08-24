import { Hooks, Row } from "react-table";
import { Field } from "../../types/database";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";

export const useHooks = (hooks: Hooks<Field>) => {
  hooks.visibleColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: "selection",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({
        getToggleAllRowsSelectedProps,
      }: {
        getToggleAllRowsSelectedProps: () => void;
      }) => (
        <div>
          {
            // @ts-ignore
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          }
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: { row: Row }) => (
        <div>
          {
            // @ts-ignore
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          }
        </div>
      ),
    },
    ...columns,
  ]);
};
