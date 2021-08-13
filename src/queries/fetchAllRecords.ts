export const fetchAllRecords = async () => {
  const res = await fetch("api/records");
  const { database } = await res.json();

  return database;
};
