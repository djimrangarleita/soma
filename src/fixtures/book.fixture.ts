import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import getRandomNum from '../lib/getRandomNum';
import { BookEntity } from '../schema/book.schema';

export const bookFactory = Factory.Sync.makeFactory<BookEntity>({
  id: Factory.each(() => faker.string.uuid()),
  title: Factory.each(() => faker.company.catchPhrase()),
  subtitle: Factory.each(() => faker.lorem.words({ min: 3, max: 7 })),
  authors: Factory.each(() => {
    const names = [];
    const authorsCount = getRandomNum(4);
    for (let i = 0; i < authorsCount; i++) {
      names.push(faker.person.fullName());
    }
    return names;
  }),
  pageCount: Factory.each(() => faker.number.int({ min: 20, max: 700 })),
  language: Factory.each(() => faker.location.county()),
  cover: Factory.each(() => faker.image.url({ width: 720, height: 960 })),
  editors: Factory.each(() => {
    const names = [];
    const editorsCount = getRandomNum(4);
    for (let i = 0; i < editorsCount; i++) {
      names.push(faker.company.name());
    }
    return names;
  }),
  summary: Factory.each(() => faker.lorem.text()),
  isbn: Factory.each(() => faker.commerce.isbn()),
  tags: Factory.each(() => {
    const tags = [];
    const tagsCount = getRandomNum(3);
    for (let i = 0; i < tagsCount; i++) {
      tags.push(faker.company.catchPhraseNoun());
    }
    return tags;
  }), //
});
