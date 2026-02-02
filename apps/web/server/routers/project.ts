import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { projectSlugSchema } from '@monetizekit/config';

import { orgProcedure, router } from '@/server/trpc';

const projectNameSchema = z.string().trim().min(2).max(80);

export const projectRouter = router({
  list: orgProcedure.query(async ({ ctx, input }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        orgId: input.orgId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { projects };
  }),
  create: orgProcedure
    .input(
      z.object({
        name: projectNameSchema,
        slug: projectSlugSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.project.findUnique({
        where: {
          orgId_slug: {
            orgId: input.orgId,
            slug: input.slug,
          },
        },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Project slug already in use.',
        });
      }

      const project = await ctx.prisma.project.create({
        data: {
          orgId: input.orgId,
          name: input.name,
          slug: input.slug,
        },
      });

      return {
        id: project.id,
        name: project.name,
        slug: project.slug,
      };
    }),
});
