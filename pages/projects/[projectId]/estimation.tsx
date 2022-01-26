import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Row as RowType,
  useBlockLayout,
  useResizeColumns,
  useRowSelect,
  useTable,
} from "react-table";
import { Datasheet } from "../../../src/modules/estimation/Datasheet";
import { columnWiths, estimationColumns } from "../../../src/constants/columns";
import { InputCell } from "../../../src/modules/estimation/Datasheet/InputCell";
import { EstimatedRow } from "../../../src/types/datasheet";
import { Delete, Plus } from "react-iconly";
import {
  Button,
  Container,
  Input,
  Loading,
  Row,
  Spacer,
  Text,
  useInput,
} from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../src/constants";
import {
  CELERITE_MAX,
  CELERITE_MIN,
} from "../../../src/modules/estimation/constants";
import { saveEstimation } from "../../../src/modules/estimation/useCases/saveEstimation";
import {
  defaultRow,
  initializeData,
} from "../../../src/modules/estimation/useCases/initializeData";
import {
  EstimationPageProps,
  getServerSideProps as _getServerSideProps,
} from "../../../src/modules/estimation/infra/getServerSideProps";
import { createTickets } from "../../../src/modules/estimation/useCases/createTickets";
import { toast } from "react-toastify";

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return <Button auto onClick={onClick} icon={<Delete />} />;
};

export const getServerSideProps = _getServerSideProps;

export default function Database({
  estimation,
  gestures,
  epics,
}: EstimationPageProps) {
  const [data, setData] = useState<EstimatedRow[]>(initializeData(estimation));
  const [isLoading, setIsLoading] = useState(false);

  const [epicList, setEpicList] = useState(() =>
    epics.map((epic) => ({
      label: epic.name,
      value: epic.id,
    }))
  );

  const { value: cMin, bindings: cMinBindings } = useInput(
    estimation.minSpeed
      ? estimation.minSpeed.toString()
      : CELERITE_MIN.toString()
  );
  const { value: cMax, bindings: cMaxBindings } = useInput(
    estimation.maxSpeed
      ? estimation.maxSpeed.toString()
      : CELERITE_MAX.toString()
  );

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
              (base["gestures"].length / estimation.maxSpeed).toFixed(2)
            );
            base["estimationFrontMax"] = parseFloat(
              (base["gestures"].length / estimation.minSpeed).toFixed(2)
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

  const gestureList = gestures.map((gesture) => ({
    label: gesture.name,
    value: gesture.id,
  }));
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
      options: gestureList,
      epicList,
      setEpicList,
      estimationId: estimation.id,
      manualPagination: true, // see the autoResetPage propss if turned to false
    },
    useResizeColumns,
    useBlockLayout,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "remove",
          Cell: ({ row }: { row: RowType }) => (
            <DeleteButton onClick={() => removeRow(row.index)} />
          ),
          width: columnWiths.s,
        },
        ...columns,
      ]);
    }
  );

  const estimationMin = Math.round(
    data.reduce((prev, row) => prev + row["estimationFrontMin"], 0)
  );
  const estimationMax = Math.round(
    data.reduce((prev, row) => prev + row["estimationFrontMax"], 0)
  );

  const addRow = () => {
    setData((oldData) => oldData.concat(defaultRow));
  };

  const removeRow = async (index: number) => {
    const removedRow = data[index];
    const newData = data.slice(0, index).concat(data.slice(index + 1));
    if (removedRow.id) {
      await wretch(
        `${ROOT_URL}/estimations/features/${removedRow.id}`
      ).delete();
    }
    setData(newData);
  };

  return (
    <Container style={{ paddingBottom: 48 }}>
      <Header>
        <h2>Estimator</h2>
        <Spacer x={3} />

        <Row align="flex-end">
          <Input label="Productivité min" type="number" {...cMinBindings} />
          <Spacer x={1} />
          <Input label="Productivité max" type="number" {...cMaxBindings} />
          <Spacer x={2} />
          <Text>{`Estimation min: ${estimationMin}`}</Text>
          <Spacer x={1} />
          <Text>{`Estimation max: ${estimationMax}`}</Text>
          <Spacer x={5} />
          <Button onClick={() => saveEstimation(estimation, data, cMin, cMax)}>
            Enregistrer
          </Button>
          <Button
            style={{ marginLeft: 20 }}
            color={"gradient"}
            onClick={async () => {
              setIsLoading(true);
              await createTickets(estimation, data, epicList, gestureList);
              toast("Tous les tickets ont été créés", { type: "success" });
              setIsLoading(false);
            }}
            clickable={!isLoading}
          >
            {isLoading ? (
              <Loading type="points-opacity" color="white" size="sm" />
            ) : (
              "Générer les Tickets"
            )}
          </Button>
        </Row>
      </Header>

      <Datasheet {...tableInstance} gestures={gestures} />

      <Button auto icon={<Plus />} onClick={addRow} title="" />
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;

const TotalContainer = styled.div`
  margin-left: 2rem;
`;
