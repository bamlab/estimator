import { mockProject } from "../mocks/mockProject";
import { computeVolumeEstimationFromDate } from "./computeVolumeEstimationFromDate";

const getMockProjectWithStaffing = (staffing: number) => {
  const mockProduction = [
    {
      id: "93f5d047-e097-4f3f-8a6f-6c5abffcd028",
      done: 3,
      date: "2022-07-11T00:00:00.000Z",
      projectId: "9ffd7e29-8cc1-4743-bcf1-6da7b2f03cab",
    },
    {
      id: "c6c74065-343b-415a-9eda-a16a4fa0fbf7",
      done: 3,
      date: "2022-07-12T00:00:00.000Z",
      projectId: "9ffd7e29-8cc1-4743-bcf1-6da7b2f03cab",
    },
  ];
  const mockStaffingFullTime = [
    {
      id: "0f482eef-724a-4640-add4-ec5ded105b88",
      date: "2022-07-11T00:00:00.000Z",
      value: staffing,
      developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
    },
    {
      id: "7cb0b322-1bc1-44fc-bff2-913ff6b756b5",
      date: "2022-07-12T00:00:00.000Z",
      value: staffing,
      developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
    },
    {
      id: "ee72c825-d8ef-4006-b622-1047ecdb5a6a",
      date: "2022-07-13T00:00:00.000Z",
      value: staffing,
      developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
    },
    {
      id: "3c916518-3659-4b80-b790-e35cf71f7665",
      date: "2022-07-14T00:00:00.000Z",
      value: staffing,
      developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
    },
    {
      id: "a51da95a-06b7-43ef-b050-9fa969c332ac",
      date: "2022-07-15T00:00:00.000Z",
      value: staffing,
      developerId: "6f557519-7e55-40e3-8fbf-29b79b839bb0",
    },
  ];

  return {
    ...mockProject,
    productions: mockProduction,
    team: mockProject.team
      ? {
          ...mockProject.team,
          developers: [
            {
              ...mockProject.team?.developers[0],
              staffing: mockStaffingFullTime,
            },
          ],
        }
      : null,
  };
};
describe("computeVolumeEstimationFromDate", () => {
  it("should return the correct value for a project staffed full time", () => {
    expect(
      computeVolumeEstimationFromDate(
        new Date("2022-07-14"),
        getMockProjectWithStaffing(1)
      )
    ).toEqual(5.4);
  });

  it("should return the correct value for a project staffed half time", () => {
    expect(
      computeVolumeEstimationFromDate(
        new Date("2022-07-14"),
        getMockProjectWithStaffing(0.5)
      )
    ).toEqual(2.7);
  });
});
