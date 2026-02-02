import { Button } from '@/components/ui/button';

import type { ApiKeySectionProps } from '@/types/dashboard';

export function ApiKeySection({ model, actions }: ApiKeySectionProps) {
  const { apiKeys, isLoading, isSubmitting, isRevoking, canCreate, name, errors, issuedToken } =
    model;
  const { onNameChange, onSubmit, onCopyToken, onDismissToken, onRevoke } = actions;

  return (
    <section className="rounded-[30px] border border-[#e0d2bf] bg-white/85 p-8 shadow-[0_24px_60px_-55px_rgba(27,20,16,0.7)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">API keys</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Issue access tokens</h2>
        </div>
        <div className="rounded-full border border-[#e9dece] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
          {apiKeys.length} keys
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7a6b5f]">
            Key label
          </label>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Usage exporter"
            className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
          />
          {errors.name ? <p className="text-xs text-[#b05b3b]">{errors.name}</p> : null}
        </div>
        {errors.form ? (
          <div className="rounded-2xl border border-[#f0d5c3] bg-[#fdf3ea] px-4 py-3 text-xs text-[#b05b3b]">
            {errors.form}
          </div>
        ) : null}
        <Button
          type="submit"
          disabled={!canCreate || isSubmitting}
          className="h-11 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f] disabled:bg-[#cbbdaf] disabled:text-[#f7f4ef]"
        >
          {isSubmitting ? 'Issuing key...' : 'Issue API key'}
        </Button>
        {!canCreate ? (
          <p className="text-xs text-[#9c8877]">Select a project before issuing a key.</p>
        ) : null}
      </form>

      {issuedToken ? (
        <div className="mt-6 rounded-3xl border border-[#e6d9c8] bg-[#fff8ef] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">New API key</p>
          <p className="mt-2 break-all font-mono text-sm text-[#1f1a17]">{issuedToken}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              size="sm"
              onClick={onCopyToken}
              className="rounded-full bg-[#1f1a17] text-xs uppercase tracking-[0.24em] text-[#f7f4ef] hover:bg-[#2a231f]"
            >
              Copy
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onDismissToken}
              className="rounded-full border-[#e6d9c8] text-xs uppercase tracking-[0.24em] text-[#6b5d52]"
            >
              Dismiss
            </Button>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
            Store this token securely. You will not see it again.
          </p>
        </div>
      ) : null}

      <div className="mt-8 border-t border-dashed border-[#e7d9c6] pt-6">
        {isLoading ? (
          <p className="text-sm text-[#7a6b5f]">Loading API keys...</p>
        ) : apiKeys.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfcf] bg-white px-4 py-4 text-sm text-[#6b5d52]">
            No keys issued yet. Create one for your integrations.
          </div>
        ) : (
          <div className="grid gap-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1f1a17]">{key.name}</p>
                  <p className="text-xs text-[#9c8877]">•••• {key.keyLast4}</p>
                </div>
                <div className="flex items-center gap-3">
                  {key.revokedAt ? (
                    <span className="rounded-full border border-[#f2d2c4] bg-[#fdf0e7] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#b05b3b]">
                      Revoked
                    </span>
                  ) : (
                    <span className="rounded-full border border-[#dbe5d8] bg-[#eef7ed] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#3e6c42]">
                      Active
                    </span>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={Boolean(key.revokedAt) || isRevoking}
                    onClick={() => onRevoke(key.id)}
                    className="rounded-full border-[#e6d9c8] text-xs uppercase tracking-[0.24em] text-[#6b5d52]"
                  >
                    {key.revokedAt ? 'Revoked' : 'Revoke'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
