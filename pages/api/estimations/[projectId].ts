import { Estimation, EstimationFeature } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";
import {
  CELERITE_MAX,
  CELERITE_MIN,
} from "../../../src/modules/estimation/constants";
import { EstimatedRow } from "../../../src/types/datasheet";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { projectId } = req.query;
  if (!projectId || typeof projectId !== "string") {
    return res.status(400).send("multiple query params");
  }

  if (req.method === "GET") {
    const estimation = await prisma.estimation.findUnique({
      where: { projectId },
      include: {
        epics: {
          include: {
            features: {
              include: {
                gestures: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(estimation);
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
        include: {
          epics: {
            include: {
              features: {
                include: {
                  gestures: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json(estimation);
    } else {
      const { estimation, rows } = req.body as {
        estimation: Estimation;
        rows: (EstimatedRow & { id: string })[];
      };
      if (!estimation) {
        return res.status(400).send("bad request: an estimation is mandatory");
      }
      if (!rows) {
        return res.status(400).send("bad request: an rows are mandatory");
      }

      const makeData = (
        row: EstimatedRow & { id: string }
      ): Omit<EstimationFeature, "id" | "createdAt" | "updatedAt"> => ({
        name: row.feature,
        batch: row.batch ? row.batch : 1,
        dependencies: row.dependencies || "",
        details: row.details,
        exclude: row.exclude || "",
        saasOrPackage: row.saasOrPackage,
        type: row.type,
        estimationEpicId: row.epic,
      });

      try {
        await prisma.$transaction(
          rows.map((feature) =>
            prisma.estimationFeature.upsert({
              where: {
                id: feature.id,
              },
              create: makeData(feature),
              update: {
                gestures: {
                  set: feature.gestures.map((gesture) => ({ id: gesture })),
                },
              },
            })
          )
        );
      } catch (e) {
        return res
          .status(500)
          .send(`Impossible de mettre à jour les features existantes : ${e}`);
      }

      return res.status(200).json(estimation);
    }
  } else {
    res.status(404).end();
  }
};
