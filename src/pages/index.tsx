import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import Image from "next/image";

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.blueprints.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Blueprints | Home</title>
        <meta name="description" content="Blueprint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col w-screen h-screen">
        <div className="p-8 py-4 border-b antialiased flex items-center">
          <h1 className="text-xl font-bold text-slate grow">Blueprints</h1>
          <div className="flex items-center gap-2">
            <Image alt="Imagem" src={user?.user?.profileImageUrl ?? ""} className="rounded-full" width={25} height={25}/>
            <div className="flex flex-col items-start">
              <span className="font-semibold">{user.user?.fullName}</span>
              <SignOutButton>Sair</SignOutButton>
            </div>
          </div>
        </div>
        <div className="background-sky-50 grow p-8">
          {
            isLoading ? (
              <h2 className="text-md">Carregando...</h2>
            ) :
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 transition-all">
              {
                data?.map((blueprint) => (
                  <div className="col-span-2 p-4 border border-slate rounded-xl shadow-sm antialiased focus:border-blue-500 outline-none select-none" key={blueprint?.id} tabIndex={0}>
                    <h2 className="text-md font-semibold">{blueprint.name}</h2>
                    <p className="text-sm text-slate-500">{blueprint.description}</p>
                    {
                      !!blueprint?.authorId &&
                        <div className="flex items-center mt-2 gap-2">
                          <Image alt="Imagem" src={blueprint?.author?.profileImageUrl ?? ""} className="rounded-full" width={25} height={25}/>
                          <p className="text-xs text-slate-500 ">Criado por {blueprint.author.fullName} • { dayjs(blueprint.createdAt).fromNow() }</p>
                        </div>
                    }
                  </div>
                ))
              }
              <div className="col-span-2 p-4 border border-slate rounded-xl shadow-sm antialiased">
                <h2 className="text-md font-semibold">Novo Blueprint</h2>
                <p className="text-sm text-slate-500">Clique aqui para criar</p>
              </div>
            </div>
          }
        </div>
      </main>
    </>
  );
};

export default Home;
