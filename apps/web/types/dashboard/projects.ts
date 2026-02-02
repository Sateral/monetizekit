import type { FormEvent } from 'react';

export type Project = {
  id: string;
  name: string;
  slug: string;
};

export type ProjectFormErrors = {
  name?: string;
  slug?: string;
  form?: string;
};

export type ProjectModel = {
  projects: Project[];
  selectedProjectId: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  name: string;
  slug: string;
  slugPreview: string;
  errors: ProjectFormErrors;
};

export type ProjectActions = {
  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onSelectProject: (projectId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type ProjectSectionProps = {
  model: ProjectModel;
  actions: ProjectActions;
};
