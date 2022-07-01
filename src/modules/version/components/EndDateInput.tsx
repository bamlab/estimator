import { Input, Spacer } from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ProjectWithDevelopersAndStaffingDTO } from "../../project/types";
import { checkEndDate } from "../helpers/checkEndDate";
import { computeEndDateFromVolume } from "../helpers/computeEndDateFromVolume";
import { HelperText } from "./HelperText";
import { VersionFormData } from "./VersionFormModal";

interface Props {
  volume: string;
  startDate: string;
  endDate: string;
  control: Control<VersionFormData, object>;
  project: ProjectWithDevelopersAndStaffingDTO;
}
export const EndDateInput: React.FC<Props> = ({
  volume,
  startDate,
  endDate,
  control,
  project,
}) => {
  const [endDateEstimation, setEndDateEstimation] = useState<string>("");
  const [endDateWarning, setEndDateWarning] = useState("");

  useEffect(() => {
    if (startDate === "" || volume === "") setEndDateEstimation("");
    else
      setEndDateEstimation(
        format(
          computeEndDateFromVolume(
            parseISO(startDate),
            parseFloat(volume),
            project
          ),
          "dd/MM/yyyy"
        )
      );
  }, [startDate, volume, project]);

  useEffect(() => {
    setEndDateWarning(checkEndDate(project.endAt, endDate));
  }, [endDate, project.endAt]);

  return (
    <>
      <div>
        <Controller
          name="endDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              onChange={onChange}
              value={value}
              label="Date de fin prévue"
              type="date"
            />
          )}
        />
      </div>
      {endDateEstimation !== "" && (
        <HelperText
          color={"primary"}
          text={`Date de fin estimée pour le volume renseigné : ${endDateEstimation}`}
        />
      )}
      <Spacer y={0.5} />
      <HelperText color={"warning"} text={endDateWarning} italic />
    </>
  );
};
