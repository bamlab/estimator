import React from "react";
import { Styles } from "./style";
import { TableInstance } from "react-table";
import { Searchbar } from "./SearchBar";
import { Field } from "../../types/database";

export const Table = ({
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
}: TableInstance<Field>) => {
  // Render the UI for your table
  return (
    <Styles>
      {preGlobalFilteredRows && (
        <Searchbar
          preGlobalFilteredRows={preGlobalFilteredRows}
          // @ts-ignore
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.getHeaderGroupProps().key}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.getHeaderProps().key}
                >
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
              <tr {...row.getRowProps()} key={row.getRowProps().key}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                      {cell.render("Cell")}
                    </td>
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
