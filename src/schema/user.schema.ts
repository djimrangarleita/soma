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
    password: z.string().max(64).min(6),
    salt: z.string().optional(),
  })
  .strict();

const LoginCredentialsSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string(),
  })
  .strict();

export const PartialUserSchema = UserSchema.partial();

export type User = z.infer<typeof UserSchema>;

export type PartialUser = z.infer<typeof PartialUserSchema>;

export type UserEntity = User & { id: string };

export type UserEntityPublic = Omit<User, 'password' | 'salt'> & { id: string };

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const publicUser = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  accountStatus: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const userValidator = {
  validateCreate: validate(UserSchema),
  validateUpdate: validate(PartialUserSchema),
  validateCredentials: validate(LoginCredentialsSchema),
};
