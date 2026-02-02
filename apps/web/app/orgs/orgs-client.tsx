'use client';

import { useRouter } from 'next/navigation';

import { CreateOrgDialog } from '@/components/create-org-dialog';
import { Button } from '@/components/ui/button';
import { OrgInviteForm } from '@/components/org-invite-form';
import type { OrgMembershipSummary } from '@/types/orgs';

type OrgsClientProps = {
  memberships: OrgMembershipSummary[];
};

export function OrgsClient({ memberships }: OrgsClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Workspace
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                Choose your organization
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Create a new org or join an existing one.
              </p>
            </div>
            <CreateOrgDialog
              trigger={
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Create org
                </Button>
              }
            />
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                    Organizations
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Your org list</h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">
                  {memberships.length} total
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {memberships.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                    You are not part of any organizations yet.
                  </div>
                ) : (
                  memberships.map((membership) => (
                    <button
                      key={membership.orgId}
                      type="button"
                      onClick={() =>
                        router.push(`/dashboard?orgId=${encodeURIComponent(membership.orgId)}`)
                      }
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-300"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{membership.orgName}</p>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                          /{membership.orgSlug}
                        </p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                        {membership.role}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <OrgInviteForm
                title="Join with invite"
                description="Paste an invite link or token to join an organization."
              />

              {memberships.length === 0 ? (
                <>
                  <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                    Not ready? You can explore the empty dashboard and create an org later.
                  </div>
                  <Button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="mt-4 h-10 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300"
                    variant="outline"
                  >
                    Skip for now
                  </Button>
                </>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
