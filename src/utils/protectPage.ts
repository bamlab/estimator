// import { GetServerSidePropsContext } from "next";
// import { getServerSession, Session } from "next-auth";
// import { authOptions } from "../../pages/api/auth/[...nextauth]";

// const isM33er = (session: Session) => {
//   const domain = session.user?.email?.split("@")[1] ?? "";
//   return [
//     "bam.tech",
//     "theodo.fr",
//     "theodo.co.uk",
//     "sipios.com",
//     "sicara.com",
//   ].includes(domain);
// };

export const protectPage = async (): //context: GetServerSidePropsContext
Promise<{ destination: string; permanent: boolean } | undefined> => {
  //const session = await getServerSession(context.req, context.res, authOptions);
  //
  // if (!session) {
  //   return {
  //     destination: "/api/auth/signin",
  //     permanent: false,
  //   };
  // }
  // if (!isM33er(session)) {
  //   return {
  //     destination: "/api/auth/signin",
  //     permanent: false,
  //   };
  // }
  return undefined;
};
