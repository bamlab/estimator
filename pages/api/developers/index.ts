import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export type CREATE_DEVELOPER_DTO = {
  name: string;
  teamId: string;
  staffingData: { date: string; value: number }[];
};

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const projects = await prisma.project.findMany();

    res.status(200).json({ projects });
  } else if (req.method === "POST") {
    const { teamId, name, staffingData } = req.body as CREATE_DEVELOPER_DTO;
    if (!teamId) {
      return res.status(400).send("No teamId provided");
    }
    const developer = await prisma.developer.create({
      data: {
        capacity: 6,
        name,
        team: {
          connect: {
            id: teamId,
          },
        },
      },
    });

    const data = staffingData.map((data) => ({
      date: new Date(data.date),
      value: data.value,
      developerId: developer.id,
    }));

    const staffing = await prisma.staffing.createMany({
      data,
    });

    res.status(200).json({ developer, staffing });
  } else {
    res.status(404).end();
  }
});
