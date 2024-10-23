import cors from 'cors';
import express from 'express';
import {
  Express,
  NextFunction,
  Request,
  Response,
} from 'express-serve-static-core';
import path from 'path';
import config from './config';
import appRouter from './routes';
import handleErrors, {
  handleNotFound,
} from './routes/middlewares/errorHandler';

export default function startServer(appPort?: string): Express {
  const app: Express = express();

  app.use(cors());

  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.baseUrl}  ${req.body}`);
    next();
  });

  app.use(express.json());

  app.use('/api/media', express.static(path.join(__dirname, '..', 'media')));

  app.use('/api', appRouter);

  app.use(handleNotFound);

  app.use(handleErrors);

  app.listen(appPort || config.APP_PORT, () => {
    console.log(`Server running on port ${appPort || config.APP_PORT}...`);
  });

  return app;
}
