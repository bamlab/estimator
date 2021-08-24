import React, { useState } from "react";
import { FieldSet } from "airtable";
import Loader from "react-loader-spinner";
import { useQuery } from "react-query";
import { Table } from "../src/components/Table";
import { fetchAllRecords } from "../src/queries/fetchAllRecords";
import { columns } from "../src/constants/columns";
import { TabBar } from "../src/components/TabBar";
import styled from "@emotion/styled";
import {
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useTable,
} from "react-table";
import { useHooks } from "../src/components/Table/useHooks";
import { fuzzyTextFilterFn } from "../src/components/Table/filters/fuzzyTextFilter";
import { DefaultColumnFilter } from "../src/components/Table/filters/DefaultColumnFilter";
import { Field } from "../src/types/database";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

type Props = {
  database: FieldSet[];
};

const tabOptions = [
  { id: "database", label: "Database" },
  { id: "myEstimation", label: "Mon estimation" },
];

export default function Database({}: Props) {
  const { data: database, isLoading } = useQuery("database", fetchAllRecords);

  const [activeId, setActiveId] = useState(tabOptions[0].id);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Let the table remove the filter if the string is empty
  // @ts-ignore
  fuzzyTextFilterFn.autoRemove = (val) => !val;

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
    }),
    []
  );

  const { selectedFlatRows, ...tableInstance } = useTable<Field>(
    // @ts-ignore
    {
      columns,
      data: database || [],
      defaultColumn,
      filterTypes,
    },
    useHooks,
    useFilters,
    useGlobalFilter,
    useRowSelect
  );

  if (isLoading) {
    return <Loader type="Puff" color="#00BFFF" height={50} width={50} />;
  }

  if (!database) {
    return <p>Oops there is no database</p>;
  }

  return (
    <div>
      <Header>
        <h2>Estimator</h2>
        <TabBar
          options={tabOptions}
          onChange={setActiveId}
          activeId={activeId}
        />
      </Header>
      {activeId === "database" && (
        // @ts-ignore
        <Table {...tableInstance} />
      )}
    </div>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
