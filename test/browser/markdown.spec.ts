import { expect, test } from '@playwright/test';

// A wide table or code block scrolls sideways, which makes it a scroll container. A vertical wheel over it
// must still scroll the panel behind it, so only inline overscroll may be contained.
for (const [name, selector] of [['table', '.cr-markdown-table'], ['code block', '.cr-markdown pre']] as const) {
  test(`a vertical wheel over a wide Markdown ${name} scrolls the panel behind it`, async ({ page }) => {
    await page.goto('/test/browser/markdown-fixture.html');
    const panel = page.getByTestId('panel');
    const scroller = page.locator(selector).first();
    expect(await scroller.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    await scroller.scrollIntoViewIfNeeded();
    const before = await panel.evaluate(el => el.scrollTop);
    const box = (await scroller.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height / 2, 20));
    await page.mouse.wheel(0, 100);
    await page.mouse.wheel(0, 100);
    await expect.poll(() => panel.evaluate(el => el.scrollTop)).toBeGreaterThan(before);
  });
}
