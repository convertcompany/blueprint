import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { ptBR } from "~/utils/localization";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Blueprint</title>
      </Head>
      <ClerkProvider {...pageProps} localization={ptBR}>
        <SignedIn>
          <Component {...pageProps} />
        </SignedIn>
        <SignedOut>
          <Login />
        </SignedOut>
      </ClerkProvider>
    </>
  );
};

const Login = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-sky-50">
      <SignIn />
    </div>
  );
};

export default api.withTRPC(MyApp);
