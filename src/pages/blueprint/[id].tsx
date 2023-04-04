import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetStaticProps, NextPage } from "next";
import dynamic from "next/dynamic";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { CgArrowsExpandRight, CgClose, CgComment } from "react-icons/cg";
import superjson from "superjson";
import BlueprintEditor from "~/components/blueprintEditor";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const BlueprintComments = dynamic(() => import("~/components/blueprintComments"), { ssr: false });

/** Pagina aonde o usuário edita o blueprint */
const Blueprint: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blueprints.getBlueprintById.useQuery({ id });
  return (
    <>
      <Head>
        <title>Editando | {data?.name}</title>
      </Head>
      <main className="flex h-screen max-h-screen flex-col overflow-hidden">
        <nav className="flex items-center gap-6 border-b p-8 py-4 antialiased shadow-sm">
          <div className="flex grow flex-row items-center gap-4">
            <Link href={"/"}>
              <Image alt="Blueprint" src="/logos/light.svg" width={120} height={25} className="cursor-pointer" />
            </Link>
            <div className="flex flex-col border-l pl-4 leading-4">
              <span className="text-base font-bold">{data?.name}</span>
              <span className="text-xs font-medium text-slate-500">{data?.description}</span>
            </div>
          </div>
        </nav>
        <div className="flex grow flex-row">
          <div className="flex grow flex-col border-r">
            <BlueprintEditor />
          </div>
          <div className="flex max-h-screen w-[400px] flex-col bg-slate-50/50">
            <div className="flex items-center px-6 pt-4 text-slate-400">
              <span className="flex grow items-center gap-2 text-xs">
                <CgComment /> Comentários sobre o Projeto
              </span>
              <div className="font-regular grid h-9 w-9 cursor-pointer select-none place-items-center rounded-full text-xl hover:bg-slate-200">
                <CgArrowsExpandRight />
              </div>
              <div className="font-regular grid h-9 w-9 cursor-pointer select-none place-items-center rounded-full text-2xl hover:bg-slate-200">
                <CgClose className="" />
              </div>
            </div>
            <BlueprintComments />
          </div>
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
