import { initializeRedisClient } from './common/redisClient';
import config from './config';
import startServer from './server';

console.log(`Starting with ${JSON.stringify(config, null, 2)}`);

const app = initializeRedisClient().then(() => startServer());

export default app;
