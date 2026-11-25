import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/test/browser/conversation-quote-fixture.html');
  await expect(page.getByRole('heading', { name: 'Conversation quote fixture' })).toBeVisible();
}

/** Selects from the start of one text match to the end of another, inside the page. */
async function select(page: Page, from: string, to = from) {
  await page.evaluate(([from, to]) => {
    (document.activeElement as HTMLElement | null)?.blur();
    const walker = document.createTreeWalker(document.querySelector('.cr-conversation')!, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    const start = nodes.find(node => node.data.includes(from))!;
    const end = nodes.find(node => node.data.includes(to))!;
    const range = document.createRange();
    range.setStart(start, start.data.indexOf(from));
    range.setEnd(end, end.data.indexOf(to) + to.length);
    getSelection()!.removeAllRanges();
    getSelection()!.addRange(range);
  }, [from, to]);
}

const quoteButton = (page: Page) => page.getByRole('button', { name: 'Quote' });
const composer = (page: Page) => page.getByRole('textbox', { name: 'Reply' });

test('selected plain text is quoted into the composer and Command/Ctrl+Z removes it', async ({ page }) => {
  await open(page);
  await select(page, 'Plain', 'Second line.');
  await quoteButton(page).click();
  await expect(page.getByTestId('quoted')).toHaveText('user');
  await expect(composer(page)).toHaveValue('> Plain **text** from the user.\n> Second line.\n\n');
  await expect(composer(page)).toBeFocused();
  expect(await composer(page).evaluate((element: HTMLTextAreaElement) => element.selectionStart)).toBe(48);
  await expect(quoteButton(page)).toHaveCount(0);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(composer(page)).toHaveValue('');
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await page.keyboard.type('Agreed.');
  await expect(composer(page)).toHaveValue('> Plain **text** from the user.\n> Second line.\n\nAgreed.');
});

test('a quote is inserted at the cursor of a focused composer, separated by blank lines', async ({ page }) => {
  await open(page);
  await composer(page).fill('Before after');
  await composer(page).evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(6, 7));
  await select(page, 'A final reply.');
  await quoteButton(page).click();
  await expect(composer(page)).toHaveValue('Before\n\n> A final reply.\n\nafter');
});

test('an unfocused composer gets the quote appended', async ({ page }) => {
  await open(page);
  await select(page, 'A final reply.');
  await quoteButton(page).click();
  await select(page, 'Second line.');
  await quoteButton(page).click();
  await expect(composer(page)).toHaveValue('> A final reply.\n\n> Second line.\n\n');
});

test('Markdown formatting survives the quote', async ({ page }) => {
  await open(page);
  await select(page, 'Run', 'const answer = 42;');
  await quoteButton(page).click();
  await expect(composer(page)).toHaveValue('> Run `npm test` before **every** release.\n>\n> - First item\n> - Second item\n>\n> ```ts\n> const answer = 42;\n> ```\n\n');
});

test('a selection inside inline code or a list keeps that formatting', async ({ page }) => {
  await open(page);
  await select(page, 'npm');
  await quoteButton(page).click();
  await expect(composer(page)).toHaveValue('> `npm`\n\n');
  await composer(page).fill('');
  await select(page, 'Second item');
  await quoteButton(page).click();
  await expect(composer(page)).toHaveValue('> - Second item\n\n');
});

test('the button is hidden for collapsed selections and selections across messages', async ({ page }) => {
  await open(page);
  await select(page, 'Plain', 'Second line.');
  await expect(quoteButton(page)).toBeVisible();
  await page.evaluate(() => getSelection()!.collapseToEnd());
  await expect(quoteButton(page)).toHaveCount(0);
  await select(page, 'Second line.', 'Run');
  await page.waitForTimeout(100);
  await expect(quoteButton(page)).toHaveCount(0);
});

test('the button is keyboard reachable after the selection and sits beside it', async ({ page }) => {
  await open(page);
  await select(page, 'A final reply.');
  await expect(quoteButton(page)).toBeVisible();
  const text = await page.getByText('A final reply.').boundingBox();
  const button = await quoteButton(page).boundingBox();
  expect(button!.y).toBeGreaterThan(text!.y + text!.height - 1);
  expect(button!.y).toBeLessThan(text!.y + text!.height + 20);
  await quoteButton(page).focus();
  await page.keyboard.press('Enter');
  await expect(composer(page)).toHaveValue('> A final reply.\n\n');
  await expect(composer(page)).toBeFocused();
});

test('a mouse selection keeps the button and its quote', async ({ page }) => {
  await open(page);
  await page.getByText('A final reply.').dblclick({ position: { x: 24, y: 10 } });
  await expect(quoteButton(page)).toBeVisible();
  await quoteButton(page).click();
  await expect(composer(page)).toHaveValue('> final\n\n');
});

test('Tab moves from the selection to the button, and Escape dismisses it with the selection', async ({ page }) => {
  await open(page);
  await page.getByText('A final reply.').dblclick({ position: { x: 24, y: 10 } });
  await expect(quoteButton(page)).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(quoteButton(page)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(quoteButton(page)).toHaveCount(0);
  expect(await page.evaluate(() => getSelection()!.isCollapsed)).toBe(true);
});
