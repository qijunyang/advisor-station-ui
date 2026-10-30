import { expect, test } from '@playwright/test';

test('loads the demo foundation and preserves its content after refresh', async ({ page }) => {
  await page.goto('/');

  const main = page.getByRole('main');
  await expect(page).toHaveTitle('Advisor Station UI');
  await expect(main.getByRole('heading', { level: 1, name: 'Advisor Station UI' })).toBeVisible();
  await expect(main.getByText('A fictional demo foundation for a financial advisor workspace.')).toBeVisible();

  await page.reload();

  await expect(main.getByRole('heading', { level: 1, name: 'Advisor Station UI' })).toBeVisible();
  await expect(main.getByText('A fictional demo foundation for a financial advisor workspace.')).toBeVisible();
});
