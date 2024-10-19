import { Router } from 'express';
import config from '../config';
import * as userController from '../controllers/user.controller';
import { UserRole, userValidator } from '../schema/user.schema';
import { isGranted } from './middlewares/requireAuth';

const userRouter = Router();

userRouter.get('/', isGranted(UserRole.ADMIN), userController.getAll);

userRouter.post('/', userValidator.validateCreate, userController.register);

userRouter.post(
  '/login',
  userValidator.validateCredentials,
  userController.login
);

userRouter.get('/me', isGranted(), userController.getProfile);

userRouter.get(`/:id(${config.APP_ID_VALIDATOR})`, userController.getProfile);

userRouter.patch(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(),
  userValidator.validateUpdate,
  userController.update
);

userRouter.delete(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(UserRole.ADMIN),
  userController.remove
);

userRouter.delete('/', isGranted(), userController.remove);

export default userRouter;
