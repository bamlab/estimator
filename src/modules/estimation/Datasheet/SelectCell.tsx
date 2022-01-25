import React from "react";
import { ActionMeta, MultiValue } from "react-select";

import ReactSelect from "react-select/creatable";
import { DatasheetCellProps } from "./types";

const defaultTechniqueGestures = [
  { label: "Faire un call API", value: "get" },
  { label: "Gérer l'erreur d'un call API", value: "handle error" },
  { label: "Intégrer un formulaire", value: "form" },
  { label: "Utilisation d'un composant", value: "component" },
  { label: "Logique algorithmique", value: "logic" },
  { label: "Navigation ou création de page", value: "page" },
  { label: "Intégrer une webview", value: "webview" },
  { label: "Intégrer un SDK ou une librairie", value: "sdk" },
  { label: "POST API et gestion d'erreur", value: "post" },
];

interface Props extends DatasheetCellProps {
  options: { label: string; value: string }[];
}

export const SelectCell = ({
  updateMyData,
  options = defaultTechniqueGestures,
  column,
  row,
}: Props) => {
  const onChange: (
    newValue: MultiValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => void = (newValue) => {
    updateMyData(
      row.index,
      column.id,
      newValue.map((value) => value.value)
    );
  };
  return (
    <ReactSelect
      options={options}
      isMulti
      name="colors"
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange}
    />
  );
};
