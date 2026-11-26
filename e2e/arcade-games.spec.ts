import { expect, type Locator, type Page, test } from '@playwright/test';

const GAME_TABS = ['runner', 'shooter', 'lanes', 'penalty', 'rpg', 'maze'] as const;

async function openDemos(page: Page): Promise<void> {
	await page.goto('/es/demos', { waitUntil: 'networkidle' });
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');
	await expect(page.locator('app-arcade-games')).toBeVisible();
}

async function selectGame(page: Page, id: (typeof GAME_TABS)[number]): Promise<void> {
	await page.locator(`#arcade-tab-${id}`).click();
	await expect(page.locator('.arcade-games__stage')).toHaveAttribute('data-arcade-game', id);
}

async function startGame(game: Locator): Promise<void> {
	await game.locator('[data-arcade-action="start"]').click();
	await expect(game).toHaveAttribute('data-game-state', 'running');
	await expect(game.locator('[arcade-stage]')).toBeFocused();
}

test('Arcade-01 six real games accept and score player actions', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await openDemos(page);
	await expect(page.locator('.arcade-games__tabs [role="tab"]')).toHaveCount(6);

	const runner = page.locator('app-runner-game');
	await startGame(runner);
	await runner.locator('.runner-game__controls button').click();
	await expect.poll(() => runner.locator('.runner-game__player').evaluate((element) => getComputedStyle(element).transform)).not.toBe('none');

	await selectGame(page, 'shooter');
	const shooter = page.locator('app-shooter-game');
	await startGame(shooter);
	await shooter.locator('.shooter-game__controls button').click();
	await expect(shooter.locator('.shooter-game__readout')).toContainText('1');

	await selectGame(page, 'lanes');
	const lanes = page.locator('app-lane-rush-game');
	await startGame(lanes);
	const beforeLane = await lanes.locator('.lane-rush-game__player').evaluate((element) => (element as HTMLElement).style.left);
	await lanes.locator('.lane-rush-game__controls button').last().click();
	await expect.poll(() => lanes.locator('.lane-rush-game__player').evaluate((element) => (element as HTMLElement).style.left)).not.toBe(beforeLane);

	await selectGame(page, 'penalty');
	const penalty = page.locator('app-penalty-game');
	await startGame(penalty);
	await penalty.locator('.penalty-game__zone').first().click();
	await penalty.locator('.penalty-game__controls button').click();
	await expect(penalty.locator('[data-hud-lives]')).toHaveText('4');
	await expect(penalty.locator('.penalty-game__stage')).toHaveAttribute('data-result', /goal|saved/);

	await selectGame(page, 'rpg');
	const rpg = page.locator('app-rpg-battle-game');
	await startGame(rpg);
	const enemyBefore = await rpg.locator('.rpg-battle-game__fighter--enemy small').textContent();
	await rpg.locator('.rpg-battle-game__controls button').first().click();
	await expect(rpg.locator('.rpg-battle-game__fighter--enemy small')).not.toHaveText(enemyBefore ?? '');

	await selectGame(page, 'maze');
	const maze = page.locator('app-maze-collector-game');
	await startGame(maze);
	const playerIndex = () => maze.locator('.maze-collector-game__cell').evaluateAll((cells) => cells.findIndex((cell) => cell.querySelector('.maze-collector-game__player')));
	const beforeMove = await playerIndex();
	await page.keyboard.press('ArrowRight');
	await expect.poll(playerIndex).not.toBe(beforeMove);
});

test('Arcade-02 mobile fullscreen keeps all six control sets usable', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await openDemos(page);
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
	expect(overflow).toBeLessThanOrEqual(0);

	await page.locator('.arcade-games__fullscreen').click();
	const arcade = page.locator('.arcade-games');
	await expect(arcade).toHaveClass(/is-fallback-fullscreen/);
	for (const id of GAME_TABS) {
		await selectGame(page, id);
		const game = arcade.locator(`[data-arcade-game="${id}"] > *`).first();
		await game.locator('[data-arcade-action="start"]').click();
		await expect(game.locator('[arcade-stage]')).toBeFocused();
		const controls = game.locator('[arcade-actions] button:visible');
		if (await controls.count()) {
			const sizes = await controls.evaluateAll((buttons) => buttons.map((button) => {
				const bounds = button.getBoundingClientRect();
				return { width: bounds.width, height: bounds.height };
			}));
			for (const size of sizes) {
				expect(size.width).toBeGreaterThanOrEqual(44);
				expect(size.height).toBeGreaterThanOrEqual(44);
			}
		}
		await game.locator('[data-arcade-action="reset"]').click();
	}
	await page.keyboard.press('Escape');
	await expect(arcade).not.toHaveClass(/is-fallback-fullscreen/);
});
