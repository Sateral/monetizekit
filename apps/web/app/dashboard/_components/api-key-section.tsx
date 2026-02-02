import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ApiKeySectionProps } from '@/types/dashboard';

export function ApiKeySection({ model, actions }: ApiKeySectionProps) {
  const { apiKeys, isLoading, isSubmitting, isRevoking, canCreate, name, errors, issuedToken } =
    model;
  const { onNameChange, onSubmit, onCopyToken, onDismissToken, onRevoke } = actions;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            API keys
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Issue access tokens</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">
          {apiKeys.length} keys
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
            Key label
          </label>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Usage exporter"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.name ? <p className="text-xs text-rose-600">{errors.name}</p> : null}
        </div>
        {errors.form ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            {errors.form}
          </div>
        ) : null}
        <Button
          type="submit"
          disabled={!canCreate || isSubmitting}
          className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500"
        >
          {isSubmitting ? 'Issuing key...' : 'Issue API key'}
        </Button>
        {!canCreate ? (
          <p className="text-xs text-slate-400">Select a project before issuing a key.</p>
        ) : null}
      </form>

      {issuedToken ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-600">
            New API key
          </p>
          <p className="mt-2 break-all font-mono text-sm text-slate-900">{issuedToken}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              size="sm"
              onClick={onCopyToken}
              className="rounded-full bg-emerald-600 text-xs uppercase tracking-[0.24em] text-white hover:bg-emerald-700"
            >
              Copy
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onDismissToken}
              className="rounded-full border-slate-200 text-xs uppercase tracking-[0.24em] text-slate-600"
            >
              Dismiss
            </Button>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-emerald-700">
            Store this token securely. You will not see it again.
          </p>
        </div>
      ) : null}

      <div className="mt-8 border-t border-dashed border-slate-200 pt-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading API keys...</p>
        ) : apiKeys.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
            No keys issued yet. Create one for your integrations.
          </div>
        ) : (
          <Table className="text-sm">
            <TableHeader className="[&_tr]:border-slate-200">
              <TableRow>
                <TableHead className="px-0 text-xs uppercase tracking-[0.24em] text-slate-400">
                  Label
                </TableHead>
                <TableHead className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Last 4
                </TableHead>
                <TableHead className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-[0.24em] text-slate-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id} className="border-slate-200">
                  <TableCell className="px-0 py-3 font-semibold text-slate-900">
                    {key.name}
                  </TableCell>
                  <TableCell className="py-3 text-slate-500">•••• {key.keyLast4}</TableCell>
                  <TableCell className="py-3">
                    {key.revokedAt ? (
                      <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50 text-[10px] uppercase tracking-[0.24em] text-rose-600"
                      >
                        Revoked
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-[10px] uppercase tracking-[0.24em] text-emerald-700"
                      >
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={Boolean(key.revokedAt) || isRevoking}
                      onClick={() => onRevoke(key.id)}
                      className="rounded-full border-slate-200 text-xs uppercase tracking-[0.24em] text-slate-600"
                    >
                      {key.revokedAt ? 'Revoked' : 'Revoke'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
