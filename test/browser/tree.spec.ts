import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const calls = (page: Page) => page.evaluate(() => (window as unknown as { treeCalls: string[] }).treeCalls.splice(0));

for (const name of ['Start tree', 'End tree', 'Plain end tree', 'Controlled tree']) {
  test(`${name}: the chevron toggles its branch without selecting it`, async ({ page }) => {
    await page.goto('/test/browser/tree-fixture.html');
    const tree = page.getByRole('tree', { name, exact: true });
    const parent = tree.getByRole('treeitem', { name: 'Coordinator' });
    const row = parent.locator(':scope > .cr-tree-row');
    const chevron = row.locator('.cr-tree-toggle');
    const child = tree.getByRole('treeitem', { name: 'Reviewer' });
    await expect(chevron).toHaveAttribute('aria-hidden', 'true');
    await expect(chevron).not.toHaveAttribute('role', /.+/);
    await expect(chevron).not.toHaveAttribute('tabindex', /.+/);
    await calls(page);

    // A chevron click on an unselected branch expands and collapses it, and selects nothing.
    await chevron.click();
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await expect(child).toBeVisible();
    await chevron.click();
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    await expect(tree.locator('[aria-selected="true"]')).toHaveCount(0);
    if (name === 'Controlled tree') expect(await calls(page)).toEqual(['expanded:parent', 'expanded:']);

    // A row click selects without expanding, and a click on the selected row toggles it, as before.
    await row.click({ position: { x: 200, y: 20 } });
    await expect(parent).toHaveAttribute('aria-selected', 'true');
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    await row.click({ position: { x: 200, y: 20 } });
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    // On the selected branch, the chevron toggles once, not twice.
    await chevron.click();
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    await expect(parent).toHaveAttribute('aria-selected', 'true');
    if (name === 'Controlled tree') expect(await calls(page)).toEqual(['selected:parent', 'expanded:parent', 'expanded:']);

    // A chevron click on an expanded parent of the selection collapses it without moving the selection.
    await chevron.click();
    await child.click();
    await expect(child).toHaveAttribute('aria-selected', 'true');
    await chevron.click();
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    await expect(parent).toHaveAttribute('aria-selected', 'false');

    // The keyboard is unchanged: one Tab stop, arrows expand and collapse, Enter selects.
    await parent.focus();
    await page.keyboard.press('ArrowRight');
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(child).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(parent).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await expect(parent).toHaveAttribute('aria-selected', 'true');
    await expect(tree.locator('[tabindex="0"]')).toHaveCount(1);
  });
}

test('the chevron is a 24px ghost control that takes the hover from its row', async ({ page }) => {
  await page.goto('/test/browser/tree-fixture.html');
  for (const name of ['Start tree', 'End tree', 'Plain end tree']) {
    const tree = page.getByRole('tree', { name, exact: true });
    const parent = tree.getByRole('treeitem', { name: 'Coordinator' });
    const row = parent.locator(':scope > .cr-tree-row');
    const chevron = row.locator('.cr-tree-toggle');
    const style = () => Promise.all([row, chevron].map(element => element.evaluate(node => {
      const computed = getComputedStyle(node);
      return { background: computed.backgroundColor, color: computed.color, cursor: computed.cursor };
    })));
    const rowBox = await row.boundingBox();
    const box = await chevron.boundingBox();
    expect([box!.width, box!.height]).toEqual([24, 24]);

    await page.mouse.move(0, 0);
    const [restRow, restChevron] = await style();
    await row.hover({ position: { x: 200, y: 20 } });
    const [hoverRow] = await style();
    await chevron.hover();
    const [rowWhileChevron, hoverChevron] = await style();
    expect(hoverChevron.cursor).toBe('pointer');
    expect(hoverChevron.background).not.toBe(restChevron.background);
    expect(rowWhileChevron.background, `${name}: the row keeps its rest background`).toBe(restRow.background);
    if (name !== 'Plain end tree') expect(hoverRow.background).not.toBe(restRow.background);
    expect(await row.boundingBox()).toEqual(rowBox);

    // On the selected row the hover is a light tint over the active background.
    await row.click({ position: { x: 200, y: 20 } });
    await page.mouse.move(0, 0);
    const [, selectedRest] = await style();
    await chevron.hover();
    const [selectedRow, selectedHover] = await style();
    expect(selectedHover.background).not.toBe(selectedRest.background);
    expect(selectedRow.background).toBe(await row.evaluate(node => getComputedStyle(node).backgroundColor));
    expect(await chevron.boundingBox()).toEqual(box);
  }
});

test('the end chevron follows the title and leaves reserve no space', async ({ page }) => {
  await page.goto('/test/browser/tree-fixture.html');
  const tree = page.getByRole('tree', { name: 'End tree', exact: true });
  const title = tree.getByRole('treeitem', { name: 'Coordinator' }).locator(':scope > .cr-tree-row strong');
  const chevron = title.locator('.cr-tree-toggle');
  const [titleBox, chevronBox] = [await title.boundingBox(), await chevron.boundingBox()];
  expect(chevronBox!.x).toBeGreaterThan(titleBox!.x + 40);
  const leafRow = tree.getByRole('treeitem', { name: 'Other' }).locator(':scope > .cr-tree-row');
  const leafText = leafRow.locator('strong');
  expect((await leafText.boundingBox())!.x - (await leafRow.boundingBox())!.x).toBeLessThan(20);
});
