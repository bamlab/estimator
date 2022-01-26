import { Estimation } from "@prisma/client";
import { toast } from "react-toastify";
import { ROOT_URL } from "../../../constants";
import { EstimatedRow } from "../../../types/datasheet";
import wretch from "wretch";

export const saveEstimation = async (
  estimation: Estimation,
  rows: EstimatedRow[],
  productivityMin: string,
  productivityMax: string
) => {
  const newEstimation: {
    estimation: Omit<Estimation, "createdAt" | "updatedAt">;
    rows: EstimatedRow[];
  } = {
    estimation: {
      id: estimation.id,
      archi: "",
      maxSpeed: parseFloat(productivityMax),
      minSpeed: parseFloat(productivityMin),
      sales: "",
      projectId: estimation.projectId,
    },
    rows,
  };
  try {
    const result = await wretch(
      `${ROOT_URL}/estimations/${estimation.projectId}`
    ).post(newEstimation);
    if (result) {
      toast("Estimation enregistrée", { type: "success" });
    } else {
      toast("Une erreur s'est produite", { type: "error" });
    }
  } catch (e) {
    toast("Une erreur s'est produite", { type: "error" });
  }
};
