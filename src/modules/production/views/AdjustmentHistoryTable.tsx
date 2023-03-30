import { differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../utils/formatDate";
import { FullProjectDTO, ReleaseDTO } from "../../project/types";
import { Table, Tooltip } from "@nextui-org/react";

type Props = {
  project: FullProjectDTO;
  releases: ReleaseDTO[];
};

export const AdjustmentHistoryTable = ({ project, releases }: Props) => {
  const dayDifference = (newDate: string, oldDate: string) => {
    const n = differenceInBusinessDays(parseISO(newDate), parseISO(oldDate));
    return (n <= 0 ? "" : "+") + String(n);
  };
  const volDifference = (newVol: number, originalVol: number) => {
    const n = newVol - originalVol;
    return (n <= 0 ? "" : "+") + String(n);
  };

  const conditionalStyling = (n: string, unit: string) => {
    if (unit == "days") {
      if (n[0] == "-") return PositiveCell;
      else if (n[0] == "+") return NegativeCell;
      else return NeutralCell;
    } else {
      if (n[0] == "-") return NegativeCell;
      else if (n[0] == "+") return PositiveCell;
      else return NeutralCell;
    }
  };

  return (
    <Table>
      <Table.Header>
        <Table.Column width={500} css={{ Header }}>
          Reason for Change
        </Table.Column>
        <Table.Column css={Header}>Date of Change</Table.Column>
        <Table.Column css={TooltipHeader} width={150}>
          <Tooltip
            content={
              "Increase or decrease in volume compared to original sprint"
            }
            offset={25}
          >
            Change in Volume ({project.unit.toLocaleLowerCase()}s)
          </Tooltip>
        </Table.Column>
        <Table.Column css={TooltipHeader} width={150}>
          <Tooltip
            content={
              "Increase or decrease in length of sprint compared to original sprint (in business days)"
            }
            offset={25}
          >
            Change in Days
          </Tooltip>
        </Table.Column>
      </Table.Header>
      <Table.Body>
        {releases.slice(1).map((item) => {
          return (
            <Table.Row key={item.id}>
              <Table.Cell> {item.reasonForChange} </Table.Cell>
              <Table.Cell css={{ textAlign: "center" }}>
                {" "}
                {formatDate(parseISO(item.updatedAt))}{" "}
              </Table.Cell>
              <Table.Cell
                css={conditionalStyling(
                  volDifference(item.volume, releases[0].volume),
                  "volume"
                )}
              >
                {volDifference(item.volume, releases[0].volume)}
              </Table.Cell>
              <Table.Cell
                css={conditionalStyling(
                  dayDifference(
                    item.forecastEndDate,
                    releases[0].forecastEndDate
                  ),
                  "days"
                )}
              >
                {dayDifference(
                  item.forecastEndDate,
                  releases[0].forecastEndDate
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

const Header = {
  textAlign: "center",
};

const TooltipHeader = {
  textAlign: "center",
  "text-decoration": "underline dotted",
  "text-underline-offset": "0.3em",
};

const PositiveCell = {
  backgroundColor: "#d9ffdd",
  textAlign: "center",
};

const NegativeCell = {
  backgroundColor: "#ffc9c9",
  textAlign: "center",
};

const NeutralCell = {
  backgroundColor: "#FFFFFF",
  textAlign: "center",
};
