import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { type NextPage } from "next";
import Head from "next/head";
import { IoMdAddCircle } from "react-icons/io";
dayjs.locale("pt-br");
dayjs.extend(relativeTime);

import { Blueprint } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { TbEdit, TbLink, TbTextSize, TbTrash } from "react-icons/tb";
import Button from "~/components/button";
import ContextMenu from "~/components/contextMenu";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

type BlueprintProps = RouterOutputs["blueprints"]["getAll"][number];
const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.blueprints.getAll.useQuery();

  const { mutate, isLoading: isCreating } = api.blueprints.create.useMutation({
    onSuccess: (blueprint: Blueprint) => {
      window.location.href = `/blueprint/${blueprint.id}`;
    },
  });

  const createBlueprint = () => {
    mutate({
      name: "Untitled",
      description: "Descrição do projeto",
    });
  };

  return (
    <>
      <Head>
        <title>Blueprints | Home</title>
        <meta name="description" content="Blueprint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col">
        <nav className="flex items-center gap-6 border-b p-8 py-4 antialiased shadow-sm">
          <div className="grow">
            <Image alt="Blueprint" src="/logos/light.svg" width={120} height={25} />
          </div>
          <div className="flex items-center gap-3">
            <Image alt="Imagem" src={user?.user?.profileImageUrl ?? ""} className="rounded-full" width={25} height={25} />
            <div className="flex flex-col items-start">
              <span className="font-semibold">{user.user?.fullName}</span>
              <span className="font-regular text-xs leading-3 text-slate-500">{user.user?.organizationMemberships[0]?.organization?.name}</span>
            </div>
          </div>
        </nav>
        <div className="flex grow bg-slate-50 p-8">
          <div className="flex grow flex-col gap-6">
            {isLoading ? (
              <div className="flex grow flex-col items-center justify-center">
                <div role="status">
                  <svg aria-hidden="true" className="mb-6 inline h-12 w-12 animate-spin fill-blue-600 text-gray-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">Buscando Blueprints</h2>
                <p className="text-sm text-slate-500">Por favor, aguarde um momento...</p>
              </div>
            ) : (
              <>
                {data?.length === 0 ? (
                  <div className="flex grow flex-col items-center justify-center">
                    <Image alt="Icone" width={60} height={60} src={"/logos/icon.svg"} className="mb-6 grayscale" />
                    <h2 className="text-2xl font-semibold">Nenhum Blueprint encontrado</h2>
                    <p className="mb-4 text-sm text-slate-500">Clique no botão abaixo para criar um novo projeto</p>
                    <Button className="bg-slate-950" onClick={createBlueprint} isLoading={isCreating}>
                      Criar novo projeto
                    </Button>
                  </div>
                ) : (
                  <>
                    <CreateBlueprintButton createBlueprint={createBlueprint} isCreating={isCreating} />
                    <div className="grid grid-cols-1 gap-6 transition-all sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {data?.map((blueprint: BlueprintProps) => (
                        <BlueprintCard {...blueprint} key={blueprint?.id} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const CreateBlueprintButton = ({ createBlueprint, isCreating }: { createBlueprint: () => void; isCreating: boolean }) => {
  return (
    <div onClick={createBlueprint} className={`relative flex select-none items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 antialiased shadow-sm outline-none ring-blue-500 ring-offset-2 transition-all hover:shadow-md focus-visible:ring-2 active:shadow-none ${isCreating ? "pointer-events-none" : ""}`} tabIndex={0}>
      <div className="relative">
        <Image alt="Icone" width={24} height={24} src={"/logos/icon.svg"} className="grayscale" />
        <IoMdAddCircle className="text-md absolute left-4 top-3 rounded-full bg-white text-blue-500" />
      </div>
      <div>
        <span className="text-base font-semibold">Novo Blueprint</span>
        <p className="text-sm text-slate-500">Clique aqui para criar um novo projeto</p>
      </div>
    </div>
  );
};

const BlueprintCard = (blueprint: BlueprintProps) => {
  const { id } = blueprint;
  const { mutate: deleteMutate, isLoading: isDeleting } = api.blueprints.delete.useMutation({
    onSuccess: () => {
      // toast.success("Blueprint deletado com sucesso");
      api.blueprints.getAll.useQuery();
    },
  });

  /** Função para deletar node */
  const deleteBlueprint = () => {
    deleteMutate({ id });
  };

  /** Função para editar node */
  const editBlueprint = () => {
    window.location.reload();
  };

  const contextMenuItems = [
    {
      label: "Editar",
      onSelect: editBlueprint,
      icon: <TbEdit />,
    },
    {
      label: "Renomear",
      onSelect: editBlueprint,
      icon: <TbTextSize />,
    },
    {
      label: "Copiar Link",
      onSelect: editBlueprint,
      icon: <TbLink />,
    },
    {
      label: "Deletar",
      onSelect: deleteBlueprint,
      icon: <TbTrash />,
    },
  ];

  return (
    <ContextMenu items={contextMenuItems}>
      <Link href={`/blueprint/${blueprint.id}`} className="cursor-default" tabIndex={0}>
        <div className="relative select-none overflow-hidden rounded-2xl border border-slate-200 bg-white antialiased shadow-sm  transition-all hover:shadow-md focus:outline-none  active:shadow-none">
          <Image src={"/teste.png"} width={1000} height={80} alt={"teste"} />
          <div className="border-t p-3 pt-2">
            <span className="text-base font-semibold">{blueprint.name}</span>
            <p className="text-sm text-slate-500">{blueprint.description}</p>
            {!!blueprint?.authorId && (
              <div className="mt-2 flex items-center gap-2">
                <Image alt="Imagem" src={blueprint?.author?.profileImageUrl ?? ""} onClick={deleteBlueprint} className="rounded-full" width={20} height={20} />
                <p className="text-xs font-medium text-slate-500 ">
                  por {blueprint.author.fullName} • {dayjs(blueprint.createdAt).fromNow()}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </ContextMenu>
  );
};

export default Home;
