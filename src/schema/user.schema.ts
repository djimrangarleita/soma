import { z } from 'zod';
import validate from '../routes/middlewares/validate';

export const UserAccountStatus = ['CREATED', 'ACTIVATED', 'SUSPENDED'] as const;

export const UserRole = ['USER', 'ADMIN'] as const;

export const UserSchema = z
  .object({
    name: z.string().trim().max(128).min(3),
    email: z.string().trim().email(),
    phoneNumber: z.string().trim().max(24).min(3),
    accountStatus: z.enum(UserAccountStatus).optional(),
    role: z.enum(UserRole).optional(),
    password: z.string().trim().max(64).min(6),
  })
  .strict();

export const PartialUserSchema = UserSchema.partial();

export type User = z.infer<typeof UserSchema>;

export type PartialUser = z.infer<typeof PartialUserSchema>;

export type UserEntity = User & { id: string };

export const userValidator = {
  validateCreate: validate(UserSchema),
  validateUpdate: validate(PartialUserSchema),
};
