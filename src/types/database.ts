export type Field = {
  feature: string;
  tribe: string;
  saasOrPackage: string;
  estimationFrontMin: number;
  estimationFrontMax: number;
  estimationBackMin: number;
  estimationBackMax: number;
  projet: string;
  archi: string;
  epic: string;
  sales: string;
  details: string;
};

export interface EstimatedField extends Field {
  type: "A" | "B" | "C";
  exclude: string | null;
  dependencies: string | null;
  batch: string;
}
