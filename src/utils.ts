import { DEFAULT_EXPIRATION_TIME } from './constants';

export function now(): number {
  return Math.floor(Date.now() / DEFAULT_EXPIRATION_TIME);
}
