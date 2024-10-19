import { UserEntityPublic } from '../../src/schema/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntityPublic;
    }
  }
}
