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
    <section className="rounded-[34px] border border-[#e0d2bf] bg-white/90 p-10 shadow-[0_30px_70px_-60px_rgba(27,20,16,0.7)]">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">Team ledger</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Members and access control</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#5c524a]">
            Keep ownership tight and document who has access to your organization and projects.
          </p>
        </div>
        <div className="rounded-full border border-[#e9dece] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
          {members.length} members
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1.6fr]">
        <div className="rounded-[26px] border border-[#eadfcf] bg-[#fffaf2] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">Invite by email</p>
          <h3 className="mt-3 text-lg font-semibold text-[#1f1a17]">Add an existing user</h3>
          <p className="mt-2 text-sm text-[#6b5d52]">
            Members need a MonetizeKit account before they can join.
          </p>

          <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
            <input
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="name@company.com"
              className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
              disabled={!isOwner}
            />
            {errors.email ? <p className="text-xs text-[#b05b3b]">{errors.email}</p> : null}
            {errors.form ? (
              <div className="rounded-2xl border border-[#f0d5c3] bg-[#fdf3ea] px-4 py-3 text-xs text-[#b05b3b]">
                {errors.form}
              </div>
            ) : null}
            <Button
              type="submit"
              disabled={!isOwner || isInviting}
              className="h-10 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f] disabled:bg-[#cbbdaf]"
            >
              {isInviting ? 'Sending invite...' : 'Send invite'}
            </Button>
            {!isOwner ? (
              <p className="text-xs text-[#9c8877]">Only owners can invite or remove members.</p>
            ) : null}
          </form>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[26px] border border-[#eadfcf] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">Access roster</p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#b6a59a]">Role badges</p>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <p className="text-sm text-[#7a6b5f]">Loading members...</p>
              ) : members.length === 0 ? (
                <div className="rounded-2xl border border-[#eadfcf] bg-white px-4 py-4 text-sm text-[#6b5d52]">
                  No members found yet.
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className="[&_tr]:border-[#eadfcf]">
                    <TableRow>
                      <TableHead className="px-0 text-xs uppercase tracking-[0.24em] text-[#9c8877]">
                        Member
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-[0.24em] text-[#9c8877]">
                        Email
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-[0.24em] text-[#9c8877]">
                        Role
                      </TableHead>
                      <TableHead className="text-right text-xs uppercase tracking-[0.24em] text-[#9c8877]">
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
                        <TableRow key={member.id} className="border-[#eadfcf]">
                          <TableCell className="px-0 py-3 font-semibold text-[#1f1a17]">
                            <div className="flex items-center gap-2">
                              <span>{member.user.name || member.user.email}</span>
                              {isSelf ? (
                                <Badge
                                  variant="outline"
                                  className="border-[#d7dfe7] bg-[#edf3f8] text-[10px] uppercase tracking-[0.26em] text-[#536170]"
                                >
                                  You
                                </Badge>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-[#7a6b5f]">{member.user.email}</TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className={
                                isMemberOwner
                                  ? 'border-[#dbe5d8] bg-[#eef7ed] text-[10px] uppercase tracking-[0.24em] text-[#3e6c42]'
                                  : 'border-[#e5dcd4] bg-[#f7f0e6] text-[10px] uppercase tracking-[0.24em] text-[#7a6b5f]'
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
                                  className="rounded-full border-[#e6d9c8] text-[10px] uppercase tracking-[0.24em] text-[#6b5d52]"
                                >
                                  Make member
                                </Button>
                              ) : null}
                              {canTransfer ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => onTransferOwner(member.user.id, member.user.name)}
                                  className="rounded-full bg-[#1f1a17] text-[10px] uppercase tracking-[0.24em] text-[#f7f4ef] hover:bg-[#2a231f]"
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
                                  className="rounded-full border-[#f0d5c3] text-[10px] uppercase tracking-[0.24em] text-[#b05b3b]"
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

          <div className="rounded-[26px] border border-[#eadfcf] bg-[#fffdf8] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">Pending invites</p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#b6a59a]">Expiry</p>
            </div>

            <div className="mt-4">
              {isInvitesLoading ? (
                <p className="text-sm text-[#7a6b5f]">Loading invites...</p>
              ) : invites.length === 0 ? (
                <div className="rounded-2xl border border-[#eadfcf] bg-white px-4 py-4 text-sm text-[#6b5d52]">
                  No active invites.
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className="[&_tr]:border-[#eadfcf]">
                    <TableRow>
                      <TableHead className="px-0 text-xs uppercase tracking-[0.24em] text-[#9c8877]">
                        Email
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-[0.24em] text-[#9c8877]">
                        Expires
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-[0.24em] text-[#9c8877]">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-xs uppercase tracking-[0.24em] text-[#9c8877]">
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
                        <TableRow key={invite.id} className="border-[#eadfcf]">
                          <TableCell className="px-0 py-3 font-semibold text-[#1f1a17]">
                            {invite.email}
                          </TableCell>
                          <TableCell className="py-3 text-[#7a6b5f]">{expiresLabel}</TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className="border-[#e5dcd4] bg-[#f7f0e6] text-[10px] uppercase tracking-[0.24em] text-[#7a6b5f]"
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
                              className="rounded-full border-[#f0d5c3] text-[10px] uppercase tracking-[0.24em] text-[#b05b3b]"
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
