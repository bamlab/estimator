import React from "react";
import { Styles } from "./style";
import {
  useTable,
  useRowSelect,
  Column,
  useGlobalFilter,
  useFilters,
  Row,
} from "react-table";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { Searchbar } from "./SearchBar";
import { fuzzyTextFilterFn } from "./filters/fuzzyTextFilter";
import { DefaultColumnFilter } from "./filters/DefaultColumnFilter";
import { Field } from "../../types/database";
type Props = {
  columns: Column<Field>[];
  data: Field[];
};

export const Table = ({ columns, data }: Props) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Let the table remove the filter if the string is empty
  // @ts-ignore
  fuzzyTextFilterFn.autoRemove = (val) => !val;

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // @ts-ignore
    preGlobalFilteredRows,
    // @ts-ignore
    setGlobalFilter,
    state,
  } = useTable(
    //@ts-ignore
    {
      columns,
      data,
      // @ts-ignore
      defaultColumn,
      filterTypes,
    },

    (hooks) => {
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
    },
    useFilters,
    useGlobalFilter,
    useRowSelect
  );

  // Render the UI for your table
  return (
    <Styles>
      <Searchbar
        preGlobalFilteredRows={preGlobalFilteredRows}
        // @ts-ignore
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  <div>
                    {column.defaultCanFilter ? column.render("Filter") : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Styles>
  );
};
