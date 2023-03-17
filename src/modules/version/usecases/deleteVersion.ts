import wretch from "wretch";

export const deleteVersion = async (projectId: string, versionId: string) => {
  return await wretch(`/projects/${projectId}/versions/${versionId}`)
    .delete()
    .json();
};
