import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const projects = await prisma.project.findMany();

    res.status(200).json({ projects });
  } else if (req.method === "POST") {
    const { name, unit, startDate, endDate, productivity } = req.body;
    if (!name) {
      return res.status(400).send("No name provided");
    }
    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        unit: unit.toLowerCase() === "ticket" ? "TICKET" : "POINT",
        productivity: parseInt(productivity),
        endAt: new Date(endDate),
        startAt: new Date(startDate),
      },
    });
    res.status(200).json({ project });
  } else {
    res.status(404).end();
  }
});
