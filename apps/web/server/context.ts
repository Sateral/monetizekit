import { headers } from 'next/headers';
import { cache } from 'react';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

export const createTRPCContext = cache(async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  return {
    prisma,
    session,
  };
});

export async function createTRPCContextFromRequest(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  return {
    prisma,
    session,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
