import { Ticket, TicketStep } from ".prisma/client";

export const ticketsToLane = (
  tickets: Ticket[]
): ReactTrello.BoardData["lanes"] => {
  const lanes = [];
  for (const step in TicketStep) {
    lanes.push({
      id: step,
      title: step,
      cards: tickets
        .filter((ticket) => ticket.currentStep === step)
        .map((ticket) => ({
          id: ticket.id,
          title: ticket.name,
          label: ticket.points,
        })),
    });
  }
  return lanes;
};
