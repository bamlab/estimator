import { ROOT_URL } from "../constants";

export const fetchAllRecords = async () => {
  const res = await fetch(`${ROOT_URL}/records`);
  const { database } = await res.json();

  return database;
};
