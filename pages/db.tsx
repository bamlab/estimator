import React from "react";
import { FieldSet } from "airtable";
import Loader from "react-loader-spinner";
import { useQuery } from "react-query";
import { Table } from "../src/components/Table";
import { fetchAllRecords } from "../src/queries/fetchAllRecords";
import { columns } from "../src/constants/columns";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

type Props = {
  database: FieldSet[];
};

export default function Database({}: Props) {
  const { data: database, isLoading } = useQuery("database", fetchAllRecords);

  if (isLoading) {
    return <Loader type="Puff" color="#00BFFF" height={50} width={50} />;
  }

  if (!database) {
    return <p>Oops there is no database</p>;
  }

  return (
    <div>
      <h2>Estimator</h2>
      <Table columns={columns} data={database} />;
    </div>
  );
}
