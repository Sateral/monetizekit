import { TRPCError, initTRPC } from '@trpc/server';

import type { TRPCContext } from '@/server/context';

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

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
