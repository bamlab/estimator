import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Button, Row, Spacer } from "@nextui-org/react";
import { ROOT_URL } from "../../../src/constants";
import wretch from "wretch";
import { Datasheet } from "../../../src/modules/estimation/Datasheet";
import { Column, Row as RowType, useBlockLayout, useTable } from "react-table";
import { InputCell } from "../../../src/modules/estimation/Datasheet/InputCell";
import {
  initializeRessourcesData,
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
import { ProjectWithDevelopersAndStaffingDTO } from "../../../src/modules/project/types";

type Props = {
  project: ProjectWithDevelopersAndStaffingDTO;
};

type Params = {
  projectId: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | Record<string, unknown>,
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
      const year = new Date(parseISO(project.startAt)).getFullYear(); // TODO : This will stop working between two years because the year of the project's start can be different from the year of the updated value (ex project between December and January). When fixing this, be careful because there is currently a bug with formatISO that seems to return different result for the same date object between the front and the server. https://github.com/date-fns/date-fns/issues/2151
      const month = parseInt(columnId.split("/")[1]) - 1;
      const day = parseInt(columnId.split("/")[0]) + 1;

      const body = {
        date: new Date(year, month, day).toISOString(),
        value: parseFloat(value),
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
      {
        id: result.developer.id,
        defaultStaffingValue: result.developer.defaultStaffingValue,
        name: "Développeur",
        ...dates,
      },
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

  const changeDefaultStaffingValue = async (
    e: React.FocusEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    if (!e.target.value) return;
    const changedRow = data[index];
    const developerId = changedRow.id;
    if (developerId) {
      const body = {
        defaultStaffingValue: parseFloat(e.target.value),
      };
      await wretch(`${ROOT_URL}/developers/${developerId}`).post(body);
    }
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
            <CenterDiv>
              <DeleteButton onClick={() => removeRow(row.index)} />
            </CenterDiv>
          ),
        },
        {
          id: "defaultStaffing",
          Header: "Staffing par défaut",
          Cell: ({ row }: { row: RowType }) => (
            <CenterDiv>
              <textarea
                defaultValue={data[row.index].defaultStaffingValue}
                onBlur={(e) => changeDefaultStaffingValue(e, row.index)}
                style={{ width: 100, height: "100%", resize: "none" }}
              />
            </CenterDiv>
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
        <span>
          Renseigner ici vos ressources de production disponibles sur le projet
          :
        </span>
        <Ul>
          <li>Ajouter autant de lignes que de ressources de production</li>
          <li>
            Remplacer &quot;Développeur&quot; par le nom des membres de votre
            équipe
          </li>
          <li>
            Renseigner la disponibilité de ces ressources en <Bold>jour</Bold>{" "}
            (entrer une valeur comprise entre 0 et 1). Exemple : Renseigner 1 si
            la personne est à plein temps sur le projet sur le jour indiqué, 0,5
            si la personne est à 50%.
          </li>
        </Ul>
      </Header>

      <Datasheet {...tableInstance} />
      <Spacer />
      <StickyRow>
        <Button auto icon={<Plus />} onClick={addRow} title="" />
        <Button onClick={goToVersions} icon={<ArrowRight />}>
          Etape Suivante
        </Button>
      </StickyRow>
    </Container>
  );
}

const Container = styled.div`
  overflow: auto;
  margin-left: 20px;
  padding: 20px;
`;

const Header = styled.div`
  position: sticky;
  left: 0;
`;

const Ul = styled.ul`
  list-style-type: disc;
`; // Les cercles noirs ne s'affichent pas sans ça même si c'est la valeur par défaut

const Bold = styled.span`
  font-weight: bold;
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StickyRow = styled(Row)`
  justify-content: space-between;
  position: sticky;
  left: 0;
`;
