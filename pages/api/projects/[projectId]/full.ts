import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { projectId } = req.query;
    if (typeof projectId === "string") {
      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          productions: true,
          team: {
            include: {
              developers: {
                include: {
                  staffing: true,
                },
              },
            },
          },
        },
      });
      res.status(200).json(project);
    } else {
      res.status(400).send("multiple query params");
    }
  } else {
    res.status(404).end();
  }
});
