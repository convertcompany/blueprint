import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const blueprintsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.blueprint.findMany();
  }),
});
