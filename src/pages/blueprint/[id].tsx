import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import superjson from "superjson";
import Image from "next/image";
import BlueprintComments from "~/components/blueprintComments";
import { CgArrowsExpandRight, CgClose, CgNotes } from "react-icons/cg";

/** Pagina aonde o usuário edita o blueprint */
const Blueprint: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blueprints.getBlueprintById.useQuery({ id });
  return (
    <>
      <Head>
        <title>Editando | {data?.name}</title>
      </Head>
      <main className="flex h-screen flex-col">
        <nav className="flex items-center gap-6 border-b p-8 py-4 antialiased shadow-sm">
          <div className="flex grow flex-row items-center gap-4">
            <Image alt="Blueprint" src="/logos/light.svg" width={120} height={25} />
            <div className="flex flex-col border-l pl-4 leading-4">
              <span className="text-base font-bold">{data?.name}</span>
              <span className="text-xs font-medium text-slate-500">{data?.description}</span>
            </div>
          </div>
        </nav>
        <div className="flex grow">
          <div className="flex w-3/5 flex-col border-r p-4">
            <span>Ola</span>
          </div>
          <div className="flex grow flex-col antialiased">
            <div className="flex items-center gap-2 border-b p-4 shadow-sm">
              <CgNotes />
              <label className="grow font-semibold">Notas</label>
              <CgArrowsExpandRight size={20} />
              <CgClose size={24} />
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
