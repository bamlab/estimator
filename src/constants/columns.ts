import { Field } from "../types/database";

export const columns: { Header: string; accessor: keyof Field }[] = [
  {
    Header: "Feature",
    accessor: "feature",
  },
  {
    Header: "EPIC",
    accessor: "epic",
  },
  {
    Header: "Tribe",
    accessor: "tribe",
  },
  {
    Header: "SaaS ou Package",
    accessor: "saasOrPackage",
  },
  {
    Header: "Détails",
    accessor: "details",
  },
  {
    Header: "Estim. Front Min",
    accessor: "estimationFrontMin",
  },
  {
    Header: "Estim. Front Max",
    accessor: "estimationFrontMax",
  },
  {
    Header: "Estim. Back Min",
    accessor: "estimationBackMin",
  },
  {
    Header: "Estim. Back Max",
    accessor: "estimationBackMax",
  },
];
