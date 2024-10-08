import { Request, Response } from 'express-serve-static-core';
import startServer from './server';

const app = startServer();

// const prisma = new PrismaClient();

app.use('/status', (req: Request, res: Response) => {
  res.send({ status: 200, message: 'ok' });
});

// app.post('/users', async () => {
//   const user = await prisma.user.create({
//     data: {
//       name: 'Djimra NGARLEITA',
//       email: 'dngarleita@gmail.com',
//     },
//   });

//   console.log(user);
// });
