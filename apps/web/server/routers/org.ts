import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { orgSlugSchema } from '@monetizekit/config';

import { protectedProcedure, router } from '@/server/trpc';

export const orgRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(80),
        slug: orgSlugSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.organization.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Organization slug already in use.',
        });
      }

      const org = await ctx.prisma.organization.create({
        data: {
          name: input.name,
          slug: input.slug,
          ownerUserId: ctx.userId,
          members: {
            create: {
              userId: ctx.userId,
              role: 'OWNER',
            },
          },
        },
      });

      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
      };
    }),
});
