import dbClient from '../common/dbClient';
import config from '../config';
import { authentication, random } from '../lib/auth';
import { makeUserFixture } from './user.fixture';

async function main() {
  const {
    users,
    usersProfile,
    posts,
    comments,
    postLikes,
    commentLikes,
    books,
    libraries,
    notes,
  } = makeUserFixture(10);

  const usalt = random();

  await dbClient.user.createMany({
    data: [
      {
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        phoneNumber: config.ADMIN_PHONE_NUMBER,
        salt: usalt,
        password: authentication(usalt, config.ADMIN_PASSWORD),
        role: 'ADMIN',
        accountStatus: 'ACTIVATED',
      },
      ...users,
    ],
  });

  await dbClient.profile.createMany({
    data: usersProfile,
  });

  await dbClient.book.createMany({
    data: books,
  });

  await dbClient.post.createMany({
    data: posts,
  });

  await dbClient.postLike.createMany({
    data: postLikes,
  });

  await dbClient.comment.createMany({
    data: comments,
  });

  await dbClient.commentLike.createMany({
    data: commentLikes,
  });

  await dbClient.library.createMany({
    data: libraries,
  });

  await dbClient.note.createMany({
    data: notes,
  });
}

main()
  .then(() => {
    console.info('Fixtures generated');
  })
  .catch(error => {
    console.error(error);
  });
