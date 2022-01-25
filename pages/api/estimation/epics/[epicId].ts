import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { epicId } = req.query;
  if (typeof epicId !== "string") {
    return res.status(400).send("epic id is mandatory");
  }

  if (req.method === "GET") {
    const gestures = await prisma.estimationEpic.findUnique({
      where: { id: epicId },
    });

    res.status(200).json(gestures);
  } else if (req.method === "POST") {
    res.status(404).end();
  } else {
    res.status(404).end();
  }
};
