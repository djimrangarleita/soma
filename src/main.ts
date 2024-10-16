import { initializeRedisClient } from './common/redisClient';
import startServer from './server';

const app = initializeRedisClient().then(() => startServer());

export default app;
