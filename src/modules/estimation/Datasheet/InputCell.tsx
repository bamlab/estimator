import React from "react";
import { DatasheetCellProps } from "./types";

export const InputCell = ({
  value: initialValue,
  row: { index },
  column: { width = 120, id },
  updateMyData, // This is a custom function that we supplied to our table instance
}: DatasheetCellProps) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={{ width: width - 20 }}
    />
  );
};
