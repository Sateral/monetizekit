import { createHash, randomBytes } from 'crypto';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { cuidSchema } from '@monetizekit/config';

import { orgProcedure, router } from '@/server/trpc';

const apiKeyNameSchema = z.string().trim().min(2).max(80);
const projectIdSchema = cuidSchema;
const apiKeyIdSchema = cuidSchema;

const generateApiKey = () => {
  const payload = randomBytes(24).toString('base64url');
  return `mk_${payload}`;
};

const hashApiKey = (value: string) => {
  return createHash('sha256').update(value).digest('hex');
};

export const apiKeyRouter = router({
  list: orgProcedure
    .input(
      z.object({
        projectId: projectIdSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.projectId,
          orgId: input.orgId,
        },
        select: { id: true },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found.',
        });
      }

      const apiKeys = await ctx.prisma.apiKey.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          keyLast4: true,
          createdAt: true,
          revokedAt: true,
        },
      });

      return { apiKeys };
    }),
  create: orgProcedure
    .input(
      z.object({
        projectId: projectIdSchema,
        name: apiKeyNameSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.projectId,
          orgId: input.orgId,
        },
        select: { id: true },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found.',
        });
      }

      const rawKey = generateApiKey();
      const keyHash = hashApiKey(rawKey);
      const keyLast4 = rawKey.slice(-4);

      const apiKey = await ctx.prisma.apiKey.create({
        data: {
          projectId: project.id,
          createdByUserId: ctx.userId,
          name: input.name,
          keyHash,
          keyLast4,
        },
        select: {
          id: true,
          name: true,
          keyLast4: true,
          createdAt: true,
          revokedAt: true,
        },
      });

      return {
        apiKey,
        token: rawKey,
      };
    }),
  revoke: orgProcedure
    .input(
      z.object({
        apiKeyId: apiKeyIdSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.prisma.apiKey.findFirst({
        where: {
          id: input.apiKeyId,
          project: {
            orgId: input.orgId,
          },
        },
        select: {
          id: true,
          revokedAt: true,
        },
      });

      if (!apiKey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'API key not found.',
        });
      }

      const revoked = apiKey.revokedAt
        ? apiKey
        : await ctx.prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { revokedAt: new Date() },
            select: {
              id: true,
              name: true,
              keyLast4: true,
              createdAt: true,
              revokedAt: true,
            },
          });

      return { apiKey: revoked };
    }),
});
