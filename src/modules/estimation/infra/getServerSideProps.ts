import { Epic, Gesture } from "@prisma/client";
import { GetServerSideProps } from "next";
import { EstimationWithEpicsAndFeatures } from "../../../types/relations";
import wretch from "wretch";
import { ROOT_URL } from "../../../constants";

type Params = {
  projectId: string;
};

export type EstimationPageProps = {
  estimation: EstimationWithEpicsAndFeatures;
  gestures: Gesture[];
  epics: Epic[];
};

export const getServerSideProps: GetServerSideProps<
  EstimationPageProps | { props: null },
  Params
> = async ({ params }) => {
  if (!params || !params.projectId) {
    return {
      redirect: "/projects",
      props: { props: null },
    };
  }

  const gestures: Gesture[] = await wretch(`${ROOT_URL}/gestures`).get().json();
  const epics: Epic[] = await wretch(`${ROOT_URL}/estimations/epics`)
    .get()
    .json();

  const { projectId } = params;

  const estimation: EstimationWithEpicsAndFeatures = await wretch(
    `${ROOT_URL}/estimations/${projectId}`
  )
    .get()
    .json();

  if (!estimation) {
    const estimation: EstimationWithEpicsAndFeatures = await wretch(
      `${ROOT_URL}/estimations/${projectId}`
    )
      .post()
      .json();
    return {
      props: {
        estimation,
        gestures,
        epics,
      },
    };
  }

  return {
    props: { estimation, gestures, epics },
  };
};
