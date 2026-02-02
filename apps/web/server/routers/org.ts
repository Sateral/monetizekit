import { createHash, randomBytes } from 'crypto';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { orgSlugSchema } from '@monetizekit/config';

import { sendOrgInviteEmail } from '@/lib/email';
import { orgOwnerProcedure, orgProcedure, protectedProcedure, router } from '@/server/trpc';

const inviteExpiryMs = 7 * 24 * 60 * 60 * 1000;

const createInviteToken = () => randomBytes(32).toString('base64url');
const hashInviteToken = (value: string) => createHash('sha256').update(value).digest('hex');

export const orgRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(80),
        slug: orgSlugSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.organization.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Organization slug already in use.',
        });
      }

      const org = await ctx.prisma.organization.create({
        data: {
          name: input.name,
          slug: input.slug,
          ownerUserId: ctx.userId,
          members: {
            create: {
              userId: ctx.userId,
              role: 'OWNER',
            },
          },
        },
      });

      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
      };
    }),
  listMembers: orgProcedure.query(async ({ ctx, input }) => {
    const members = await ctx.prisma.orgMember.findMany({
      where: {
        orgId: input.orgId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        role: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { members };
  }),
  addMember: orgOwnerProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found.',
        });
      }

      const existing = await ctx.prisma.orgMember.findUnique({
        where: {
          orgId_userId: {
            orgId: input.orgId,
            userId: user.id,
          },
        },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User is already a member of this organization.',
        });
      }

      const membership = await ctx.prisma.orgMember.create({
        data: {
          orgId: input.orgId,
          userId: user.id,
          role: 'MEMBER',
        },
        select: {
          id: true,
          role: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return { member: membership };
    }),
  inviteCreate: orgOwnerProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        const existingMember = await ctx.prisma.orgMember.findUnique({
          where: {
            orgId_userId: {
              orgId: input.orgId,
              userId: existingUser.id,
            },
          },
        });

        if (existingMember) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User is already a member of this organization.',
          });
        }
      }

      await ctx.prisma.orgInvite.updateMany({
        where: {
          orgId: input.orgId,
          email,
          acceptedAt: null,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      const token = createInviteToken();
      const invite = await ctx.prisma.orgInvite.create({
        data: {
          orgId: input.orgId,
          email,
          role: 'MEMBER',
          tokenHash: hashInviteToken(token),
          expiresAt: new Date(Date.now() + inviteExpiryMs),
          invitedByUserId: ctx.userId,
        },
        include: {
          org: {
            select: {
              name: true,
            },
          },
        },
      });

      const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
      const inviteUrl = new URL(`/invite/${token}`, baseUrl).toString();

      await sendOrgInviteEmail({
        toEmail: invite.email,
        orgName: invite.org.name,
        inviteUrl,
        inviterName: ctx.session?.user?.name,
      });

      return {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
        inviteUrl,
      };
    }),
  inviteList: orgOwnerProcedure.query(async ({ ctx, input }) => {
    const invites = await ctx.prisma.orgInvite.findMany({
      where: {
        orgId: input.orgId,
        acceptedAt: null,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        role: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        createdAt: true,
      },
    });

    return { invites };
  }),
  inviteRevoke: orgOwnerProcedure
    .input(
      z.object({
        inviteId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.orgInvite.findFirst({
        where: {
          id: input.inviteId,
          orgId: input.orgId,
          revokedAt: null,
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invite not found.',
        });
      }

      const revokedInvite = await ctx.prisma.orgInvite.update({
        where: { id: invite.id },
        data: { revokedAt: new Date() },
        select: {
          id: true,
          email: true,
          role: true,
          expiresAt: true,
          acceptedAt: true,
          revokedAt: true,
          createdAt: true,
        },
      });

      return { invite: revokedInvite };
    }),
  inviteAccept: protectedProcedure
    .input(
      z.object({
        token: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tokenHash = hashInviteToken(input.token);
      const invite = await ctx.prisma.orgInvite.findUnique({
        where: { tokenHash },
      });

      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invite not found.',
        });
      }

      if (invite.revokedAt || invite.acceptedAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This invite is no longer active.',
        });
      }

      if (invite.expiresAt.getTime() < Date.now()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This invite has expired.',
        });
      }

      const sessionEmail = ctx.session?.user?.email?.toLowerCase();
      if (!sessionEmail || sessionEmail !== invite.email.toLowerCase()) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This invite does not match your signed-in email.',
        });
      }

      await ctx.prisma.$transaction(async (tx) => {
        const existingMember = await tx.orgMember.findUnique({
          where: {
            orgId_userId: {
              orgId: invite.orgId,
              userId: ctx.userId,
            },
          },
        });

        if (!existingMember) {
          await tx.orgMember.create({
            data: {
              orgId: invite.orgId,
              userId: ctx.userId,
              role: invite.role,
            },
          });
        }

        await tx.orgInvite.update({
          where: { id: invite.id },
          data: { acceptedAt: new Date() },
        });
      });

      return { orgId: invite.orgId };
    }),
  removeMember: orgOwnerProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.org.ownerUserId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot remove the organization owner.',
        });
      }

      const membership = await ctx.prisma.orgMember.findUnique({
        where: {
          orgId_userId: {
            orgId: input.orgId,
            userId: input.userId,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Member not found.',
        });
      }

      await ctx.prisma.orgMember.delete({
        where: {
          id: membership.id,
        },
      });

      return { removed: true };
    }),
  updateMemberRole: orgOwnerProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        role: z.enum(['OWNER', 'MEMBER']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.prisma.orgMember.findUnique({
        where: {
          orgId_userId: {
            orgId: input.orgId,
            userId: input.userId,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Member not found.',
        });
      }

      if (input.role === 'MEMBER' && input.userId === ctx.org.ownerUserId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Transfer ownership before demoting the current owner.',
        });
      }

      if (input.role === 'OWNER') {
        const [, updatedMember] = await ctx.prisma.$transaction([
          ctx.prisma.orgMember.updateMany({
            where: {
              orgId: input.orgId,
              role: 'OWNER',
            },
            data: {
              role: 'MEMBER',
            },
          }),
          ctx.prisma.orgMember.update({
            where: {
              id: membership.id,
            },
            data: {
              role: 'OWNER',
            },
            select: {
              id: true,
              role: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          }),
          ctx.prisma.organization.update({
            where: {
              id: input.orgId,
            },
            data: {
              ownerUserId: input.userId,
            },
          }),
        ]);

        return { member: updatedMember };
      }

      const updatedMember = await ctx.prisma.orgMember.update({
        where: {
          id: membership.id,
        },
        data: {
          role: input.role,
        },
        select: {
          id: true,
          role: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return { member: updatedMember };
    }),
});
