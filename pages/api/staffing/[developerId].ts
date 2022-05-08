import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { developerId } = req.query;
    if (typeof developerId === "string") {
      const team = await prisma.staffing.findMany({
        where: { developerId },
      });

      if (!team) {
        return res.status(200).json({});
      }
      res.status(200).json(team);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    const { developerId } = req.query;

    if (typeof developerId !== "string") {
      return res.status(400).send("wrong query params");
    }

    const { date, value } = req.body;

    const { count } = await prisma.staffing.updateMany({
      data: {
        value,
      },
      where: {
        date,
        developerId,
      },
    });

    if (count < 1) {
      await prisma.staffing.create({
        data: {
          date,
          value,
          developerId,
        },
      });
    }
  } else {
    res.status(404).end();
  }
});
