import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import dbClient from '../common/dbClient';
import { authentication, random } from '../lib/auth';
import { UserEntity } from '../schema/user.schema';

const userFactory = Factory.Sync.makeFactory<UserEntity>({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.number(),
  salt: random(),
  password: 'password',
});

async function main() {
  const user = userFactory.withDerivation('password', (user) => authentication(user.salt!, 'password')).build();

  console.log(`Generated id: ${user.id}`)

  const userEntity = await dbClient.user.create({
    data: { ...user, salt: user.salt!}
  });

  console.log(userEntity);
}

main().then(() => {
  console.log('User created');
}).catch(error => {
  console.error(error);
});
