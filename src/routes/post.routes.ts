import { Router } from 'express';
import config from '../config';
import * as postController from '../controllers/post.controller';
import { postValidator } from '../schema/post.schema';
import { isGranted } from './middlewares/requireAuth';

const postRouter = Router();

postRouter.get('/', postController.getAll);

postRouter.get(`/:id(${config.APP_ID_VALIDATOR})`, postController.getItem);

postRouter.post(
  '/',
  isGranted(),
  postValidator.validateCreate,
  postController.create
);

postRouter.patch(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(),
  postValidator.validateUpdate,
  postController.update
);

postRouter.delete(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(),
  postController.remove
);

export default postRouter;
