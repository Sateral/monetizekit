import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

export default async function DashboardPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const membership = await prisma.orgMember.findFirst({
    where: { userId: session.user.id },
    include: { org: true },
  });

  if (!membership) {
    redirect('/onboarding/create-org');
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-950">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          Organization
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {membership.org.name}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">/{membership.org.slug}</p>
      </div>
    </div>
  );
}
