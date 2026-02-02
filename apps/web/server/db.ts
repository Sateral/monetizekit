import { createPrismaClient } from '@monetizekit/db';

export const prisma = createPrismaClient(process.env.DATABASE_URL);
