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
import { Field } from "../src/types/database";
import { filterTypes } from "../src/components/Table/options/filterTypes";
import { defaultColumn } from "../src/components/Table/options/defaultColumn";

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
