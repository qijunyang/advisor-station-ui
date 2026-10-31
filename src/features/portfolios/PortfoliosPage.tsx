import { CollectionPage } from '../../shared/components/CollectionPage';
import { previewPortfolios } from './previewPortfolios';
import type { PortfolioPreviewRow } from './previewPortfolios';

export function PortfoliosPage({ rows = previewPortfolios }: { rows?: readonly PortfolioPreviewRow[] }) {
  return (
    <CollectionPage title="Portfolios" description="A read-only view of portfolios held at a brokerage."
      footer={<><span>{rows.length} portfolios</span><span>Sample snapshots only. Broker import and synchronization are not connected.</span></>}>
      <table className="collection-table">
        <caption className="visually-hidden">Broker portfolio copies — fictional layout preview</caption>
        <thead><tr><th scope="col">Portfolio name</th><th scope="col">Broker</th><th scope="col">Last synced (sample)</th><th scope="col">Source</th></tr></thead>
        <tbody>
          {rows.map((row) => <tr key={row.id}><th scope="row">{row.name}</th><td>{row.broker}</td><td><time dateTime={row.lastSyncedAt}>{row.lastSyncedAt}</time></td><td><span className="source-badge">Broker copy · Sample</span></td></tr>)}
          {rows.length === 0 && <tr><td colSpan={4} className="collection-empty">No portfolios to display.</td></tr>}
        </tbody>
      </table>
    </CollectionPage>
  );
}
