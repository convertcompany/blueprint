import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <SignedIn>
        <Component {...pageProps} />
      </SignedIn>
      <SignedOut>
        <div className="flex h-screen w-screen items-center justify-center bg-sky-50">
          <SignIn />
        </div>
      </SignedOut>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
