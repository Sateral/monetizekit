'use client';

import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateOrgDialog } from '@/components/create-org-dialog';
import type { OrgMembershipSummary } from '@/types/orgs';

type DashboardSection = 'overview' | 'projects' | 'keys' | 'members';

type SidebarNavProps = {
  orgId: string;
  orgName: string;
  orgSlug: string;
  orgs: OrgMembershipSummary[];
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
};

const navItems: Array<{ id: DashboardSection; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'keys', label: 'API Keys' },
  { id: 'members', label: 'Members & Invites' },
];

export function SidebarNav({
  orgId,
  orgName,
  orgSlug,
  orgs,
  activeSection,
  onSelectSection,
}: SidebarNavProps) {
  const router = useRouter();
  const activeOrg = orgs.find((org) => org.orgId === orgId);

  return (
    <aside className="w-full border-b border-slate-200 bg-white/80 px-6 py-6 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">
            MonetizeKit
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Workspace</p>
          <p className="text-xs text-slate-500">/{orgSlug}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 transition hover:border-slate-300"
            >
              {activeOrg?.orgName ?? orgName}
              <span className="text-emerald-600">▾</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="min-w-[220px] rounded-2xl border border-slate-200 bg-white/95 p-2 text-slate-900"
          >
            <DropdownMenuLabel className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
              Switch organization
            </DropdownMenuLabel>
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.orgId}
                onClick={() => router.push(`/dashboard?orgId=${encodeURIComponent(org.orgId)}`)}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-slate-100"
              >
                <span>{org.orgName}</span>
                {org.orgId === orgId ? (
                  <span className="text-[11px] uppercase tracking-[0.24em] text-emerald-600">
                    Active
                  </span>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="mt-6 flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col">
        {navItems.map((item) => {
          const isActive = item.id === activeSection;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <CreateOrgDialog
          trigger={
            <button
              type="button"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Create org
            </button>
          }
        />
        <button
          type="button"
          onClick={() => router.push('/orgs')}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-600 transition hover:border-slate-300"
        >
          View all orgs
        </button>
      </div>
    </aside>
  );
}
