import startServer from './server';

const app = startServer();

export default app;

// const prisma = new PrismaClient({ log: ['query'] });

// app.use('/status', (req: Request, res: Response) => {
//   res.send({ status: 200, message: 'ok' });
// });

// app.post('/users', async (req: Request, res: Response) => {
//   const user = await prisma.user.create({
//     data: {
//       name: 'Djimra NGARLEITA',
//       email: 'dngaleita@gmail.com',
//     },
//   });

//   res.send(user);
// });
