import { Router } from 'express';
import config from '../config';
import * as commentController from '../controllers/comment.controller';
import { postCommentValidator } from '../schema/comment.schema';
import { attachUser, isGranted } from './middlewares/requireAuth';

const commentRouter = Router();

commentRouter.get(
  `/:id(${config.APP_ID_VALIDATOR})`,
  attachUser,
  commentController.getAll
);

commentRouter.post(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(),
  postCommentValidator.validateCreate,
  commentController.create
);

commentRouter.patch(
  `/:id(${config.APP_ID_VALIDATOR})/like`,
  isGranted(),
  commentController.like
);

export default commentRouter;
