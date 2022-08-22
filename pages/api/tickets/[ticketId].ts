import { Ticket, TicketStep } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { ticketId } = req.query;
  if (typeof ticketId !== "string") {
    return res.status(400).send("multiple query params");
  }

  if (req.method === "GET") {
    const project = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    res.status(200).json(project);
  } else if (req.method === "PUT") {
    const { ticket } = req.body as { ticket: Partial<Ticket> };

    if (!ticket) {
      return res.status(400).send("ticket param is missing");
    }

    const doneAt: Ticket["doneAt"] =
      ticket.currentStep && ticket.currentStep === TicketStep.DONE
        ? new Date()
        : null;

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...ticket,
        doneAt,
      },
    });
    res.status(200).end();
  } else {
    res.status(200).end();
  }
};
