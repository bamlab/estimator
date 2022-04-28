import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { releaseId } = req.query;
    if (typeof releaseId === "string") {
      const release = await prisma.release.findUnique({
        where: { id: releaseId },
        include: {
          version: {
            include: { project: true },
          },
        },
      });

      res.status(200).json(release);
    } else {
      res.status(400).send("multiple query params");
    }
  } else {
    res.status(404).end();
  }
};
