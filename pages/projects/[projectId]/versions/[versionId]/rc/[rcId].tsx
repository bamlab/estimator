import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { Production, Project, Release, Version } from "@prisma/client";
import { Container, FormElement, Input, Row, Spacer } from "@nextui-org/react";
import wretch from "wretch";
import { ROOT_URL } from "../../../../../../src/constants";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { makeReleaseChartData } from "../../../../../../src/modules/bdc/makeReleaseChartData";
import { addBusinessDays, differenceInBusinessDays, parseISO } from "date-fns";
import { formatDate } from "../../../../../../src/utils/formatDate";

type Props = {
  release: Omit<Release, "forecastEndDate"> & {
    version: Omit<Version, "starDate"> & {
      project: Project;
      startDate: string;
    };
    productions: (Omit<Production, "date"> & { date: string })[];
    forecastEndDate: string;
  };
};

type Params = {
  projectId: string;
  versionId: string;
  rcId: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | {},
  Params
> = async ({ params }) => {
  if (!params || !params.projectId) {
    return {
      redirect: "/projects",
      props: {},
    };
  }

  const { rcId } = params;

  const release = await wretch(`${ROOT_URL}/releases/${rcId}`).get().json();

  return {
    props: {
      release,
    },
  };
};

export default function ReleasePage({ release }: Props) {
  const [done, setDone] = useState<
    Record<string, { id: string; value: number }>
  >({});

  const startDate = parseISO(release.version.startDate);

  const data = useMemo(
    () =>
      makeReleaseChartData({
        productivity: release.version.project.productivity,
        endDate: parseISO(release.forecastEndDate),
        startDate,
        volume: release.volume,
        productions: done,
      }),
    [release, done]
  );

  const dates = Array.from(
    Array(
      differenceInBusinessDays(parseISO(release.forecastEndDate), startDate) + 1
    ).keys()
  ).map((_, index) => addBusinessDays(startDate, index));

  useEffect(() => {
    const tmp: Record<string, { id: string; value: number }> = {};

    release.productions.forEach((production) => {
      tmp[formatDate(new Date(production.date))] = {
        id: production.id,
        value: production.done,
      };
    });

    setDone(tmp);
  }, []);

  const setProductionDay = async (
    id: string | null,
    date: Date,
    value: string
  ) => {
    const production = await wretch(`${ROOT_URL}/releases/${release.id}`)
      .post({
        id,
        date,
        done: value,
      })
      .json();

    setDone({
      ...done,
      [formatDate(date)]: {
        id: production.id,
        value: parseInt(value),
      },
    });
  };

  return (
    <Container>
      <Header>
        <h2>{release.version.project.name}</h2>
        <h3>{`Version ${release.version.name}, RC ${release.id}`}</h3>
      </Header>

      <p>
        {`Date de fin de jalon : ${formatDate(
          new Date(release.forecastEndDate)
        )}`}
      </p>

      <Row>
        <LineChart width={800} height={400} data={data} id="bdc">
          <Line type="monotone" stroke="#0059ff" dataKey="done" />
          <Line type="monotone" stroke="#ff0000" dataKey="standard" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>

        <Spacer x={3} />

        <table>
          <thead>
            <tr>
              <th>{"Jour"}</th>
              <th>{"Done"}</th>
            </tr>
          </thead>
          <tbody>
            {dates.map((day) => {
              const doneThisDay =
                done[formatDate(day)] !== undefined
                  ? {
                      id: done[formatDate(day)].id,
                      value: done[formatDate(day)].value.toString(),
                    }
                  : { value: "", id: "" };

              const changeLocalInputValue = (
                e: React.ChangeEvent<FormElement>
              ) => {
                setDone({
                  ...done,
                  [formatDate(day)]: {
                    id: doneThisDay.id,
                    value: parseInt(e.target.value),
                  },
                });
              };

              return (
                <tr key={day.toString()}>
                  <td>{formatDate(day)}</td>
                  <td>
                    <Input
                      type="number"
                      aria-label="done"
                      value={doneThisDay.value}
                      onChange={changeLocalInputValue}
                      onBlur={(e) => {
                        setProductionDay(doneThisDay.id, day, e.target.value);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Spacer y={3} />
      </Row>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
`;
