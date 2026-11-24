import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/test/browser/table-fixture.html');
  await expect(page.getByRole('heading', { name: 'Table fixture' })).toBeVisible();
  const heading = page.locator('tr[data-group-heading]').first();
  return {
    heading,
    toggle: page.getByRole('button', { name: 'Done', exact: true }),
    rows: page.getByRole('row', { name: /Ship the palette|Write the recipe/ }),
    summary: page.getByRole('row', { name: '2 tasks hidden' }),
    state: page.getByTestId('state'),
  };
}

test('a click anywhere on a collapsible group heading toggles the group', async ({ page }) => {
  const { heading, toggle, rows, summary, state } = await open(page);
  await expect(rows).toHaveCount(2);
  const ariaControls = await toggle.getAttribute('aria-controls');

  // The title, the count, and the empty space before the action all toggle.
  await heading.locator('.cr-table-group-title').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(summary).toBeVisible();
  await expect(rows).toHaveCount(0);
  await heading.locator('.cr-table-group-count').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const action = await heading.locator('.cr-table-group-action').boundingBox();
  await page.mouse.click(action!.x - 40, action!.y + action!.height / 2);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  // The chevron toggles once, not twice through the row.
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(state).toHaveText('adds:0 changes:true,false,true,false');
  await expect(toggle).toHaveAttribute('aria-controls', ariaControls!);
});

test('the action stays separately clickable and does not toggle', async ({ page }) => {
  const { toggle, state } = await open(page);
  await page.getByRole('button', { name: 'Add card to Done' }).click();
  await expect(state).toHaveText('adds:1 changes:');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('the chevron remains the only keyboard control, with no nested interactive markup', async ({ page }) => {
  const { heading, toggle } = await open(page);
  await expect(heading).not.toHaveAttribute('tabindex');
  await expect(heading).not.toHaveAttribute('role', 'button');
  await expect(heading.locator('button button, button a, a button')).toHaveCount(0);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('the heading shows a pointer and a hover state, except over the action', async ({ page }) => {
  const { heading } = await open(page);
  const th = heading.locator('th');
  const read = () => th.evaluate(element => ({ cursor: getComputedStyle(element).cursor, background: getComputedStyle(element).backgroundColor }));
  await page.mouse.move(0, 0);
  const rest = await read();
  expect(rest.cursor).toBe('pointer');
  await heading.locator('.cr-table-group-title').hover();
  const hovered = await read();
  expect(hovered.background).not.toBe(rest.background);
  await page.getByRole('button', { name: 'Add card to Done' }).hover();
  expect((await read()).background).toBe(rest.background);
  // A group without a collapse prop is not clickable.
  const plain = page.locator('tr[data-group-heading]').nth(1).locator('th');
  expect(await plain.evaluate(element => getComputedStyle(element).cursor)).not.toBe('pointer');
});

test('selecting heading text does not toggle the group', async ({ page }) => {
  const { heading, toggle } = await open(page);
  const title = await heading.locator('.cr-table-group-title').boundingBox();
  await page.mouse.move(title!.x + 1, title!.y + title!.height / 2);
  await page.mouse.down();
  await page.mouse.move(title!.x + title!.width - 1, title!.y + title!.height / 2, { steps: 5 });
  await page.mouse.up();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toContain('Don');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

for (const kind of ['click', 'href'] as const) {
  test(`a truncated row-header cell clips its row ${kind === 'click' ? 'button' : 'link'} with an ellipsis`, async ({ page }) => {
    await open(page);
    const cells = await page.getByTestId(`truncate-${kind}`).locator('tbody tr').first().evaluate(row => [...row.children].map(cell => {
      const box = cell.getBoundingClientRect();
      const link = cell.querySelector<HTMLElement>('.cr-table-row-link');
      const span = cell.querySelector<HTMLElement>('.cr-table-truncate')!;
      const style = getComputedStyle(cell);
      const contentRight = box.right - parseFloat(style.paddingRight);
      return {
        right: box.right, contentRight,
        linkRight: link?.getBoundingClientRect().right, spanRight: span.getBoundingClientRect().right,
        truncated: span.scrollWidth > span.clientWidth, overflow: getComputedStyle(span).textOverflow,
      };
    }));
    expect(cells).toHaveLength(3);
    for (const cell of cells) {
      expect(cell.truncated).toBe(true);
      expect(cell.overflow).toBe('ellipsis');
      expect(cell.spanRight).toBeLessThanOrEqual(cell.contentRight + .5);
    }
    // The row header's link or button fills its cell and no more, so it cannot spill into the next column.
    expect(cells[0].linkRight).toBeLessThanOrEqual(cells[0].contentRight + .5);
    expect(cells[0].contentRight - cells[0].linkRight!).toBeLessThan(.5);
    // The whole row stays clickable through the stretched link.
    // The stretched link covers the other cells, so click the last cell by position.
    const last = (await page.getByTestId(`truncate-${kind}`).locator('tbody td').last().boundingBox())!;
    await page.mouse.click(last.x + last.width / 2, last.y + last.height / 2);
    if (kind === 'click') await expect(page.getByTestId('state')).toContainText('adds:1');
    else await expect(page).toHaveURL(/#runs\/R-1$/);
  });
}
