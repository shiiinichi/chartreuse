import { expect, test, type Locator, type Page } from '@playwright/test';

const variants = ['primary', 'secondary', 'accent', 'ghost', 'danger'] as const;
const heights = { sm: 32, md: 40, lg: 46 } as const;

async function open(page: Page) {
  await page.goto('/test/browser/split-button-fixture.html');
  await expect(page.getByRole('heading', { name: 'Split button fixture' })).toBeVisible();
}

/** Both segments' boxes, the seam, the corners, and the seam border, read from layout and computed style. */
function geometry(group: Locator) {
  return group.evaluate(element => {
    const [action, menu] = element.querySelectorAll<HTMLElement>(':scope > .cr-button');
    const a = action.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const g = element.getBoundingClientRect();
    const as = getComputedStyle(action);
    const ms = getComputedStyle(menu);
    const radii = (style: CSSStyleDeclaration) => [style.borderStartStartRadius, style.borderStartEndRadius, style.borderEndEndRadius, style.borderEndStartRadius];
    return {
      groupHeight: g.height, actionHeight: a.height, menuHeight: m.height, menuWidth: m.width,
      topOffset: m.top - a.top, bottomOffset: m.bottom - a.bottom,
      overlap: Math.round((a.right - m.left) * 100) / 100,
      widthSum: Math.round((a.width + m.width - 1 - g.width) * 100) / 100,
      actionRadii: radii(as), menuRadii: radii(ms),
      seamWidth: ms.borderInlineStartWidth, seamColor: ms.borderInlineStartColor, actionEndColor: as.borderInlineEndColor,
      actionTranslate: as.translate, menuTranslate: ms.translate, groupTranslate: getComputedStyle(element).translate,
    };
  });
}

function expectJoined(box: Awaited<ReturnType<typeof geometry>>, height: number) {
  expect(box.groupHeight).toBe(height);
  expect(box.actionHeight).toBe(height);
  expect(box.menuHeight).toBe(height);
  expect(box.topOffset).toBe(0);
  expect(box.bottomOffset).toBe(0);
  expect(box.overlap).toBe(1);
  expect(box.widthSum).toBe(0);
  expect(box.seamWidth).toBe('1px');
  expect(box.actionRadii[1]).toBe('0px');
  expect(box.actionRadii[2]).toBe('0px');
  expect(box.menuRadii[0]).toBe('0px');
  expect(box.menuRadii[3]).toBe('0px');
  expect(box.actionRadii[0]).toBe(box.menuRadii[1]);
  expect(box.actionRadii[0]).not.toBe('0px');
}

test('every variant joins its segments with one seam at rest and with either segment disabled', async ({ page }) => {
  await open(page);
  for (const variant of variants) {
    const groups = page.getByTestId(`variant-${variant}`).getByRole('group');
    await expect(groups).toHaveCount(3);
    const seams = new Set<string>();
    for (const group of await groups.all()) {
      const box = await geometry(group);
      expectJoined(box, heights.md);
      expect(box.menuWidth).toBe(heights.md);
      seams.add(box.seamColor);
    }
    // The seam is drawn by the menu segment, so disabling either segment keeps the same color.
    expect(seams.size, variant).toBe(1);
    expect([...seams][0], variant).not.toBe('rgba(0, 0, 0, 0)');
  }
});

test('each size matches the Button beside it and keeps a square menu segment', async ({ page }) => {
  await open(page);
  for (const [size, height] of Object.entries(heights)) {
    const row = page.getByTestId(`size-${size}`);
    const cancel = await row.getByRole('button', { name: 'Cancel' }).boundingBox();
    const box = await geometry(row.getByRole('group'));
    expectJoined(box, height);
    expect(box.menuWidth).toBe(height);
    expect(cancel?.height).toBe(height);
  }
});

test('hovering or pressing a segment keeps the seam aligned', async ({ page }) => {
  await open(page);
  for (const variant of variants) {
    const group = page.getByTestId(`variant-${variant}`).getByRole('group').first();
    const rest = await geometry(group);
    for (const segment of [group.getByRole('button', { name: 'Run' }), group.getByRole('combobox', { name: `${variant} options` })]) {
      await segment.hover();
      const hovered = await geometry(group);
      expectJoined(hovered, heights.md);
      expect(hovered.seamColor).toBe(rest.seamColor);

      await page.mouse.down();
      const pressed = await geometry(group);
      expectJoined(pressed, heights.md);
      expect(pressed.groupTranslate).toBe('0px 1px');
      expect(pressed.actionTranslate).toBe('none');
      expect(pressed.menuTranslate).toBe('none');
      await page.mouse.up();
      await page.keyboard.press('Escape');
    }
  }
});

test('a disabled segment does not press the group', async ({ page }) => {
  await open(page);
  const group = page.getByTestId('variant-primary').getByRole('group').nth(1);
  await group.getByRole('button', { name: 'Run' }).hover({ force: true });
  await page.mouse.down();
  expect((await geometry(group)).groupTranslate).toBe('none');
  await page.mouse.up();
});

test('the group is labeled and Tab reaches both segments without changing their geometry', async ({ page }) => {
  await open(page);
  const row = page.getByTestId('custom');
  const group = row.getByRole('group', { name: 'Ask agent' });
  await expect(group).toBeVisible();
  const rest = await geometry(group);
  await row.getByRole('button', { name: 'Post reply' }).focus();
  await page.keyboard.press('Tab');
  await expect(group.getByRole('button', { name: 'Ask agent' })).toBeFocused();
  expectJoined(await geometry(group), heights.md);
  await page.keyboard.press('Tab');
  const menu = group.getByRole('button', { name: 'Agent for this request: opus' });
  await expect(menu).toBeFocused();
  expect(await menu.evaluate(element => element.matches(':focus-visible'))).toBe(true);
  const focused = await geometry(group);
  expectJoined(focused, heights.md);
  expect(focused.seamColor).toBe(rest.seamColor);
  await expect(menu).toHaveAttribute('title', 'Agent for this request: opus');
});

test('Tab skips a disabled action and reaches the menu', async ({ page }) => {
  await open(page);
  const groups = page.getByTestId('variant-secondary').getByRole('group');
  await groups.first().getByRole('combobox', { name: 'secondary options' }).focus();
  await page.keyboard.press('Tab');
  await expect(groups.nth(1).getByRole('combobox', { name: 'secondary options, action disabled' })).toBeFocused();
  await expect(groups.nth(2).getByRole('combobox', { name: 'secondary options, menu disabled' })).toBeDisabled();
});

test('the menu segment opens with Enter, Space, or ArrowDown and Escape returns focus', async ({ page }) => {
  await open(page);
  const group = page.getByTestId('custom').getByRole('group');
  const menu = group.getByRole('button', { name: /^Agent for this request/ });
  const panel = page.locator('.cr-button-select-panel:popover-open');
  for (const key of ['Enter', 'Space', 'ArrowDown']) {
    await menu.focus();
    await page.keyboard.press(key);
    await expect(panel, key).toBeVisible();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    // The popover aligns to the start of the whole control, not the menu segment.
    const [groupBox, panelBox] = await Promise.all([group.boundingBox(), panel.boundingBox()]);
    expect(Math.abs(panelBox!.x - groupBox!.x), key).toBeLessThan(1);
    expect(panelBox!.y).toBeGreaterThan(groupBox!.y + groupBox!.height);
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
  await menu.click();
  await panel.locator('select').selectOption('sonnet');
  await panel.getByRole('button', { name: 'Done' }).click();
  await expect(panel).toHaveCount(0);
  await expect(group.getByRole('button', { name: 'Agent for this request: sonnet' })).toBeFocused();
});

test('built-in options choose a value while the action runs on its own', async ({ page }) => {
  await open(page);
  const row = page.getByTestId('built-in');
  const menu = row.getByRole('combobox', { name: 'Run target' });
  await row.getByRole('button', { name: 'Run tests' }).click();
  await expect(row.getByTestId('built-in-state')).toHaveText('tests:1');
  await menu.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox', { name: 'Run target' })).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(row.getByTestId('built-in-state')).toHaveText('lint:1');
  await expect(row.getByRole('button', { name: 'Run lint' })).toBeVisible();
  await expect(menu).toBeFocused();
});

test('an sm split button sits at the height of the sm send button in MessageComposer controls', async ({ page }) => {
  await open(page);
  const composer = page.getByTestId('composer');
  const send = await composer.getByRole('button', { name: 'Post comment' }).boundingBox();
  const box = await geometry(composer.getByRole('group', { name: 'Ask agent' }));
  expectJoined(box, heights.sm);
  expect(send?.height).toBe(heights.sm);
});

test('divider={false} hides the seam in every state and keeps the 1px join', async ({ page }) => {
  await open(page);
  for (const variant of variants) {
    const group = page.getByTestId(`no-divider-${variant}`).getByRole('group', { name: 'GA-003' });
    await expect(group).toHaveAttribute('data-divider', 'false');
    const action = group.getByRole('button', { name: 'GA-003' });
    const menu = group.getByRole('combobox', { name: `Switch ${variant} board` });
    const states = [
      async () => {},
      async () => action.hover(),
      async () => menu.hover(),
      async () => { await page.mouse.move(0, 0); await action.focus(); },
      async () => menu.focus(),
    ];
    for (const enter of states) {
      await enter();
      const box = await geometry(group);
      expectJoined(box, heights.sm);
      expect(box.menuWidth, variant).toBe(heights.sm);
      expect(box.seamColor, variant).toBe('rgba(0, 0, 0, 0)');
      expect(box.actionEndColor, variant).toBe('rgba(0, 0, 0, 0)');
    }
  }
  // The default still draws the seam.
  const withDivider = await geometry(page.getByTestId('variant-ghost').getByRole('group').first());
  expect(withDivider.seamColor).not.toBe('rgba(0, 0, 0, 0)');
});

test('forced colors keep each segment outlined without a divider', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await open(page);
  const box = await geometry(page.getByTestId('no-divider-ghost').getByRole('group'));
  expectJoined(box, heights.sm);
  expect(box.seamColor).not.toBe('rgba(0, 0, 0, 0)');
});

test.describe('coarse pointers', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('segments follow Button touch sizing and the md menu widens to 44px', async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    for (const size of ['sm', 'md', 'lg'] as const) {
      const row = page.getByTestId(`size-${size}`);
      const cancel = (await row.getByRole('button', { name: 'Cancel' }).boundingBox())!.height;
      const box = await geometry(row.getByRole('group'));
      expectJoined(box, cancel);
      if (size === 'md') expect(box.menuWidth).toBe(44);
      if (size === 'md') expect(cancel).toBe(44);
    }
  });
});
