import { Input } from "@nextui-org/react";
import { parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ProjectWithDevelopersAndStaffingDTO } from "../../ressources/initializeRessourcesData";
import { computeVolumeEstimationFromTimePeriod } from "../helpers/computeVolumeEstimationFromTimePeriod";
import { HelperText } from "./HelperText";
import { VersionFormData } from "./VersionFormModal";

interface Props {
  startDate: string;
  endDate: string;
  control: Control<VersionFormData, object>;
  project: ProjectWithDevelopersAndStaffingDTO;
}
export const VolumeInput: React.FC<Props> = ({
  startDate,
  endDate,
  control,
  project,
}) => {
  const [volumeEstimation, setVolumeEstimation] = useState<number | string>("");

  useEffect(() => {
    if (startDate === "" || endDate === "") setVolumeEstimation("");
    else
      setVolumeEstimation(
        computeVolumeEstimationFromTimePeriod(
          parseISO(startDate),
          parseISO(endDate),
          project
        )
      );
  }, [startDate, endDate, project]);
  return (
    <>
      <Controller
        name="volume"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChange={onChange}
            value={value}
            label={`Volume (en ${project.unit.toLocaleLowerCase()}s)`}
            type="number"
          />
        )}
      />
      {volumeEstimation !== "" && (
        <HelperText
          color={"primary"}
          text={`Volume recommandé pour la période renseignée : ${volumeEstimation} ${project.unit.toLocaleLowerCase()}s `}
        />
      )}
    </>
  );
};
