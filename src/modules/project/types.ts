import {
  Developer,
  Production,
  Project,
  Release,
  Staffing,
  Team,
  Version,
} from "@prisma/client";

export type FullProjectDTO = Omit<
  Project,
  "startAt" | "endAt" | "createdAt" | "updatedAt"
> & {
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  productions: ProductionDTO[];
  team: null | TeamDTO;
  versions: VersionDTO[];
};

export type TeamWithDevelopersAndStaffing = Team & {
  developers: (Developer & { staffing: Staffing[] })[];
};

export type TeamDTO = Team & {
  developers: DeveloperDTO[];
};

type DeveloperDTO = Developer & { staffing: StaffingDTO[] };

export type StaffingDTO = Omit<Staffing, "date"> & { date: string };

export type VersionDTO = Omit<
  Version,
  "startDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  createdAt: string;
  updatedAt: string;
  releases: ReleaseDTO[];
};

export type ReleaseDTO = Omit<
  Release,
  "forecastEndDate" | "createdAt" | "updatedAt"
> & {
  forecastEndDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductionDTO = Omit<Production, "date"> & { date: string };
