import { z } from 'zod';
import validate from '../routes/middlewares/validate';

type PostCommentDynamic = {
  id: string;
  userId: string;
  postId: string;
};

export const PostCommentSchema = z
  .object({
    text: z.string().trim().min(3).max(512),
    parentId: z.string().nullable().optional(),
  })
  .strict();

const PartialPostCommentSchema = PostCommentSchema.partial();

export type PostComment = z.infer<typeof PostCommentSchema>;

export type PostCommentEntity = PostComment & PostCommentDynamic;

export const postCommentValidator = {
  validateCreate: validate(PostCommentSchema),
  validateUpdate: validate(PartialPostCommentSchema),
};
