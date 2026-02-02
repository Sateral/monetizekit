import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { CreateOrgForm } from '@/components/create-org-form';
import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

export default async function CreateOrgPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const membership = await prisma.orgMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  });

  if (membership) {
    redirect(`/dashboard?orgId=${membership.orgId}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Organization setup
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Create your organization</h1>
          <p className="mt-2 text-sm text-slate-500">
            This becomes the owner of your products, plans, and API keys.
          </p>
        </div>

        <div className="mt-8 h-px w-full bg-slate-200" />

        <div className="mt-8">
          <CreateOrgForm />
        </div>
      </div>
    </div>
  );
}
