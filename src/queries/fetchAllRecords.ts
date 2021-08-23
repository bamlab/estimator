export const fetchAllRecords = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/records`);
  const { database } = await res.json();

  return database;
};
