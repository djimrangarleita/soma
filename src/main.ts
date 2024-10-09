// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express-serve-static-core';
import startServer from './server';

const app = startServer();

const prisma = new PrismaClient();

app.use('/status', (req: Request, res: Response) => {
  res.send({ status: 200, message: 'ok' });
});

app.post('/users', async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      name: 'Djimra NGARLEITA',
      email: 'dngaleita@gmail.com',
    },
  });

  res.send(user);
});
