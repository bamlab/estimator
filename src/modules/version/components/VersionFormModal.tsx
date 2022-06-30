import { Project } from "@prisma/client";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Modal,
  Spacer,
  Text,
  Textarea,
} from "@nextui-org/react";
import { HelperText } from "./HelperText";
import { validateStartDate } from "../helpers/validateStartDate";
import { createNewVersion } from "../usecases/createNewVersion";
import { computeProjectMeanProductivity } from "../helpers/computeProjectMeanProductivity";
import { computeVolumeEstimationFromTimePeriod } from "../helpers/computeVolumeEstimationFromTimePeriod";
import { parseISO } from "date-fns";

const REQUIRED_FIELD_ERROR_TEXT = "Ce champ est requis";

interface Props {
  project: Project;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export type VersionFormData = {
  versionName: string;
  startDate: string;
  endDate: string;
  scope: string;
  volume: string;
};

export const VersionFormModal: React.FC<Props> = ({
  project,
  isVisible,
  setIsVisible,
}) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VersionFormData>({
    defaultValues: {
      versionName: "",
      startDate: "",
      endDate: "",
      scope: "",
      volume: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const [volumeEstimation, setVolumeEstimation] = useState<number | string>("");

  useEffect(() => {
    const meanProductivity = computeProjectMeanProductivity(
      [],
      1, // TODO : Replace with project productions after prisma migration (currently productions are stored in each versions which is not ideal)
      project.productivity
    );
    setVolumeEstimation(
      startDate &&
        endDate &&
        computeVolumeEstimationFromTimePeriod(
          meanProductivity,
          parseISO(startDate),
          parseISO(endDate)
        )
    );
  }, [startDate, endDate, project.productivity]);

  const onSubmit = async (formData: VersionFormData) => {
    return createNewVersion(formData, project)
      .then((version) => {
        setIsVisible(false);

        if (version) {
          toast(`La version ${version.name} a bien été créée`);
          router.push(
            `/projects/${project.id}/versions/${version.id}/rc/${version.releases[0].id}`
          );
        } else {
          toast(`Une erreur s'est produite`, { type: "error" });
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Modal open={isVisible} onClose={() => setIsVisible(false)}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Créer une nouvelle version
        </Text>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="versionName"
            control={control}
            rules={{ required: REQUIRED_FIELD_ERROR_TEXT }}
            render={({ field: { onChange, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                label="Nom de la version"
                placeholder="Version 1"
                color={errors.versionName ? "error" : "default"}
                status={errors.versionName ? "error" : "default"}
              />
            )}
          />
          <HelperText
            color={errors.versionName ? "error" : "default"}
            text={errors.versionName?.message}
          />
          <Spacer y={1} />
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: REQUIRED_FIELD_ERROR_TEXT,
              validate: (startDate) => validateStartDate(project, startDate),
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                label="Date de début"
                type="date"
                color={errors.startDate ? "error" : "default"}
                status={errors.startDate ? "error" : "default"}
              />
            )}
          />
          <HelperText
            color={errors.startDate ? "error" : "default"}
            text={errors.startDate?.message}
          />
          <Spacer y={1} />
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
          <Spacer y={1} />
          <Controller
            name="scope"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Textarea onChange={onChange} value={value} label="Scope" />
            )}
          />
          <Spacer y={1} />
          <Controller
            name="volume"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                label="Volume"
                type="number"
              />
            )}
          />
          {volumeEstimation && (
            <HelperText
              color={"primary"}
              text={`Volume recommandé pour la période renseignée : ${volumeEstimation} ${project.unit.toLocaleLowerCase()}s `}
            />
          )}
          <Spacer y={1} />

          <Button color={"success"} type="submit">
            Créer une nouvelle version
          </Button>
          <Spacer y={2} />
        </form>
      </Modal.Body>
    </Modal>
  );
};
