import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export type CREATE_DEVELOPER_DTO = {
  name: string;
  teamId: string;
  staffingData: { date: string; value: number }[];
};

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  const { developerId } = req.query;
  if (typeof developerId !== "string") {
    res.status(401).send("a feature id is required");
    return;
  }

  if (req.method === "GET") {
    const developer = await prisma.developer.findUnique({
      where: { id: developerId },
    });

    res.status(200).json(developer);
  } else if (req.method === "POST") {

    const { name } = req.body as { name: string };
    const developer = await prisma.developer.update({
      data: { name },
      where: { id: developerId },
    });

    res.status(200).json(developer);
  } else if (req.method === "DELETE") {
    await prisma.staffing.deleteMany({
      where: {
        developerId: developerId,
      },
    });

    await prisma.developer.delete({
      where: {
        id: developerId,
      },
    });
    res.status(200).end();
  } else {
    res.status(404).end();
  }
});
