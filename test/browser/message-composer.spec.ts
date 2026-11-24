import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/test/browser/message-composer-fixture.html');
  await expect(page.getByRole('heading', { name: 'Message composer fixture' })).toBeVisible();
}

test('without a hint, sending keeps the footer layout and announces the status to assistive technology only', async ({ page }) => {
  await open(page);
  const section = page.getByTestId('no-hint');
  const footer = section.locator('.cr-message-composer-footer');
  const before = await footer.boundingBox();
  await section.getByRole('textbox', { name: 'Without hint' }).fill('Hello');
  await section.getByRole('button', { name: 'Send message' }).click();
  const status = section.getByText('Sending message…');
  await expect(section.getByRole('button', { name: 'Sending message' })).toBeVisible();
  await expect(status).toHaveClass(/cr-sr-only/);
  expect(await footer.boundingBox()).toEqual(before);
  await page.evaluate(() => (window as unknown as { finishSend: () => void }).finishSend());
  await expect(status).toHaveCount(0);
});

test('with a hint, sending shows the status in its place', async ({ page }) => {
  await open(page);
  const section = page.getByTestId('with-hint');
  await section.getByRole('textbox', { name: 'With hint' }).fill('Hello');
  await section.getByRole('button', { name: 'Send message' }).click();
  const status = section.getByText('Sending message…');
  await expect(status).toBeVisible();
  await expect(status).not.toHaveClass(/cr-sr-only/);
  await page.evaluate(() => (window as unknown as { finishSend: () => void }).finishSend());
  await expect(section.getByText('Enter to send')).toBeVisible();
});
