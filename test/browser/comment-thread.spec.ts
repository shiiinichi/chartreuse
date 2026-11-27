import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const open = (page: Page) => page.goto('/test/browser/comment-thread-fixture.html');
const log = (page: Page) => page.evaluate(() => (window as unknown as { menuLog: string[] }).menuLog);

test('Menu follows the menu button keyboard pattern', async ({ page }) => {
  await open(page);
  const wide = page.getByTestId('wide');
  const trigger = wide.getByRole('button', { name: 'More actions for #5' });
  await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'More actions for #5' });
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(menu.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Copy link' })).toBeFocused();
  // The disabled Archive item and the separator are skipped.
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('Home');
  await page.keyboard.press('c');
  await expect(menu.getByRole('menuitem', { name: 'Copy link' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await page.keyboard.press('ArrowUp');
  await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await log(page)).toEqual(['delete 5']);

  await page.keyboard.press('Enter');
  await expect(menu.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu).toBeHidden();
  await expect(trigger).not.toBeFocused();
});

test('Menu runs a clicked item, ignores a disabled one, and closes on an outside click', async ({ page }) => {
  await open(page);
  const trigger = page.getByTestId('wide').getByRole('button', { name: 'More actions for #5' });
  const menu = page.getByRole('menu', { name: 'More actions for #5' });
  await trigger.click();
  await menu.getByRole('menuitem', { name: 'Archive' }).click({ force: true });
  await expect(menu).toBeVisible();
  await menu.getByRole('menuitem', { name: 'Copy link' }).click();
  await expect(menu).toBeHidden();
  expect(await log(page)).toEqual(['copy 5']);
  await trigger.click();
  await page.getByTestId('outside').click();
  await expect(menu).toBeHidden();
  // The menu lines up with the trigger's end edge.
  await trigger.click();
  const [t, m] = [(await trigger.boundingBox())!, (await menu.boundingBox())!];
  expect(Math.abs(t.x + t.width - (m.x + m.width))).toBeLessThanOrEqual(1);
});

test('an inline composer keeps the field, controls, and send on one row and grows with the draft', async ({ page }) => {
  await open(page);
  const composer = page.getByTestId('wide').locator('.cr-message-composer');
  const field = composer.getByRole('textbox', { name: 'Reply to #5' });
  await expect(composer.locator('.cr-message-composer-footer')).toHaveCount(0);
  await expect(field).toHaveAttribute('aria-describedby', /-hint/);
  const parts = async () => Promise.all([field, composer.locator('.cr-split-button'), composer.getByRole('button', { name: 'Send message' })].map(async part => (await part.boundingBox())!));
  const [rest, split, send] = await parts();
  for (const box of [split, send]) {
    expect(Math.abs(box.y - rest.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(box.height - rest.height)).toBeLessThanOrEqual(1);
  }
  await field.fill('One\nTwo\nThree');
  const [grown, splitAfter, sendAfter] = await parts();
  expect(grown.height).toBeGreaterThan(rest.height + 30);
  // A wrapped draft takes the full width; the controls and send sit on the bottom line below it.
  expect(grown.width).toBeGreaterThan(rest.width + splitAfter.width);
  for (const box of [splitAfter, sendAfter]) expect(box.y).toBeGreaterThanOrEqual(grown.y + grown.height - 1);
  expect(Math.abs(sendAfter.x + sendAfter.width - (grown.x + grown.width))).toBeLessThanOrEqual(6);
  await field.fill('x'.repeat(30));
  expect(Math.abs((await field.boundingBox())!.width - rest.width)).toBeLessThanOrEqual(1);
  await field.fill('x'.repeat(200));
  expect((await field.boundingBox())!.width).toBeGreaterThan(rest.width + splitAfter.width);
  await field.fill('');
  expect(Math.round((await field.boundingBox())!.height)).toBe(Math.round(rest.height));
});

test('iconOnly="narrow" keeps only the icon in a narrow inline composer', async ({ page }) => {
  await open(page);
  for (const [id, iconOnly] of [['wide', false], ['narrow', true]] as const) {
    const composer = page.getByTestId(id).locator('.cr-message-composer');
    const action = composer.getByRole('button', { name: 'Ask agent' });
    await expect(action).toHaveAttribute('title', 'Ask agent');
    const box = (await action.boundingBox())!;
    if (iconOnly) expect(box.width).toBe(box.height);
    else expect(box.width).toBeGreaterThan(box.height * 2);
  }
});

test('the thread shows the latest replies, reveals earlier ones, and collapses to a summary', async ({ page }) => {
  await open(page);
  const thread = page.getByTestId('wide');
  const replies = thread.locator('.cr-comment-reply');
  await expect(replies).toHaveCount(2);
  await thread.getByRole('button', { name: 'Show 2 earlier replies' }).click();
  await expect(replies).toHaveCount(4);
  await expect(replies.first()).toBeFocused();
  const toggle = thread.locator('.cr-comment-thread-collapse');
  const composer = thread.locator('.cr-message-composer');
  const before = (await toggle.boundingBox())!;
  const composerBefore = (await thread.locator('.cr-comment-thread-bar').boundingBox())!;
  await toggle.click();
  await expect(toggle).toHaveText('Expand');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(replies).toHaveCount(4);
  await expect(replies.first()).toBeHidden();
  await expect(thread.locator('.cr-comment-thread-summary')).toHaveText(/4 replies\s*· latest from Agent, 5:37 PM/);
  // The toggle and the bar stay exactly where they were, and the composer stays in the band.
  const collapsedBox = (await toggle.boundingBox())!;
  expect(collapsedBox.y).toBeCloseTo(before.y, 0);
  expect(collapsedBox.x + collapsedBox.width).toBeCloseTo(before.x + before.width, 0);
  expect((await thread.locator('.cr-comment-thread-bar').boundingBox())!.y).toBeCloseTo(composerBefore.y, 0);
  await expect(thread.locator('.cr-comment-thread-replies .cr-message-composer')).toHaveCount(1);
  await expect(composer).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveText('Collapse');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toBeFocused();
  const after = (await toggle.boundingBox())!;
  expect(after.y).toBeCloseTo(before.y, 0);
  expect(after.x + after.width).toBeCloseTo(before.x + before.width, 0);
  await expect(replies.first()).toBeVisible();
});

test('times shorten in a narrow thread and keep the full date in the tooltip', async ({ page }) => {
  await open(page);
  const time = (id: string) => page.getByTestId(id).locator('.cr-comment-thread-main time');
  await expect(time('wide')).toHaveText('Nov 25, 6:10 PM', { useInnerText: true });
  await expect(time('narrow')).toHaveText('6:10 PM', { useInnerText: true });
  await expect(time('narrow')).toHaveAttribute('title', '11/25/2026, 6:10:16 PM');
});

test('a clamped reply shows its toggle only when it overflows, and focus past the edge expands it', async ({ page }) => {
  await open(page);
  const thread = page.getByTestId('wide');
  const long = thread.locator('[data-comment-id="6"]');
  await expect(thread.locator('[data-comment-id="7"]').getByRole('button', { name: 'Show full reply' })).toHaveCount(0);
  const toggle = long.getByRole('button', { name: 'Show full reply' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const body = long.locator('.cr-markdown');
  const lineHeight = await body.evaluate(element => parseFloat(getComputedStyle(element).lineHeight));
  expect(Math.round((await body.boundingBox())!.height)).toBe(Math.round(6 * lineHeight));
  await toggle.click();
  await expect(long.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
  expect((await body.boundingBox())!.height).toBeGreaterThan(12 * lineHeight);
  await long.getByRole('button', { name: 'Show less' }).click();
  await long.getByRole('link', { name: 'Last link' }).focus();
  await expect(long.getByRole('button', { name: 'Show less' })).toBeVisible();
});

test('highlighted and danger-footer cards', async ({ page }) => {
  await open(page);
  const ring = await page.getByTestId('highlighted').evaluate(element => getComputedStyle(element).boxShadow);
  expect(ring).toContain('3px');
  const footer = page.getByTestId('deleting').locator('footer');
  const [footerBg, dangerBg] = await footer.evaluate(element => [getComputedStyle(element).backgroundColor, getComputedStyle(document.documentElement).getPropertyValue('--cr-color-danger-bg')]);
  expect(footerBg).not.toBe('rgba(0, 0, 0, 0)');
  expect(dangerBg).toBeTruthy();
});

test('an ask sits above its reply in one item, with its own anchor, clamp, and narrow meta', async ({ page }) => {
  await open(page);
  const wide = page.getByTestId('asks-wide');
  const item = wide.getByRole('article', { name: 'Your ask #7 and reply #8' });
  const ask = item.getByRole('group', { name: 'Your ask #7' });
  await expect(ask).toHaveAttribute('id', 'comment-7');
  await expect(ask.locator('.cr-comment-ask-intro')).toHaveText('You asked');
  await expect(ask.locator('.cr-comment-ask-meta')).toHaveText('#7 · 6:46 PM', { useInnerText: true });
  await expect(ask.locator('.cr-comment-ask-agent')).toHaveAttribute('title', 'Claude Code · opus · Medium');
  await expect(ask.getByRole('button', { name: 'More actions for #ask 7' })).toBeVisible();
  await expect(ask.getByRole('button', { name: 'Show more' })).toHaveCount(0);
  // The ask comes before the reply header.
  const [askBox, header] = [(await ask.boundingBox())!, (await item.locator('.cr-comment-header').boundingBox())!];
  expect(askBox.y + askBox.height).toBeLessThanOrEqual(header.y);

  const pending = wide.getByRole('article', { name: 'Your ask #9 and pending reply' });
  await expect(pending.locator('.cr-comment-header')).toHaveCount(0);
  await expect(pending.getByTestId('running')).toBeVisible();
  const text = pending.locator('.cr-comment-ask-text .cr-markdown');
  const line = await text.evaluate(element => parseFloat(getComputedStyle(element).lineHeight));
  expect(Math.round((await text.boundingBox())!.height)).toBe(Math.round(2 * line));
  await pending.getByRole('button', { name: 'Show more' }).click();
  expect((await text.boundingBox())!.height).toBeGreaterThan(2 * line + 1);

  const narrowLine = page.getByTestId('asks-narrow').getByRole('group', { name: 'Your ask #7' }).locator('.cr-comment-ask-meta');
  await expect(narrowLine).toHaveText('#7', { useInnerText: true });
});

test('the danger footer text matches the comment body and keeps its buttons centred', async ({ page }) => {
  await open(page);
  const text = page.getByTestId('confirm-text');
  const body = page.getByTestId('deleting').locator('.cr-comment-plain, .cr-markdown').first();
  const style = (locator: typeof text) => locator.evaluate(element => [getComputedStyle(element).fontSize, getComputedStyle(element).lineHeight]);
  expect(await style(text)).toEqual(await style(body));
  expect(await style(text)).toEqual(['13px', '20.8px']);
  const t = (await text.boundingBox())!;
  for (const name of ['Keep', 'Delete']) {
    const b = (await page.getByTestId('deleting').getByRole('button', { name, exact: true }).boundingBox())!;
    expect(Math.abs(b.y + b.height / 2 - (t.y + t.height / 2))).toBeLessThanOrEqual(1);
  }
});

test('Menu highlights only the hovered item, never the focused one', async ({ page }) => {
  await open(page);
  const background = (name: string) => page.getByRole('menuitem', { name, exact: true }).evaluate(element => getComputedStyle(element).backgroundColor);
  await page.getByTestId('wide').getByRole('button', { name: 'More actions for #5' }).click();
  await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  const resting = await background('Copy link');
  // Chartreuse draws no focus styles; the app supplies them.
  expect(await background('Edit')).toBe(resting);
  await page.getByRole('menuitem', { name: 'Copy link' }).hover();
  expect(await background('Copy link')).not.toBe(resting);
  await page.mouse.move(0, 0);
  await page.keyboard.press('ArrowDown');
  expect(await background('Delete')).toBe(resting);
});

test('RunStatus spans the reply, truncates its step, and shows an icon-only Stop when narrow', async ({ page }) => {
  await open(page);
  for (const [id, iconOnly] of [['asks-wide', false], ['asks-narrow', true]] as const) {
    const status = page.getByTestId(id).getByTestId('running');
    const row = status.locator('.cr-run-status-row');
    const item = page.getByTestId(id).getByRole('article', { name: 'Your ask #9 and pending reply' });
    expect(Math.abs((await row.boundingBox())!.width - ((await item.boundingBox())!.width - 12))).toBeLessThanOrEqual(3);
    expect(await row.evaluate(element => [getComputedStyle(element).fontSize, getComputedStyle(element).borderTopWidth, getComputedStyle(element).borderTopLeftRadius])).toEqual(['13px', '1px', '6px']);
    await expect(status.locator('.cr-run-status-label')).toHaveAttribute('title', 'Reading docs/spec-1.md');
    await expect(status.getByRole('status')).toHaveText('Reading docs/spec-1.md');
    const stop = status.getByRole('button', { name: 'Stop agent reply' });
    const box = (await stop.boundingBox())!;
    if (iconOnly) expect(Math.round(box.width)).toBe(Math.round(box.height));
    else expect(box.width).toBeGreaterThan(box.height + 10);
  }
  // The row is as tall as the inline composer beside it.
  const composerHeight = (await page.getByTestId('wide').locator('.cr-message-composer').boundingBox())!.height;
  expect((await page.getByTestId('asks-wide').locator('.cr-run-status-row').boundingBox())!.height).toBeCloseTo(composerHeight, 0);
  await page.getByTestId('asks-wide').getByRole('button', { name: 'Stop agent reply' }).click();
  expect(await log(page)).toEqual(['stop 10']);
});

test('CommentThread keeps 16px between its content and every card edge', async ({ page }) => {
  await open(page);
  const insets = (testId: string) => page.getByTestId(testId).locator('.cr-comment-thread').evaluate(thread => {
    const card = thread.getBoundingClientRect();
    const border = parseFloat(getComputedStyle(thread).borderTopWidth);
    const header = thread.querySelector('.cr-comment-thread-main > .cr-comment-header')!.getBoundingClientRect();
    const composer = [...thread.querySelectorAll('.cr-comment-thread-composer')].pop()!.getBoundingClientRect();
    const round = (value: number) => Math.round(value * 100) / 100;
    return {
      top: round(header.top - card.top - border), bottom: round(card.bottom - border - composer.bottom),
      left: round(composer.left - card.left - border), right: round(card.right - border - composer.right),
      headerLeft: round(header.left - card.left - border), headerRight: round(card.right - border - header.right),
    };
  });
  const before = { noReplies: await insets('no-replies'), withReplies: await insets('wide') };
  // The composer's own focus treatment must not move it.
  await page.getByTestId('no-replies').getByRole('textbox').focus();
  const focused = await insets('no-replies');
  for (const value of [before.noReplies, before.withReplies, focused]) {
    expect(value).toEqual({ top: 16, bottom: 16, left: 16, right: 16, headerLeft: 16, headerRight: 16 });
  }
  // Narrow threads keep their dense 10px by 12px padding.
  const narrow = await insets('narrow');
  expect(narrow).toMatchObject({ top: 10, bottom: 10, left: 12, right: 12 });
});
