export interface ModelPreviewRow {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
}

export const previewModels: readonly ModelPreviewRow[] = [
  { id: 'preview-model-1', name: 'Balanced Research', createdAt: '2026-10-01', updatedAt: '2026-10-29', updatedBy: 'Demo advisor' },
  { id: 'preview-model-2', name: 'Long-Term Growth', createdAt: '2026-10-02', updatedAt: '2026-10-28', updatedBy: 'Demo advisor' },
  { id: 'preview-model-3', name: 'Income Research', createdAt: '2026-10-03', updatedAt: '2026-10-27', updatedBy: 'Demo advisor' },
  { id: 'preview-model-4', name: 'Core Equity', createdAt: '2026-10-04', updatedAt: '2026-10-26', updatedBy: 'Demo advisor' },
  { id: 'preview-model-5', name: 'Defensive Ideas', createdAt: '2026-10-05', updatedAt: '2026-10-25', updatedBy: 'Demo advisor' },
  { id: 'preview-model-6', name: 'Global Opportunities', createdAt: '2026-10-06', updatedAt: '2026-10-24', updatedBy: 'Demo advisor' },
  { id: 'preview-model-7', name: 'Dividend Research', createdAt: '2026-10-07', updatedAt: '2026-10-23', updatedBy: 'Demo advisor' },
  { id: 'preview-model-8', name: 'Quality Companies', createdAt: '2026-10-08', updatedAt: '2026-10-22', updatedBy: 'Demo advisor' },
  { id: 'preview-model-9', name: 'Small-Cap Ideas', createdAt: '2026-10-09', updatedAt: '2026-10-21', updatedBy: 'Demo advisor' },
  { id: 'preview-model-10', name: 'Fixed Income Research', createdAt: '2026-10-10', updatedAt: '2026-10-20', updatedBy: 'Demo advisor' },
  { id: 'preview-model-11', name: 'Diversified Research', createdAt: '2026-10-11', updatedAt: '2026-10-19', updatedBy: 'Demo advisor' },
  { id: 'preview-model-12', name: 'Alternative Ideas', createdAt: '2026-10-12', updatedAt: '2026-10-18', updatedBy: 'Demo advisor' },
];
