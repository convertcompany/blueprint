import type { Blueprint } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { AnimatePresence, motion } from "framer-motion";
import type { GetStaticProps, NextPage } from "next";
import dynamic from "next/dynamic";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CgArrowsExpandRight, CgClose, CgComment } from "react-icons/cg";
import { TbMessage } from "react-icons/tb";
import superjson from "superjson";
import BlueprintEditor from "~/components/blueprintEditor";
import Button from "~/components/button";
import { Dialog } from "~/components/dialog";
import { ErrorView } from "~/components/errors";
import { LoadingPage } from "~/components/loading";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { RouterOutputs, api } from "~/utils/api";
import { toastContainerStyle, toastOptions } from "~/utils/constants";

const BlueprintComments = dynamic(() => import("~/components/blueprintComments"), { ssr: false });

type BlueprintType = RouterOutputs["blueprints"]["getAll"][number];
/** Pagina aonde o usuário edita o blueprint */
const Blueprint: NextPage<{ id: string }> = ({ id }) => {
  const [showComments, setShowComments] = useState(false);
  // disable query after error
  const { data, isLoading, isError, error } = api.blueprints.getBlueprintById.useQuery(
    { id },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );
  const [openShare, setOpenShare] = useState(false);

  const { mutate: updateMutate, isLoading: isSaving } = api.blueprints.update.useMutation({
    onSuccess: () => {
      toast.remove();
      toast.success("Projeto salvo!");
    },
    onError: () => {
      toast.remove();
      toast.error("Erro ao salvo projeto");
    },
  });

  const saveBlueprint = () => {
    toast.loading("Salvando...");
    if (!data) return;
    updateMutate({ id: data.id, name: data.name });
  };

  if (isLoading) return <LoadingPage title="Buscando Blueprint" />;

  if (isError) return <ErrorView title="Erro ao buscar Blueprint" message={error?.message} buttonText="Voltar a tela inicial"></ErrorView>;

  return (
    <>
      <Head>
        <title>{isLoading ? "Carregando..." : `Editando | ${data?.name ?? ""}`}</title>
      </Head>
      <ShareDialog open={openShare} openChange={setOpenShare} blueprintData={data ?? null} />
      <Toaster toastOptions={toastOptions} containerStyle={toastContainerStyle} />
      <main className="flex h-screen max-h-screen flex-col overflow-hidden bg-gray-50">
        {/* Barra de Navegação do Projeto */}
        <nav className="box-border flex h-16 items-center gap-6 border-b p-8 py-4 antialiased shadow-sm">
          <div className="flex grow flex-row items-center gap-4">
            <Link href={"/"}>
              <Image alt="Blueprint" src="/logos/light.svg" width={120} height={25} className="cursor-pointer" />
            </Link>
            <div className="flex grow flex-col border-l pl-4 leading-4">
              <span className="text-base font-bold">{data?.name}</span>
            </div>
            <div className="flex gap-2">
              <Button isOutlined={true} onClick={() => setOpenShare(true)}>
                Compartilhar
              </Button>
              <Button isOutlined={true} className={showComments ? "border-transparent bg-slate-900 text-white hover:bg-slate-900" : ""} onClick={() => setShowComments(!showComments)}>
                <TbMessage size={18} />
              </Button>
              <Button onClick={saveBlueprint} isLoading={isSaving}>
                Salvar
              </Button>
            </div>
          </div>
        </nav>
        {/* Container principal do Projeto */}
        <div className="flex grow flex-row">
          {/* Editor do layout do Projeto */}
          <div className="flex grow flex-col border-r">
            <BlueprintEditor />
          </div>
          {/* Comentários do Projeto */}
          <AnimatePresence>
            {showComments && (
              <motion.div initial={{ width: 0, opacity: 0 }} transition={{ type: "spring" }} animate={{ width: 400, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="flex max-h-screen w-[400px] flex-col shadow-xl">
                <div className="flex items-center px-6 pt-4 text-slate-400">
                  <span className="flex grow items-center gap-2 text-xs">
                    <CgComment /> Comentários sobre o Projeto
                  </span>
                  <div className="font-regular grid h-9 w-9 cursor-pointer select-none place-items-center rounded-full text-xl hover:bg-slate-100">
                    <CgArrowsExpandRight />
                  </div>
                  <div className="font-regular grid h-9 w-9 cursor-pointer select-none place-items-center rounded-full text-2xl hover:bg-slate-100" onClick={() => setShowComments(false)}>
                    <CgClose />
                  </div>
                </div>
                <BlueprintComments value={null} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

const ShareDialog = ({ open, openChange, blueprintData }: { open: boolean; openChange: (open: boolean) => void; blueprintData: BlueprintType | null }) => {
  const [emailInput, setEmailInput] = useState("");
  const ctx = api.useContext();

  const { mutate: addEmailMutate, isLoading: isAdding } = api.blueprints.update.useMutation({
    onSuccess: () => {
      toast.remove();
      toast.success("Usuário adicionado!");
      void ctx.blueprints.getBlueprintById.invalidate();
    },
    onError: () => {
      toast.remove();
      toast.error("Erro ao adicionar usuário");
    },
  });

  const { mutate: removeEmailMutate } = api.blueprints.update.useMutation({
    onSuccess: () => {
      toast.remove();
      toast.success("Usuário removido!");
      void ctx.blueprints.getBlueprintById.invalidate();
    },
    onError: () => {
      toast.remove();
      toast.error("Erro ao remover usuário");
    },
  });

  const addEmail = () => {
    if (!blueprintData) return;
    const allowed = blueprintData.allowedUsers.split(",") ?? [];
    if (!emailInput) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (!emailInput.includes("@")) {
      toast.error("Email inválido");
      return;
    }
    if (allowed.includes(emailInput)) {
      toast.error("Usuário já está na lista de compartilhamento");
      return;
    }
    allowed.push(emailInput);
    addEmailMutate({ id: blueprintData.id, allowedUsers: allowed.filter((email) => email).join(",") });
    setEmailInput("");
  };

  const removeEmail = (em: string) => {
    if (!blueprintData) return;
    toast.loading("Removendo usuário...");
    const allowed = blueprintData.allowedUsers.split(",") ?? [];
    allowed.splice(allowed.indexOf(em), 1);
    removeEmailMutate({ id: blueprintData.id, allowedUsers: allowed.filter((email) => email).join(",") });
  };

  return (
    <Dialog open={open} openChange={openChange}>
      <div className="flex flex-col antialiased">
        <h3 className="text-xl font-semibold">Compartilhar projeto</h3>
        <span className="mb-6 text-sm text-gray-400">Por favor, informe o email de cada usuário com o que você deseja compartilhar o projeto</span>
        <label className="mb-1 text-sm font-semibold">Convidar usuários</label>
        <div className="flex items-stretch gap-2">
          <input type="text" value={emailInput} onKeyDown={(e) => (e.key === "Enter" ? addEmail() : null)} onChange={(e) => setEmailInput(e.target.value)} className="grow rounded-lg border border-gray-300 p-2 text-sm shadow-sm outline-none focus:bg-white" placeholder="Ex : convert@convertcompany.com.br" />
          <Button onClick={addEmail} isLoading={isAdding}>
            Adicionar
          </Button>
        </div>
        {blueprintData && blueprintData?.allowedUsers?.replace(/\s/g, "")?.length > 0 ? (
          <div className="mb-3 mt-8">
            <div>
              <label className="block text-sm font-medium">Compartilhado com</label>
              <div className="mt-2 flex flex-col gap-2">
                {blueprintData?.allowedUsers?.split(",")?.map((email, index) => (
                  <div className="flex grow select-none items-center rounded-lg border border-gray-300 p-2 text-sm shadow-sm" key={index}>
                    <div className="mr-2 grid h-6 w-6 place-items-center rounded-full bg-blue-600  font-bold text-white">{email.substring(0, 1).toUpperCase()}</div>
                    <label className="grow">{email}</label>
                    <label className="rounded-md p-1 px-2 text-xs text-gray-400 hover:bg-rose-600/10 hover:text-rose-600" onClick={() => removeEmail(email)}>
                      Remover
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma,
      userId: null,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const id = context?.params?.id;
  if (typeof id !== "string") throw new Error("Nenhum id informado");

  await ssg.blueprints.getBlueprintById.prefetch({ id: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Blueprint;
