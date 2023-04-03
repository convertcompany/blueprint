import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();
  const blueprints = api.blueprints.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Blueprint</title>
        <meta name="description" content="Blueprint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col w-screen h-screen">
        <div className="p-8 py-4 border-b antialiased flex items-center">
          <h1 className="text-xl font-bold text-slate grow">Blueprints</h1>
          <div className="flex items-center gap-2">
            <img src={user.user?.profileImageUrl} className="w-8 h-8 rounded-full"/>
            <div className="flex flex-col items-start h">
              <span className="font-semibold">{user.user?.fullName}</span>
              <SignOutButton>Sair</SignOutButton>
            </div>
          </div>
        </div>
        <div className="background-sky-50 grow p-8">
          {
            blueprints.isLoading ? (
              <h2 className="text-md">Carregando...</h2>
            ) :
            <div className="grid grid-cols-6 gap-4">
              {
                blueprints?.data?.map((blueprint) => (
                  <div className="col-span-2 p-4 border border-slate rounded-xl shadow-sm antialiased" key={blueprint?.id}>
                    <h2 className="text-md font-semibold">{blueprint.name}</h2>
                    <p className="text-sm">{blueprint.description}</p>
                  </div>
                ))
              }
            </div>
          }
        </div>
      </main>
    </>
  );
};

export default Home;
