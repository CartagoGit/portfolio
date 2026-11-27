import { expect, type Page, test } from '@playwright/test';

async function openDemos(page: Page): Promise<void> {
	await page.goto('/es/demos', { waitUntil: 'networkidle' });
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');
}

test('Demos lab-01 every compact experience reacts to real input', async ({ page }) => {
	await openDemos(page);
	await page.locator('#demo-tab-reflex').click();
	const reflex = page.locator('app-reflex-game');
	await reflex.locator('.reflex-game__actions button').first().click();
	await reflex.locator('.reflex-game__grid button.is-target').click();
	await expect(reflex.locator('.reflex-game__metrics dd').first()).toContainText('1 / 10');

	await page.locator('#demo-tab-reaction').click();
	const reaction = page.locator('app-reaction-game');
	await reaction.locator('.reaction-game__surface').click();
	await reaction.locator('.reaction-game__surface').click();
	await expect(reaction.locator('.reaction-game')).toHaveAttribute('data-phase', 'result');

	await page.locator('#demo-tab-memory').click();
	const memory = page.locator('app-memory-game');
	await memory.locator('.memory-game__grid button').nth(0).click();
	await memory.locator('.memory-game__grid button').nth(1).click();
	await expect(memory.locator('.memory-game__metrics dd').first()).toHaveText('1');

	await page.locator('#demo-tab-dice').click();
	const dice = page.locator('app-dice-game');
	await dice.locator('.dice-game__die').click();
	await expect(dice.locator('.dice-game__history span')).not.toHaveCount(0);

	await page.locator('#demo-tab-rps').click();
	const rps = page.locator('app-rps-game');
	await rps.locator('.rps-game__choices button').first().click();
	await expect(rps.locator('.rps-game')).toHaveAttribute('data-phase', 'result');
	await expect(rps.locator('.rps-game__metrics dd').nth(1)).toHaveText('1');

	await page.locator('#demo-tab-color').click();
	const color = page.locator('app-color-game');
	await color.locator('.color-game__actions button').first().click();
	const targetColor = await color.locator('.color-game__target').evaluate((element) => getComputedStyle(element).getPropertyValue('--target-color').trim());
	const choiceIndex = await color.locator('.color-game__options button').evaluateAll((buttons, colorValue) => buttons.findIndex((button) => getComputedStyle(button).getPropertyValue('--choice-color').trim() === colorValue), targetColor);
	await color.locator('.color-game__options button').nth(choiceIndex).click();
	await expect(color.locator('.color-game__metrics dd').first()).toContainText('1 /');

	await page.locator('#demo-tab-tap').click();
	const tap = page.locator('app-tap-game');
	await tap.locator('.tap-game__board > button').click();
	await tap.locator('.tap-game__board > button').click();
	await expect(tap.locator('.tap-game__metrics dd').first()).toHaveText(/^1 \/ \d+$/);

	await page.locator('#demo-tab-guess').click();
	const guess = page.locator('app-guess-game');
	await guess.locator('input').fill('25');
	await guess.locator('button[type="submit"]').click();
	await expect(guess.locator('.guess-game__metrics dd').first()).toContainText('1 /');
});

test('Demos lab-02 all showcase scenes expose a changing readout and reset', async ({ page }) => {
	await openDemos(page);
	const scenes = ['depth', 'flow', 'signal', 'latency', 'particles', 'orbits'] as const;
	for (const scene of scenes) {
		await page.locator(`#showcase-tab-${scene}`).click();
		const before = await page.locator('#showcase-scene-status strong').textContent();
		await page.locator('.showcase__activate').click();
		await expect(page.locator('#showcase-scene-status strong')).not.toHaveText(before ?? '');
		await page.locator('.showcase__controls button').nth(1).click();
		await expect(page.locator('.showcase__stage')).toHaveAttribute('data-scene', scene);
	}
});

test('Demos lab-03 mobile controls remain visible in fullscreen', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await openDemos(page);
	await page.locator('.demo-games__fullscreen').click();
	const stage = page.locator('.demo-games__stage');
	await expect(stage).toHaveClass(/is-fallback-fullscreen/);
	const buttons = stage.locator('.demo-games__panel:not([hidden]) button:visible');
	const sizes = await buttons.evaluateAll((elements) => elements.map((element) => {
		const bounds = element.getBoundingClientRect();
		return { width: bounds.width, height: bounds.height };
	}));
	for (const size of sizes) {
		expect(size.width).toBeGreaterThanOrEqual(44);
		expect(size.height).toBeGreaterThanOrEqual(44);
	}
	await page.keyboard.press('Escape');
	await expect(stage).not.toHaveClass(/is-fallback-fullscreen/);
});
