import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /Northstar Advisory/ }).click();
  await page.getByRole('button', { name: 'Emma Parker', exact: true }).click();
  await expect(page).toHaveURL(/\/workspace$/);
});

test('navigates the collections, supports selection, and keeps portfolios read-only', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Workspace navigation' });
  await expect(nav.getByRole('link')).toHaveText(['Dashboard', 'Models', 'Portfolios']);
  await nav.getByRole('link', { name: 'Models', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Models', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeEnabled();
  await page.getByRole('checkbox', { name: 'Select Balanced Research', exact: true }).check();
  await expect(page.getByRole('status')).toHaveText('1 of 12 selected');
  expect(await page.getByRole('checkbox', { name: 'Select all models' }).evaluate((element) => (element as HTMLInputElement).indeterminate)).toBe(true);
  await expect(page.getByRole('button', { name: 'Delete selected' })).toBeEnabled();
  await page.getByRole('checkbox', { name: 'Select all models' }).check();
  await expect(page.getByRole('status')).toHaveText('12 of 12 selected');
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await expect(page.getByRole('status')).toHaveText('0 of 12 selected');
  await nav.getByRole('link', { name: 'Portfolios', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Portfolios', exact: true })).toBeVisible();
  await expect(page.getByRole('checkbox')).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('button')).toHaveCount(0);
  await expect(page.getByText(/Broker import and synchronization are not connected/)).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 of 12 selected');
});

test('supports deep links and refresh and resets transient selection', async ({ page }) => {
  await page.goto('/workspace/models');
  await page.getByRole('checkbox', { name: 'Select Balanced Research', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('status')).toHaveText('1 of 12 selected');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 of 12 selected');
  await page.goto('/workspace/portfolios');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Portfolios', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('resets selection on session replacement and guards collection routes after logout', async ({ page, context }) => {
  await page.goto('/workspace/models');
  await page.getByRole('checkbox', { name: 'Select Balanced Research', exact: true }).check();
  const other = await context.newPage();
  await other.goto('/workspace');
  await other.evaluate(() => localStorage.setItem('advisor-station.auth.v1', JSON.stringify({
    version: 1, firmId: 'harborview', advisorId: 'harborview-noah', sessionId: crypto.randomUUID(),
  })));
  await expect(page.getByRole('banner').getByText('Noah Brooks')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 of 12 selected');
  await page.getByRole('button', { name: 'Logout' }).click();
  for (const path of ['/workspace/models', '/workspace/portfolios']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('table')).toHaveCount(0);
  }
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  for (const collection of ['Models', 'Portfolios']) {
    test(`${collection} contains table scrolling at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.getByRole('link', { name: collection, exact: true }).click();
      const region = page.getByRole('region', { name: `${collection} table`, exact: true });
      const title = page.getByRole('heading', { name: collection, exact: true });
      const titleBefore = await title.boundingBox();
      expect(await region.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await region.focus();
      await page.keyboard.press('PageDown');
      await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      expect((await title.boundingBox())?.y).toBe(titleBefore?.y);
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();
      if (collection === 'Models') await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
      await region.evaluate((element) => { element.scrollTop = 0; });
      await page.screenshot({ path: testInfo.outputPath(`${collection.toLowerCase()}-${viewport.width}.png`), fullPage: true });
    });
  }
}
