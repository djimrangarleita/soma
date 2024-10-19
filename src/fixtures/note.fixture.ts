import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import { NoteEntity, NoteTypeV } from '../schema/note.schema';

type Notes = Omit<NoteEntity, 'isPublic'> & { isPublic: boolean };

export const noteFactory = Factory.Sync.makeFactory<Notes>({
  id: Factory.each(() => faker.string.uuid()),
  text: Factory.each(() => faker.lorem.sentence({ min: 3, max: 5 })),
  bookId: 'bookid',
  type: Factory.each(() => faker.helpers.objectValue(NoteTypeV)),
  userId: 'user-id',
  isPublic: Factory.each(() => faker.datatype.boolean()),
  reference: 'reference-of',
});
