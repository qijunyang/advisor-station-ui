import { BrowserRouter } from 'react-router';
import { AppRoutes } from './app/AppRoutes';
import { SessionProvider } from './features/auth/SessionProvider';
import { AppDataProvider } from './app/AppDataProvider';

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <SessionProvider>
          <AppRoutes />
        </SessionProvider>
      </BrowserRouter>
    </AppDataProvider>
  );
}
