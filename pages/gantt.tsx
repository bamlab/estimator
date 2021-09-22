import React from "react";
import { GanttChart } from "../src/components/Gantt/components/gantt/GanttChart";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

type Props = {};

export default function Gantt({}: Props) {
  return (
    <div>
      <GanttChart
        tasks={[
          {
            id: "3",
            name: "tache 1",
            type: "task",
            start: new Date("01/01/2021"),
            end: new Date("01/05/2021"),
            progress: 50,
          },
          {
            id: "1",
            name: "project",
            type: "project",
            start: new Date("01/01/2021"),
            end: new Date("01/05/2021"),
            progress: 50,
          },
          {
            id: "2",
            name: "tache 2",
            type: "task",
            start: new Date("01/03/2021"),
            end: new Date("01/04/2021"),
            progress: 100,
            dependencies: ["1"],
          },
          {
            id: "4",
            name: "tache 2",
            type: "milestone",
            start: new Date("01/03/2021"),
            end: new Date("01/04/2021"),
            progress: 100,
            dependencies: ["1"],
          },
        ]}
      />
    </div>
  );
}
