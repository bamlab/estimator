import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { featureId } = req.query;
    if (typeof featureId === "string") {
      const feature = await prisma.estimationFeature.findUnique({
        where: { id: featureId },
      });

      res.status(200).json(feature);
    } else {
      res.status(400).send("multiple query params");
    }
  } else if (req.method === "DELETE") {
    const { featureId } = req.query;
    if (!featureId || typeof featureId !== "string") {
      res.status(401).send("a feature id is required");
      return;
    }

    await prisma.estimationFeature.delete({
      where: {
        id: featureId,
      },
    });
    res.status(200).end();
  } else {
    res.status(404).end();
  }
};
