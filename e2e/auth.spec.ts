import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const key = 'advisor-station.auth.v1';
const sample = { version: 1, firmId: 'northstar', advisorId: 'northstar-emma', sessionId: 'b7a472b1-0102-4345-8678-123456789abc' };

async function login(page: Page, firm = 'Northstar Advisory', advisor = 'Emma Parker') {
  await page.goto('/login');
  await page.getByRole('button', { name: new RegExp(firm) }).click();
  await page.getByRole('button', { name: advisor, exact: true }).click();
  await expect(page).toHaveURL(/\/workspace$/);
  await expect(page.getByRole('banner').getByText(advisor, { exact: true })).toBeVisible();
}

async function storedSession(page: Page) {
  return page.evaluate((storageKey) => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as { firmId: string; advisorId: string; sessionId: string } : null;
  }, key);
}

test('guards direct workspace and unknown URLs', async ({ page }) => {
  for (const path of ['/workspace', '/workspace/missing', '/unknown']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('navigation')).toHaveCount(0);
  }
});

test('offers exactly three advisors for each firm and opens the three-region workspace', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /Northstar Advisory/ }).click();
  const advisorList = page.getByRole('region', { name: /Choose an advisor/ });
  await expect(advisorList.getByRole('button')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Emma Parker', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Harborview Wealth/ }).click();
  await expect(page.getByRole('button', { name: 'Emma Parker', exact: true })).toHaveCount(0);
  await expect(advisorList.getByRole('button')).toHaveCount(3);
  await page.getByRole('button', { name: 'Noah Brooks', exact: true }).click();
  await expect(page).toHaveURL(/\/workspace$/);
  await expect(page.getByRole('banner').getByText('Noah Brooks', { exact: true })).toBeVisible();
  await expect(page.getByRole('banner').getByText('Harborview Wealth')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Workspace navigation' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await expect(page.getByRole('main').getByText('Your dashboard is ready.', { exact: false })).toBeVisible();
});

test('supports keyboard selection and a usable narrow workspace', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByRole('button', { name: /Northstar Advisory/ }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Emma Parker', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/workspace$/);
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('preserves ID across refresh, entry/login redirects, and another tab', async ({ page, context }) => {
  await login(page);
  const first = await storedSession(page);
  expect(first?.sessionId).toMatch(/^[0-9a-f-]{36}$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  expect(await storedSession(page)).toEqual(first);
  for (const path of ['/login', '/']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/workspace$/);
  }
  const secondTab = await context.newPage();
  await secondTab.goto('/workspace');
  await expect(secondTab.getByRole('banner').getByText('Emma Parker')).toBeVisible();
  expect(await storedSession(secondTab)).toEqual(first);
});

test('synchronizes login and logout across tabs, blocks history, and creates a fresh ID', async ({ page, context }) => {
  const other = await context.newPage();
  await other.goto('/login');
  await login(page);
  await expect(other).toHaveURL(/\/workspace$/);
  const first = await storedSession(page);
  await other.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(other).toHaveURL(/\/login$/);
  expect(await storedSession(page)).toBeNull();
  await page.goBack();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await login(page, 'Harborview Wealth', 'Noah Brooks');
  await expect(other.getByRole('banner').getByText('Noah Brooks')).toBeVisible();
  expect((await storedSession(page))?.sessionId).not.toBe(first?.sessionId);
});

test('adopts an externally replaced or cleared shared session in all tabs', async ({ page, context }) => {
  await login(page);
  const other = await context.newPage();
  await other.goto('/workspace');
  await other.evaluate(({ storageKey, replacement }) => localStorage.setItem(storageKey, JSON.stringify(replacement)), {
    storageKey: key,
    replacement: { ...sample, firmId: 'harborview', advisorId: 'harborview-ava' },
  });
  await expect(page.getByRole('banner').getByText('Ava Collins')).toBeVisible();
  await other.evaluate(() => localStorage.clear());
  await expect(page).toHaveURL(/\/login$/);
});

test('isolates session IDs for the same advisor in separate browser contexts', async ({ browser, page }) => {
  await login(page);
  const independent = await browser.newContext();
  try {
    const other = await independent.newPage();
    await login(other);
    const first = await storedSession(page);
    const second = await storedSession(other);
    expect(first?.advisorId).toBe(second?.advisorId);
    expect(first?.firmId).toBe(second?.firmId);
    expect(first?.sessionId).not.toBe(second?.sessionId);
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(other.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  } finally {
    await independent.close();
  }
});

for (const [name, raw] of [
  ['invalid JSON', '{broken'], ['missing fields', '{}'],
  ['unsupported version', JSON.stringify({ ...sample, version: 2 })],
  ['unknown firm', JSON.stringify({ ...sample, firmId: 'unknown' })],
  ['unknown advisor', JSON.stringify({ ...sample, advisorId: 'unknown' })],
  ['cross-firm advisor', JSON.stringify({ ...sample, advisorId: 'harborview-noah' })],
  ['invalid ID', JSON.stringify({ ...sample, sessionId: 'invalid' })],
] as const) {
  test(`rejects ${name} and preserves unrelated storage`, async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(({ storageKey, value }) => {
      localStorage.setItem(storageKey, value);
      localStorage.setItem('unrelated-demo-test', 'keep');
    }, { storageKey: key, value: raw });
    await page.goto('/workspace');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('navigation')).toHaveCount(0);
    await page.getByRole('button', { name: /Northstar Advisory/ }).click();
    await page.getByRole('button', { name: 'Emma Parker', exact: true }).click();
    await expect(page).toHaveURL(/\/workspace$/);
    await page.getByRole('button', { name: 'Logout' }).click();
    expect(await page.evaluate(() => localStorage.getItem('unrelated-demo-test'))).toBe('keep');
  });
}

test('offers not-found recovery inside the workspace', async ({ page }) => {
  await login(page);
  await page.goto('/workspace/missing');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await page.getByRole('link', { name: 'Return to Dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
});
