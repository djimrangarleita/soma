import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { userValidator } from '../schema/user.schema';

const userRouter = Router();

userRouter.get('/', userController.getAll);

userRouter.post('/', userValidator.validateCreate, userController.register);

userRouter.post(
  '/login',
  userValidator.validateCredentials,
  userController.login
);

userRouter.get('/me', userController.getProfile);

userRouter.patch('/:id', userValidator.validateUpdate, userController.update);

userRouter.delete('/:id', userController.remove);

export default userRouter;
