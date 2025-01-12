import { Router } from 'express';
import config from '../config';
import * as postController from '../controllers/post.controller';
import { postValidator } from '../schema/post.schema';
import { attachUser, isGranted } from './middlewares/requireAuth';

const postRouter = Router();

postRouter.get('/', attachUser, postController.getAll);

postRouter.get(
  `/:id(${config.APP_ID_VALIDATOR})`,
  attachUser,
  postController.getItem
);

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

postRouter.patch(
  `/:id(${config.APP_ID_VALIDATOR})/like`,
  isGranted(),
  postController.like
);

postRouter.delete(
  `/:id(${config.APP_ID_VALIDATOR})`,
  isGranted(),
  postController.remove
);

export default postRouter;
