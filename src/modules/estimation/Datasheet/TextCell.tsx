import React from "react";
import { DatasheetCellProps } from "./types";

export const TextCell = ({ value }: DatasheetCellProps) => {
  return <p>{value}</p>;
};
