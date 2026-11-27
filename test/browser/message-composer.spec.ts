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

test('the inline field re-measures its height when its width changes', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await open(page);
  const section = page.getByTestId('inline-resize');
  const field = section.getByRole('textbox', { name: 'Reply' });
  const height = () => field.evaluate(element => element.getBoundingClientRect().height);
  const setWidth = (width: string) => section.evaluate((element, next) => { element.style.inlineSize = next; }, width);
  const oneRow = await field.evaluate(element => { const style = getComputedStyle(element); return parseFloat(style.lineHeight) + parseFloat(style.paddingBlockStart) + parseFloat(style.paddingBlockEnd); });
  const maxHeight = await field.evaluate(element => parseFloat(getComputedStyle(element).maxBlockSize));

  // Narrow: the placeholder wraps, so the empty field is taller than one row.
  const narrow = await height();
  expect(narrow).toBeGreaterThan(oneRow);

  // Wide, as in a dialog that opens wider: the placeholder fits on one line beside the controls again,
  // so the empty field returns to one row.
  await setWidth('560px');
  await expect.poll(height).toBe(oneRow);

  // A draft still grows up to max-block-size and shrinks again, at the new width.
  await field.fill('A longer reply that wraps onto several lines. '.repeat(30));
  await expect.poll(height).toBe(maxHeight);
  await field.fill('Short reply');
  await expect.poll(height).toBe(oneRow);

  // Narrowing with a draft re-measures too, and widening again restores it.
  await field.fill('A reply that fits on one wide line');
  await expect.poll(height).toBe(oneRow);
  await setWidth('200px');
  await expect.poll(height).toBeGreaterThan(oneRow);
  await setWidth('560px');
  await expect.poll(height).toBe(oneRow);

  // The height changes inside ResizeObserver work must not loop or log errors.
  await page.waitForTimeout(200);
  expect(errors).toEqual([]);
});
