import { PrismaClient } from '@prisma/client';

const dbClient = new PrismaClient({ log: ['query'] });

export default dbClient;
