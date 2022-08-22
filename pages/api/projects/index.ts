import { withSentry } from "@sentry/nextjs";
import { parseGMTMidnight } from "../../../src/utils/parseGMTMidnight";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";
import { createStaffingList } from "../../../src/modules/ressources/createStaffingList";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const projects = await prisma.project.findMany();

    res.status(200).json({ projects });
  } else if (req.method === "POST") {
    const { name, unit, startDate, endDate, productivity } = req.body;
    if (!name) {
      return res.status(400).send("No name provided");
    }
    const staffingList = createStaffingList(
      parseGMTMidnight(startDate),
      parseGMTMidnight(endDate)
    );

    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        unit: unit.toLowerCase() === "ticket" ? "TICKET" : "POINT",
        productivity: parseInt(productivity),
        endAt: parseGMTMidnight(endDate),
        startAt: parseGMTMidnight(startDate),
        team: {
          create: {
            developers: {
              create: {
                capacity: 6,
                defaultStaffingValue: 1,
                name: "Dévelopeur 1",
                staffing: {
                  createMany: { data: staffingList.datesList },
                },
              },
            },
          },
        },
      },
    });
    res.status(200).json({ project });
  } else {
    res.status(200).end();
  }
});
