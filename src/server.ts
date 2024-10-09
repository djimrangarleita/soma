import express from 'express';
import { Express } from 'express-serve-static-core';
import config from './config';

export default function startServer(appPort?: string): Express {
  const app: Express = express();

  app.listen(appPort || config.APP_PORT, () => {
    console.log(`Server running on port ${appPort || config.APP_PORT}...`);
  });

  return app;
}
