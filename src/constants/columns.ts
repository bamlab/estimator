import { Column } from "react-table";
import { SelectColumnFilter } from "../components/Table/filters/SelectColumnFilter";
import { EstimatedField, Field } from "../types/database";

export const databaseColumns: Column<Field>[] = [
  {
    Header: "Feature",
    accessor: "feature",
    filter: "include",
    defaultCanFilter: true,
  },
  {
    Header: "EPIC",
    accessor: "epic",
    Filter: SelectColumnFilter,
    filter: "include",
    defaultCanFilter: true,
  },
  {
    Header: "Tribe",
    accessor: "tribe",
    Filter: SelectColumnFilter,
    filter: "include",
    defaultCanFilter: true,
  },
  {
    Header: "SaaS ou Package",
    accessor: "saasOrPackage",
    Filter: SelectColumnFilter,
    filter: "include",
    defaultCanFilter: true,
  },
  {
    Header: "Détails",
    accessor: "details",
    defaultCanFilter: true,
  },
  {
    Header: "Estim. Front Min (JH)",
    accessor: "estimationFrontMin",
    defaultCanFilter: false,
  },
  {
    Header: "Estim. Front Max (JH)",
    accessor: "estimationFrontMax",
    defaultCanFilter: false,
  },
  {
    Header: "Estim. Back Min (JH)",
    accessor: "estimationBackMin",
    defaultCanFilter: false,
  },
  {
    Header: "Estim. Back Max (JH)",
    accessor: "estimationBackMax",
    defaultCanFilter: false,
  },
];

export const estimationColumns: Column<EstimatedField>[] = [
  { Header: "Type", accessor: "type" },
  {
    Header: "EPIC",
    accessor: "epic",
  },
  {
    Header: "Feature",
    accessor: "feature",
  },
  {
    Header: "Tâches techniques incluses",
    accessor: "details",
  },
  { Header: "Préciser ce qui n'est pas dans le scope", accessor: "exclude" },
  {
    Header: "Estim. Front Min (JH)",
    accessor: "estimationFrontMin",
  },
  {
    Header: "Estim. Front Max (JH)",
    accessor: "estimationFrontMax",
  },
  {
    Header: "Estim. Back Min (JH)",
    accessor: "estimationBackMin",
  },
  {
    Header: "Estim. Back Max (JH)",
    accessor: "estimationBackMax",
  },
  {
    Header: "Dépendances",
    accessor: "dependencies",
  },
  {
    Header: "Lot",
    accessor: "batch",
  },
];
