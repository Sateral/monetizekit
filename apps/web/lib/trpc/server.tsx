import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';

import { createCallerFactory } from '@/server/trpc';
import { createTRPCContext } from '@/server/context';
import { appRouter } from '@/server/routers/_app';
import { makeQueryClient } from '@/lib/trpc/query-client';

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } =
  createHydrationHelpers<typeof appRouter>(caller, getQueryClient);
