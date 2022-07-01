import { Release, Version } from "@prisma/client";
import { VersionFormData } from "../components/VersionFormModal";
import wretch from "wretch";
import { CREATE_VERSION_DTO } from "../../../../pages/api/projects/[projectId]/versions";
import { ROOT_URL } from "../../../constants";

export const createNewVersion = async (
  formData: VersionFormData,
  projectID: string
): Promise<Version & { releases: Release[] }> => {
  const { versionName, startDate, endDate, scope, volume } = formData;

  const body: CREATE_VERSION_DTO = {
    projectId: projectID,
    name: versionName,
    startDate,
    endDate,
    scope,
    volume,
  };
  console.log("body", body);

  return await wretch(`${ROOT_URL}/versions`).post(body).json();
};
