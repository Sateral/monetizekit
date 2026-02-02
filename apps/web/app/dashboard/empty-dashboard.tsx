'use client';

import { useRouter } from 'next/navigation';

import { CreateOrgDialog } from '@/components/create-org-dialog';
import { Button } from '@/components/ui/button';
import { OrgInviteForm } from '@/components/org-invite-form';

export function EmptyDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Getting started
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">No organization yet</h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a new org to begin or join one with an invite link.
            </p>

            <div className="mt-8 grid gap-6">
              <CreateOrgDialog
                trigger={
                  <Button
                    type="button"
                    className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    Create organization
                  </Button>
                }
              />

              <OrgInviteForm
                title="Join with invite"
                description="Paste an invite link or token to join an organization."
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/orgs')}
              className="mt-6 h-10 w-full rounded-xl border-slate-200 text-sm text-slate-600"
            >
              View organization list
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
