import { FeatureType } from "@prisma/client";

export type EstimatedRow = {
  type: FeatureType;
  epic: string;
  feature: string;
  gestures: string[];
  saasOrPackage: string;
  details: string;
  exclude: string | null;
  estimationFrontMin: number;
  estimationFrontMax: number;
  estimationBackMin: number;
  estimationBackMax: number;
  dependencies: string | null;
  batch: number;
};
