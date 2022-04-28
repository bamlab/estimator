import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { versionId } = req.query;
    if (typeof versionId === "string") {
      const project = await prisma.version.findUnique({
        where: { id: versionId },
      });

      res.status(200).json(project);
    } else {
      res.status(400).send("multiple query params");
    }
  } else {
    res.status(404).end();
  }
};
