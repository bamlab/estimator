import { addToDate } from "../../../components/Gantt/helpers/date-helper";
import { prisma } from "../../../lib/prisma";

export const createNewVersion = async ({
  volume,
  scope,
  name,
  projectId,
  startDate,
}: {
  projectId: string;
  volume: string;
  scope: string;
  startDate: string;
  name: string;
}) => {
  const CELERITE = 3; // todo: fetch calculate this

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
          comment: "",
          forecastEndDate: addToDate(
            new Date(startDate),
            parsedVolume / CELERITE,
            "day"
          ),
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
