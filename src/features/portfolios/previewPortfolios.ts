export interface PortfolioPreviewRow {
  readonly id: string;
  readonly name: string;
  readonly broker: string;
  readonly lastSyncedAt: string;
}

export const previewPortfolios: readonly PortfolioPreviewRow[] = [
  { id: 'preview-portfolio-1', name: 'Long-Term Account', broker: 'Cedar Demo Brokerage', lastSyncedAt: '2026-10-29' },
  { id: 'preview-portfolio-2', name: 'Retirement Account', broker: 'Cedar Demo Brokerage', lastSyncedAt: '2026-10-29' },
  { id: 'preview-portfolio-3', name: 'Income Account', broker: 'Summit Demo Securities', lastSyncedAt: '2026-10-28' },
  { id: 'preview-portfolio-4', name: 'Family Account', broker: 'Summit Demo Securities', lastSyncedAt: '2026-10-28' },
  { id: 'preview-portfolio-5', name: 'Education Account', broker: 'Cedar Demo Brokerage', lastSyncedAt: '2026-10-27' },
  { id: 'preview-portfolio-6', name: 'Core Investments', broker: 'Meadow Demo Brokerage', lastSyncedAt: '2026-10-27' },
  { id: 'preview-portfolio-7', name: 'Growth Account', broker: 'Meadow Demo Brokerage', lastSyncedAt: '2026-10-26' },
  { id: 'preview-portfolio-8', name: 'Reserve Account', broker: 'Summit Demo Securities', lastSyncedAt: '2026-10-26' },
  { id: 'preview-portfolio-9', name: 'Diversified Account', broker: 'Cedar Demo Brokerage', lastSyncedAt: '2026-10-25' },
  { id: 'preview-portfolio-10', name: 'Legacy Account', broker: 'Meadow Demo Brokerage', lastSyncedAt: '2026-10-25' },
];
