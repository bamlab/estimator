import { FieldSet } from "airtable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllRecords } from "../../src/services/airtable/getAllRecords";

type Data = {
  database: FieldSet[];
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const records = await getAllRecords();

  res.status(200).json({ database: records });
};
