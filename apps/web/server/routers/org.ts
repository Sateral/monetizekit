import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { orgSlugSchema } from '@monetizekit/config';

import { orgOwnerProcedure, orgProcedure, protectedProcedure, router } from '@/server/trpc';

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
