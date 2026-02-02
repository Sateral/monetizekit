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
import type { MemberSectionProps } from '@/types/dashboard';

export function MemberSection({ model, actions }: MemberSectionProps) {
  const {
    members,
    invites,
    isLoading,
    isInvitesLoading,
    isOwner,
    isInviting,
    userId,
    email,
    errors,
  } = model;
  const { onEmailChange, onSubmit, onRemove, onTransferOwner, onDemoteOwner, onRevokeInvite } =
    actions;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Team ledger
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Members and access control</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Keep ownership tight and document who has access to your organization and projects.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">
          {members.length} members
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1.6fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Invite by email
          </p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">Add an existing user</h3>
          <p className="mt-2 text-sm text-slate-500">
            Members need a MonetizeKit account before they can join.
          </p>

          <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
            <input
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="name@company.com"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={!isOwner}
            />
            {errors.email ? <p className="text-xs text-rose-600">{errors.email}</p> : null}
            {errors.form ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
                {errors.form}
              </div>
            ) : null}
            <Button
              type="submit"
              disabled={!isOwner || isInviting}
              className="h-10 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500"
            >
              {isInviting ? 'Sending invite...' : 'Send invite'}
            </Button>
            {!isOwner ? (
              <p className="text-xs text-slate-400">Only owners can invite or remove members.</p>
            ) : null}
          </form>
        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Access roster
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Role badges</p>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <p className="text-sm text-slate-500">Loading members...</p>
              ) : members.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                  No members found yet.
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className="[&_tr]:border-slate-200">
                    <TableRow>
                      <TableHead className="px-0 text-xs uppercase tracking-[0.24em] text-slate-400">
                        Member
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Email
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Role
                      </TableHead>
                      <TableHead className="text-right text-xs uppercase tracking-[0.24em] text-slate-400">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => {
                      const isMemberOwner = member.role === 'OWNER';
                      const isSelf = member.user.id === userId;
                      const canRemove = isOwner && !isMemberOwner;
                      const canTransfer = isOwner && !isMemberOwner;
                      const canDemote = isOwner && isMemberOwner && !isSelf;

                      return (
                        <TableRow key={member.id} className="border-slate-200">
                          <TableCell className="px-0 py-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{member.user.name || member.user.email}</span>
                              {isSelf ? (
                                <Badge
                                  variant="outline"
                                  className="border-slate-200 bg-slate-50 text-[10px] uppercase tracking-[0.26em] text-slate-500"
                                >
                                  You
                                </Badge>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-slate-500">{member.user.email}</TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className={
                                isMemberOwner
                                  ? 'border-emerald-200 bg-emerald-50 text-[10px] uppercase tracking-[0.24em] text-emerald-700'
                                  : 'border-slate-200 bg-slate-50 text-[10px] uppercase tracking-[0.24em] text-slate-500'
                              }
                            >
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <div className="flex flex-wrap justify-end gap-2">
                              {canDemote ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onDemoteOwner(member.user.id, member.user.name)}
                                  className="rounded-full border-slate-200 text-[10px] uppercase tracking-[0.24em] text-slate-600"
                                >
                                  Make member
                                </Button>
                              ) : null}
                              {canTransfer ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => onTransferOwner(member.user.id, member.user.name)}
                                  className="rounded-full bg-emerald-600 text-[10px] uppercase tracking-[0.24em] text-white hover:bg-emerald-700"
                                >
                                  Transfer owner
                                </Button>
                              ) : null}
                              {canRemove ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onRemove(member.user.id, member.user.name)}
                                  className="rounded-full border-rose-200 text-[10px] uppercase tracking-[0.24em] text-rose-600"
                                >
                                  Remove
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Pending invites
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Expiry</p>
            </div>

            <div className="mt-4">
              {isInvitesLoading ? (
                <p className="text-sm text-slate-500">Loading invites...</p>
              ) : invites.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                  No active invites.
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className="[&_tr]:border-slate-200">
                    <TableRow>
                      <TableHead className="px-0 text-xs uppercase tracking-[0.24em] text-slate-400">
                        Email
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Expires
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
                    {invites.map((invite) => {
                      const expiresAt = new Date(invite.expiresAt);
                      const expiresLabel = expiresAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });

                      return (
                        <TableRow key={invite.id} className="border-slate-200">
                          <TableCell className="px-0 py-3 font-semibold text-slate-900">
                            {invite.email}
                          </TableCell>
                          <TableCell className="py-3 text-slate-500">{expiresLabel}</TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className="border-slate-200 bg-slate-50 text-[10px] uppercase tracking-[0.24em] text-slate-500"
                            >
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => onRevokeInvite(invite.id, invite.email)}
                              className="rounded-full border-rose-200 text-[10px] uppercase tracking-[0.24em] text-rose-600"
                            >
                              Revoke
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
