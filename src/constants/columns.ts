import { Column } from "react-table";
import { SelectColumnFilter } from "../components/Table/filters/SelectColumnFilter";
import { Field } from "../types/database";

export const columns: Column<Field>[] = [
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
    Header: "Estim. Front Min",
    accessor: "estimationFrontMin",
    defaultCanFilter: false,
  },
  {
    Header: "Estim. Front Max",
    accessor: "estimationFrontMax",
    defaultCanFilter: false,
  },
  {
    Header: "Estim. Back Min",
    accessor: "estimationBackMin",
    defaultCanFilter: false,
  },
  {
    Header: "Estim. Back Max",
    accessor: "estimationBackMax",
    defaultCanFilter: false,
  },
];
