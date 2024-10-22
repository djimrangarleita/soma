import { Router } from 'express';
import commentRouter from './comment.routes';
import fileRouter from './file.routes';
import postRouter from './post.routes';
import userRouter from './user.routes';

const appRouter = Router();

appRouter.use('/users', userRouter);

appRouter.use('/posts', postRouter);

appRouter.use('/upload', fileRouter);

appRouter.use(`/comment`, commentRouter);

export default appRouter;
