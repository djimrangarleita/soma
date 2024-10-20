import cors from 'cors';
import express from 'express';
import { Express } from 'express-serve-static-core';
import config from './config';
import appRouter from './routes';
import handleErrors, {
  handleNotFound,
} from './routes/middlewares/errorHandler';

export default function startServer(appPort?: string): Express {
  const app: Express = express();

  app.use(cors({ origin: config.APP_CLIENT_ORIGIN, credentials: true }));

  app.use(express.json());

  app.use('/api', appRouter);

  app.use(handleNotFound);

  app.use(handleErrors);

  app.listen(appPort || config.APP_PORT, () => {
    console.log(`Server running on port ${appPort || config.APP_PORT}...`);
  });

  return app;
}
