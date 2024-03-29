import { Epic } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const gestures = await prisma.epic.findMany();

    res.status(200).json(gestures);
  } else if (req.method === "POST") {
    if (!req.body) {
      return res.status(400).send("a body is mandatory");
    }

    const { epic } = req.body as {
      epic: Omit<Epic, "createdAt" | "updatedAt" | "id">;
    };

    if (!epic) {
      return res.status(400).send("an epic are mandatory");
    }

    const epicWithId = await prisma.epic.create({ data: epic });

    res.status(200).send(epicWithId);
  } else {
    res.status(200).end();
  }
};
