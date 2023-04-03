import { createTRPCRouter } from "~/server/api/trpc";
import { blueprintsRouter } from "~/server/api/routers/blueprint";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  blueprints: blueprintsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
