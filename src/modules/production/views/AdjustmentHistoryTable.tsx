import { differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../utils/formatDate";
import { ReleaseDTO } from "../../project/types";
import { Table } from "@nextui-org/react";

type Props = {
  endDate: Date;
  releases: ReleaseDTO[];
};

export const AdjustmentHistoryTable = ({ endDate, releases }: Props) => {
  const dayDifference = (newDate: string, oldDate: Date) => {
    return differenceInBusinessDays(oldDate, parseISO(newDate));
  };
  const volDifference = (newVol: number, originalVol: number) => {
    return newVol - originalVol;
  };

  return (
    <Table css={{ AdjustmentTable }}>
      <Table.Header>
        <Table.Column>{"Reason for change"}</Table.Column>
        <Table.Column>{"Date"}</Table.Column>
        <Table.Column>{"Volume Change (points)"}</Table.Column>
        <Table.Column>{"End-date Change (days)"}</Table.Column>
      </Table.Header>
      <Table.Body>
        {releases.map((item) => {
          return (
            <Table.Row key={item.id}>
              <Table.Cell> {item.comment} </Table.Cell>
              <Table.Cell> {formatDate(parseISO(item.updatedAt))} </Table.Cell>
              <Table.Cell>
                {" "}
                {volDifference(item.volume, releases[0].volume)}
              </Table.Cell>
              <Table.Cell>
                {" "}
                {dayDifference(item.forecastEndDate, endDate)}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

const AdjustmentTable = {
  "text-align": "center",
};
