import { AuthenticatedUser } from '../../src/apps/user/types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
