import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const user = useUser();
  return (
    <>
      <Head>
        <title>Blueprint</title>
        <meta name="description" content="Blueprint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {
          !!user?.isSignedIn ? (
            <div className="p-8">
              <h1 className="text-lg font-bold">Olá, seja bem vindo!</h1>
              <div className="flex items-center gap-5 mt-10">
                <img src={user?.user?.profileImageUrl} className="w-12 h-12 rounded-full"/>
                <div>
                  <p className="text-lg font-bold">{user?.user?.fullName}</p>
                  <SignOutButton/>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-screen h-screen justify-center items-center bg-sky-50">
              <SignIn/>
            </div>
          )
        }
      </main>
    </>
  );
};

export default Home;
