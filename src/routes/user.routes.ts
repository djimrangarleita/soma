import { Router } from 'express';
import config from '../config';
import * as userController from '../controllers/user.controller';
import { UserRole, userValidator } from '../schema/user.schema';
import { attachUser, isGranted } from './middlewares/requireAuth';

const userRouter = Router();

userRouter.get('/', attachUser, userController.getAll);

userRouter.post('/', userValidator.validateCreate, userController.register);

userRouter.post(
  '/login',
  userValidator.validateCredentials,
  userController.login
);

userRouter.get('/logout', userController.logout);

userRouter.get('/me', isGranted(), userController.getProfile);

userRouter.get(
  `/:id(${config.APP_ID_VALIDATOR})`,
  attachUser,
  userController.getProfile
);

userRouter.patch(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(),
  userValidator.validateUpdate,
  userController.update
);

userRouter.patch(
  `/:id(${config.APP_ID_VALIDATOR})/follow`,
  isGranted(),
  userController.follow
);

userRouter.delete(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(UserRole.ADMIN),
  userController.remove
);

userRouter.delete('/', isGranted(), userController.remove);

export default userRouter;
