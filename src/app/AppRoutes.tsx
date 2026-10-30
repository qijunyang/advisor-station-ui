import { Link, Navigate, Route, Routes } from 'react-router';
import { LoginPage } from '../features/auth/components/LoginPage';
import { SessionGuard } from '../features/auth/components/SessionGuard';
import { Dashboard } from '../features/workspace/Dashboard';
import { WorkspaceLayout } from '../features/workspace/WorkspaceLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<SessionGuard />}>
        <Route path="/" element={<Navigate to="/workspace" replace />} />
        <Route element={<WorkspaceLayout />}>
          <Route path="/workspace" element={<Dashboard />} />
          <Route path="*" element={
            <>
              <h1>Page not found</h1>
              <p>This page is not available.</p>
              <Link to="/workspace">Return to Dashboard</Link>
            </>
          } />
        </Route>
      </Route>
    </Routes>
  );
}
