import type { NextApiRequest, NextApiResponse } from "next";
import { addToDate } from "../../../../src/components/Gantt/helpers/date-helper";
import { prisma } from "../../../../src/lib/prisma";

export type VersionToCreate = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { projectId } = req.query;
    if (typeof projectId === "string") {
      const versions = await prisma.version.findMany({
        where: { projectId },
      });

      res.status(200).json(versions);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    const { name, startDate, volume, scope } = req.body as {
      projectId: string;
      volume: string;
      scope: string;
      startDate: string;
      name: string;
    };
    const { projectId } = req.query;

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).send("no projectId provided");
    }

    const CELERITE = 3; // todo: fetch calculate this

    const parsedVolume = parseInt(volume);
    const version = await prisma.version.create({
      data: {
        name,
        scope,
        startDate: new Date(startDate),
        volume: parsedVolume, // todo : check if this key is useful
        projectId,
        releases: {
          create: {
            comment: "",
            forecastEndDate: addToDate(
              new Date(startDate),
              parsedVolume / CELERITE,
              "day"
            ),
            volume: parsedVolume,
          },
        },
      },
      include: {
        releases: true,
      },
    });

    res.status(200).json(version);
  } else {
    res.status(404).end();
  }
};
