import { z } from 'zod';
import validate from '../routes/middlewares/validate';

export const UserGender = { MALE: 'Male', FEMALE: 'Female' } as const;

type UserGenderType = (typeof UserGender)[keyof typeof UserGender];

export const UserProfileSchema = z
  .object({
    gender: z.enum(
      Object.values(UserGender) as [UserGenderType, ...UserGenderType[]]
    ),
    birthday: z.date(),
    profilePicture: z.string(),
    coverPicture: z.string(),
    timeZone: z.string(),
    bio: z.string().max(512),
    favoriteAuthor: z.string().trim().min(3).max(64),
    favoriteBook: z.string().trim().max(128),
    favoriteGenres: z.string(),
    centerOfInterest: z.string(),
  })
  .partial()
  .strict();

export type UserProfile = z.infer<typeof UserProfileSchema>;

export type UserProfileEntity = z.infer<typeof UserProfileSchema> & {
  id: string;
  userId: string;
};

export const profileValidator = {
  validate: validate(UserProfileSchema),
};
