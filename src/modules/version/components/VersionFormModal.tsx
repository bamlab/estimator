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
import { computeVolumeEstimationFromTimePeriod } from "../helpers/computeVolumeEstimationFromTimePeriod";
import { parseISO } from "date-fns";
import { ProjectWithDevelopersAndStaffingDTO } from "../../ressources/initializeRessourcesData";
import { VolumeInput } from "./VolumeInput";

const REQUIRED_FIELD_ERROR_TEXT = "Ce champ est requis";

interface Props {
  project: ProjectWithDevelopersAndStaffingDTO;
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

  const onSubmit = async (formData: VersionFormData) => {
    return createNewVersion(formData, project.id)
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
              validate: (startDate) =>
                validateStartDate(project.startAt, startDate),
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
          <VolumeInput
            startDate={startDate}
            endDate={endDate}
            control={control}
            project={project}
          />
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
