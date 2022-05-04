import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { releaseId } = req.query;
    if (typeof releaseId === "string") {
      const release = await prisma.release.findUnique({
        where: { id: releaseId },
        include: {
          productions: true,
          version: {
            include: { project: true },
          },
        },
      });

      if (!release) {
        return res.status(200).json({});
      }
      res.status(200).json(release);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    const { releaseId } = req.query;
    const { date, done, id } = req.body as {
      date: string;
      done: string;
      id: string;
    };

    if (typeof releaseId !== "string") {
      return res.status(400).send("multiple query params");
    }

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
          releaseId,
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
