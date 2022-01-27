import { FeatureStep, TicketStep } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export type TicketToCreate = {
  name: string;
  feature: { id: string; name: string };
  epic: { id: string; name: string };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { projectId } = req.query;
    if (typeof projectId === "string") {
      const project = await prisma.ticket.findMany({
        where: { id: projectId },
      });

      res.status(200).json(project);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    const { projectId } = req.query;
    if (typeof projectId !== "string") {
      res.status(400).send("multiple query params");
      return;
    }

    const { tickets } = req.body as { tickets: TicketToCreate[] };
    if (!tickets) {
      return res.status(400).send("no tickets provided");
    }

    await prisma.$transaction(
      tickets.map((ticket) =>
        prisma.ticket.create({
          data: {
            name: ticket.name,
            currentStep: TicketStep.BACKLOG,
            feature: {
              connectOrCreate: {
                where: { name: ticket.feature.name },
                create: {
                  currentStep: FeatureStep.CONCEPTION,
                  name: ticket.feature.name,
                  estimationFeature: {
                    connect: { id: ticket.feature.id },
                  },
                  epic: {
                    connectOrCreate: {
                      where: {
                        name: ticket.epic.name,
                      },
                      create: {
                        name: ticket.epic.name,
                        project: {
                          connect: {
                            id: projectId,
                          },
                        },
                        estimationEpic: {
                          connect: {
                            id: ticket.epic.id,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            points: 0,
          },
        })
      )
    );
    res.status(200).end();
  } else {
    res.status(404).end();
  }
};
