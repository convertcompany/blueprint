import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod"

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    fullName : `${user.firstName} ${user.lastName}`,
  }
};

export const blueprintsRouter = createTRPCRouter({
  getAll: privateProcedure.query( async ({ ctx }) => {
    const blueprints = await ctx.prisma.blueprint.findMany({
      take : 100,
      where : {
        authorId : ctx.userId
      }
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
  
  create: privateProcedure 
    .input(z.object({
      name : z.string(),
      description : z.string(),
    }))
    .mutation( async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const blueprint = await ctx.prisma.blueprint.create({
        data : {
          authorId,
          name : input.name,
          description : input.description,
        }
      })
      return blueprint;
    })
});
