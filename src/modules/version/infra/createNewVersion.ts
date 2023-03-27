import { prisma } from "../../../lib/prisma";

export const createNewVersion = async ({
  volume,
  scope,
  name,
  projectId,
  startDate,
  endDate,
}: {
  projectId: string;
  volume: string;
  scope: string;
  startDate: string;
  endDate: string;
  name: string;
}) => {
  const parsedVolume = parseInt(volume);
  const version = await prisma.version.create({
    data: {
      name,
      scope,
      startDate: new Date(startDate),
      volume: parseInt(volume),
      projectId,
      releases: {
        create: {
          name: "RC1",
          description: "",
          reasonForChange: "",
          forecastEndDate: new Date(endDate),
          volume: parsedVolume,
        },
      },
    },

    include: {
      releases: true,
    },
  });

  return version;
};
