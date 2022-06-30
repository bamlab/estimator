import { Production } from "@prisma/client";
import { parseISO } from "date-fns";

export const productionsMock: Production[] = [
  {
    id: "0",
    date: parseISO("2022-06-29T00:00:00+0000"),
    done: 4,
    projectId: "0",
  },
  {
    id: "1",
    date: parseISO("2022-06-30T00:00:00+0000"),
    done: 12,
    projectId: "0",
  },
  {
    id: "2",
    date: parseISO("2022-07-01T00:00:00+0000"),
    done: 8,
    projectId: "0",
  },
  {
    id: "3",
    date: parseISO("2022-07-04T00:00:00+0000"),
    done: 1,
    projectId: "0",
  },
  {
    id: "4",
    date: parseISO("2022-07-05T00:00:00+0000"),
    done: 17,
    projectId: "0",
  },
  {
    id: "5",
    date: parseISO("2022-07-06T00:00:00+0000"),
    done: 4,
    projectId: "0",
  },
  {
    id: "6",
    date: parseISO("2022-07-07T00:00:00+0000"),
    done: 12,
    projectId: "0",
  },
  {
    id: "7",
    date: parseISO("2022-07-08T00:00:00+0000"),
    done: 8,
    projectId: "0",
  },
  {
    id: "8",
    date: parseISO("2022-07-10T00:00:00+0000"),
    done: 12,
    projectId: "0",
  },
  {
    id: "9",
    date: parseISO("2022-07-11T00:00:00+0000"),
    done: 3,
    projectId: "0",
  },
  {
    id: "10",
    date: parseISO("2022-07-12T00:00:00+0000"),
    done: 4,
    projectId: "0",
  },
  {
    id: "11",
    date: parseISO("2022-07-13T00:00:00+0000"),
    done: 12,
    projectId: "0",
  },
  {
    id: "12",
    date: parseISO("2022-07-14T00:00:00+0000"),
    done: 8,
    projectId: "0",
  },
  {
    id: "13",
    date: parseISO("2022-07-17T00:00:00+0000"),
    done: 1,
    projectId: "0",
  },
  {
    id: "14",
    date: parseISO("2022-07-18T00:00:00+0000"),
    done: 11,
    projectId: "0",
  },
];
