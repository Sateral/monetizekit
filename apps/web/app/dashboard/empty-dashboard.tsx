'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { OrgInviteForm } from '@/components/org-invite-form';

export function EmptyDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1a17]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(68%_90%_at_20%_10%,#efe4d2_0%,transparent_60%),radial-gradient(60%_60%_at_82%_12%,#e9d5b9_0%,transparent_55%),linear-gradient(120deg,#f7f4ef_0%,#f4efe7_60%,#efe7dc_100%)]" />
        <div className="absolute inset-0 opacity-25 mix-blend-multiply [background-image:radial-gradient(#1f1a17_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[32px] border border-[#e0d2bf] bg-white/90 p-10 shadow-[0_30px_70px_-60px_rgba(27,20,16,0.7)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8c7a6b]">Getting started</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">No organization yet</h1>
              <p className="mt-2 text-sm text-[#6b5d52]">
                Create a new org to begin or join one with an invite link.
              </p>

              <div className="mt-8 grid gap-6">
                <Button
                  type="button"
                  onClick={() => router.push('/onboarding/create-org')}
                  className="h-11 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f]"
                >
                  Create organization
                </Button>

                <OrgInviteForm
                  title="Join with invite"
                  description="Paste an invite link or token to join an organization."
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/orgs')}
                className="mt-6 h-10 w-full rounded-2xl border-[#e6d9c8] text-sm text-[#6b5d52]"
              >
                View organization list
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
