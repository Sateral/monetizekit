'use client';

import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DashboardHeaderProps } from '@/types/dashboard';

export function DashboardHeader({
  orgId,
  orgName,
  orgSlug,
  orgs,
  selectedProjectName,
  selectedProjectSlug,
}: DashboardHeaderProps) {
  const router = useRouter();
  const hasProject = Boolean(selectedProjectName && selectedProjectSlug);
  const activeOrg = orgs.find((org) => org.orgId === orgId);

  return (
    <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#8c7a6b]">MonetizeKit workspace</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{orgName}</h1>
        <p className="mt-2 text-sm text-[#6b5d52]">/{orgSlug}</p>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#4d433b]">
          Shape your product surface with intentional projects and keys. Keep it lean, traceable,
          and ready for scale.
        </p>
        <div className="mt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#e6d9c8] bg-white px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#6b5d52] transition hover:border-[#1f1a17]/40"
              >
                {activeOrg?.orgName ?? orgName}
                <span className="text-[#9c8877]">▾</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-[220px] rounded-2xl border border-[#eadfcf] bg-white/95 p-2 text-[#1f1a17]"
            >
              <DropdownMenuLabel className="text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
                Switch organization
              </DropdownMenuLabel>
              {orgs.map((org) => (
                <DropdownMenuItem
                  key={org.orgId}
                  onClick={() => router.push(`/dashboard?orgId=${encodeURIComponent(org.orgId)}`)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-[#f7f0e6]"
                >
                  <span>{org.orgName}</span>
                  {org.orgId === orgId ? (
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#9c8877]">
                      Active
                    </span>
                  ) : null}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-2 bg-[#eadfcf]" />
              <DropdownMenuItem
                onClick={() => router.push('/onboarding/create-org')}
                className="cursor-pointer rounded-xl px-3 py-2 text-sm hover:bg-[#f7f0e6]"
              >
                Create org
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/orgs')}
                className="cursor-pointer rounded-xl px-3 py-2 text-sm hover:bg-[#f7f0e6]"
              >
                View all orgs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-[28px] border border-[#e2d6c4] bg-white/70 p-6 shadow-[0_30px_70px_-55px_rgba(27,20,16,0.7)] backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-[#8c7a6b]">Active surface</div>
        <p className="mt-3 text-sm text-[#5c524a]">Selected project</p>
        <div className="mt-4 rounded-2xl border border-[#eadfcf] bg-white px-4 py-4">
          <p className="text-base font-semibold text-[#1f1a17]">
            {selectedProjectName ?? 'No project selected'}
          </p>
          <p className="mt-1 text-xs text-[#7a6b5f]">
            {hasProject ? `/${selectedProjectSlug}` : 'Create a project to begin'}
          </p>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[#7a6b5f]">
          API keys inherit permissions from their project. Keep scopes tight and revoke unused keys.
        </p>
      </div>
    </header>
  );
}
