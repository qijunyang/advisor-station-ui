import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function action(page: Page, model: string, label: string) {
  await page.getByRole('button', { name: `Actions for ${model}`, exact: true }).click();
  await page.getByRole('menuitem', { name: label, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /Northstar Advisory/ }).click();
  await page.getByRole('button', { name: 'Emma Parker', exact: true }).click();
  await page.getByRole('link', { name: 'Models', exact: true }).click();
});

test('creates, views, edits, and cancels fresh drafts through the same reusable model dialog', async ({ page }) => {
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  const create = page.getByRole('dialog', { name: 'Create model', exact: true });
  await expect(create.getByRole('textbox', { name: 'Name', exact: true })).toBeFocused();
  await create.getByRole('button', { name: 'Create model', exact: true }).click();
  await expect(create.getByRole('alert')).toBeVisible();
  await create.getByRole('textbox', { name: 'Name', exact: true }).fill('  My research  ');
  await create.getByRole('textbox', { name: /Description/ }).fill('Research notes');
  await create.getByRole('button', { name: 'Create model', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('rowheader', { name: 'My research', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 of 13 selected');
  await action(page, 'My research', 'View');
  const view = page.getByRole('dialog', { name: 'View model', exact: true });
  await expect(view).toContainText('Research notes');
  await expect(view.getByRole('textbox')).toHaveCount(0);
  await expect(view.getByRole('button', { name: /Save/ })).toHaveCount(0);
  await view.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Actions for My research', exact: true })).toBeFocused();
  await action(page, 'My research', 'Edit');
  const edit = page.getByRole('dialog', { name: 'Edit model', exact: true });
  await expect(edit.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('My research');
  await edit.getByRole('textbox', { name: 'Name', exact: true }).fill('Updated research');
  await edit.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('rowheader', { name: 'Updated research', exact: true })).toBeVisible();
  await action(page, 'Updated research', 'Edit');
  await edit.getByRole('textbox', { name: 'Name', exact: true }).fill('Abandoned');
  await edit.getByRole('button', { name: 'Cancel' }).click();
  await action(page, 'Updated research', 'Edit');
  await expect(edit.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('Updated research');
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await page.getByRole('link', { name: 'Models', exact: true }).click();
  await expect(page.getByRole('rowheader', { name: 'Updated research', exact: true })).toHaveCount(0);
});

test('confirms exact bulk targets, cancels safely, and deletes all into an empty table', async ({ page }) => {
  const remove = page.getByRole('button', { name: 'Delete selected', exact: true });
  await expect(remove).toBeDisabled();
  await page.getByRole('checkbox', { name: 'Select Balanced Research', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Select Long-Term Growth', exact: true }).check();
  await expect(remove).toBeEnabled();
  await remove.click();
  const confirmation = page.getByRole('dialog', { name: 'Delete selected models', exact: true });
  await expect(confirmation.getByRole('listitem')).toHaveText(['Balanced Research', 'Long-Term Growth']);
  await expect(confirmation.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('status')).toHaveText('2 of 12 selected');
  await expect(remove).toBeFocused();
  await remove.click();
  await confirmation.getByRole('button', { name: 'Confirm delete' }).click();
  await expect(page.getByRole('status')).toHaveText('0 of 10 selected');
  await expect(page.getByRole('rowheader', { name: 'Balanced Research', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeFocused();
  await page.getByRole('checkbox', { name: 'Select all models' }).check();
  await remove.click();
  await page.getByRole('button', { name: 'Confirm delete' }).click();
  await expect(page.getByText('No models to display.')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 of 0 selected');
  await expect(remove).toBeDisabled();
  await page.reload();
  await expect(page.getByRole('rowheader', { name: 'Balanced Research', exact: true })).toBeVisible();
});

test('row actions ignore checkbox selection and preserve unrelated selection', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Select Balanced Research', exact: true }).check();
  await action(page, 'Long-Term Growth', 'Delete');
  await expect(page.getByRole('dialog').getByRole('listitem')).toHaveText(['Long-Term Growth']);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await action(page, 'Long-Term Growth', 'Delete');
  await page.getByRole('button', { name: 'Confirm delete' }).click();
  await expect(page.getByRole('status')).toHaveText('1 of 11 selected');
  await expect(page.getByRole('checkbox', { name: 'Select Balanced Research', exact: true })).toBeChecked();
});

test('native modal traps focus, blocks background focus, dismisses with Escape, and restores the trigger', async ({ page }) => {
  const create = page.getByRole('button', { name: 'Create', exact: true });
  await create.click();
  const dialog = page.getByRole('dialog', { name: 'Create model', exact: true });
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    await expect(dialog.locator(':focus')).toHaveCount(1);
  }
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator(':focus')).toHaveCount(1);
  await page.getByRole('link', { name: 'Dashboard', exact: true }).evaluate((element) => (element as HTMLElement).focus());
  await expect(dialog.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(create).toBeFocused();
});

test('row menu keyboard controls and last-row placement work without clipping', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Actions for Alternative Ideas', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  await expect(page.getByRole('menuitem', { name: 'View', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Delete', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('heading', { name: 'Models', exact: true }).click();
  await expect(menu).toHaveCount(0);
});

test('closes an open draft and resets local changes when auth scope changes in another tab', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Unfinished');
  const other = await context.newPage();
  await other.goto('/workspace');
  await other.evaluate(() => localStorage.setItem('advisor-station.auth.v1', JSON.stringify({ version: 1, firmId: 'harborview', advisorId: 'harborview-noah', sessionId: crypto.randomUUID() })));
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('banner').getByText('Noah Brooks')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 of 12 selected');
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`model modal remains usable at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Create model', exact: true });
    await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Research preview');
    await dialog.getByRole('textbox', { name: /Description/ }).fill('A reusable model dialog for create, view, and edit.');
    await expect(dialog.getByRole('button', { name: 'Create model', exact: true })).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.height).toBeLessThanOrEqual(viewport.height);
    await page.screenshot({ path: testInfo.outputPath(`model-dialog-${viewport.width}.png`), fullPage: true });
    await dialog.getByRole('button', { name: 'Cancel' }).click();
  });
}
