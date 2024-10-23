import dotenv from 'dotenv';

dotenv.config({
  path: ['.env.local', '.env.test.local', '.env.test', '.env'],
});

type Config = {
  APP_PORT: string;
  APP_SECRET: string;
  NODE_ENV: string;
  DB_URL: string;
  DB_USER: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  APP_CLIENT_ORIGIN: string;
  AUTH_TOKEN_TTL: number;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_PHONE_NUMBER: string;
  APP_ID_VALIDATOR: string;
  APP_SERVER: string;
};

const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_NAME: process.env.DB_NAME || 'move_forward',
  DB_USER: process.env.DB_USER || 'user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'default-password',
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/move_forward',
  APP_PORT: process.env.APP_PORT || '3000',
  APP_SECRET: process.env.APP_SECRET || 'secret-that-should-be-secret',
  APP_CLIENT_ORIGIN:
    (process.env.NODE_ENV === 'production'
      ? process.env.APP_CLIENT_ORIGIN_PROD
      : process.env.APP_CLIENT_ORIGIN_DEV) || 'http://localhost',
  AUTH_TOKEN_TTL: Number(process.env.AUTH_TOKEN_TTL) || 3600,
  ADMIN_NAME: process.env.ADMIN_NAME || 'Admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@soma.org',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'password',
  ADMIN_PHONE_NUMBER: process.env.ADMIN_PHONE_NUMBER || '1234',
  APP_ID_VALIDATOR: '[0-9a-fA-F-]+',
  get APP_SERVER() {
    return `http://localhost:${this.APP_PORT}/api`;
  },
};

export default config;
