import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export type CREATE_TEAM_DTO = {
  projectId: string;
  developers: { id: string; name: string }[];
};

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const teams = await prisma.team.findMany();

    res.status(200).json(teams);
  } else if (req.method === "POST") {
    res.status(404).end();
  } else {
    res.status(200).end();
  }
});
