import { createClient, RedisClientType } from 'redis';
import {
  AppRedisClientError,
  AppRedisClientInitializationError,
} from './appErrors';

let initialRedisClient: RedisClientType;

const redisClient: {
  redisClient?: RedisClient;
} = {};

export const initializeRedisClient = async () => {
  // TODO: Create and return a single instance of the class RedisClient instead
  if (!initialRedisClient) {
    initialRedisClient = createClient();

    initialRedisClient.on('error', error => {
      console.error(`Redis client error: ${error}`);
    });
    if (!initialRedisClient.isOpen) {
      await initialRedisClient.connect();
    }
    redisClient.redisClient = new RedisClient(initialRedisClient);
  }
  return initialRedisClient;
};

class RedisClient {
  private client: RedisClientType;

  constructor(initialClient: RedisClientType) {
    if (!initialClient) {
      throw new AppRedisClientInitializationError();
    }
    this.client = initialClient;
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key: string) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      const err = error as Error;
      throw new AppRedisClientError(err.message);
    }
  }

  async set(key: string, value: string | number, duration: number) {
    try {
      const response = await this.client.set(key, value, { EX: duration });
      return response;
    } catch (error) {
      const err = error as Error;
      throw new AppRedisClientError(err.message);
    }
  }

  async del(key: string) {
    try {
      const response = await this.client.del(key);
      return response;
    } catch (error) {
      const err = error as Error;
      throw new AppRedisClientError(err.message);
    }
  }
}

export default redisClient;
