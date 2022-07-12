import React from "react";
import { DONE_STROKE_COLOR, STANDARD_STROKE_COLOR } from "./Chart";

const LegendIcon = ({
  color,
  dashed = false,
}: {
  color: string;
  dashed?: boolean;
}) => {
  return (
    <svg height={10} width={20}>
      <line
        x1="0"
        y1="5"
        x2="20"
        y2="5"
        stroke={color}
        strokeDasharray={dashed ? "5,2" : ""}
      />
    </svg>
  );
};
export const ChartLegend = () => {
  return (
    <div>
      <LegendIcon color={DONE_STROKE_COLOR} dashed />
      <span> Projections </span>
      <LegendIcon color={DONE_STROKE_COLOR} />
      <span> Réalisé </span>
      <LegendIcon color={STANDARD_STROKE_COLOR} />
      <span> Standard </span>
    </div>
  );
};
