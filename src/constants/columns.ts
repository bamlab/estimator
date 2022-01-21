import { Column } from "react-table";
import { SelectCell } from "../modules/estimation/Datasheet/SelectCell";
import { TextCell } from "../modules/estimation/Datasheet/TextCell";
import { SelectColumnFilter } from "../components/Table/filters/SelectColumnFilter";
import { EstimatedField, Field } from "../types/database";
import { EstimatedRow } from "../types/datasheet";

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

export const columnWiths = {
  s: 100,
  m: 200,
  l: 400,
};

export const estimationColumns: Column<EstimatedRow>[] = [
  { id: "type", Header: "Type", accessor: "type", width: columnWiths.s },
  {
    id: "epic",
    Header: "EPIC",
    accessor: "epic",
  },
  {
    id: "feature",
    Header: "Feature",
    accessor: "feature",
    width: columnWiths.m,
  },
  {
    id: "gestures",
    Header: "Gestes techniques inclus",
    accessor: "gestures",
    Cell: SelectCell,
    width: columnWiths.l,
  },
  {
    id: "exclude",
    Header: "Préciser ce qui n'est pas dans le scope",
    accessor: "exclude",
  },
  {
    id: "details",
    Header: "Détails (nom du SDK, SaaS, lien utile, etc...)",
    accessor: "details",
  },
  {
    id: "estimationFrontMin",
    Header: "Estim. Front Min (JH)",
    accessor: "estimationFrontMin",
    Cell: TextCell,
  },
  {
    id: "estimationFrontMax",
    Header: "Estim. Front Max (JH)",
    accessor: "estimationFrontMax",
    Cell: TextCell,
  },
  {
    id: "estimationBackMin",
    Header: "Estim. Back Min (JH)",
    accessor: "estimationBackMin",
  },
  {
    id: "estimationBackMax",
    Header: "Estim. Back Max (JH)",
    accessor: "estimationBackMax",
  },
  {
    id: "dependencies",
    Header: "Dépendances",
    accessor: "dependencies",
  },
  {
    id: "batch",
    Header: "Lot",
    accessor: "batch",
  },
];

export const estimationDbColumns: Column<EstimatedField>[] = [
  { Header: "Type", accessor: "type", width: columnWiths.s },
  {
    Header: "EPIC",
    accessor: "epic",
  },
  {
    Header: "Feature",
    accessor: "feature",
    width: columnWiths.m,
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
