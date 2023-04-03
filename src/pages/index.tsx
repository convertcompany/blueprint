import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { IoMdAddCircle } from "react-icons/io";

import { api, RouterOutputs } from "~/utils/api";
import Image from "next/image";

type BlueprintProps = RouterOutputs["blueprints"]["getAll"][number];
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
        <div className="p-8 py-4 border-b shadow-sm antialiased flex items-center">
          <div className="grow">
            <Image alt="Blueprint" src="/logos/light.svg" width={120} height={25} />
          </div>
          <div className="flex items-center gap-3">
            <Image alt="Imagem" src={user?.user?.profileImageUrl ?? ""} className="rounded-full" width={25} height={25}/>
            <div className="flex flex-col items-start">
              <span className="font-semibold">{user.user?.fullName}</span>
              <span className="font-regular text-xs leading-3 text-slate-500">{user.user?.organizationMemberships[0]?.organization?.name}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 grow p-8">
          {
            isLoading ? (
              <h2 className="text-md">Carregando...</h2>
            ) :
            <div className="flex flex-col gap-6">
              <div className="flex gap-6 transition-all">
                <div className="grow border overflow-hidden p-4 flex items-center gap-4 bg-white border-slate-200 rounded-2xl shadow-sm antialiased hover:shadow-md relative transition-all outline-none select-none focus-visible:ring-2 ring-blue-500 ring-offset-2"  tabIndex={0}>
                  <div className="relative">
                    <Image alt="Icone" width={24} height={24} src={"/logos/icon.svg"} className="grayscale"/>
                    <IoMdAddCircle className="absolute top-3 left-4 bg-white rounded-full text-blue-600 text-md"/>
                  </div>
                  <div>
                    <span className="text-base font-semibold">Novo Blueprint</span>
                    <p className="text-sm text-slate-500">Clique aqui para criar um novo projeto</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all">
                { data?.map((blueprint:BlueprintProps) => <BlueprintCard {...blueprint} key={blueprint?.id}/>) }
              </div>
            </div>
          }
        </div>
      </main>
    </>
  );
};

const BlueprintCard = (blueprint:BlueprintProps) => {
  return (
    <div className="border overflow-hidden bg-white border-slate-200 rounded-2xl shadow-sm antialiased hover:shadow-md relative transition-all outline-none select-none focus-visible:ring-2 ring-blue-500 ring-offset-2"  tabIndex={0}>
      <Image src={"/teste.png"} width={1000} height={80} alt={"teste"}/>
      <div className="p-3 pt-2 border-t">
        <span className="text-base font-semibold">{blueprint.name}</span>
        <p className="text-sm text-slate-500">{blueprint.description}</p>
        {
          !!blueprint?.authorId &&
          <div className="flex items-center mt-2 gap-2">
              <Image alt="Imagem" src={blueprint?.author?.profileImageUrl ?? ""} className="rounded-full" width={20} height={20}/>
              <p className="text-xs font-medium text-slate-500 ">Criado por {blueprint.author.fullName} • { dayjs(blueprint.createdAt).fromNow() }</p>
          </div>
        }
      </div>
    </div>
  )
}

export default Home;
