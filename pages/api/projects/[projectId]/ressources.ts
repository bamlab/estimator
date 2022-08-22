import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { projectId } = req.query;
    if (typeof projectId === "string") {
      const team = await prisma.team.findUnique({
        where: { projectId },
        include: { developers: { include: { staffing: true } } },
      });

      res.status(200).json(team);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    res.status(404).end();
  } else {
    res.status(200).end();
  }
};
