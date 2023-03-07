import "../styles/globals.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
export default MyApp;
