import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  useBlockLayout,
  useResizeColumns,
  useRowSelect,
  useTable,
} from "react-table";
import { Datasheet } from "../../../src/modules/estimation/Datasheet";
import { estimationColumns } from "../../../src/constants/columns";
import { InputCell } from "../../../src/modules/estimation/Datasheet/InputCell";
import { GetServerSideProps } from "next";
import { ProjectWithEstimation } from "../../../src/types/relations";
import { EstimatedRow } from "../../../src/types/datasheet";
import { Epic, Estimation, Gesture } from "@prisma/client";

import {
  Button,
  Container,
  Input,
  Row,
  Spacer,
  Text,
  useInput,
} from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../src/constants";

type Props = {
  project: ProjectWithEstimation;
  estimation: Estimation;
  gestures: Gesture[];
  epics: Epic[];
};

type Params = {
  projectId: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | { props: null },
  Params
> = async ({ params }) => {
  if (!params || !params.projectId) {
    return {
      redirect: "/projects",
      props: { props: null },
    };
  }

  const gestures: Gesture[] = await wretch(`${ROOT_URL}/gestures`).get().json();
  const epics: Epic[] = await wretch(`${ROOT_URL}/estimation/epics`)
    .get()
    .json();

  const { projectId } = params;

  const project: ProjectWithEstimation = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/estimation/${projectId}`
  ).then((res) => res.json());

  if (!project.estimation) {
    const estimation: Estimation = await wretch(
      `${process.env.NEXT_PUBLIC_API_URL}/estimation/${projectId}`
    )
      .post()
      .json();
    return {
      props: {
        project,
        estimation,
        gestures,
        epics,
      },
    };
  }
  return {
    props: { project, estimation: project.estimation, gestures, epics },
  };
};

const defaultRow: EstimatedRow = {
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
  saasOrPackage: "",
  type: "A",
};

const createEmptyData = (rowsNumber: number = 10): EstimatedRow[] => {
  const data = [];
  for (let i = 1; i < rowsNumber; i++) {
    data.push(defaultRow);
  }

  return data;
};

export default function Database({
  project,
  estimation,
  gestures,
  epics,
}: Props) {
  const [data, setData] = useState(() => createEmptyData());

  const [epicList, setEpicList] = useState(() =>
    epics.map((epic) => ({
      label: epic.name,
      value: epic.id,
    }))
  );

  const { value: cMin } = useInput(estimation.minSpeed.toString());
  const { value: cMax } = useInput(estimation.maxSpeed.toString());

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
              (base["gestures"].length * estimation.minSpeed).toFixed(2)
            );
            base["estimationFrontMax"] = parseFloat(
              (base["gestures"].length * estimation.maxSpeed).toFixed(2)
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
      options: gestures.map((gesture) => ({
        label: gesture.name,
        value: gesture.id,
      })),
      epicList,
      setEpicList,
      estimationId: estimation.id,
      manualPagination: true, // see the autoResetPage propss if turned to false
    },
    useResizeColumns,
    useBlockLayout,
    useRowSelect
  );

  const estimationMin = Math.round(
    data.reduce((prev, row) => prev + row["estimationFrontMin"], 0)
  );
  const estimationMax = Math.round(
    data.reduce((prev, row) => prev + row["estimationFrontMax"], 0)
  );

  const saveEstimation = async (rows: EstimatedRow[]) => {
    const newEstimation: {
      estimation: Omit<Estimation, "createdAt" | "updatedAt">;
      rows: EstimatedRow[];
    } = {
      estimation: {
        id: estimation.id,
        archi: "",
        maxSpeed: parseFloat(cMax),
        minSpeed: parseFloat(cMin),
        sales: "",
        projectId: project.id,
      },
      rows: data,
    };
    await wretch(`${ROOT_URL}/estimation/${project.id}`).post(newEstimation);
  };

  return (
    <Container>
      <Header>
        <h2>Estimator</h2>
        <Spacer x={3} />

        <Row align="flex-end">
          <Input label="Célérité min" type="number" value={cMin} />
          <Spacer x={1} />
          <Input label="Célérité max" type="number" value={cMax} />
          <Spacer x={2} />
          <Text>{`Estimation min: ${estimationMin}`}</Text>
          <Spacer x={1} />
          <Text>{`Estimation max: ${estimationMax}`}</Text>
          <Spacer x={5} />
          <Button onClick={() => saveEstimation(data)}>Enregistrer</Button>
        </Row>
      </Header>

      <Datasheet {...tableInstance} gestures={gestures} />
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
