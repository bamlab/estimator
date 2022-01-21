import { Estimation, Project } from "@prisma/client";

export interface ProjectWithEstimation extends Project {
  estimation?: Estimation;
}
