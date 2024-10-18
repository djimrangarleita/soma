import { Router } from 'express';
import postRouter from './post.routes';
import userRouter from './user.routes';

const appRouter = Router();

appRouter.use('/users', userRouter);

appRouter.use('/posts', postRouter);

export default appRouter;
