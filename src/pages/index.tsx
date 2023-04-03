import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();
  return (
    <>
      <Head>
        <title>Blueprint</title>
        <meta name="description" content="Blueprint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-column w-screen h-screen">
        <div className="p-8 py-6 border-b antialiased">
          <h1 className="text-xl font-bold text-slate">Blueprints</h1>
        </div>
        <div className="background-sky-50 grow">

        </div>
      </main>
    </>
  );
};

export default Home;
