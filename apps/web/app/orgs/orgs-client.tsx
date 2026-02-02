'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { OrgInviteForm } from '@/components/org-invite-form';
import type { OrgMembershipSummary } from '@/types/orgs';

type OrgsClientProps = {
  memberships: OrgMembershipSummary[];
};

export function OrgsClient({ memberships }: OrgsClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1a17]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(68%_90%_at_20%_10%,#efe4d2_0%,transparent_60%),radial-gradient(60%_60%_at_82%_12%,#e9d5b9_0%,transparent_55%),linear-gradient(120deg,#f7f4ef_0%,#f4efe7_60%,#efe7dc_100%)]" />
        <div className="absolute inset-0 opacity-25 mix-blend-multiply [background-image:radial-gradient(#1f1a17_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <header className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8c7a6b]">Workspace</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">
                  Choose your organization
                </h1>
                <p className="mt-2 text-sm text-[#6b5d52]">
                  Create a new org or join an existing one.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => router.push('/onboarding/create-org')}
                className="h-11 rounded-2xl bg-[#1f1a17] px-6 text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f]"
              >
                Create org
              </Button>
            </header>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-[30px] border border-[#e0d2bf] bg-white/85 p-8 shadow-[0_24px_60px_-55px_rgba(27,20,16,0.7)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">
                      Organizations
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">Your org list</h2>
                  </div>
                  <div className="rounded-full border border-[#e9dece] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
                    {memberships.length} total
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {memberships.length === 0 ? (
                    <div className="rounded-2xl border border-[#eadfcf] bg-white px-4 py-4 text-sm text-[#6b5d52]">
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
                        className="flex items-center justify-between rounded-2xl border border-[#e6d9c8] bg-white px-4 py-4 text-left transition hover:border-[#1f1a17]/40"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#1f1a17]">
                            {membership.orgName}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
                            /{membership.orgSlug}
                          </p>
                        </div>
                        <span className="rounded-full border border-[#e5dcd4] bg-[#f7f0e6] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#7a6b5f]">
                          {membership.role}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-[30px] border border-[#e0d2bf] bg-white/85 p-8 shadow-[0_24px_60px_-55px_rgba(27,20,16,0.7)]">
                <OrgInviteForm
                  title="Join with invite"
                  description="Paste an invite link or token to join an organization."
                />

                <div className="mt-8 rounded-2xl border border-[#eadfcf] bg-[#fffaf2] px-4 py-4 text-sm text-[#6b5d52]">
                  Not ready? You can explore the empty dashboard and create an org later.
                </div>
                <Button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 h-10 w-full rounded-2xl border border-[#e6d9c8] bg-white text-sm font-semibold text-[#6b5d52] shadow-sm transition hover:border-[#1f1a17]/40"
                  variant="outline"
                >
                  Skip for now
                </Button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
