import { expect, type Page, test } from '@playwright/test';

const ROUTES = ['', 'work', 'lab', 'approach', 'knowledge', 'docker', 'demos', 'contact'] as const;

async function openSpanishRoute(page: Page, route = ''): Promise<void> {
	await page.goto(`/es${route ? `/${route}` : ''}`, { waitUntil: 'networkidle' });
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');
}

async function expectNoHorizontalOverflow(page: Page, route: string): Promise<void> {
	const overflow = await page.evaluate(() =>
		Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
	);
	expect(overflow, `${route || 'home'} must not overflow horizontally`).toBe(0);
}

test('S14-01 monitor preserves preview, destinations and section state', async ({ page }) => {
	await openSpanishRoute(page);
	await page.mouse.move(10, 10);
	await expect(page.locator('.header__nav a')).toHaveCount(8);
	await expect(page.locator('.hero-monitor__chart-switcher button span')).toHaveCount(14);
	const monitorFullscreen = page.locator('.hero-monitor__fullscreen');
	await expect(monitorFullscreen).toHaveText('');
	const fullscreenBounds = await monitorFullscreen.boundingBox();
	const chromeBounds = await page.locator('.hero-monitor__chrome').boundingBox();
	expect(fullscreenBounds).not.toBeNull();
	expect(chromeBounds).not.toBeNull();
	expect(fullscreenBounds!.x + fullscreenBounds!.width).toBeLessThanOrEqual(chromeBounds!.x + chromeBounds!.width);
	expect(fullscreenBounds!.y + fullscreenBounds!.height).toBeLessThanOrEqual(chromeBounds!.y + chromeBounds!.height);
	const restingTransform = await page.locator('.hero-monitor__interface').evaluate((element) => getComputedStyle(element).transform);
	expect(restingTransform).not.toBe('none');
	await page.locator('.hero-monitor__selector button').filter({ hasText: 'DelendAI' }).click();
	await expect(page.locator('.hero-monitor__preview h3')).toHaveText('DelendAI');
	const destinations = page.locator('.hero-monitor__destination-primary');
	expect(await destinations.count(), 'DelendAI exposes verified destinations').toBeGreaterThan(1);
	await expect(destinations.first().locator('b')).toHaveCSS('text-overflow', 'ellipsis');
	await expect(destinations.first().locator('span')).toHaveCSS('text-overflow', 'ellipsis');
	for (const href of await destinations.evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
		expect(href, 'destination is HTTPS').toMatch(/^https:\/\//);

	await page.getByRole('button', { name: 'Tecnologías', exact: true }).click();
	await expect(page.locator('.hero-monitor__preview h3')).toHaveText('DelendAI');
	await expect(page.locator('.hero-monitor__selector')).toHaveAttribute('data-section', 'technologies');
	await expect.poll(() => page.locator('.hero-monitor__interface').evaluate((element) => {
		const matrix = new DOMMatrix(getComputedStyle(element).transform);
		return Math.max(Math.abs(matrix.m11 - 1), Math.abs(matrix.m22 - 1), Math.abs(matrix.m12), Math.abs(matrix.m21));
	})).toBeLessThan(.02);
});

test('S14-02 globe catalogue, token theme, stacking and return are stable', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('cartago-theme', 'light'));
	await openSpanishRoute(page);
	await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
	await expect(page.locator('app-hero-monitor')).toHaveClass(/hero-monitor-host--earth-front/);
	await expect(page.locator('.hero-monitor__earth-controls')).toHaveClass(/is-active/);

	await expect(page.getByRole('tab')).toHaveCount(6);
	const expectedCounts = [6, 10, 3, 5, 7, 3];
	let total = 0;
	for (let category = 0; category < expectedCounts.length; category += 1) {
		await page.locator('.hero-monitor__earth-categories button').nth(category).click();
		const buttons = page.locator('.hero-monitor__earth-textures button');
		await expect(buttons).toHaveCount(expectedCounts[category] ?? 0);
		total += await buttons.count();
	}
	expect(total, 'complete globe preset catalogue').toBe(34);

	const themeMatch = await page.evaluate(() => {
		const root = getComputedStyle(document.documentElement);
		return {
			scrim: getComputedStyle(document.querySelector('.hero-monitor__globe-scrim')!).backgroundColor,
			token: root.getPropertyValue('--scrim').trim(),
		};
	});
	expect(themeMatch.scrim).toBe(themeMatch.token);

	await page.locator('.hero-monitor__earth-close').click();
	await expect(page.locator('.hero-monitor__earth-controls')).not.toHaveClass(/is-active/, { timeout: 2_000 });
	await expect(page.locator('app-hero-monitor')).not.toHaveClass(/hero-monitor-host--earth-front/, { timeout: 2_000 });
});

test('S14-03 Work exposes project identity, distinct visual modes and iconized chips', async ({ page }) => {
	await openSpanishRoute(page, 'work');
	const cards = page.locator('.work-page__card');
	await expect(cards).toHaveCount(6);
	await expect(cards.locator('h3')).toHaveText([
		'DelendAI', 'Tanit', 'QuickModel', 'Print CV', 'Steam Keys', 'Keyer',
	]);
	await expect(page.locator('app-work-project-visual .work-project-visual > div')).toHaveCount(6);
	const visualModes = await page.locator('app-work-project-visual .work-project-visual > div').evaluateAll((elements) =>
		elements.map((element) => [...element.classList].find((name) => name.startsWith('work-project-visual__')) ?? ''),
	);
	expect(new Set(visualModes).size).toBe(6);
	for (const card of await cards.all()) {
		await expect(card.locator('.work-page__identity img, .work-page__identity svg')).toHaveCount(1);
		expect(await card.locator('.work-page__content li svg path[d]').count()).toBe(await card.locator('.work-page__content li').count());
	}
	await expect(page.locator('.work-page__experiment-grid app-evidence-card > a')).toHaveCount(4);
});

test('S14-04 route scroll, footer surfaces and back-to-top preserve locale/route', async ({ page }) => {
	await openSpanishRoute(page);
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	await page.getByRole('link', { name: 'Proyectos', exact: true }).first().click();
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	const surfaces = await page.evaluate(() => {
		const footer = getComputedStyle(document.querySelector('app-shell-footer')!);
		const copyright = getComputedStyle(document.querySelector('.footer__copyright')!);
		const badge = getComputedStyle(document.querySelector('app-shell-footer .profile-links__badge')!);
		return {
			footer: { background: footer.backgroundColor, border: footer.borderTopWidth, shadow: footer.boxShadow },
			copyright: copyright.backgroundColor,
			badge: badge.backgroundColor,
		};
	});
	expect(surfaces.footer).toEqual({ background: 'rgba(0, 0, 0, 0)', border: '0px', shadow: 'none' });
	expect(surfaces.copyright).not.toBe('rgba(0, 0, 0, 0)');
	expect(surfaces.badge).not.toBe('rgba(0, 0, 0, 0)');
	await page.getByRole('button', { name: 'Volver arriba ↑' }).click();
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
	await expect(page).toHaveURL(/\/es\/work$/);
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('S14-05 global search traps and restores focus', async ({ page }) => {
	await openSpanishRoute(page, 'lab');
	const trigger = page.getByRole('button', { name: 'Abrir buscador del portafolio' });
	await trigger.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const input = dialog.locator('input[type="search"]');
	await expect(input).toBeFocused();
	await input.fill('Tetris');
	const lastCommand = dialog.locator('.command-palette__commands a').last();
	await expect(lastCommand).toBeVisible();
	await lastCommand.focus();
	await page.keyboard.press('Tab');
	await expect(dialog.locator('button')).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(trigger).toBeFocused();
});

test('S14-06 route tabs are keyboard usable and every mobile route stays contained', async ({ page }) => {
	await openSpanishRoute(page, 'approach');
	await expect(page.locator('[role="tab"]')).toHaveCount(6);
	const firstTab = page.locator('[role="tab"]').first();
	await firstTab.focus();
	await page.keyboard.press('ArrowDown');
	await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);

	await openSpanishRoute(page, 'demos');
	await expect(page.locator('app-demos-showcase [role="tab"]')).toHaveCount(6);
	await page.locator('app-demos-showcase [role="tab"]').first().focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.locator('.showcase__stage')).toHaveAttribute('data-scene', 'flow');
	await expect(page.locator('.demo-games__tabs [role="tab"]')).toHaveCount(8);
	await page.getByRole('tab', { name: 'Reflejos', exact: true }).focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.locator('.demo-games__stage')).toHaveAttribute('data-game', 'reaction');
	await page.getByRole('tab', { name: 'Memoria', exact: true }).click();
	await expect(page.locator('.memory-game__grid button')).toHaveCount(12);
	for (const [label, game, component] of [
		['Dados', 'dice', 'app-dice-game'],
		['Roca, papel', 'rps', 'app-rps-game'],
		['Colores', 'color', 'app-color-game'],
		['Toques', 'tap', 'app-tap-game'],
		['Adivina', 'guess', 'app-guess-game'],
	] as const) {
		await page.getByRole('tab', { name: label, exact: true }).click();
		await expect(page.locator('.demo-games__stage')).toHaveAttribute('data-game', game);
		await expect(page.locator(component)).toHaveCount(1);
	}

	await page.setViewportSize({ width: 390, height: 844 });
	for (const route of ROUTES) {
		await openSpanishRoute(page, route);
		await expectNoHorizontalOverflow(page, route);
	}
});

test('S14-07 Contact stays viewport-sized with honest delivery and layered portrait effects', async ({ page }) => {
	await openSpanishRoute(page, 'contact');
	expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(768);
	await expect(page.locator('.contact-page__links a')).toHaveCount(4);
	await expect(page.locator('.contact-page__links img, .contact-page__links svg')).toHaveCount(4);
	await expect(page.locator('.contact-page__links a[href^="mailto:"]')).toHaveCount(0);
	await expect(page.locator('#contact-email')).toHaveAttribute('placeholder', 'tu@email.com');
	await expect(page.locator('#contact-message')).toHaveCSS('resize', 'none');
	await expect(page.locator('.contact-portrait__aura')).toHaveCount(1);
	await expect(page.locator('.contact-portrait__inner-aura')).toHaveCount(1);
	await expect(page.locator('.contact-portrait figcaption')).toHaveText('Mario Cabrero Volarich · Cartago · 2026');
	await expect(page.locator('.contact-portrait img')).toHaveCSS('transform', 'none');
	await page.locator('.contact-portrait__frame').hover();
	await expect(page.locator('.contact-portrait img')).toHaveCSS('transform', 'matrix(1.015, 0, 0, 1.015, 0, 0)');
	await expect(page.locator('.contact-portrait__inner-aura')).not.toHaveCSS('opacity', '0');
});

test('S2-01 downloaded meshes render, rotate, restore and remain recognisable', async ({ page }) => {
	const failures: string[] = [];
	page.on('requestfailed', (request) => failures.push(request.url()));
	await openSpanishRoute(page);
	await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
	await page.getByRole('tab', { name: 'Figuras', exact: true }).click();
	const models = [
		['Mando 3D', 'model-gamepad'],
		['Balón americano 3D', 'model-football'],
		['Elefante tallado 3D', 'model-elephant'],
		['Roca lunar 3D', 'model-moon-rock'],
	] as const;
	for (const [label, style] of models) {
		await page.getByRole('button', { name: label, exact: true }).click();
		await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', style);
		await expect(page.locator('app-earth-globe')).toHaveAttribute('data-render-state', 'ready');
		await expect(page.locator('app-earth-globe canvas')).toHaveClass(/is-active/);
		await expect(page.locator('.hero-monitor__earth-origin')).toContainText('Poly Haven CC0');
	}
	const figure = page.locator('app-earth-globe');
	await figure.focus();
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('ArrowUp');
	const box = await figure.boundingBox();
	expect(box).not.toBeNull();
	await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
	await page.mouse.down();
	await page.mouse.move(box!.x + box!.width * .7, box!.y + box!.height * .62, { steps: 4 });
	await page.mouse.up();
	await expect(figure).toHaveAttribute('data-render-state', 'ready');
	await page.locator('.hero-monitor__earth-close').click();
	await expect(figure).toHaveAttribute('data-texture-style', 'clouds');
	await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
	await page.getByRole('tab', { name: 'Figuras', exact: true }).click();
	await page.getByRole('button', { name: 'Mando 3D', exact: true }).click();
	await expect(figure).toHaveAttribute('data-render-state', 'ready');
	expect(failures).toEqual([]);
});

test('S2-02 a failed 3D asset exposes a labelled fallback instead of a blank canvas', async ({ page }) => {
	await page.route('**/images/globe/models/gamepad/**', (route) => route.abort());
	await openSpanishRoute(page);
	await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
	await page.getByRole('tab', { name: 'Figuras', exact: true }).click();
	await page.getByRole('button', { name: 'Mando 3D', exact: true }).click();
	await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', 'model-gamepad');
	await expect(page.locator('app-earth-globe')).toHaveAttribute('data-render-state', 'error');
	await expect(page.locator('.earth-globe__status')).toContainText('No se pudo renderizar la figura 3D');
	await expect(page.locator('.earth-globe__status-fallback')).toHaveCount(1);
	await page.getByRole('button', { name: 'Balón americano 3D', exact: true }).click();
	await expect(page.locator('app-earth-globe')).toHaveAttribute('data-render-state', 'ready');
});
