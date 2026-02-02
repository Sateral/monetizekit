'use client';

import type { DashboardHeaderProps } from '@/types/dashboard';

export function DashboardHeader({ title, subtitle, orgName }: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          {orgName}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
    </header>
  );
}
