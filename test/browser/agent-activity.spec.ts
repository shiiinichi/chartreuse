import { expect, test, type Locator, type Page } from '@playwright/test';

const widths = [350, 440, 760] as const;
const variants = ['default', 'list'] as const;

async function open(page: Page) {
  // Chevrons rotate with a transition; measure their settled box.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/test/browser/agent-activity-fixture.html');
  await expect(page.getByRole('heading', { name: 'Agent activity fixture' })).toBeVisible();
}

/** Every row's box and the boxes of its parts, read from layout. */
function rows(container: Locator) {
  return container.locator('.cr-agent-activity-row').evaluateAll(elements => elements.map(row => {
    const box = (selector: string) => {
      const element = row.querySelector<HTMLElement>(`:scope > ${selector}`);
      if (!element) return null;
      const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
      return { left, right, top, bottom, width, height, center: (top + bottom) / 2 };
    };
    const title = row.querySelector<HTMLElement>(':scope > .cr-agent-activity-title')!;
    return {
      height: row.getBoundingClientRect().height,
      kind: box('.cr-agent-activity-kind')!, title: box('.cr-agent-activity-title')!, meta: box('.cr-agent-activity-row-meta')!,
      chevron: box('.cr-agent-activity-chevron'),
      metaScrollWidth: row.querySelector<HTMLElement>(':scope > .cr-agent-activity-row-meta')!.scrollWidth,
      titleTruncated: title.scrollWidth > title.clientWidth,
      metaChildTops: [...row.querySelectorAll<HTMLElement>(':scope > .cr-agent-activity-row-meta > *')].map(child => child.getBoundingClientRect().top),
      rowBox: (() => { const { left, right } = row.getBoundingClientRect(); return { left, right }; })(),
    };
  }));
}

type Row = Awaited<ReturnType<typeof rows>>[number];

function expectOneLine(row: Row, rtl: boolean, minHeight: number) {
  expect(row.height).toBe(minHeight);
  // Everything shares one vertical center.
  for (const part of [row.title, row.meta, row.chevron].filter(Boolean)) {
    expect(Math.abs(part!.center - row.kind.center)).toBeLessThan(1.5);
  }
  // The meta keeps its full width and its children stay on one line.
  expect(Math.round(row.meta.width)).toBeGreaterThanOrEqual(row.metaScrollWidth - 1);
  expect(new Set(row.metaChildTops.map(Math.round)).size).toBe(1);
  // Order along the inline axis: kind, title, meta, chevron.
  const order = [row.kind, row.title, row.meta, row.chevron].filter(Boolean);
  for (let index = 1; index < order.length; index += 1) {
    if (rtl) expect(order[index]!.right).toBeLessThanOrEqual(order[index - 1]!.left + .5);
    else expect(order[index]!.left).toBeGreaterThanOrEqual(order[index - 1]!.right - .5);
  }
  // The meta and chevron sit at the row's end edge.
  const end = row.chevron ?? row.meta;
  if (rtl) expect(Math.abs(end.left - row.rowBox.left - 8)).toBeLessThan(1);
  else expect(Math.abs(row.rowBox.right - end.right - 8)).toBeLessThan(1);
}

for (const dir of ['ltr', 'rtl'] as const) {
  test(`single-line rows stay on one line at every width (${dir})`, async ({ page }) => {
    await open(page);
    for (const width of widths) {
      for (const variant of variants) {
        const id = `${dir}-${width}-${variant}-single`;
        const list = await rows(page.getByTestId(id));
        expect(list, id).toHaveLength(3);
        for (const row of list) expectOneLine(row, dir === 'rtl', 40);
        // The long title ends in an ellipsis instead of wrapping.
        if (width < 760) expect(list[1].titleTruncated, id).toBe(true);
      }
    }
  });
}

test('multiple-line rows keep stacking the status under the title in narrow containers', async ({ page }) => {
  await open(page);
  for (const width of [350, 440]) {
    for (const variant of variants) {
      const [short] = await rows(page.getByTestId(`ltr-${width}-${variant}-multiple`));
      expect(short.meta.top).toBeGreaterThanOrEqual(short.title.bottom - .5);
      expect(short.height).toBeGreaterThan(40);
    }
  }
  const [wide] = await rows(page.getByTestId('ltr-760-default-multiple'));
  expect(wide.height).toBe(40);
});

test('an expanded single-line row keeps its summary on one line', async ({ page }) => {
  await open(page);
  const container = page.getByTestId('ltr-350-default-single');
  await expect(container.locator('.cr-agent-activity-event[open] .cr-agent-activity-detail')).toBeVisible();
  const before = await rows(container);
  await container.locator('.cr-agent-activity-event').first().locator('summary').click();
  await expect(container.locator('.cr-agent-activity-event[open]')).toHaveCount(2);
  const after = await rows(container);
  expect(after[0].height).toBe(before[0].height);
  expectOneLine(after[0], false, 40);
});

test.describe('coarse pointers', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('single-line rows grow to 44px and stay on one line', async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    for (const dir of ['ltr', 'rtl'] as const) {
      for (const variant of variants) {
        const list = await rows(page.getByTestId(`${dir}-350-${variant}-single`));
        for (const row of list) expectOneLine(row, dir === 'rtl', 44);
      }
    }
  });
});
