import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { releaseId } = req.query;
    if (typeof releaseId === "string") {
      const release = await prisma.release.findUnique({
        where: { id: releaseId },
        include: {
          version: {
            include: { project: { include: { productions: true } } },
          },
        },
      });

      if (!release) {
        return res.status(200).json({});
      }
      res.status(200).json(release);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "POST") {
    return res.status(400).send("wrong route");
  } else {
    res.status(404).end();
  }
});
