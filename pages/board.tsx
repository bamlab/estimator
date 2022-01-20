import { prisma } from "../src/lib/prisma";
import React, { useMemo } from "react";
import Board from "react-trello";
import { GetServerSideProps } from "next";
import { Ticket } from ".prisma/client";
import { ticketsToLane } from "../src/modules/gantt/adapter";

type Props = { tickets: Ticket[] };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const tickets = await prisma.ticket.findMany();
  return {
    props: { tickets },
  };
};

export default function Gantt({ tickets }: Props) {
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
