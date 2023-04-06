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
import superjson from "superjson";
import BlueprintEditor from "~/components/blueprintEditor";
import Button from "~/components/button";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { toastContainerStyle, toastOptions } from "~/utils/constants";

const BlueprintComments = dynamic(() => import("~/components/blueprintComments"), { ssr: false });

/** Pagina aonde o usuário edita o blueprint */
const Blueprint: NextPage<{ id: string }> = ({ id }) => {
  const [showComments, setShowComments] = useState(false);
  const { data, isLoading } = api.blueprints.getBlueprintById.useQuery({ id });

  const ctx = api.useContext();

  const { mutate:updateMutate, isLoading:isSaving } = api.blueprints.update.useMutation({
    onSuccess: () => {
      toast.remove();
      toast.success("Projeto salvo!");
      // void ctx.blueprints.getAll.invalidate();
    },
    onError: () => {
      toast.remove();
      toast.error("Erro ao salvo projeto");
    },
  });

  const saveBlueprint = () => {
    console.log("ENTREI")
    toast.loading("Salvando...");
    if ( !data ) return;
    updateMutate({ id: data.id, name: data.name });
  }

  return (
    <>
      <Head>
        <title>{ isLoading ? "Carregando..." : `Editando | ${data?.name}` }</title>
      </Head>
      <Toaster toastOptions={toastOptions} containerStyle={toastContainerStyle}/>
      <main className="flex h-screen max-h-screen flex-col overflow-hidden">
        {/* Barra de Navegação do Projeto */}
        <nav className="flex items-center gap-6 border-b p-8 py-4 antialiased shadow-sm h-16 box-border">
          <div className="flex grow flex-row items-center gap-4">
            <Link href={"/"}>
              <Image alt="Blueprint" src="/logos/light.svg" width={120} height={25} className="cursor-pointer" />
            </Link>
            <div  className="flex grow flex-col border-l pl-4 leading-4">
              <span className="text-base font-bold" onClick={() => setShowComments(!showComments)}>
                {data?.name}
              </span>
            </div>
            <div className="flex gap-2">
              <Button isOutlined={true}>Compartilhar</Button>
              <Button onClick={saveBlueprint} isLoading={isSaving}>Salvar</Button>
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
                <BlueprintComments />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
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
