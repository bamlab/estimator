import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Button, Container, Row, Spacer } from "@nextui-org/react";
import { ROOT_URL } from "../../../src/constants";
import wretch from "wretch";
import { Datasheet } from "../../../src/modules/estimation/Datasheet";
import { Column, Row as RowType, useBlockLayout, useTable } from "react-table";
import { InputCell } from "../../../src/modules/estimation/Datasheet/InputCell";
import {
  initializeRessourcesData,
  ProjectWithDevelopersAndStaffingDTO,
  RessourceRow,
} from "../../../src/modules/ressources/initializeRessourcesData";
import { ArrowRight, Plus } from "react-iconly";
import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../src/utils/formatDate";
import { DeleteButton } from "../../../src/modules/estimation/Datasheet/DeleteButton";
import { Developer } from "@prisma/client";
import { toast } from "react-toastify";
import { CREATE_DEVELOPER_DTO } from "../../api/developers";
import { useRouter } from "next/router";
import { createStaffingList } from "../../../src/modules/ressources/createStaffingList";

type Props = {
  project: ProjectWithDevelopersAndStaffingDTO;
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

  const project: ProjectWithDevelopersAndStaffingDTO = await wretch(
    `${ROOT_URL}/projects/${projectId}/full`
  )
    .get()
    .json();
  return { props: { project } };
};

export default function RessourcesPage({ project }: Props) {
  const [data, setData] = useState<RessourceRow[]>(
    initializeRessourcesData(project)
  );

  const router = useRouter();

  const updateMyData = async (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    const developerId = data[rowIndex].id;

    if (columnId === "name") {
      await wretch(`${ROOT_URL}/developers/${developerId}`).post({
        name: value,
      });
    } else {
      const year = new Date(project.startAt).getFullYear();
      const month = parseInt(columnId.split("/")[1]) - 1;
      const day = parseInt(columnId.split("/")[0]) + 1;

      const body = {
        date: new Date(year, month, day).toISOString(),
        value: parseInt(value),
      };

      await wretch(`${ROOT_URL}/staffing/${developerId}`).post(body);
    }

    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          if (typeof value === "object") {
            return { ...old[rowIndex] };
          }

          if (columnId === "name") {
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

  const addRow = async () => {
    if (!project.team) {
      toast("Aucune team n'a été crée", { type: "error" });
      return;
    }
    const { datesList, dates } = createStaffingList(
      parseISO(project.startAt),
      parseISO(project.endAt)
    );

    const body: CREATE_DEVELOPER_DTO = {
      teamId: project.team.id,
      name: "Développeur",
      staffingData: datesList,
    };
    const result: { developer: Developer } = await wretch(
      `${ROOT_URL}/developers`
    )
      .post(body)
      .json();

    setData((oldData) => [
      ...oldData,
      { id: result.developer.id, name: "Développeur", ...dates },
    ]);
  };

  const removeRow = async (index: number) => {
    const removedRow = data[index];
    const newData = data.slice(0, index).concat(data.slice(index + 1));
    if (removedRow.id) {
      await wretch(`${ROOT_URL}/developers/${removedRow.id}`).delete();
    }
    setData(newData);
  };

  const goToVersions = () => {
    router.push(`/projects/${project.id}/versions`);
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
      <Row style={{ justifyContent: "space-between" }}>
        <Button auto icon={<Plus />} onClick={addRow} title="" />
        <Button onClick={goToVersions} icon={<ArrowRight />}>
          Etape Suivante
        </Button>
      </Row>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;
