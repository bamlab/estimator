import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const projects = await prisma.project.findMany();

    res.status(200).json({ projects });
  } else if (req.method === "POST") {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("No name provided");
    }
    const project = await prisma.project.create({
      data: { name: req.body.name },
    });
    res.status(200).json({ project });
  } else {
    res.status(404).end();
  }
};