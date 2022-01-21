import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";
import {
  CELERITE_MAX,
  CELERITE_MIN,
} from "../../../src/modules/estimation/constants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { projectId } = req.query;
  if (!projectId || typeof projectId !== "string") {
    return res.status(400).send("multiple query params");
  }

  if (req.method === "GET") {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        estimation: true,
      },
    });

    res.status(200).json(project);
  } else if (req.method === "POST") {
    if (!req.body) {
      const estimation = await prisma.estimation.create({
        data: {
          archi: "",
          maxSpeed: CELERITE_MAX,
          minSpeed: CELERITE_MIN,
          sales: "",
          projectId: projectId,
        },
      });
      return res.status(200).json(estimation);
    } else {
      const estimation = await prisma.estimation.update({
        where: {
          id: req.body.id,
        },
        data: req.body,
      });
      return res.status(200).json(estimation);
    }
  } else {
    res.status(404).end();
  }
};
