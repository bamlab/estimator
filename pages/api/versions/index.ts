import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";
import { createNewVersion } from "../../../src/modules/version/infra/createNewVersion";
import { CREATE_VERSION_DTO } from "../projects/[projectId]/versions";

export type VersionToCreate = {
  name: string;
};

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { projectId } = req.query;
    if (typeof projectId === "string") {
      const project = await prisma.version.findMany({
        where: { id: projectId },
      });

      res.status(200).json(project);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    const { name, startDate, volume, scope, projectId, endDate } =
      req.body as CREATE_VERSION_DTO;
    if (!projectId) {
      return res.status(400).send("no projectId provided");
    }
    const version = await createNewVersion({
      name,
      projectId,
      scope,
      startDate,
      endDate,
      volume,
    });
    res.status(200).json(version);
  } else {
    res.status(404).end();
  }
});
