import { prisma } from "../../../src/lib/prisma";
import React, { useMemo } from "react";
import Board from "react-trello";
import { GetServerSideProps } from "next";
import { Ticket } from ".prisma/client";
import { ticketsToLane } from "../../../src/modules/gantt/adapter";
import { FullProject } from "../../../src/types/relations";

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

export default function BoardPage({ project }: Props) {
  const tickets: Ticket[] = useMemo(() => {
    if (!project) {
      return [];
    }

    const temp: Ticket[] = [];

    project.epics.forEach((epic) => {
      epic.features.forEach((feature) => {
        feature.tickets.forEach((ticket) => {
          temp.push(ticket);
        });
      });
    });
    return temp;
  }, [project]);

  const data = useMemo(() => {
    return { lanes: ticketsToLane(tickets) };
  }, [tickets]);

  const createNewTicket = async (
    card: ReactTrello.DraggableCard,
    laneId: string
  ) => {
    await fetch("/api/ticket", {
      method: "POST",
      body: JSON.stringify({ card, laneId, feature: tickets[0].featureId }),
    }).catch((e) => alert("Erreur" + JSON.stringify(e)));
    alert("Ticket créé");
  };

  return (
    <div>
      <Board data={data} onCardAdd={createNewTicket} editable />
    </div>
  );
}
