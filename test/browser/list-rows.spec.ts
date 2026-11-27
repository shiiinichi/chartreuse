import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const open = (page: Page) => page.goto('/test/browser/list-rows-fixture.html');
const calls = (page: Page) => page.evaluate(() => (window as unknown as { listCalls: string[] }).listCalls.splice(0));

/** Insets of a row's content from the row's border box, plus the row's computed surface. */
const insets = (row: Locator, content: string) => row.evaluate((element, selector) => {
  const box = element.getBoundingClientRect();
  const inner = element.querySelector(selector)!.getBoundingClientRect();
  const style = getComputedStyle(element);
  return { left: inner.left - box.left, top: inner.top - box.top, right: box.right - inner.right, height: box.height, font: style.font, padding: style.padding,
    minHeight: style.minBlockSize, radius: style.borderRadius, border: style.borderColor, background: style.backgroundColor, color: style.color, shadow: style.boxShadow };
}, content);

for (const variant of ['outline', 'plain'] as const) {
  for (const width of [560, 320]) {
    test(`a ${variant} List row matches a Tree row at ${width}px`, async ({ page }) => {
      await open(page);
      const scope = page.getByTestId(`parity-${variant}-${width}`);
      const treeRow = (name: string) => scope.getByRole('treeitem', { name }).locator(':scope > .cr-tree-row');
      const listRow = (name: string) => scope.getByRole('list').locator('li', { has: page.getByRole('button', { name }) });
      for (const name of ['Alpha', 'Beta']) {
        const [tree, list] = [await insets(treeRow(name), '.cr-tree-content'), await insets(listRow(name), '.cr-list-content')];
        expect(list).toEqual(tree);
      }
      const expected = width < 400 ? '12px' : variant === 'outline' ? '16px' : '6px 8px';
      expect((await insets(treeRow('Alpha'), '.cr-tree-content')).padding).toBe(expected);
      // Hover matches too, and a hovered selected row keeps its selected surface.
      await treeRow('Alpha').hover();
      const treeHover = (await insets(treeRow('Alpha'), '.cr-tree-content')).background;
      await listRow('Alpha').hover();
      expect((await insets(listRow('Alpha'), '.cr-list-content')).background).toBe(treeHover);
      const selected = (await insets(listRow('Beta'), '.cr-list-content')).background;
      await listRow('Beta').hover();
      expect((await insets(listRow('Beta'), '.cr-list-content')).background).toBe(selected);
      await treeRow('Beta').hover();
      expect((await insets(treeRow('Beta'), '.cr-tree-content')).background).toBe(selected);
    });
  }
}

test('selectable rows are native buttons with aria-current and keyboard activation', async ({ page }) => {
  await open(page);
  const list = page.getByRole('list', { name: 'Runs' });
  const first = list.getByRole('button', { name: /Refactor the board/ });
  const second = list.getByRole('button', { name: /Fix the composer height/ });
  const third = list.getByRole('button', { name: 'Run 3: clickable chevrons' });
  await expect(first).toHaveAttribute('aria-current', 'true');
  await expect(second).not.toHaveAttribute('aria-current', /.+/);
  await calls(page);

  // A click anywhere on the row, including on its text and badge, selects it.
  const title = await page.getByTestId('title-run-2').boundingBox();
  await page.mouse.click(title!.x + 4, title!.y + 4);
  await expect(second).toHaveAttribute('aria-current', 'true');
  await expect(first).not.toHaveAttribute('aria-current', /.+/);
  expect(await calls(page)).toEqual(['select:run-2']);
  // Clicking the selected row again does not report it again.
  await second.click();
  expect(await calls(page)).toEqual([]);

  // Native keyboard: Tab moves between rows, Enter and Space activate.
  await second.focus();
  await page.keyboard.press('Tab');
  await expect(third).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(third).toHaveAttribute('aria-current', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(second).toBeFocused();
  await page.keyboard.press('Space');
  await expect(second).toHaveAttribute('aria-current', 'true');
  expect(await calls(page)).toEqual(['select:run-3', 'select:run-2']);
  await expect(list.locator('li[data-selected]')).toHaveCount(1);
  await expect(list.locator('li[data-selected]')).toContainText('Fix the composer height');
});

test('link rows are native links with their content as the name', async ({ page }) => {
  await open(page);
  const list = page.getByRole('list', { name: 'Threads' });
  const one = list.getByRole('link', { name: 'Thread one' });
  const two = list.getByRole('link', { name: 'Thread two' });
  await expect(one).toHaveAttribute('href', '#thread-1');
  await expect(one).toHaveAttribute('aria-current', 'true');
  await expect(two).not.toHaveAttribute('aria-current', /.+/);
  await calls(page);
  await two.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#thread-2$/);
  expect(await calls(page)).toEqual(['click:t2']);
  // The link covers the row, so a click on its text follows it.
  const text = await list.getByText('Thread one').boundingBox();
  await page.mouse.click(text!.x + 4, text!.y + 4);
  await expect(page).toHaveURL(/#thread-1$/);
});

test('size props set inline sizes; a row clips at maxHeight and the list scrolls at maxHeight', async ({ page }) => {
  await open(page);
  const list = page.getByRole('list', { name: 'Sized' });
  const rows = list.locator(':scope > li');
  const style = (locator: Locator) => locator.evaluate(element => {
    const computed = getComputedStyle(element);
    return { minWidth: computed.minInlineSize, maxHeight: computed.maxBlockSize, overflowY: computed.overflowY, overflowX: computed.overflowX,
      height: element.getBoundingClientRect().height, width: element.getBoundingClientRect().width, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight };
  });
  const listStyle = await style(list);
  expect(listStyle).toMatchObject({ minWidth: '240px', maxHeight: '200px', overflowY: 'auto', overflowX: 'clip', height: 200 });
  expect(listStyle.scrollHeight).toBeGreaterThan(listStyle.clientHeight);
  const clipped = await style(rows.nth(0));
  expect(clipped).toMatchObject({ maxHeight: '64px', overflowY: 'clip', height: 64 });
  expect(clipped.scrollHeight).toBeGreaterThan(64);
  const narrow = await style(rows.nth(1));
  expect(narrow.width).toBe(300);
  expect(narrow.height).toBeGreaterThanOrEqual(120);
});

test('Lists work inside Flex, and Flex works inside row content', async ({ page }) => {
  await open(page);
  const row = page.getByTestId('flex-row');
  const [left, right] = [row.getByRole('list', { name: 'Left' }), row.getByRole('list', { name: 'Right' })];
  const [flexBox, leftBox, rightBox] = [await row.boundingBox(), await left.boundingBox(), await right.boundingBox()];
  // Side by side, sharing the width, neither collapsed nor overflowing.
  expect(leftBox!.y).toBe(rightBox!.y);
  expect(leftBox!.width).toBeGreaterThan(300);
  expect(Math.abs(leftBox!.width - rightBox!.width)).toBeLessThanOrEqual(1);
  expect(rightBox!.x + rightBox!.width).toBeLessThanOrEqual(flexBox!.x + flexBox!.width + 0.5);
  // Each List resolves its row padding against its own width, not the Flex's.
  const padding = (list: Locator) => list.locator('li').first().evaluate(element => getComputedStyle(element).padding);
  expect(await padding(left)).toBe('16px');
  await row.evaluate(element => { element.style.inlineSize = '600px'; });
  await expect.poll(() => padding(left)).toBe('12px');
  const column = page.getByTestId('flex-column').getByRole('list');
  expect(await padding(column)).toBe('16px');
  expect((await column.boundingBox())!.width).toBe(700);
  // The status badge stays pinned top right inside the row's own Flex.
  const item = column.locator('li').first();
  const [itemBox, badgeBox] = [await item.boundingBox(), await item.locator('.cr-badge').boundingBox()];
  expect(Math.round(itemBox!.x + itemBox!.width - (badgeBox!.x + badgeBox!.width))).toBe(17);
  expect(Math.round(badgeBox!.y - itemBox!.y)).toBeLessThanOrEqual(20);
});
