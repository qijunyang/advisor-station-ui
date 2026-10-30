import { BrowserRouter } from 'react-router';
import { AppRoutes } from './app/AppRoutes';
import { SessionProvider } from './features/auth/SessionProvider';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
}
