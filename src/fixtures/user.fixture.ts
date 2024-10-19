import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import { authentication, random } from '../lib/auth';
import getRandomNum from '../lib/getRandomNum';
import { UserGenderType, UserProfileEntity } from '../schema/profile.schema';
import { UserEntity } from '../schema/user.schema';
import { bookFactory } from './book.fixture';
import { commentFactory } from './comment.fixture';
import { libraryFactory } from './library.fixture';
import { noteFactory } from './note.fixture';
import { postFactory } from './post.fixture';

const uFactory = Factory.Sync.makeFactory<
  Omit<UserEntity, 'salt'> & Required<Pick<UserEntity, 'salt'>>
>({
  id: Factory.each(() => faker.string.uuid()),
  name: Factory.each(() => faker.person.fullName()),
  email: Factory.each(() => faker.internet.email()),
  phoneNumber: Factory.each(() => faker.phone.number()),
  salt: Factory.each(() => random()),
  password: 'password',
  avatar: Factory.each(() => faker.image.avatar()),
});

const userFactory = uFactory.withDerivation('password', user =>
  authentication(user.salt, 'password')
);
type UserProfileEntityDb = Omit<
  UserProfileEntity,
  'favoriteGenres' | 'centerOfInterest'
> & { favoriteGenres: string[]; centerOfInterest: string[] };

export const profileFactory = Factory.Sync.makeFactory<UserProfileEntityDb>({
  id: Factory.each(() => faker.string.uuid()),
  gender: Factory.each(() => {
    const gen = faker.person.sexType();
    return `${gen.charAt(0).toUpperCase()}${gen.slice(1)}` as UserGenderType;
  }),
  birthday: Factory.each(() => faker.date.birthdate()),
  coverPicture: Factory.each(() =>
    faker.image.urlPicsumPhotos({ height: 396, width: 1584 })
  ),
  timeZone: Factory.each(() => faker.location.timeZone()),
  bio: Factory.each(() => faker.person.bio()),
  favoriteAuthor: Factory.each(() => faker.person.fullName()),
  favoriteBook: Factory.each(() => faker.lorem.words({ min: 2, max: 5 })),
  favoriteGenres: Factory.each(() => {
    const favorites = faker.lorem.words({ min: 1, max: 5 });
    return favorites.split(' ');
  }),
  centerOfInterest: Factory.each(() => {
    const favorites = faker.lorem.words({ min: 1, max: 5 });
    return favorites.split(' ');
  }),
  userId: 'def',
});

export const makeUserFixture = (userCount = 1) => {
  const posts = [];
  const usersProfile = [];
  const comments = [];
  const postLikes = [];
  const commentLikes = [];
  const libraries = [];
  const notes = [];
  const books = bookFactory.buildList(30);
  const booksId = books.map(book => book.id);
  const users = userFactory.buildList(userCount);
  const userIds = users.map(user => user.id);

  for (const user of users) {
    usersProfile.push(profileFactory.build({ userId: user.id }));

    const postCount = getRandomNum(10);
    for (let j = 0; j < postCount; j++) {
      const bookId = booksId[getRandomNum(30)];
      const post = postFactory.build({ userId: user.id, bookId });
      posts.push(post);

      const commentCount = getRandomNum(10);
      for (let k = 0; k < commentCount; k++) {
        const commenterId = userIds[getRandomNum(userIds.length)];
        const comment = commentFactory.build({
          userId: commenterId,
          postId: post.id,
        });
        comments.push(comment);
        const numOfCommentLikes = getRandomNum(userIds.length);
        for (let n = 0; n < numOfCommentLikes; n++) {
          const userId = userIds[n];
          const commentLike = { commentId: comment.id, userId };
          commentLikes.push(commentLike);
        }
      }
      const numOfLikes = getRandomNum(userIds.length);
      for (let m = 0; m < numOfLikes; m++) {
        const userId = userIds[m];
        const like = { postId: post.id, userId };
        postLikes.push(like);
      }
    }

    const libCount = getRandomNum(10);
    for (let i = 0; i < libCount; i++) {
      const library = libraryFactory.build({
        userId: user.id,
        bookId: booksId[i],
      });
      libraries.push(library);
    }

    const notesCount = getRandomNum(5);
    for (let h = 0; h < notesCount; h++) {
      const bookId = booksId[getRandomNum(30)];
      const bookTitle = books.find(book => book.id === bookId)?.title;
      const note = noteFactory.build({
        userId: user.id,
        bookId,
        reference: `${bookTitle}, page: ${notesCount}`,
      });
      notes.push(note);
    }
  }

  return {
    users,
    posts,
    usersProfile,
    comments,
    postLikes,
    commentLikes,
    books,
    libraries,
    notes,
  };
};

export default userFactory;
