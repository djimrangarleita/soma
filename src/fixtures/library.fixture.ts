import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import { LibraryEntity, Shelf } from '../schema/library.schema';

type LibEntity = Omit<LibraryEntity, 'status'> &
  Required<Pick<LibraryEntity, 'status'>>;

export const libraryFactory = Factory.Sync.makeFactory<LibEntity>({
  id: Factory.each(() => faker.string.uuid()),
  userId: 'user-new',
  bookId: 'book-new',
  shelf: Factory.each(() => faker.helpers.objectValue(Shelf)),
  readingCompletionDate: Factory.each(() => faker.date.past()),
  rating: Factory.each(() => faker.number.int({ max: 5, min: 1 })),
  status: Factory.each(() => faker.lorem.word()),
});
