import { z } from 'zod';
import validate from '../routes/middlewares/validate';
import { AnyUser } from './user.schema';

type PostDynamic = {
  id: string;
  userId: string;
  user: AnyUser;
  isLiked?: boolean;
};

export const PostSchema = z
  .object({
    text: z.string().trim().min(3).max(1000),
    reference: z.string().trim().max(128).nullable().optional(),
    medias: z.array(z.string()).optional(),
    bookId: z.string().optional().nullable(),
  })
  .strict();

export const PartialPostSchema = PostSchema.partial();

export type Post = z.infer<typeof PostSchema>;

export type PartialPost = z.infer<typeof PartialPostSchema>;

export type PostEntity = Post & PostDynamic;

export type PostEntityPublic = Post & PostDynamic;

export const publicPost = {
  likes: true,
};

export const postValidator = {
  validateCreate: validate(PostSchema),
  validateUpdate: validate(PartialPostSchema),
};
