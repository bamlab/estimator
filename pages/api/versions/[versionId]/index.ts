import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { versionId } = req.query;
    if (typeof versionId === "string") {
      const version = await prisma.version.findUnique({
        where: { id: versionId },
        include: {
          releases: true,
        },
      });

      res.status(200).json(version);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "DELETE") {
    const { versionId } = req.query;
    if (typeof versionId === "string") {
      const something = prisma.version.delete({
        where: {
          id: versionId,
        },
      });
      console.log("results of delete: ", something);
    }

    res.status(200).end();
  } else {
    res.status(200).end();
  }
});
