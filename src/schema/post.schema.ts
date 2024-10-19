import { z } from 'zod';
import validate from '../routes/middlewares/validate';
import { PostComment } from './comment.schema';

type PostDynamic = {
  id: string;
  medias?: string[];
  userId: string;
};

export const PostSchema = z
  .object({
    text: z.string().trim().max(1000),
    reference: z.string().trim().max(128).nullable().optional(),
    bookId: z.string().nullable().optional(),
  })
  .strict();

export const PartialPostSchema = PostSchema.partial();

export type Post = z.infer<typeof PostSchema>;

export type PartialPost = z.infer<typeof PartialPostSchema>;

export type PostEntity = Post & PostDynamic;

export type PostEntityPublic = Post &
  PostDynamic & {
    comments: PostComment[] | null;
  };

export const publicPost = {
  comments: {
    text: true,
    parentId: true,
    select: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  },
  likes: true,
};

export const postValidator = {
  validateCreate: validate(PostSchema),
  validateUpdate: validate(PartialPostSchema),
};
