import { EstimatedRow } from "../../../types/datasheet";
import { EstimationWithEpicsAndFeatures } from "../../../types/relations";

export const defaultRow: EstimatedRow = {
  batch: 1,
  dependencies: "",
  details: "",
  epic: "",
  gestures: [],
  estimationBackMax: 0,
  estimationBackMin: 0,
  estimationFrontMax: 0,
  estimationFrontMin: 0,
  exclude: "",
  feature: "",
  saasOrPackage: "",
  type: "A",
};

const createEmptyData = (rowsNumber = 10): EstimatedRow[] => {
  const data = [];
  for (let i = 1; i < rowsNumber; i++) {
    data.push(defaultRow);
  }

  return data;
};

export const initializeData = (estimation: EstimationWithEpicsAndFeatures) => {
  if (estimation && estimation.epics) {
    const rows: EstimatedRow[] = [];
    estimation.epics.forEach((epic) => {
      epic.features.forEach((feature) => {
        rows.push({
          ...feature,
          epic: epic.id,
          feature: feature.name,
          estimationFrontMin: parseFloat(
            (feature.gestures.length / estimation.maxSpeed).toFixed(2)
          ),
          estimationFrontMax: parseFloat(
            (feature.gestures.length / estimation.minSpeed).toFixed(2)
          ),
          estimationBackMax: 0,
          estimationBackMin: 0,
          gestures: feature.gestures.map((gesture) => gesture.id),
        });
      });
    });

    return rows;
  }
  return createEmptyData();
};
