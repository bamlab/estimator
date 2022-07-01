import {
  Developer,
  Production,
  Project,
  Release,
  Staffing,
  Team,
  Version,
} from "@prisma/client";

export type FullProjectDTO = Omit<Project, "startAt" | "endAt"> & {
  startAt: string;
  endAt: string;
  productions: Production[];
  team: null | TeamDTO;
  versions: VersionDTO[];
};

export type TeamWithDevelopersAndStaffing = Team & {
  developers: (Developer & { staffing: Staffing[] })[];
};

type TeamDTO = Team & {
  developers: DeveloperDTO[];
};

type DeveloperDTO = Developer & { staffing: StaffingDTO[] };

type StaffingDTO = Omit<Staffing, "date"> & { date: string };

export type VersionDTO = Omit<
  Version,
  "startDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  createdAt: string;
  updatedAt: string;
  releases: ReleaseDTO[];
};

type ReleaseDTO = Omit<
  Release,
  "forecastEndDate" | "createdAt" | "updatedAt"
> & {
  forecastEndDate: string;
  createdAt: string;
  updatedAt: string;
};
