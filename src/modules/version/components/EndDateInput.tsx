import { Input } from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ProjectWithDevelopersAndStaffingDTO } from "../../ressources/initializeRessourcesData";
import { computeEndDateFromVolume } from "../helpers/computeEndDateFromVolume";
import { HelperText } from "./HelperText";
import { VersionFormData } from "./VersionFormModal";

interface Props {
  volume: string;
  startDate: string;
  control: Control<VersionFormData, object>;
  project: ProjectWithDevelopersAndStaffingDTO;
}
export const EndDateInput: React.FC<Props> = ({
  volume,
  startDate,
  control,
  project,
}) => {
  const [endDateEstimation, setEndDateEstimation] = useState<string>("");

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

  return (
    <>
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
      {endDateEstimation !== "" && (
        <HelperText
          color={"primary"}
          text={`Date de fin estimée pour le volume renseigné : ${endDateEstimation}`}
        />
      )}
    </>
  );
};
