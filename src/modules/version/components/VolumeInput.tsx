import { Input } from "@nextui-org/react";
import { parseGMTMidnight } from "../../../utils/parseGMTMidnight";
import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { FullProjectDTO } from "../../project/types";
import { computeVolumeEstimationFromTimePeriod } from "../helpers/computeVolumeEstimationFromTimePeriod";
import { HelperText } from "./HelperText";
import { VersionFormData } from "./VersionFormModal";
import { formatTwoDecimal } from "../../../utils/formatTwoDecimal";
import { ReleaseFormData } from "../../../../pages/projects/[projectId]/versions/[versionId]";

interface Props {
  startDate: string;
  endDate: string;
  control: Control<VersionFormData, object> | Control<ReleaseFormData, object>;
  project: FullProjectDTO;
  label: string;
}
export const VolumeInput: React.FC<Props> = ({
  startDate,
  endDate,
  control,
  project,
  label,
}) => {
  const [volumeEstimation, setVolumeEstimation] = useState<number | string>("");

  useEffect(() => {
    if (startDate === "" || endDate === "") setVolumeEstimation("");
    else
      setVolumeEstimation(
        computeVolumeEstimationFromTimePeriod(
          parseGMTMidnight(startDate),
          parseGMTMidnight(endDate),
          project
        )
      );
  }, [startDate, endDate, project]);
  return (
    <>
      <Controller
        name="volume"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChange={onChange}
            value={value}
            label={label} //`Volume (en ${project.unit.toLocaleLowerCase()}s)`
            type="number"
          />
        )}
      />
      {volumeEstimation !== "" && (
        <HelperText
          color={"primary"}
          text={`Volume recommandé pour la période renseignée : ${formatTwoDecimal(
            volumeEstimation,
            2
          )} ${project.unit.toLocaleLowerCase()}s `}
        />
      )}
    </>
  );
};
