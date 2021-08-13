import { FieldSet, Record } from "airtable";
import { table } from "./table";

export const getAllRecords = async (): Promise<FieldSet[]> => {
  const allRecords: FieldSet[] = [];

  await table
    .select({ view: "Grid view" })
    .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record) {
        allRecords.push({ id: record.id, ...record.fields });
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    });

  return allRecords;
};
