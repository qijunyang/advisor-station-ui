import type { Firm } from './types';

export const authDirectory: readonly Firm[] = [
  {
    id: 'northstar', name: 'Northstar Advisory',
    advisors: [
      { id: 'northstar-emma', name: 'Emma Parker' },
      { id: 'northstar-liam', name: 'Liam Bennett' },
      { id: 'northstar-olivia', name: 'Olivia Hayes' },
    ],
  },
  {
    id: 'harborview', name: 'Harborview Wealth',
    advisors: [
      { id: 'harborview-noah', name: 'Noah Brooks' },
      { id: 'harborview-ava', name: 'Ava Collins' },
      { id: 'harborview-ethan', name: 'Ethan Reed' },
    ],
  },
];
