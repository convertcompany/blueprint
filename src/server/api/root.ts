import { createTRPCRouter } from "~/server/api/trpc";
import { blueprintsRouter } from "~/server/api/routers/blueprints";

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

/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-unsafe-assignment : "off" */
/* eslint @typescript-eslint/no-unsafe-member-access : "off" */
/* eslint @typescript-eslint/no-unsafe-call : "off" */
const { Hocuspocus } = require("@hocuspocus/server");

const server = new Hocuspocus({
  port: 1234,
});

server.listen();
