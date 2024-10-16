import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { userValidator } from '../schema/user.schema';
import { isGranted } from './middlewares/requireAuth';

const userRouter = Router();

userRouter.get('/', isGranted('ADMIN'), userController.getAll);

userRouter.post('/', userValidator.validateCreate, userController.register);

userRouter.post(
  '/login',
  userValidator.validateCredentials,
  userController.login
);

userRouter.get('/me', isGranted(), userController.getProfile);

userRouter.patch('/:id', userValidator.validateUpdate, userController.update);

userRouter.delete('/:id', userController.remove);

export default userRouter;
