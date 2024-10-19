import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import getRandomNum from '../lib/getRandomNum';
import { PostEntity } from '../schema/post.schema';

export const postFactory = Factory.Sync.makeFactory<PostEntity>({
  id: Factory.each(() => faker.string.uuid()),
  text: Factory.each(() => faker.lorem.sentences()),
  reference: Factory.each(() => faker.lorem.words({ min: 1, max: 5 })),
  userId: 'string',
  bookId: null,
  medias: Factory.each(() => {
    const mediasCount = getRandomNum(3);
    const medias = [];
    for (let i = 0; i < mediasCount; i++) {
      medias.push(
        faker.image.urlPicsumPhotos({ width: 720, height: 960, blur: 1 })
      );
    }
    return medias;
  }),
});
