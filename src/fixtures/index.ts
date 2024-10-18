import dbClient from '../common/dbClient';
import config from '../config';
import { authentication, random } from '../lib/auth';
import userFactory from './user.fixture';


async function main() {
  const users = userFactory.buildList(10);

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
    ]
  });
}

main().then(() => {
  console.info('Users created');
}).catch(error => {
  console.error(error);
});
