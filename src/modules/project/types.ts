import {
  Developer,
  Production,
  Project,
  Staffing,
  Team,
} from "@prisma/client";

export type ProjectDTO = Omit<Project, "startAt" | "endAt"> & {
  startAt: string;
  endAt: string;
  productions: Production[];
};

export type ProjectWithDevelopersAndStaffingDTO = ProjectDTO & {
  team: null | TeamWithDevelopersAndStaffingDTO;
};

export type TeamWithDevelopersAndStaffing = Team & {
  developers: (Developer & { staffing: Staffing[] })[];
};

type TeamWithDevelopersAndStaffingDTO = Team & {
  developers: (Developer & {
    staffing: (Omit<Staffing, "date"> & { date: string })[];
  })[];
};
