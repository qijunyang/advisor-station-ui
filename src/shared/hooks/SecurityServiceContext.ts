import { createContext } from 'react';
import type { SecurityService } from '../../services/securities/SecurityService';

export const SecurityServiceContext = createContext<SecurityService | null>(null);
