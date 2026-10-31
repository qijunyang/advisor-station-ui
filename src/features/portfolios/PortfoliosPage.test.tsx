import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { PortfoliosPage } from './PortfoliosPage';

test('shows broker-copy preview rows and columns without selection or mutation actions', () => {
  render(<PortfoliosPage />);
  expect(screen.getByRole('heading', { name: 'Portfolios', level: 1 })).toBeVisible();
  expect(screen.getByText('Layout preview · Fictional sample data')).toBeVisible();
  const table = screen.getByRole('table', { name: /Broker portfolio copies/ });
  expect(within(table).getAllByRole('row')).toHaveLength(11);
  for (const name of ['Portfolio name', 'Broker', 'Last synced (sample)', 'Source']) {
    expect(within(table).getByRole('columnheader', { name })).toBeVisible();
  }
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  expect(screen.getByText('10 portfolios')).toBeVisible();
  expect(screen.getByText(/Broker import and synchronization are not connected/)).toBeVisible();
});

test('renders an empty portfolio state without mutation controls', () => {
  render(<PortfoliosPage rows={[]} />);
  expect(screen.getByText('No portfolios to display.')).toBeVisible();
  expect(screen.getByText('0 portfolios')).toBeVisible();
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
});
