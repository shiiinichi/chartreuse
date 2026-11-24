import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/test/browser/dialog-fixture.html');
  await expect(page.getByRole('heading', { name: 'Dialog fixture' })).toBeVisible();
}

async function boxes(page: Page) {
  const area = (await page.getByTestId('area').boundingBox())!;
  const dialog = (await page.getByRole('dialog', { name: 'Contained dialog' }).boundingBox())!;
  return { area, dialog };
}

test('a contained dialog covers its container and leaves the rest of the page usable', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open contained' }).click();
  const dialog = page.getByRole('dialog', { name: 'Contained dialog' });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(element => element.matches(':modal'))).toBe(false);
  const { area, dialog: box } = await boxes(page);
  expect(box).toEqual(area);
  const style = await dialog.evaluate(element => { const s = getComputedStyle(element); return [s.borderTopWidth, s.borderTopLeftRadius, s.boxShadow]; });
  expect(style).toEqual(['0px', '0px', 'none']);

  await page.getByRole('button', { name: 'Count clicks' }).click();
  await expect(page.getByLabel('Clicks')).toHaveText('1');
  await expect(dialog).toBeVisible();
});

test('a contained dialog follows its container when it resizes', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open contained' }).click();
  await page.getByRole('button', { name: 'Resize area' }).click();
  await expect.poll(async () => { const { area, dialog } = await boxes(page); return dialog.x === area.x && dialog.width === area.width; }).toBe(true);
});

test('Escape and the close button dismiss a contained dialog and return focus', async ({ page }) => {
  await open(page);
  const opener = page.getByRole('button', { name: 'Open contained' });
  const dialog = page.getByRole('dialog', { name: 'Contained dialog' });
  await opener.click();
  await dialog.getByRole('button', { name: 'Done' }).focus();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await opener.click();
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  await expect(dialog).toBeHidden();
});

test('a dialog without a container stays modal', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open modal' }).click();
  const dialog = page.getByRole('dialog', { name: 'Modal dialog' });
  expect(await dialog.evaluate(element => element.matches(':modal'))).toBe(true);
});
