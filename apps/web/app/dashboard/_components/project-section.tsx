import { Button } from '@/components/ui/button';

import type { ProjectSectionProps } from '@/types/dashboard';

export function ProjectSection({ model, actions }: ProjectSectionProps) {
  const { projects, selectedProjectId, isLoading, isSubmitting, name, slug, slugPreview, errors } =
    model;
  const { onNameChange, onSlugChange, onSelectProject, onSubmit } = actions;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Projects
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Organize your surface</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">
          {projects.length} total
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
            Project name
          </label>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="API Gateway"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.name ? <p className="text-xs text-rose-600">{errors.name}</p> : null}
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
            Project slug
          </label>
          <input
            value={slug}
            onChange={(event) => onSlugChange(event.target.value)}
            placeholder="api-gateway"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
            Preview: {slugPreview || '---'}
          </p>
          {errors.slug ? <p className="text-xs text-rose-600">{errors.slug}</p> : null}
        </div>
        {errors.form ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            {errors.form}
          </div>
        ) : null}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          {isSubmitting ? 'Creating project...' : 'Create project'}
        </Button>
      </form>

      <div className="mt-8 border-t border-dashed border-slate-200 pt-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
            No projects yet. Create one to start issuing keys.
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                  selectedProjectId === project.id
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{project.name}</p>
                  <p
                    className={`text-[11px] uppercase tracking-[0.28em] ${
                      selectedProjectId === project.id ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    /{project.slug}
                  </p>
                </div>
                <span
                  className={`text-[11px] uppercase tracking-[0.28em] ${
                    selectedProjectId === project.id ? 'text-white/70' : 'text-slate-400'
                  }`}
                >
                  Active
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
