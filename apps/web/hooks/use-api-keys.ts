'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { trpc } from '@/lib/trpc/client';

import type { ApiKey, ApiKeyActions, ApiKeySectionErrors, ApiKeyModel } from '@/types/dashboard';

export function useApiKeys(orgId: string, selectedProjectId: string | null) {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<ApiKeySectionErrors>({});
  const [issuedToken, setIssuedToken] = useState<string | null>(null);

  const apiKeyList = trpc.apiKey.list.useQuery(
    { orgId, projectId: selectedProjectId ?? '' },
    { enabled: Boolean(selectedProjectId) },
  );

  const createApiKey = trpc.apiKey.create.useMutation({
    onSuccess: async (data) => {
      setName('');
      setErrors({});
      setIssuedToken(data.token);
      await apiKeyList.refetch();
    },
    onError: (error) => {
      setErrors({ form: error.message });
    },
  });

  const revokeApiKey = trpc.apiKey.revoke.useMutation({
    onSuccess: async () => {
      await apiKeyList.refetch();
    },
  });

  const validate = () => {
    const nextErrors: ApiKeySectionErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'API key name is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProjectId || !validate()) return;

    createApiKey.mutate({
      orgId,
      projectId: selectedProjectId,
      name: name.trim(),
    });
  };

  const handleCopyToken = async () => {
    if (!issuedToken) return;
    await navigator.clipboard.writeText(issuedToken);
  };

  const handleRevoke = (apiKeyId: string) => {
    revokeApiKey.mutate({ orgId, apiKeyId });
  };

  const apiKeys: ApiKey[] = apiKeyList.data?.apiKeys ?? [];
  const canCreate = Boolean(selectedProjectId);

  const model: ApiKeyModel = {
    apiKeys,
    isLoading: apiKeyList.isLoading,
    isSubmitting: createApiKey.isPending,
    isRevoking: revokeApiKey.isPending,
    canCreate,
    name,
    errors,
    issuedToken,
  };

  const actions: ApiKeyActions = {
    onNameChange: setName,
    onSubmit: handleSubmit,
    onCopyToken: handleCopyToken,
    onDismissToken: () => setIssuedToken(null),
    onRevoke: handleRevoke,
  };

  return {
    model,
    actions,
  };
}
