import { Button } from '@/components/ui/button';

import type { ProjectSectionProps } from '@/types/dashboard';

export function ProjectSection({ model, actions }: ProjectSectionProps) {
  const { projects, selectedProjectId, isLoading, isSubmitting, name, slug, slugPreview, errors } =
    model;
  const { onNameChange, onSlugChange, onSelectProject, onSubmit } = actions;

  return (
    <section className="rounded-[30px] border border-[#e0d2bf] bg-white/85 p-8 shadow-[0_24px_60px_-55px_rgba(27,20,16,0.7)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">Projects</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Organize your surface</h2>
        </div>
        <div className="rounded-full border border-[#e9dece] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
          {projects.length} total
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7a6b5f]">
            Project name
          </label>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="API Gateway"
            className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
          />
          {errors.name ? <p className="text-xs text-[#b05b3b]">{errors.name}</p> : null}
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7a6b5f]">
            Project slug
          </label>
          <input
            value={slug}
            onChange={(event) => onSlugChange(event.target.value)}
            placeholder="api-gateway"
            className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
          />
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
            Preview: {slugPreview || '---'}
          </p>
          {errors.slug ? <p className="text-xs text-[#b05b3b]">{errors.slug}</p> : null}
        </div>
        {errors.form ? (
          <div className="rounded-2xl border border-[#f0d5c3] bg-[#fdf3ea] px-4 py-3 text-xs text-[#b05b3b]">
            {errors.form}
          </div>
        ) : null}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f]"
        >
          {isSubmitting ? 'Creating project...' : 'Create project'}
        </Button>
      </form>

      <div className="mt-8 border-t border-dashed border-[#e7d9c6] pt-6">
        {isLoading ? (
          <p className="text-sm text-[#7a6b5f]">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfcf] bg-white px-4 py-4 text-sm text-[#6b5d52]">
            No projects yet. Create one to start issuing keys.
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  selectedProjectId === project.id
                    ? 'border-[#1f1a17] bg-[#1f1a17] text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/20'
                    : 'border-[#e6d9c8] bg-white text-[#1f1a17] hover:border-[#1f1a17]/40'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{project.name}</p>
                  <p
                    className={`text-[11px] uppercase tracking-[0.28em] ${
                      selectedProjectId === project.id ? 'text-[#e7d7c6]' : 'text-[#9c8877]'
                    }`}
                  >
                    /{project.slug}
                  </p>
                </div>
                <span
                  className={`text-[11px] uppercase tracking-[0.28em] ${
                    selectedProjectId === project.id ? 'text-[#e7d7c6]' : 'text-[#b6a59a]'
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
