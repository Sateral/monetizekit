import { TRPCError, initTRPC } from '@trpc/server';
import { z } from 'zod';

import { cuidSchema } from '@monetizekit/config';

import type { TRPCContext } from '@/server/context';

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * A middleware that checks if the user is authenticated
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.session.user.id,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const orgInputSchema = z.object({
  orgId: cuidSchema,
});

/**
 * A procedure that requires the user to be a member of an organization
 */
export const orgProcedure = protectedProcedure
  .input(orgInputSchema)
  .use(async ({ ctx, input, next }) => {
    const membership = await ctx.prisma.orgMember.findUnique({
      where: {
        orgId_userId: {
          orgId: input.orgId,
          userId: ctx.userId,
        },
      },
      include: {
        org: true,
      },
    });

    if (!membership) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this organization.',
      });
    }

    return next({
      ctx: {
        ...ctx,
        org: membership.org,
        membership,
        orgRole: membership.role,
      },
    });
  });

/**
 * A procedure that requires the user to be an organization owner
 */
export const orgOwnerProcedure = orgProcedure.use(({ ctx, next }) => {
  if (ctx.orgRole !== 'OWNER') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an organization owner to perform this action.',
    });
  }

  return next();
});
