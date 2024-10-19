import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import { PostCommentEntity } from '../schema/comment.schema';

export const commentFactory = Factory.Sync.makeFactory<PostCommentEntity>({
  id: Factory.each(() => faker.string.uuid()),
  text: Factory.each(() => faker.lorem.sentences(5)),
  postId: 'new-post',
  userId: 'new-user',
});
