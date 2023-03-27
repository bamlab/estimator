import React, { useEffect, useState } from "react";
import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../utils/formatDate";
import { FullProjectDTO } from "../../../modules/project/types";
import {
  Button,
  Container,
  FormElement,
  Input,
  Spacer,
} from "@nextui-org/react";
import range from "lodash/range";

type Props = {
  project: FullProjectDTO;
  startDate: Date;
  endDate: Date;
  onProductionSet: (date: Date, id: string, value: string) => void;
};

export const ProductionForm = ({
  project,
  startDate,
  endDate,
  onProductionSet,
}: Props) => {
  const [data, setData] = useState<
    Record<string, { id: string; value: number }>
  >({});

  const dates = range(differenceInBusinessDays(endDate, startDate) + 1).map(
    (currentDayIdx) => addBusinessDays(startDate, currentDayIdx)
  );

  const updateInput = (date: Date, id: string, value: string) => {
    setData((data) => ({
      ...data,
      [formatDate(date)]: {
        id,
        value: parseInt(value),
      },
    }));
  };

  const clearInput = () => {
    setData((data) => {
      const newData: Record<string, { id: string; value: number }> = {};
      Object.keys(data).forEach((key) => {
        newData[key] = { ...data[key], value: parseInt("") };
      });
      return newData;
    });
  };

  useEffect(() => {
    const newData: Record<string, { id: string; value: number }> = {};

    project.productions.forEach((production) => {
      newData[formatDate(parseISO(production.date))] = {
        id: production.id,
        value: production.done,
      };
    });

    setData(newData);
  }, [project]);

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>{"Day"}</th>
            <th>{"Done"}</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => {
            const done = data[formatDate(date)];
            const value = done?.value ?? "";
            const id = done?.id ?? "";
            return (
              <tr key={date.toString()}>
                <td> {formatDate(date)} </td>
                <td>
                  <Input
                    type="number"
                    aria-label="done"
                    value={value}
                    onChange={(e: React.ChangeEvent<FormElement>) =>
                      updateInput(date, id, e.target.value)
                    }
                    onBlur={(e) => {
                      onProductionSet(date, id, e.target.value);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Spacer y={1} />
      <Button
        style={DeleteButton}
        onPress={() => {
          clearInput();
          onProductionSet(new Date(0), "", "all");
        }}
      >
        Clear All
      </Button>
    </Container>
  );
};

const DeleteButton = {
  backgroundColor: "#f03d30",
};
