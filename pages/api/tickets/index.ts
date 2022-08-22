import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { name, currentStep } = req.body;

    if (!name || !currentStep) {
      return res.status(401).send("name or currenStep is missing");
    }
    prisma.ticket.create({
      data: {
        currentStep,
        name,
        points: 0,
      },
    });

    res.status(200).end();
  } else {
    res.status(200).end();
  }
};
