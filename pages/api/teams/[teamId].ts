import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { teamId } = req.query;
    if (typeof teamId === "string") {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        return res.status(200).json({});
      }
      res.status(200).json(team);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    res.status(404).end();
  } else {
    res.status(404).end();
  }
});
