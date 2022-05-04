import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/prisma";

export type CREATE_RELEASE_DTO = {
  name: string;
  comment: string;
  forecastEndDate: string;
  volume: number;
  versionId: string;
};

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const releases = await prisma.release.findMany();

    res.status(200).json(releases);
  } else if (req.method === "POST") {
    const { name, comment, forecastEndDate, volume, versionId } =
      req.body as CREATE_RELEASE_DTO;

    const release = await prisma.release.create({
      data: {
        name,
        comment,
        forecastEndDate: new Date(forecastEndDate),
        volume,
        versionId,
      },
    });
    res.status(200).json(release);
  } else {
    res.status(404).end();
  }
});
