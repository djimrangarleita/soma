import { z } from 'zod';
import validate from '../routes/middlewares/validate';

type PostDynamic = {
  id: string;
  medias: string[];
  userId: string;
  comments: string[];
  likes: string[];
};

export const PostSchema = z
  .object({
    text: z.string().trim().max(1000),
    reference: z.string().trim().max(128).optional(),
    bookId: z.string().optional(),
  })
  .strict();

export const PartialPostSchema = PostSchema.partial();

export type Post = z.infer<typeof PostSchema>;

export type PartialPost = z.infer<typeof PartialPostSchema>;

export type PostEntity = Post & PostDynamic;

export const postValidator = {
  validateCreate: validate(PostSchema),
  validateUpdate: validate(PartialPostSchema),
};
