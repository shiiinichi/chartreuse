import { expect, test, type Page } from '@playwright/test';

// Playwright hides scrollbars in headless Chromium. Without that flag Linux Chromium draws classic,
// space-taking scrollbars, as Windows does. macOS draws overlay scrollbars, so the wheel test below also
// forces a space-taking scrollbar through the legacy ::-webkit-scrollbar path.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });
const classicScrollbar = `.cr-tab-list[data-wheel-scroll] { scrollbar-width: auto !important; scrollbar-color: auto !important; }
.cr-tab-list::-webkit-scrollbar { block-size: 12px; height: 12px; background: #ccc; }`;

async function open(page: Page) {
  await page.goto('/test/browser/fixture.html');
  const list = page.getByRole('tablist', { name: 'Overflowing tabs' });
  await list.scrollIntoViewIfNeeded();
  await expect(list).toBeVisible();
}

// Space between the inner edge of the bottom border and the content box: a reserved scrollbar shows up here.
const reservedScrollbar = (page: Page) => page.getByRole('tablist', { name: 'Overflowing tabs' }).evaluate(list => {
  const el = list as HTMLElement;
  const style = getComputedStyle(el);
  return { overflows: el.scrollWidth > el.clientWidth, reserved: el.offsetHeight - el.clientHeight - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) };
});

test('an overflowing tab row reserves no scrollbar space', async ({ page }) => {
  await open(page);
  const { overflows, reserved } = await reservedScrollbar(page);
  expect(overflows).toBe(true);
  expect(reserved).toBe(0);
});

test('the selected underline sits on the tab list border', async ({ page }) => {
  await open(page);
  const list = page.getByRole('tablist', { name: 'Overflowing tabs' });
  const gap = await list.evaluate(el => {
    const tab = el.querySelector('[aria-selected="true"]')!;
    const underline = parseFloat(getComputedStyle(tab, '::after').bottom);
    const tabBottom = tab.getBoundingClientRect().bottom - underline;
    const borderTop = el.getBoundingClientRect().bottom - parseFloat(getComputedStyle(el).borderBottomWidth);
    return Math.abs(borderTop - tabBottom);
  });
  expect(gap).toBeLessThan(1);
});

test('a horizontal wheel scroll scrolls the row without revealing a classic scrollbar', async ({ page }) => {
  await open(page);
  await page.addStyleTag({ content: classicScrollbar });
  const list = page.getByRole('tablist', { name: 'Overflowing tabs' });
  const before = await list.evaluate(el => ({ height: (el as HTMLElement).offsetHeight, left: el.scrollLeft }));
  await list.hover();
  await page.mouse.wheel(40, 0);
  await expect.poll(() => list.evaluate(el => el.scrollLeft)).toBeGreaterThan(before.left);
  const after = await list.evaluate(el => ({ height: (el as HTMLElement).offsetHeight, wheel: (el as HTMLElement).dataset.wheelScroll, classic: (el as HTMLElement).dataset.classicScrollbar }));
  expect(after.height).toBe(before.height);
  expect(after.wheel).toBeUndefined();
  expect(after.classic).toBe('');
  expect((await reservedScrollbar(page)).reserved).toBe(0);
});

test('drag scrolling still moves an overflowing row', async ({ page }) => {
  await open(page);
  const list = page.getByRole('tablist', { name: 'Overflowing tabs' });
  await list.evaluate(el => { el.scrollLeft = el.scrollWidth; });
  const start = await list.evaluate(el => el.scrollLeft);
  const tab = await page.getByRole('tab', { name: /History/ }).boundingBox();
  await page.mouse.move(tab!.x + 10, tab!.y + tab!.height / 2);
  await page.mouse.down();
  await page.mouse.move(tab!.x + 90, tab!.y + tab!.height / 2, { steps: 8 });
  await page.mouse.up();
  expect(await list.evaluate(el => el.scrollLeft)).toBeLessThan(start);
  await expect(page.getByRole('tab', { name: /History/ })).toHaveAttribute('aria-selected', 'true');
});

test('overlay scrollbars still reveal on a horizontal wheel scroll', async ({ page }) => {
  await open(page);
  const list = page.getByRole('tablist', { name: 'Overflowing tabs' });
  const reserved = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'inline-size: 100px; block-size: 100px; overflow: scroll';
    document.body.append(probe);
    const size = probe.offsetHeight - probe.clientHeight;
    probe.remove();
    return size;
  });
  test.skip(reserved > 0, 'This browser draws classic scrollbars.');
  await list.hover();
  await page.mouse.wheel(40, 0);
  await expect(list).toHaveAttribute('data-wheel-scroll', 'true');
  await expect(list).not.toHaveAttribute('data-wheel-scroll');
});

test('keyboard selection scrolls the tab into view', async ({ page }) => {
  await open(page);
  const list = page.getByRole('tablist', { name: 'Overflowing tabs' });
  await page.getByRole('tab', { name: /History/ }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: /Details/ })).toBeFocused();
  expect(await list.evaluate(el => el.scrollLeft)).toBe(0);
});
