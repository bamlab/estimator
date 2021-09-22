import Airtable from "airtable";

export const table = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: "https://api.airtable.com",
}).base(process.env.AIRTABLE_DB_ID || "")("Clean Database");
