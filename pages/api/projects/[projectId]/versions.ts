import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";
import { createNewVersion } from "../../../../src/modules/version/infra/createNewVersion";

export type VersionToCreate = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { projectId } = req.query;
    if (typeof projectId === "string") {
      const versions = await prisma.version.findMany({
        where: { projectId },
        include: { releases: true },
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

    const version = await createNewVersion({
      name,
      projectId,
      scope,
      startDate,
      volume,
    });

    res.status(200).json(version);
  } else {
    res.status(404).end();
  }
};
