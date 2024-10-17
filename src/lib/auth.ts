import crypto from 'crypto';
import config from '../config';

const SECRET: string = config.APP_SECRET;

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) =>
  crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(SECRET)
    .digest('hex');
