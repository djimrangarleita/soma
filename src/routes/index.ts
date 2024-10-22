import { Router } from 'express';
import fileRouter from './file.routes';
import postRouter from './post.routes';
import userRouter from './user.routes';

const appRouter = Router();

appRouter.use('/users', userRouter);

appRouter.use('/posts', postRouter);

appRouter.use('/upload', fileRouter);

export default appRouter;
