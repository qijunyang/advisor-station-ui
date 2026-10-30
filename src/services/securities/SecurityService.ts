import type { Security } from './types';

export interface SecurityService {
  getSecurities(): Promise<readonly Security[]>;
}
