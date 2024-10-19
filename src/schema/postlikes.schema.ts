import { z } from 'zod';

export const PostLikesSchema = z
  .object({
    postId: z.string().nullable().optional(),
    userId: z.string().nullable().optional(),
  })
  .strict();

export type PostLikes = z.infer<typeof PostLikesSchema>;

export type PostLikeEntity = {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
};
