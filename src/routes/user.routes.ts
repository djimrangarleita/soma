import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userController.getAll);

userRouter.post('/', userController.register);

userRouter.get('/me', userController.getProfile);

userRouter.patch('/:id', userController.update);

userRouter.delete('/:id', userController.remove);

export default userRouter;
