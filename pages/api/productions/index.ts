import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(400).send("wrong route (GET productions)");
  } else if (req.method === "POST") {
    const { date, done, id, projectId } = req.body as {
      date: string;
      done: string;
      id: string;
      projectId: string;
    };

    if (!done) {
      const production = await prisma.production.delete({
        where: {
          id,
        },
      });
      return res.status(200).json(production);
    } else {
      const production = await prisma.production.upsert({
        create: {
          date: new Date(date),
          done: done ? parseInt(done) : 0,
          projectId,
        },
        update: { done: done ? parseInt(done) : 0 },
        where: { id },
      });
      return res.status(200).json(production);
    }
  } else {
    res.status(404).end();
  }
});
