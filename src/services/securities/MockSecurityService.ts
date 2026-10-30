import { securities } from '../../mocks/securities';
import type { SecurityService } from './SecurityService';
import type { Security } from './types';

export class MockSecurityService implements SecurityService {
  async getSecurities(): Promise<readonly Security[]> {
    return Object.freeze(securities.map((security) => Object.freeze({ ...security })));
  }
}
