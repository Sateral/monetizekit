import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

export const createPrismaClient = (connectionString?: string) => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to initialize Prisma Client.');
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
};

export { PrismaClient };
