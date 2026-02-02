import { z } from 'zod';

export const orgSlugSchema = z
  .string()
  .min(3)
  .max(40)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Use lowercase letters, numbers, and single hyphens only.',
  });

export const cuidSchema = z.union([
  z.string().regex(/^[a-z0-9]{25}$/, {
    error: 'Invalid CUID format.',
  }),
  z.cuid2(),
]);

export const projectSlugSchema = z
  .string()
  .min(3)
  .max(40)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Use lowercase letters, numbers, and single hyphens only.',
  });
