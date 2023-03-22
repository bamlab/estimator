import { GetServerSidePropsContext } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

const isM33er = (session: Session) => {
  const domain = session.user?.email?.split("@")[1] ?? "";

  return [
    "bam.tech",
    "theodo.fr",
    "theodo.co.uk",
    "sipios.com",
    "sicara.com",
    "gadz.org", //used by Guillaume Piedigrossi (@Spoutnik97), the owner of the repo who is working to secure the M33 data and open Estimator to the world
  ].includes(domain);
};

export const protectPage = async (
  context: GetServerSidePropsContext
): Promise<{ destination: string; permanent: boolean } | undefined> => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // if (!session) {
  //   return {
  //     destination: "/api/auth/signin",
  //     permanent: false,
  //   };
  // }
  // if (!isM33er(session)) {
  //   return {
  //     destination: "/preview",
  //     permanent: false,
  //   };
  // }
  // return undefined;
};
