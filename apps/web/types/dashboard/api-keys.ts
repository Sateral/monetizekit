import type { FormEvent } from 'react';

export type ApiKey = {
  id: string;
  name: string;
  keyLast4: string;
  revokedAt: string | Date | null;
};

export type ApiKeySectionErrors = {
  name?: string;
  form?: string;
};

export type ApiKeyModel = {
  apiKeys: ApiKey[];
  isLoading: boolean;
  isSubmitting: boolean;
  isRevoking: boolean;
  canCreate: boolean;
  name: string;
  errors: ApiKeySectionErrors;
  issuedToken: string | null;
};

export type ApiKeyActions = {
  onNameChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCopyToken: () => void;
  onDismissToken: () => void;
  onRevoke: (apiKeyId: string) => void;
};

export type ApiKeySectionProps = {
  model: ApiKeyModel;
  actions: ApiKeyActions;
};
