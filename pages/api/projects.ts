import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const projects = await prisma.project.findMany();

    res.status(200).json({ projects });
  } else {
    res.status(404).end();
  }
};
