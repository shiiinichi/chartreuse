import { expect, test } from '@playwright/test';

for (const name of ['Start tree', 'End tree']) {
  test(`${name}: a click selects, and a click on the selected branch toggles it`, async ({ page }) => {
    await page.goto('/test/browser/tree-fixture.html');
    const tree = page.getByRole('tree', { name });
    const parent = tree.getByRole('treeitem', { name: 'Coordinator' });
    const chevron = parent.locator(':scope > .cr-tree-row .cr-tree-toggle');
    await expect(chevron).toHaveAttribute('aria-hidden', 'true');
    await expect(chevron).not.toHaveAttribute('role', /.+/);
    // The first click selects without expanding, even on the chevron.
    await chevron.click();
    await expect(parent).toHaveAttribute('aria-selected', 'true');
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    // Clicking the selected branch again, anywhere on its row, toggles it.
    await parent.locator(':scope > .cr-tree-row').click({ position: { x: 200, y: 20 } });
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    const child = tree.getByRole('treeitem', { name: 'Reviewer' });
    await child.click();
    await expect(child).toHaveAttribute('aria-selected', 'true');
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await chevron.click();
    await expect(parent).toHaveAttribute('aria-selected', 'true');
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await chevron.click();
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    // A selected leaf stays selected; arrow keys still expand and collapse.
    const other = tree.getByRole('treeitem', { name: 'Other' });
    await other.click();
    await other.click();
    await expect(other).toHaveAttribute('aria-selected', 'true');
    await parent.focus();
    await page.keyboard.press('ArrowRight');
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowLeft');
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
  });
}

test('the end chevron follows the title and leaves reserve no space', async ({ page }) => {
  await page.goto('/test/browser/tree-fixture.html');
  const tree = page.getByRole('tree', { name: 'End tree' });
  const title = tree.getByRole('treeitem', { name: 'Coordinator' }).locator(':scope > .cr-tree-row strong');
  const chevron = title.locator('.cr-tree-toggle');
  const [titleBox, chevronBox] = [await title.boundingBox(), await chevron.boundingBox()];
  expect(chevronBox!.x).toBeGreaterThan(titleBox!.x + 40);
  const leafRow = tree.getByRole('treeitem', { name: 'Other' }).locator(':scope > .cr-tree-row');
  const leafText = leafRow.locator('strong');
  expect((await leafText.boundingBox())!.x - (await leafRow.boundingBox())!.x).toBeLessThan(20);
});
