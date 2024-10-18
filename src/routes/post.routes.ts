import { Request, Response, Router } from 'express';
import { postValidator } from '../schema/post.schema';

const postRouter = Router();

postRouter.get('/', (req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

postRouter.get('/:id', (req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

postRouter.post(
  '/',
  postValidator.validateCreate,
  (req: Request, res: Response) => {
    res.status(201).send({ data: req.body });
  }
);

postRouter.patch(
  '/:id',
  postValidator.validateUpdate,
  (req: Request, res: Response) => {
    res.status(200).send({ data: req.body });
  }
);

postRouter.delete('/:id', (req: Request, res: Response) => {
  res.status(204).send({ status: 'ok' });
});

export default postRouter;
