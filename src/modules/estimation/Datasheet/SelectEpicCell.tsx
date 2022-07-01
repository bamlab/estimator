import React, { Dispatch, SetStateAction } from "react";
import { ActionMeta, SingleValue } from "react-select";
import ReactSelect from "react-select/creatable";
import { createEpic } from "../useCases/createEpic";
import { DatasheetCellProps } from "./types";

const defaultTechniqueGestures = [
  { label: "Authentification", value: "auth" },
  { label: "Setup", value: "setup" },
  { label: "Notifications", value: "notifications" },
];

interface Props extends DatasheetCellProps {
  epicList: { label: string; value: string }[];
  estimationId: string;
  setEpicList: Dispatch<SetStateAction<{ label: string; value: string }[]>>;
}

export const SelectEpicCell = ({
  updateMyData,
  epicList = defaultTechniqueGestures,
  column,
  row,
  estimationId,
  setEpicList,
  value,
}: Props) => {
  const onChange: (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => void = async (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "create-option": {
        if (!newValue) {
          return;
        }
        const epic = await createEpic({
          name: actionMeta.option.label,
          estimationId,
        });
        updateMyData(row.index, column.id, newValue?.value);
        setEpicList(epicList.concat({ label: epic.name, value: epic.id }));
        break;
      }
      default:
        updateMyData(row.index, column.id, newValue?.value ?? "");
        break;
    }
  };

  return (
    <ReactSelect
      options={epicList}
      name="colors"
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange}
      defaultValue={epicList.find((epic) => epic.value === value)}
    />
  );
};
