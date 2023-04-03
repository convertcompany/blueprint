import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    fullName : user.firstName + " " + user.lastName,
  }
};

export const blueprintsRouter = createTRPCRouter({
  getAll: publicProcedure.query( async ({ ctx }) => {
    const blueprints = await ctx.prisma.blueprint.findMany({
      take : 100,
    });
    
    const users = ( await clerkClient.users.getUserList({
      userId : blueprints.map((blueprint) => blueprint.authorId),
      limit: 100
    })).map(filterUserForClient);

    return blueprints.map((blueprint) => {
      return {
        ...blueprint,
        author : {
          ...users.find((user) => user.id === blueprint.authorId),
        }
      }
    });
  }),
});
