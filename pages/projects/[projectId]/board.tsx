import { prisma } from "../../../src/lib/prisma";
import React, { useMemo } from "react";
import Board from "react-trello";
import { GetServerSideProps } from "next";
import { Ticket } from ".prisma/client";
import { ticketsToLane } from "../../../src/modules/gantt/adapter";
import { FullProject } from "../../../src/types/relations";
import wretch from "wretch";
import { ROOT_URL } from "../../../src/constants";
import { toast } from "react-toastify";
import { Card } from "../../../src/modules/board/views/Card";

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
  const updateCard = async (card: {
    title?: string;
    label?: string;
    description?: string;
    id: string;
  }) => {
    const updatedTicket: Partial<Ticket> = {
      name: card.title,
      points: parseInt(card.label || ""),
    };
    await wretch(`${ROOT_URL}/tickets/${card.id}`).put({
      ticket: updatedTicket,
    });
  };

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
    await wretch(`${ROOT_URL}/tickets`).post({
      name: card.title,
      currentStep: laneId,
    });
    toast("Ticket créé", { type: "success" });
  };

  const moveTicket = async (
    cardId: string,
    _sourceLaneId: string,
    targetLaneId: string,
    _position: number
  ) => {
    await wretch(`${ROOT_URL}/tickets/${cardId}`).put({
      ticket: { currentStep: targetLaneId },
    });
  };

  return (
    <div>
      <Board
        data={data}
        onCardAdd={createNewTicket}
        editable
        handleDragEnd={moveTicket}
        components={{
          Card: (props: any) => <Card {...props} onUpdate={updateCard} />,
        }}
      />
    </div>
  );
}
