import { useState } from 'react';
import { Navigate } from 'react-router';
import { authDirectory } from '../authDirectory';
import { useSession } from '../SessionContext';

export function LoginPage() {
  const { session, error, login, retry } = useSession();
  const [selectedFirmId, setSelectedFirmId] = useState('');
  const firm = authDirectory.find((item) => item.id === selectedFirmId);

  if (session) return <Navigate to="/workspace" replace />;

  return (
    <main className="login-page">
      <p className="eyebrow">ADVISOR STATION</p>
      <h1>Advisor Station UI</h1>
      <p className="intro">Explore a fictional advisor workspace. Choose a firm and an advisor to enter the demo. No password required.</p>
      {error && <div className="error" role="alert">{error} <button onClick={retry}>Try again</button></div>}
      <section aria-labelledby="firms-heading">
        <h2 id="firms-heading">Choose a firm</h2>
        <div className="firm-options">
          {authDirectory.map((item) => (
            <button className="firm-option" key={item.id} aria-pressed={selectedFirmId === item.id} onClick={() => setSelectedFirmId(item.id)}>
              <span className="firm-mark" aria-hidden="true">{item.name.charAt(0)}</span>
              <span>{item.name}<small>3 demo advisors</small></span>
            </button>
          ))}
        </div>
      </section>
      {firm && (
        <section aria-labelledby="advisors-heading">
          <h2 id="advisors-heading">Choose an advisor at {firm.name}</h2>
          <div className="advisor-options">
            {firm.advisors.map((advisor) => (
              <button key={advisor.id} className="advisor-option" onClick={() => login(firm.id, advisor.id)}>
                {advisor.name}<span aria-hidden="true"> →</span>
              </button>
            ))}
          </div>
        </section>
      )}
      <p className="demo-note">Demo only · All firms and advisors are fictional. Tabs in this browser share your selection.</p>
    </main>
  );
}
