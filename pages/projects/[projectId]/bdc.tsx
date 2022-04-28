import { prisma } from "../../../src/lib/prisma";
import React, { useMemo } from "react";
import { GetServerSideProps } from "next";
import { Ticket } from ".prisma/client";
import { FullProject } from "../../../src/types/relations";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import groupBy from "lodash/groupBy";
import { Container } from "@nextui-org/react";
import { add } from "date-fns";
import sumBy from "lodash/sumBy";
import { formatDate } from "../../../src/utils/formatDate";
import { ChartPoint } from "../../../src/types/charts";

type Props = { project: FullProject | null };

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string }
> = async ({ params }) => {
  if (!params || !params.projectId) {
    return {
      redirect: "/projects",
      props: { project: null },
    };
  }
  const { projectId } = params;
  const project: FullProject | null = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      epics: {
        include: {
          features: {
            include: {
              tickets: true,
            },
          },
        },
      },
    },
  });

  return {
    props: { project: JSON.parse(JSON.stringify(project)) },
  };
};

const makeSprint = (tickets: Ticket[]): ChartPoint[] => {
  const monday = new Date(2022, 0, 24);
  const sprintDuration = 14;
  const speed = 2;

  const totalPoints = sumBy(tickets, (ticket) => ticket.points);

  const ticketsByDate: Record<string, Ticket[]> = groupBy(
    tickets,
    (ticket: Ticket) => (ticket.doneAt ? formatDate(ticket.doneAt) : null)
  );

  const sprint: ChartPoint[] = [];
  let done = 0;
  for (let i = 0; i < sprintDuration; i++) {
    const date = add(monday, { days: i });

    const formatedDate = formatDate(date);
    const doneThisDay = ticketsByDate[formatedDate]
      ? sumBy(ticketsByDate[formatedDate], (ticket) => ticket.points)
      : 0;

    done += doneThisDay;
    sprint.push({
      name: formatedDate,
      done: totalPoints - done,
      standard: totalPoints - i * speed,
    });
  }

  return sprint;
};

export default function BDC({ project }: Props) {
  const tickets: Ticket[] = useMemo(() => {
    if (!project) {
      return [];
    }

    const temp: Ticket[] = [];

    project.epics.forEach((epic) => {
      epic.features.forEach((feature) => {
        feature.tickets.forEach((ticket) => {
          temp.push({
            ...ticket,
            doneAt: ticket.doneAt ? new Date(ticket.doneAt) : ticket.doneAt,
          });
        });
      });
    });
    return temp;
  }, [project]);

  const data: ChartPoint[] = useMemo(() => {
    return makeSprint(tickets);
  }, [tickets]);

  return (
    <Container>
      <h1>Burn down chart</h1>
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" stroke="#0059ff" dataKey="done" />
        <Line type="monotone" stroke="#ff0000" dataKey="standard" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </Container>
  );
}
