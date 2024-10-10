import { z } from 'zod';
import validate from '../routes/middlewares/validate';

export const UserSchema = z
  .object({
    email: z.string().trim().email(),
    name: z.string().trim().max(128).min(3),
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
