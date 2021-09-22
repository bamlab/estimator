import React from "react";
import { render } from "@testing-library/react";
import { GanttChart } from "../index";

describe("gantt", () => {
  it("renders without crashing", () => {
    const component = render(
      <GanttChart
        tasks={[
          {
            start: new Date(2020, 0, 1),
            end: new Date(2020, 2, 2),
            name: "Redesign website",
            id: "Task 0",
            progress: 45,
            type: "task",
          },
        ]}
      />
    );

    component.unmount();
  });
});
