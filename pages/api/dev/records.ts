import { FieldSet } from "airtable";
import type { NextApiRequest, NextApiResponse } from "next";
import records from "../../../json/records.json";

type Data = {
  database: FieldSet[];
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ database: records });
};
