import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
  };
};

export const blueprintsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const user = await clerkClient.users.getUser(ctx?.userId);

    const blueprints = await ctx.prisma.blueprint.findMany({
      take: 100,
      where: {
        OR: [
          {
            authorId: ctx.userId,
          },
          {
            allowedUsers: {
              contains: user?.emailAddresses[0]?.emailAddress,
            },
          },
        ],
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: blueprints.map((blueprint) => blueprint.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return blueprints.map((blueprint) => {
      return {
        ...blueprint,
        author: {
          ...users.find((user) => user.id === blueprint.authorId),
        },
      };
    });
  }),

  getBlueprintById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await clerkClient.users.getUser(ctx?.userId);
      const blueprint = await ctx.prisma.blueprint.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!blueprint) {
        throw new Error("Blueprint não encontrado");
      } else {
        if (ctx?.userId !== blueprint.authorId) {
          if (!user?.emailAddresses[0]?.emailAddress || !blueprint.allowedUsers.includes(user?.emailAddresses[0]?.emailAddress)) {
            throw new Error("Você não tem permissão para acessar esse Blueprint");
          }
        }
      }
      const author = await clerkClient.users.getUser(blueprint.authorId);
      return {
        ...blueprint,
        author: author,
      };
    }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const blueprint = await ctx.prisma.blueprint.create({
        data: {
          authorId,
          name: input.name,
        },
      });
      return blueprint;
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        layout: z.object({}).optional(),
        externalURL: z.string().optional(),
        externalId: z.string().optional(),
        comments: z.object({}).optional(),
        companyName: z.string().optional(),
        companyLogo: z.string().optional(),
        hasOmni: z.boolean().optional(),
        hasVoice: z.boolean().optional(),
        hasIntegra: z.boolean().optional(),
        allowedUsers: z.string().optional(),
        layoutPreview: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const blueprint = await ctx.prisma.blueprint.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          ...{
            id: input.id,
          },
        },
      });
      return blueprint;
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const blueprint = await ctx.prisma.blueprint.delete({
        where: {
          id: input.id,
        },
      });
      return blueprint;
    }),
});
