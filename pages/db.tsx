import { FieldSet } from "airtable";
import React, { useEffect, useState } from "react";
import { Table } from "../src/components/Table";
import { Field } from "../src/types/database";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

type Props = {
  database: FieldSet[];
};

export default function Database({}: Props) {
  const columns: { Header: string; accessor: keyof Field }[] = React.useMemo(
    () => [
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
    ],
    []
  );

  const [database, setDatabase] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("api/records");
      const { database: db } = await res.json();
      console.log("db", db);

      setDatabase(db);
    })();
  }, []);

  return <Table columns={columns} data={database} />;
}
