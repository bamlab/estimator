import { Prisma, Ticket, TicketStep } from ".prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { card, laneId, featureId } = JSON.parse(req.body);

    const ticket = {
      name: card.title,
      points: card.label ? parseInt(card.label) : 0,
      currentStep: laneId as TicketStep,
    };

    prisma.feature.update({
      where: { id: featureId },
      data: {
        tickets: {
          create: [ticket],
        },
      },
    });

    res.status(200).end();
  } else {
    res.status(404).end();
  }
};
