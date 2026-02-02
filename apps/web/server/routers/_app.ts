import { z } from 'zod';

import { procedure, router } from '@/server/trpc';
import { apiKeyRouter } from '@/server/routers/api-key';
import { orgRouter } from '@/server/routers/org';
import { projectRouter } from '@/server/routers/project';

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
  project: projectRouter,
  apiKey: apiKeyRouter,
});

export type AppRouter = typeof appRouter;
