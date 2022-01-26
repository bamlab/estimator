import {
  Epic,
  Estimation,
  EstimationEpic,
  EstimationFeature,
  Feature,
  Gesture,
  Project,
  Ticket,
} from "@prisma/client";

export interface ProjectWithEstimation extends Project {
  estimation?: Estimation;
}

interface FeatureWithGestures extends EstimationFeature {
  gestures: Gesture[];
}
interface EpicWithFeature extends EstimationEpic {
  features: FeatureWithGestures[];
}
export interface EstimationWithEpicsAndFeatures extends Estimation {
  epics: EpicWithFeature[];
}

export interface FullProject extends Project {
  epics: Array<Epic & { features: Array<Feature & { tickets: Ticket[] }> }>;
}
