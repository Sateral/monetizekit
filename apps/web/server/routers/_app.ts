import { z } from 'zod';

import { procedure, router } from '@/server/trpc';
import { orgRouter } from '@/server/routers/org';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input }) => {
      return { greeting: `hello ${input.text}` };
    }),
  org: orgRouter,
});

export type AppRouter = typeof appRouter;
