import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';
import type { OrgMembershipSummary } from '@/types/orgs';

import { OrgsClient } from './orgs-client';

export default async function OrgsPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const memberships = await prisma.orgMember.findMany({
    where: { userId: session.user.id },
    include: { org: true },
    orderBy: { createdAt: 'asc' },
  });

  const data: OrgMembershipSummary[] = memberships.map((membership) => ({
    orgId: membership.org.id,
    orgName: membership.org.name,
    orgSlug: membership.org.slug,
    role: membership.role,
  }));

  return <OrgsClient memberships={data} />;
}
