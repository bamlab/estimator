import { Project } from "@prisma/client";

export type ProjectDTO = Omit<Project, "startAt" | "endAt"> & {
  startAt: string;
  endAt: string;
};