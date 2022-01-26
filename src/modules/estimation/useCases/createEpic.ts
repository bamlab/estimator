import { EstimationEpic } from "@prisma/client";
import wretch from "wretch";
import { ROOT_URL } from "../../../constants";

export const createEpic = async (
  epic: Omit<EstimationEpic, "id" | "createdAt" | "updatedAt">
): Promise<EstimationEpic> => {
  const epicWithId: EstimationEpic = await wretch(
    `${ROOT_URL}/estimations/epics`
  ).post({
    epic,
  });
  return epicWithId;
};
