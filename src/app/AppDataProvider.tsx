import { useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MockSecurityService } from '../services/securities/MockSecurityService';
import type { SecurityService } from '../services/securities/SecurityService';
import { SecurityServiceContext } from '../shared/hooks/SecurityServiceContext';

const defaultSecurityService = new MockSecurityService();

export function AppDataProvider({ children, securityService = defaultSecurityService }: {
  children: ReactNode;
  securityService?: SecurityService;
}) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <SecurityServiceContext.Provider value={securityService}>
        {children}
      </SecurityServiceContext.Provider>
    </QueryClientProvider>
  );
}
