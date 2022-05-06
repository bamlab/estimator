import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Button, Container } from "@nextui-org/react";
import { ROOT_URL } from "../../../src/constants";
import wretch from "wretch";
import { Datasheet } from "../../../src/modules/estimation/Datasheet";
import { Column, Row as RowType, useBlockLayout, useTable } from "react-table";
import { InputCell } from "../../../src/modules/estimation/Datasheet/InputCell";
import {
  initializeRessourcesData,
  RessourceRow,
} from "../../../src/modules/ressources/initializeRessourcesData";
import { Plus } from "react-iconly";
import { ProjectDTO } from "../../../src/modules/project/types";
import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../src/utils/formatDate";
import { DeleteButton } from "../../../src/modules/estimation/Datasheet/DeleteButton";

type Props = {
  project: ProjectDTO;
};

type Params = {
  projectId: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | {},
  Params
> = async ({ params }) => {
  if (!params || !params.projectId) {
    return {
      redirect: "/projects",
      props: {},
    };
  }

  const { projectId } = params;

  const project = await wretch(`${ROOT_URL}/projects/${projectId}`)
    .get()
    .json();

  return {
    props: { project },
  };
};

export default function RessourcesPage({ project }: Props) {
  const [data, setData] = useState<RessourceRow[]>(
    initializeRessourcesData(project)
  );

  const updateMyData = (
    rowIndex: number,
    columnId: string,
    value: string | string[]
  ) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          if (typeof value === "object") {
            return { ...old[rowIndex] };
          }

          if (columnId === "dev") {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          }

          return {
            ...old[rowIndex],
            [columnId]: value ? parseFloat(value) : 0,
          };
        }
        return row;
      })
    );
  };

  const columns: Column<RessourceRow>[] = useMemo(() => {
    const headers = [{ id: "name", Header: "Développeur", accessor: "name" }];
    const startDate = parseISO(project.startAt);
    const days = differenceInBusinessDays(parseISO(project.endAt), startDate);

    for (let i = 0; i <= days; i++) {
      const currentDay = addBusinessDays(startDate, i);
      const date = formatDate(currentDay);

      headers.push({ id: date, Header: date, accessor: date });
    }

    return headers;
  }, [project]);

  const addRow = () => {
    const startDate = parseISO(project.startAt);
    const days = differenceInBusinessDays(parseISO(project.endAt), startDate);

    const dates: Record<string, number> = {};

    for (let i = 0; i <= days; i++) {
      const currentDay = addBusinessDays(startDate, i);
      dates[formatDate(currentDay)] = 1;
    }

    setData((oldData) => [...oldData, { name: "Développeur", ...dates }]);
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

  const { ...tableInstance } = useTable(
    {
      columns,
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
    useBlockLayout,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "remove",
          Cell: ({ row }: { row: RowType }) => (
            <DeleteButton onClick={() => removeRow(row.index)} />
          ),
        },
        ...columns,
      ]);
    }
  );

  return (
    <Container>
      <Header>
        <h2>{project.name}</h2>
      </Header>

      <Datasheet {...tableInstance} />
      <Button auto icon={<Plus />} onClick={addRow} title="" />
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
