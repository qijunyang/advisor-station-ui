import { expect, test } from '@playwright/test';

test('opens demo login from the entry route and preserves it after refresh', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page).toHaveTitle('Advisor Station UI');
  await expect(page.getByRole('heading', { level: 1, name: 'Advisor Station UI' })).toBeVisible();
  await expect(page.getByText(/All firms and advisors are fictional/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Northstar Advisory/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Harborview Wealth/ })).toBeVisible();
});
