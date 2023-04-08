import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { type NextPage } from "next";
import Head from "next/head";
import { IoMdAddCircle } from "react-icons/io";
dayjs.locale("pt-br");
dayjs.extend(relativeTime);

import type { Blueprint } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Toast } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
import { TbEdit, TbLink, TbTextSize, TbTrash } from "react-icons/tb";
import { TiWarning } from "react-icons/ti";
import Button from "~/components/button";
import ContextMenu from "~/components/contextMenu";
import { ErrorView } from "~/components/errors";
import { LoadingPage } from "~/components/loading";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { toastContainerStyle, toastOptions } from "~/utils/constants";

type BlueprintProps = RouterOutputs["blueprints"]["getAll"][number];
const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading, isError, error } = api.blueprints.getAll.useQuery();

  const { mutate, isLoading: isCreating } = api.blueprints.create.useMutation({
    onSuccess: (blueprint: Blueprint) => {
      toast.remove();
      toast.success("Projeto criado com sucesso!");
      window.location.href = `/blueprint/${blueprint.id}`;
    },
    onError: () => {
      toast.remove();
      toast.error("Ocorreu um erro ao criar o projeto!");
    },
  });

  const createBlueprint = () => {
    toast.loading("Criando novo projeto...");
    mutate({
      name: "Untitled",
    });
  };

  if (isLoading) return <LoadingPage title="Buscando Blueprints" />;

  if (isError) return <ErrorView title="Erro ao buscar Blueprints" message={error?.message} buttonText="Voltar a tela inicial"></ErrorView>;

  return (
    <>
      <Head>
        <title>Blueprints | Home</title>
        <meta name="description" content="Blueprint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster toastOptions={toastOptions} containerStyle={toastContainerStyle} />
      <main className="flex h-screen w-screen flex-col">
        <nav className="box-border flex h-16 items-center gap-6 border-b p-8 py-4 antialiased shadow-sm">
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
        <div className="flex grow bg-gray-50 p-8">
          <AnimatePresence>
            {data?.length === 0 ? (
              <motion.div className="flex grow flex-col items-center justify-center" key={"container-empty"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Image alt="Icone" width={60} height={60} src={"/logos/icon.svg"} className="mb-6 grayscale" />
                <h2 className="text-2xl font-semibold">Nenhum Blueprint encontrado</h2>
                <p className="mb-8 text-sm text-slate-500">Clique no botão abaixo para criar um novo projeto</p>
                <Button className="bg-slate-950" onClick={createBlueprint}>
                  Criar novo projeto
                </Button>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col gap-6" key={"container-blueprints"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
                <CreateBlueprintButton createBlueprint={createBlueprint} isCreating={isCreating} />
                <div className="grid grid-cols-1 gap-6 transition-all sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {data?.map((blueprint: BlueprintProps) => (
                    <BlueprintCard {...blueprint} key={blueprint?.id} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
  const [blueprintState, setBlueprintState] = useState<BlueprintProps>(blueprint);
  const [renaming, setRenaming] = useState(false);
  const renamingRef = useRef<HTMLInputElement>(null);
  const { id } = blueprint;
  const ctx = api.useContext();

  const { mutate: deleteMutate } = api.blueprints.delete.useMutation({
    onSuccess: () => {
      toast.remove();
      void ctx.blueprints.getAll.invalidate();
      toast.success("Projeto deletado com sucesso");
      setTimeout(() => {
        toast.dismiss();
      }, 2000); // tenho que fazer por aqui senao ele nao some
    },
    onError: () => {
      toast.remove();
      toast.error("Erro ao deletar projeto");
    },
  });

  const { mutate: editMutate } = api.blueprints.update.useMutation({
    onSuccess: () => {
      toast.remove();
      toast.success("Projeto salvo!");
      void ctx.blueprints.getAll.invalidate();
    },
    onError: () => {
      toast.remove();
      toast.error("Erro ao renomear projeto");
    },
  });

  /** Função para deletar blueprint */
  const deleteBlueprint = () => {
    toast.remove();
    toast.loading("Deletando projeto...");
    deleteMutate({ id });
  };

  /** Função para editar blueprint */
  const editBlueprint = () => {
    window.location.href = `/blueprint/${blueprint.id}`;
  };

  /** Função para gerar link do blueprint */
  const shareBlueprint = () => {
    const url = `${window.location.origin}/blueprint/${blueprint.id}`;
    navigator.clipboard.writeText(url).catch((err) => {
      toast.error("Erro ao copiar link");
    });
    toast.success("Link copiado para o clipboard");
  };

  /** Salvar blueprint após renomear */
  const renameBlueprint = () => {
    setRenaming(false);
    if (blueprintState.name === blueprint.name) return;
    if (blueprintState.name === "") {
      setBlueprintState(blueprint);
      return;
    }
    editMutate({ id: blueprint.id, name: blueprintState.name });
  };

  const contextMenuItems = [
    {
      label: "Editar",
      onSelect: editBlueprint,
      icon: <TbEdit />,
    },
    {
      label: "Renomear",
      onSelect: () => {
        setRenaming(true);
        setTimeout(() => {
          renamingRef.current?.focus();
          renamingRef.current?.setSelectionRange(0, renamingRef.current.value.length);
        }, 100);
      },
      icon: <TbTextSize />,
    },
    {
      label: "Copiar Link",
      onSelect: shareBlueprint,
      icon: <TbLink />,
    },
    {
      label: "Deletar",
      onSelect: () => {
        toast(
          (t: Toast) => {
            return (
              <div className="ml-2 flex items-center gap-3">
                <span>Você tem certeza que deseja deletar esse projeto?</span>
                <Button className="bg-slate-700 hover:bg-slate-600" onClick={() => toast.dismiss(t.id)}>
                  Não
                </Button>
                <Button
                  className="bg-rose-500 hover:bg-rose-600"
                  onClick={() => {
                    toast.dismiss(t.id);
                    deleteBlueprint();
                  }}
                >
                  Sim
                </Button>
              </div>
            );
          },
          {
            icon: <TiWarning size={28} color="#FCD34E" />,
            style: {
              maxWidth: "500px",
            },
            position: "bottom-center",
            duration: Infinity,
          }
        );
      },
      icon: <TbTrash />,
    },
  ];

  return (
    <ContextMenu items={contextMenuItems}>
      <Link href={renaming ? `` : `/blueprint/${blueprint.id}`} className="cursor-default" tabIndex={-1}>
        <div className="relative select-none overflow-hidden rounded-2xl border border-slate-200 bg-white antialiased shadow-sm  outline-none ring-blue-500 ring-offset-2 transition-all hover:shadow-sm focus-visible:ring-2" tabIndex={0}>
          <Image src={"/teste.png"} width={1000} height={80} alt={"teste"} />
          <div className="border-t p-3 pt-2">
            {renaming ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  ref={renamingRef}
                  className="w-full border-none bg-transparent text-base font-semibold outline-none"
                  value={blueprintState?.name}
                  onChange={(e) => setBlueprintState({ ...blueprintState, name: e.target.value })}
                  onBlur={() => {
                    renameBlueprint();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameBlueprint();
                    }
                  }}
                />
              </div>
            ) : (
              <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">{blueprintState?.name}</span>
            )}
            {!!blueprint?.authorId && (
              <div className="flex items-center gap-2">
                {/* <Image alt="Imagem" src={blueprint?.author?.profileImageUrl ?? ""} className="rounded-full" width={20} height={20} /> */}
                <p className="text-xs font-medium text-slate-500 ">Ultima edição {dayjs(blueprint.updatedAt).fromNow()}</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </ContextMenu>
  );
};

export default Home;
