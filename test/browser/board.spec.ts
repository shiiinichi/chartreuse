import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const fixture = '/test/browser/fixture.html';

async function open(page: Page) {
  await page.goto(fixture);
  await expect(page.getByRole('heading', { name: 'Board fixture' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

const box = async (page: Page, selector: string) => {
  const rect = await page.locator(selector).first().boundingBox();
  if (!rect) throw new Error(`No box for ${selector}`);
  return rect;
};

for (const scheme of ['light', 'dark'] as const) {
  test(`has no axe violations in ${scheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await open(page);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

for (const [name, media] of [
  ['light', { colorScheme: 'light' }],
  ['dark', { colorScheme: 'dark' }],
  ['forced-colors', { colorScheme: 'light', forcedColors: 'active' }],
] as const) {
  test(`matches the ${name} snapshots`, async ({ page }) => {
    await page.emulateMedia(media);
    await open(page);
    for (const id of ['alignment-card', 'alignment-flush', 'kanban', 'compact', 'table', 'controls']) {
      await expect(page.getByTestId(id)).toHaveScreenshot(`${id}-${name}.png`);
    }
  });
}

test('keeps lane actions on one line across collapsed and expanded lanes', async ({ page }) => {
  await open(page);
  for (const variant of ['card', 'flush']) {
    const expanded = await box(page, `[data-testid="${variant}-expanded"] .cr-swimlane-action`);
    const collapsed = await box(page, `[data-testid="${variant}-collapsed"] .cr-swimlane-action`);
    expect(Math.abs(expanded.y - collapsed.y), `${variant} action top`).toBeLessThanOrEqual(0.5);
  }
});

test('aligns the first table column with the group dot', async ({ page }) => {
  await open(page);
  const table = page.getByTestId('table');
  const dot = await table.locator('.cr-table-group-dot').first().boundingBox();
  const cell = table.locator('tbody tr:not([data-group-heading]) > :first-child').first();
  const textLeft = await cell.evaluate((el) => {
    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
    const node = walker.nextNode();
    if (!node) return NaN;
    range.selectNodeContents(node);
    return range.getBoundingClientRect().left;
  });
  expect(dot).not.toBeNull();
  expect(Math.abs(textLeft - dot!.x)).toBeLessThanOrEqual(0.5);
});

test('collapses a lane from the keyboard and keeps focus on its toggle', async ({ page }) => {
  await open(page);
  const lane = page.getByTestId('card-expanded');
  const collapse = lane.locator('.cr-swimlane-collapse');
  await collapse.focus();
  await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Enter');
  const expand = lane.locator('.cr-swimlane-toggle');
  await expect(expand).toHaveAttribute('aria-expanded', 'false');
  await expect(expand).toHaveAccessibleName('Expand Doing, 1 item');
  await expect(expand).toBeFocused();
  await page.keyboard.press('Space');
  await expect(lane.locator('.cr-swimlane-collapse')).toBeFocused();
});

test('collapses a table group and keeps focus on its toggle', async ({ page }) => {
  await open(page);
  const toggle = page.getByTestId('table').locator('.cr-table-group-toggle').first();
  const controlled = (await toggle.getAttribute('aria-controls'))!.split(' ')[0];
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator(`[id="${controlled}"]`)).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('gives interactive controls at least 24px targets', async ({ page }) => {
  await open(page);
  const selectors = '.cr-swimlane-toggle, .cr-table-group-toggle, .cr-toggle-chip, .cr-swimlane-action button';
  const sizes = await page.locator(selectors).evaluateAll((els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return { cls: el.className, w: r.width, h: r.height };
  }));
  expect(sizes.length).toBeGreaterThan(0);
  for (const s of sizes) expect(Math.min(s.w, s.h), s.cls).toBeGreaterThanOrEqual(24);
});

test('gives expanded lanes the fixed laneWidth and keeps collapsed rails at 48px', async ({ page }) => {
  await open(page);
  const widths = await page.getByTestId('fixed-width').locator('.cr-swimlane').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  expect(widths).toEqual([240, 48, 240]);
});

test('keeps narrow lane actions on the title row and truncates long titles', async ({ page }) => {
  await open(page);
  for (const style of ['dot', 'tag']) {
    const lanes = await page.getByTestId(`narrow-${style}`).locator('.cr-swimlane').evaluateAll((els) => els.map((el) => {
      const rect = (selector: string) => el.querySelector(selector)?.getBoundingClientRect() ?? null;
      const title = el.querySelector<HTMLElement>('.cr-swimlane-title');
      return {
        title: el.querySelector('.cr-swimlane-toggle-title, .cr-swimlane-title')?.textContent ?? '',
        collapsed: el.getAttribute('data-collapsed') === 'true',
        width: el.getBoundingClientRect().width,
        heading: rect('.cr-swimlane-heading'),
        action: rect('.cr-swimlane-action'),
        header: rect('.cr-swimlane-header'),
        truncated: title ? title.scrollWidth > title.clientWidth : false,
      };
    }));
    const expanded = lanes.filter((lane) => !lane.collapsed);
    const short = expanded.find((lane) => lane.title === 'QA')!;
    const long = expanded.find((lane) => lane.title === 'Ready to ship')!;
    expect(long.width, `${style} lanes are narrow`).toBeLessThan(200);
    expect(long.truncated, `${style} long title truncates`).toBe(true);
    for (const lane of expanded) {
      expect(Math.abs(lane.action!.y - lane.heading!.y), `${style} ${lane.title} action on the title row`).toBeLessThanOrEqual(0.5);
      expect(lane.action!.right, `${style} ${lane.title} action inside the header`).toBeLessThanOrEqual(lane.header!.right);
      expect(Math.abs(lane.header!.height - short.header!.height), `${style} ${lane.title} header height`).toBeLessThanOrEqual(0.5);
    }
    const rail = lanes.find((lane) => lane.collapsed)!;
    expect(Math.abs(rail.action!.y - short.action!.y), `${style} collapsed action top`).toBeLessThanOrEqual(0.5);
  }
});

test('keeps the full lane title in the accessibility tree when it truncates', async ({ page }) => {
  await open(page);
  await expect(page.getByTestId('narrow-dot').getByRole('region', { name: 'Shipped to customers' })).toBeVisible();
  await expect(page.getByTestId('narrow-tag').getByRole('heading', { name: 'Shipped to customers' })).toBeVisible();
});

test('clips off-screen collapsed lanes inside the group scroller instead of widening the page', async ({ page }) => {
  await open(page);
  const scroller = page.getByTestId('overflow').locator('.cr-swimlane-group-scroll');
  expect(await scroller.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});
