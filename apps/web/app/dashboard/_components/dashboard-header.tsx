import type { DashboardHeaderProps } from '@/types/dashboard';

export function DashboardHeader({
  orgName,
  orgSlug,
  selectedProjectName,
  selectedProjectSlug,
}: DashboardHeaderProps) {
  const hasProject = Boolean(selectedProjectName && selectedProjectSlug);

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
