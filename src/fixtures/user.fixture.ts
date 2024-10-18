import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';
import { authentication, random } from "../lib/auth";
import { UserEntity } from "../schema/user.schema";

const uFactory = Factory.Sync.makeFactory<Omit<UserEntity, 'salt'> & Required<Pick<UserEntity, 'salt'>>>({
  id: Factory.each(() => faker.string.uuid()),
  name: Factory.each(() => faker.person.fullName()),
  email: Factory.each(() => faker.internet.email()),
  phoneNumber: Factory.each(() => faker.phone.number()),
  salt: Factory.each(() => random()),
  password: 'password',
});

const userFactory = uFactory.withDerivation(
  'password',
  (user) => authentication(user.salt, 'password')
);

export default userFactory;