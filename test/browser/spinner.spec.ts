import { expect, test } from '@playwright/test';

test('a spinner keeps its size beside truncating text', async ({ page }) => {
  await page.goto('/test/browser/spinner-fixture.html');
  const spinner = page.getByTestId('truncate').locator('.cr-spinner');
  expect(await spinner.boundingBox()).toMatchObject({ width: 16 });
  // The svg spins, so read its laid-out size rather than its rotated bounding box.
  expect(await spinner.locator('svg').evaluate(svg => [getComputedStyle(svg).width, getComputedStyle(svg).height])).toEqual(['16px', '16px']);
});

test('align="first-line" centers the spinner on the first line of wrapping text', async ({ page }) => {
  await page.goto('/test/browser/spinner-fixture.html');
  const row = page.getByTestId('first-line');
  const text = (await row.locator('p').boundingBox())!;
  expect(text.height).toBeGreaterThan(50);
  const icon = (await row.locator('.cr-spinner svg').boundingBox())!;
  expect(await row.locator('.cr-spinner svg').evaluate(svg => getComputedStyle(svg).width)).toBe('16px');
  expect(Math.abs(icon.y + icon.height / 2 - (text.y + 10))).toBeLessThanOrEqual(1);
});
