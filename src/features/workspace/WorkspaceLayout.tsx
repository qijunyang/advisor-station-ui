import { NavLink, Outlet } from 'react-router';
import { useSession } from '../auth/SessionContext';
import { findAdvisor } from '../auth/sessionValidation';

export function WorkspaceLayout() {
  const { session, error, logout } = useSession();
  const selection = session && findAdvisor(session.firmId, session.advisorId);
  if (!selection) return null;

  return (
    <div className="workspace">
      <header className="action-bar">
        <div className="brand">Advisor Station <span className="demo-badge">DEMO</span></div>
        <div className="advisor-context">
          <span>{selection.firm.name}</span>
          <strong>{selection.advisor.name}</strong>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <nav className="side-nav" aria-label="Workspace navigation">
        <span className="nav-label">WORKSPACE</span>
        <NavLink to="/workspace" end>Dashboard</NavLink>
      </nav>
      <main className="work-area" id="workspace-content">
        {error && <div className="error" role="alert">{error}</div>}
        <Outlet />
      </main>
    </div>
  );
}
