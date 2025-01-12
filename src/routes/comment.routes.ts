import { Router } from 'express';
import config from '../config';
import * as commentController from '../controllers/comment.controller';
import { postCommentValidator } from '../schema/comment.schema';
import { attachUser, isGranted } from './middlewares/requireAuth';

const commentRouter = Router();

commentRouter.get(
  `/:id(${config.APP_ID_VALIDATOR})`, // post id
  attachUser,
  commentController.getAll
);

commentRouter.post(
  `/:id(${config.APP_ID_VALIDATOR})`, // post id
  isGranted(),
  postCommentValidator.validateCreate,
  commentController.create
);

commentRouter.patch(
  `/:id(${config.APP_ID_VALIDATOR})/like`, // comment id
  isGranted(),
  commentController.like
);

export default commentRouter;
