import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "../../../../src/utils/formatDate";
import { ChartPoint } from "../../../types/charts";
import { ReleaseDTO } from "../../project/types";
import { parseISO } from "date-fns";
import { ChartLegend } from "./ChartLegend";

export const DONE_STROKE_COLOR = "#0059ff";
export const STANDARD_STROKE_COLOR = "#ff0000";

export const Chart = ({
  data,
  sortedReleases,
}: {
  data: ChartPoint[];
  sortedReleases: ReleaseDTO[];
}) => {
  return (
    <LineChart width={800} height={400} data={data} id="bdc">
      <Legend
        verticalAlign={"bottom"}
        wrapperStyle={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          bottom: "-10px",
        }}
        content={() => <ChartLegend />}
      />
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid stroke="#ccc" />
      <Line type="linear" stroke={STANDARD_STROKE_COLOR} dataKey="standard" />
      <Line
        type="linear"
        stroke={DONE_STROKE_COLOR}
        dataKey="forecastRemaining"
        strokeDasharray={"5 5"}
      />
      <Line type="linear" stroke={DONE_STROKE_COLOR} dataKey="remaining" />
      {sortedReleases.map((release, index) => {
        if (index !== 0) {
          return (
            <ReferenceLine
              x={formatDate(parseISO(release.createdAt))}
              stroke={"#0059ff"}
              key={release.id}
              label={release.name}
              strokeDasharray="5 5"
            />
          );
        }
      })}
    </LineChart>
  );
};
