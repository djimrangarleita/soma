import { Request, Response } from 'express-serve-static-core';
import startServer from './server';

const app = startServer();

app.use('/status', (req: Request, res: Response) => {
  res.send({ status: 200, message: 'ok' });
});
