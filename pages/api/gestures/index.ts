import { Gesture } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const gestures = await prisma.gesture.findMany();

    res.status(200).json(gestures);
  } else if (req.method === "POST") {
    if (!req.body) {
      return res.status(400).send("a body is mandatory");
    }

    const { gestures } = req.body as {
      gestures: Omit<Gesture, "createdAt" | "updatedAt" | "id">[];
    };

    if (!gestures) {
      return res.status(400).send("gestures are mandatory");
    }

    await prisma.gesture.createMany({ data: gestures });
    res.status(200).end();
  } else {
    res.status(404).end();
  }
};
