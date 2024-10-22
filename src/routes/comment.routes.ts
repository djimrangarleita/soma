import { Router } from 'express';
import config from '../config';
import * as commentController from '../controllers/commentController';
import { postCommentValidator } from '../schema/comment.schema';
import { isGranted } from './middlewares/requireAuth';

const commentRouter = Router();

commentRouter.post(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(),
  postCommentValidator.validateCreate,
  commentController.create
);

export default commentRouter;
