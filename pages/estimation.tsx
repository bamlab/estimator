import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  useBlockLayout,
  useResizeColumns,
  useRowSelect,
  useTable,
} from "react-table";
import { Datasheet } from "../src/modules/estimation/Datasheet";
import { estimationColumns } from "../src/constants/columns";
import { EstimatedField } from "../src/types/database";
import { InputCell } from "../src/modules/estimation/Datasheet/InputCell";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

const defaultRow: EstimatedField = {
  archi: "",
  batch: "",
  dependencies: "",
  details: "",
  epic: "",
  gestures: [],
  estimationBackMax: 0,
  estimationBackMin: 0,
  estimationFrontMax: 0,
  estimationFrontMin: 0,
  exclude: "",
  feature: "",
  projet: "",
  saasOrPackage: "",
  sales: "",
  tribe: "",
  type: "A",
};

const createEmptyData = (rowsNumber: number = 10): EstimatedField[] => {
  const data = [];
  for (let i = 1; i < rowsNumber; i++) {
    data.push(defaultRow);
  }

  return data;
};

const CELERITE_MIN = 0.7;
const CELERITE_MAX = 0.85;
export default function Database() {
  const [data, setData] = useState(() => createEmptyData());

  const updateMyData = (
    rowIndex: number,
    columnId: string,
    value: string | string[]
  ) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const base = {
            ...old[rowIndex],
            [columnId]: value,
          };
          if (columnId === "gestures") {
            base["estimationFrontMin"] = parseFloat(
              (base["gestures"].length * CELERITE_MIN).toFixed(2)
            );
            base["estimationFrontMax"] = parseFloat(
              (base["gestures"].length * CELERITE_MAX).toFixed(2)
            );
          }
          return {
            ...base,
          };
        }
        return row;
      })
    );
  };

  const { ...tableInstance } = useTable(
    {
      columns: estimationColumns,
      data,
      defaultColumn: {
        Cell: InputCell,
      },

      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      manualPagination: true, // see the autoResetPage propss if turned to false
    },
    useResizeColumns,
    useBlockLayout,
    useRowSelect
  );

  return (
    <div>
      <Header>
        <h2>Estimator</h2>
      </Header>

      <Datasheet {...tableInstance} />
    </div>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
