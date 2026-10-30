import { Navigate, Outlet } from 'react-router';
import { useSession } from '../SessionContext';

export function SessionGuard() {
  const { session, error, retry } = useSession();
  if (session) return <Outlet />;
  if (error) {
    return (
      <main className="login-page">
        <h1>Session unavailable</h1>
        <p role="alert">{error}</p>
        <button onClick={retry}>Try again</button>
      </main>
    );
  }
  return <Navigate to="/login" replace />;
}
