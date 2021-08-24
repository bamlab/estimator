import React, { useCallback, useState } from "react";
import { FieldSet } from "airtable";
import Loader from "react-loader-spinner";
import { useQuery } from "react-query";
import { Table } from "../src/components/Table";
import { fetchAllRecords } from "../src/queries/fetchAllRecords";
import { columns } from "../src/constants/columns";
import { TabBar } from "../src/components/TabBar";
import styled from "@emotion/styled";

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
      {activeId === "database" && <Table columns={columns} data={database} />}
    </div>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
