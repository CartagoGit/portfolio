import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { expect, type Locator, type Page, test } from '@playwright/test';
import { EARTH_TEXTURE_CATEGORIES, EARTH_TEXTURE_OPTIONS, earthCategoryLabel, earthTextureLabel } from '../src/pages/home/hero-monitor/earth-texture.catalog';

const ROUTES = ['', 'work', 'lab', 'approach', 'knowledge', 'docker', 'demos', 'contact'] as const;
const VIEWPORTS = [
	{ name: 'desktop', width: 1440, height: 900 },
	{ name: 'laptop', width: 1024, height: 768 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'tablet-landscape', width: 1024, height: 600 },
	{ name: 'smartphone', width: 390, height: 844 },
	{ name: 'small-touch', width: 320, height: 568 },
] as const;
const THEMES = ['dark', 'light', 'midnight', 'ocean', 'forest', 'sunset', 'solar', 'mono'] as const;
const CAPTURE_ROOT = '.cache/visual-audit';
const E2E_BASE_URL = `http://localhost:${process.env['PORTFOLIO_E2E_PORT'] ?? '4410'}`;

async function captureVisual(page: Page, name: string): Promise<void> {
	if (process.env['VISUAL_AUDIT_CAPTURE'] !== '1') return;
	await mkdir(CAPTURE_ROOT, { recursive: true });
	const safeName = name.replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
	await page.screenshot({ path: join(CAPTURE_ROOT, `${safeName}.png`), animations: 'disabled' });
}

async function openRoute(
	page: Page,
	options: { route?: (typeof ROUTES)[number]; locale?: string } = {},
): Promise<void> {
	const route = options.route ?? '';
	const locale = options.locale ?? 'es';
	await page.goto(`/${locale}${route ? `/${route}` : ''}`, { waitUntil: 'networkidle' });
	await expect(page.locator('main')).toBeVisible();
	await expect(page.locator('html')).toHaveAttribute('lang', locale);
}

async function expectContained(page: Page, label: string): Promise<void> {
	const delta = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	expect(delta, `${label} must fit its viewport`).toBeLessThanOrEqual(0);
}

async function expectAspectRatio(locator: Locator, expected: number): Promise<void> {
	await expect.poll(async () => {
		const box = await locator.boundingBox();
		return box ? box.width / box.height : 0;
	}).toBeCloseTo(expected, 1);
}

async function filesBelow(root: string): Promise<string[]> {
	const files: string[] = [];
	for (const entry of await readdir(root, { withFileTypes: true })) {
		const path = join(root, entry.name);
		if (entry.isDirectory()) files.push(...await filesBelow(path));
		else files.push(path);
	}
	return files;
}

test('visual truth: downloaded 3D attribution matches all local bytes and MD5 values', async () => {
	const modelRoot = join(process.cwd(), 'public', 'images', 'globe', 'models');
	const attribution = await readFile(join(process.cwd(), 'public', 'images', 'ATTRIBUTION.md'), 'utf8');
	const records = [...attribution.matchAll(/\| `([^`]+)` \| ([\d,]+) \| `([a-f0-9]{32})` \|/g)]
		.map((match) => ({
			path: match[1] ?? '',
			bytes: Number((match[2] ?? '').replaceAll(',', '')),
			md5: match[3] ?? '',
		}));
	const actualFiles = (await filesBelow(modelRoot)).map((path) => relative(modelRoot, path));
	expect(records).toHaveLength(20);
	expect(records.map(({ path }) => path).sort()).toEqual(actualFiles.sort());
	for (const record of records) {
		const bytes = await readFile(join(modelRoot, record.path));
		expect(bytes.byteLength, `${record.path} bytes`).toBe(record.bytes);
		expect(createHash('md5').update(bytes).digest('hex'), `${record.path} MD5`).toBe(record.md5);
	}
});

for (const viewport of VIEWPORTS) {
	test(`visual truth: ${viewport.name} contains every route and exposes no broken assets`, async ({ page }) => {
		test.setTimeout(90_000);
		await page.setViewportSize({ width: viewport.width, height: viewport.height });
		for (const route of ROUTES) {
			await openRoute(page, { route });
			await expectContained(page, `${viewport.name}/${route || 'home'}`);
			await captureVisual(page, `route-${viewport.name}-${route || 'home'}`);
			const body = (await page.locator('body').innerText()).trim();
			expect(body, `${viewport.name}/${route || 'home'} has unresolved UI keys`).not.toMatch(/(?:pages|content)\.[a-z]/i);
			const brokenImages = await page.locator('img').evaluateAll((images) =>
				images
					.map((image) => image as HTMLImageElement)
					.filter((image) => image.complete && image.naturalWidth === 0)
					.map((image) => image.getAttribute('src')),
			);
			expect(brokenImages, `${viewport.name}/${route || 'home'} has broken images`).toEqual([]);
		}
	});
}

test('visual truth: all themes keep monitor and globe controls in the active token system', async ({ browser }) => {
	test.setTimeout(360_000);
	const themeTokens = new Set<string>();
	for (const theme of THEMES) {
		const context = await browser.newContext({
			baseURL: E2E_BASE_URL,
			viewport: { width: 1280, height: 900 },
		});
		const themePage = await context.newPage();
		try {
			await themePage.addInitScript((id) => localStorage.setItem('cartago-theme', id), theme);
			await openRoute(themePage);
			await expect(themePage.locator('html')).toHaveAttribute('data-theme', theme);
			const activeTokens = await themePage.evaluate(() => {
				const root = getComputedStyle(document.documentElement);
				const control = getComputedStyle(document.querySelector('.hero-monitor__technology-toggle')!);
				const chrome = getComputedStyle(document.querySelector('.hero-monitor__chrome')!);
				const probe = document.createElement('span');
				probe.style.backgroundColor = root.getPropertyValue('--surface-2').trim();
				document.body.append(probe);
				const expectedSurface = getComputedStyle(probe).backgroundColor;
				probe.remove();
				return {
					primary: root.getPropertyValue('--cyan').trim(),
					surface: root.getPropertyValue('--surface').trim(),
					controlColor: control.color,
					controlBackground: control.backgroundColor,
					chromeBackground: chrome.backgroundColor,
					expectedSurface,
				};
			});
			expect(activeTokens.primary).not.toBe('');
			expect(activeTokens.surface).not.toBe('');
			expect(activeTokens.controlColor).not.toBe('rgba(0, 0, 0, 0)');
			expect(activeTokens.controlBackground).not.toBe('rgba(0, 0, 0, 0)');
			expect(activeTokens.chromeBackground).toBe(activeTokens.expectedSurface);
			themeTokens.add(`${activeTokens.primary}/${activeTokens.surface}`);
			await themePage.locator('.hero-monitor__selector button').filter({ hasText: 'DelendAI' }).click();
			await expect(themePage.locator('.hero-monitor__preview h3')).toHaveText('DelendAI');
			await captureVisual(themePage, `theme-${theme}-monitor`);
			await themePage.getByRole('button', { name: 'Gráficas', exact: true }).click();
			await themePage.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
			await expect(themePage.locator('.hero-monitor__earth-controls')).toHaveClass(/is-active/);
			const figuresTab = themePage.getByRole('tab', { name: earthCategoryLabel('es', 'figures'), exact: true });
			await figuresTab.click();
			await expect(figuresTab).toHaveAttribute('aria-selected', 'true');
			await expect(themePage.getByRole('button', { name: 'Mando 3D', exact: true })).toHaveCount(1);
			for (const option of EARTH_TEXTURE_OPTIONS.filter(({ id }) => id.startsWith('model-'))) {
				await themePage.getByRole('button', { name: earthTextureLabel('es', option.id), exact: true }).click();
				await expect(themePage.locator('app-earth-globe')).toHaveAttribute('data-texture-style', option.id);
				await expect(themePage.locator('app-earth-globe')).toHaveAttribute('data-render-state', 'ready');
				await expect(themePage.locator('app-earth-globe canvas')).toHaveCSS('opacity', '1');
				await captureVisual(themePage, `theme-${theme}-${option.id}`);
			}
			await themePage.locator('.hero-monitor__earth-close').click();
		} finally {
			await context.close();
		}
	}
	expect(themeTokens.size).toBe(THEMES.length);
});

test('visual truth: all 34 globe presets render in every device class', async ({ page }) => {
	test.setTimeout(720_000);
	for (const viewport of VIEWPORTS) {
		await page.setViewportSize({ width: viewport.width, height: viewport.height });
		await openRoute(page);
		await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
		await expect(page.locator('.hero-monitor__earth-controls')).toHaveClass(/is-active/);
		for (const category of EARTH_TEXTURE_CATEGORIES) {
			await page.getByRole('tab', { name: earthCategoryLabel('es', category), exact: true }).click();
			for (const option of EARTH_TEXTURE_OPTIONS.filter((entry) => entry.category === category)) {
				const presetButton = page.getByRole('button', { name: earthTextureLabel('es', option.id), exact: true });
				await presetButton.focus();
				await presetButton.press('Enter');
				await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', option.id);
				await expect(page.locator('app-earth-globe')).toHaveAttribute('data-render-state', 'ready');
				await expect(page.locator('app-earth-globe canvas')).toHaveCSS('opacity', '1');
				const canvasBox = await page.locator('app-earth-globe canvas').boundingBox();
				expect(canvasBox, `${viewport.name}/${option.id} canvas`).not.toBeNull();
				expect(canvasBox!.width).toBeGreaterThan(0);
				expect(canvasBox!.height).toBeGreaterThan(0);
				await captureVisual(page, `preset-${viewport.name}-${option.id}`);
			}
		}
		await page.locator('.hero-monitor__earth-close').click();
		await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', 'clouds');
	}
});

test('visual truth: interactive product surfaces keep an explicit fullscreen exit path', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await openRoute(page);
	await expect(page.locator('.hero-monitor__fullscreen')).toHaveCount(1);
	await page.locator('.hero-monitor__fullscreen').click();
	await expect(page.locator('app-hero-monitor')).toHaveClass(/app-hero-monitor--fullscreen/);
	await expect(page.locator('.hero-monitor__fullscreen')).toHaveAttribute('aria-pressed', 'true');
	await expectAspectRatio(page.locator('.hero-monitor__interface'), 8 / 5);
	const monitorLogicalSize = await page.locator('.hero-monitor__interface').evaluate((element) => ({
		width: (element as HTMLElement).offsetWidth,
		height: (element as HTMLElement).offsetHeight,
	}));
	expect(monitorLogicalSize).toEqual({ width: 780, height: 488 });
	await expect.poll(async () => page.locator('.hero-monitor__interface').evaluate((element) => {
		const style = getComputedStyle(element);
		const matrix = new DOMMatrix(style.transform);
		const expected = Number(style.getPropertyValue('--monitor-fullscreen-scale'));
		return Math.max(
			Math.abs(matrix.a - expected),
			Math.abs(matrix.d - expected),
			Math.abs(matrix.b),
			Math.abs(matrix.c),
		);
	})).toBeLessThan(0.001);
	await page.mouse.move(2, 2);
	await page.waitForTimeout(800);
	await expect(page.locator('.hero-monitor')).toHaveClass(/hero-monitor--expanded/);
	await expect.poll(async () => page.locator('.hero-monitor__interface').evaluate((element) => {
		const style = getComputedStyle(element);
		const matrix = new DOMMatrix(style.transform);
		const expected = Number(style.getPropertyValue('--monitor-fullscreen-scale'));
		return Math.max(
			Math.abs(matrix.a - expected),
			Math.abs(matrix.d - expected),
			Math.abs(matrix.b),
			Math.abs(matrix.c),
		);
	})).toBeLessThan(0.001);
	const closeButton = page.locator('.hero-monitor__fullscreen');
	await expect(closeButton).toBeInViewport();
	const closeBox = await closeButton.boundingBox();
	expect(closeBox ? closeBox.y + closeBox.height : 900).toBeLessThanOrEqual(844);
	await page.keyboard.press('Escape');
	await expect(page.locator('app-hero-monitor')).not.toHaveClass(/app-hero-monitor--fullscreen/);
	await expect(page.locator('app-shell-header')).not.toHaveCSS('visibility', 'hidden');
	await page.locator('.hero-monitor__fullscreen').click();
	await page.locator('.hero-monitor__fullscreen').click();
	await openRoute(page, { route: 'demos' });
	await expect(page.locator('.showcase__controls .showcase__fullscreen')).toHaveCount(1);
	await expect(page.locator('.showcase__stage .showcase__fullscreen svg')).toHaveCount(1);
	await page.locator('.showcase__fullscreen').click();
	await expectAspectRatio(page.locator('.showcase__fullscreen-frame'), 16 / 9);
	await page.keyboard.press('Escape');
	await expect(page.locator('.demo-games__fullscreen svg')).toHaveCount(1);
	await page.locator('.demo-games__fullscreen').click();
	await expectAspectRatio(page.locator('.demo-games__fullscreen-frame'), 8 / 5);
	await page.keyboard.press('Escape');
	await openRoute(page, { route: 'lab' });
	await expect(page.locator('.lab-page__signal-card > .lab-page__fullscreen')).toHaveCount(3);
	await expect(page.locator('.lab-page__experiment-grid > * > .interactive-fullscreen-control')).toHaveCount(7);
	await expect(page.locator('app-lab-dashboard > .interactive-fullscreen-control')).toHaveCount(1);
	await page.locator('.lab-page__signal-card .lab-page__fullscreen').first().click();
	await expectAspectRatio(page.locator('.lab-page__signal-card .lab-page__fullscreen-frame').first(), 8 / 5);
	await expect(page.locator('.lab-page__signal-card.is-fullscreen .lab-page__fullscreen-evidence > div')).toHaveCount(3);
	await page.keyboard.press('Escape');
});

test('visual truth: Approach expands one capability and explains six distinct interactions', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await openRoute(page, { route: 'approach' });
	const tabs = page.locator('.approach-page__tabs button');
	await expect(tabs).toHaveCount(6);
	const heights = await tabs.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
	expect(heights[0]).toBeGreaterThan((heights[1] ?? 0) + 20);
	for (const capability of ['product', 'architecture', 'mobile', 'quality', 'systems', 'tooling']) {
		await page.locator(`#capability-tab-${capability}`).click();
		await expect(page.locator('.approach-page__detail')).toHaveAttribute('data-capability', capability);
		await expect(page.locator(`.approach-page__playground[data-interaction="${capability}"]`)).toBeVisible();
		await expect(page.locator('.approach-page__detail-heading .approach-page__detail-icon svg')).toBeVisible();
	}
});

test('visual truth: priority routes stay contained in all twenty deep locales', async ({ page }) => {
	test.setTimeout(480_000);
	await page.setViewportSize({ width: 390, height: 844 });
	const locales = ['en', 'es', 'fr', 'de', 'it', 'pt-PT', 'pt-BR', 'ru', 'uk', 'pl', 'hr', 'tr', 'ar', 'hi', 'bn', 'zh-CN', 'zh-TW', 'ja', 'ko', 'id'] as const;
	for (const locale of locales) {
		for (const route of ['approach', 'demos', 'docker', 'contact'] as const) {
			await openRoute(page, { locale, route });
			await expectContained(page, `${locale}/${route}`);
			await expect(page.locator('.route-stage')).not.toContainText(/pages\.\w+\./);
			await captureVisual(page, `locale-${locale}-${route}`);
		}
	}
});

test('S16-01 mobile monitor and globe controls are readable and touchable', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await openRoute(page);
	const monitor = page.locator('app-hero-monitor');
	await monitor.scrollIntoViewIfNeeded();
	const monitorTargets = monitor.locator('.hero-monitor__selector button, .hero-monitor__platform-row > a, .hero-monitor__platform-row > button, .hero-monitor__chart-switcher button');
	const targetHeights = await monitorTargets.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
	expect(Math.min(...targetHeights)).toBeGreaterThanOrEqual(44);
	const labelSizes = await monitor.locator('.hero-monitor__selector button span, .hero-monitor__chart-switcher button span, .hero-monitor__technology-toggle span').evaluateAll((elements) => elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
	expect(Math.min(...labelSizes)).toBeGreaterThanOrEqual(12);
	await expectContained(page, 'S16/mobile monitor');

	await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
	const controls = page.locator('.hero-monitor__earth-controls.is-active');
	await expect(controls).toBeVisible();
	const controlHeights = await controls.locator('button:visible').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
	expect(Math.min(...controlHeights)).toBeGreaterThanOrEqual(44);
	const close = controls.locator('.hero-monitor__earth-close');
	await expect(close).toBeInViewport();
	const closeBox = await close.boundingBox();
	expect(closeBox ? closeBox.y + closeBox.height : 900).toBeLessThanOrEqual(844);
	await page.getByRole('tab', { name: 'Planetas', exact: true }).click();
	await page.getByRole('button', { name: 'Saturno', exact: true }).click();
	await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', 'saturn');
	await close.click();
	await expect(controls).toHaveCount(0);
});

test('monitor header keeps the intrinsic banner ratio without covering the controls', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await openRoute(page);
	const monitor = page.locator('app-hero-monitor');
	const header = monitor.locator('.hero-monitor__header');
	await monitor.scrollIntoViewIfNeeded();
	await monitor.hover();
	const desktop = await header.evaluate((element) => {
		const motion = element.querySelector<HTMLElement>('.hero-monitor__motion-control');
		const banner = element.querySelector<HTMLElement>('.hero-monitor__banner-link');
		const image = element.querySelector<HTMLImageElement>('.hero-monitor__banner');
		const rail = element.querySelector<HTMLElement>('.hero-monitor__platform-rail');
		if (!motion || !banner || !image || !rail) throw new Error('Missing monitor header geometry');
		return {
			bannerRatio: image.offsetWidth / image.offsetHeight,
			motionRight: motion.offsetLeft + motion.offsetWidth,
			bannerLeft: banner.offsetLeft,
			bannerRight: banner.offsetLeft + banner.offsetWidth,
			railLeft: rail.offsetLeft,
			railClientWidth: rail.clientWidth,
			railScrollWidth: rail.scrollWidth,
		};
	});
	expect(desktop.bannerRatio).toBeCloseTo(1023 / 300, 2);
	expect(desktop.motionRight).toBeLessThanOrEqual(desktop.bannerLeft);
	expect(desktop.bannerRight).toBeLessThanOrEqual(desktop.railLeft);
	expect(desktop.railScrollWidth).toBeLessThanOrEqual(desktop.railClientWidth);

	await monitor.locator('.hero-monitor__platform-row > a').first().click();
	const detail = monitor.locator('.hero-monitor__preview-detail');
	await expect(detail).toContainText('LinkedIn es un destino público');
	expect((await detail.innerText()).length).toBeGreaterThan(140);
	const typography = await monitor.evaluate((element) => {
		const status = element.querySelector<HTMLElement>('.hero-monitor__preview-status');
		const copy = element.querySelector<HTMLElement>('.hero-monitor__preview-detail');
		if (!status || !copy) throw new Error('Missing monitor preview typography');
		return {
			status: Number.parseFloat(getComputedStyle(status).fontSize),
			copy: Number.parseFloat(getComputedStyle(copy).fontSize),
		};
	});
	expect(typography.status).toBeLessThan(typography.copy * 0.8);

	await page.setViewportSize({ width: 390, height: 844 });
	const mobile = await header.evaluate((element) => {
		const banner = element.querySelector<HTMLElement>('.hero-monitor__banner-link');
		const image = element.querySelector<HTMLImageElement>('.hero-monitor__banner');
		const rail = element.querySelector<HTMLElement>('.hero-monitor__platform-rail');
		if (!banner || !image || !rail) throw new Error('Missing mobile monitor header geometry');
		return {
			bannerRatio: image.offsetWidth / image.offsetHeight,
			bannerBottom: banner.offsetTop + banner.offsetHeight,
			railTop: rail.offsetTop,
		};
	});
	expect(mobile.bannerRatio).toBeCloseTo(1023 / 300, 2);
	expect(mobile.railTop).toBeGreaterThanOrEqual(mobile.bannerBottom);
	await captureVisual(page, 'monitor-header-intrinsic-mobile');
});

test('visual truth: coarse touch input remains direct at 320px', async ({ browser }) => {
	test.setTimeout(120_000);
	const context = await browser.newContext({
		baseURL: E2E_BASE_URL,
		viewport: { width: 320, height: 568 },
		hasTouch: true,
		isMobile: true,
	});
	const page = await context.newPage();
	try {
		await page.addInitScript(() => localStorage.setItem('cartago-theme', 'ocean'));
		await openRoute(page);
		await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).tap();
		await expect(page.locator('.hero-monitor__earth-controls')).toHaveClass(/is-active/);
		const figuresTab = page.getByRole('tab', { name: earthCategoryLabel('es', 'figures'), exact: true });
		await figuresTab.click();
		await expect(figuresTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('button', { name: 'Mando 3D', exact: true })).toHaveCount(1);
		for (const option of EARTH_TEXTURE_OPTIONS.filter(({ id }) => id.startsWith('model-'))) {
			await page.getByRole('button', { name: earthTextureLabel('es', option.id), exact: true }).tap();
			await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', option.id);
			await expect(page.locator('app-earth-globe')).toHaveAttribute('data-render-state', 'ready');
		}
		const figureBox = await page.locator('app-earth-globe').boundingBox();
		expect(figureBox).not.toBeNull();
		const touch = await context.newCDPSession(page);
		const start = { x: figureBox!.x + figureBox!.width * .45, y: figureBox!.y + figureBox!.height * .5 };
		await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
		await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + 35, y: start.y + 15 }] });
		await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await expect(page.locator('app-earth-globe')).toHaveAttribute('data-render-state', 'ready');
		await captureVisual(page, 'coarse-touch-320-globe-model');
		await page.locator('.hero-monitor__earth-close').tap();
		await expect(page.locator('app-hero-monitor')).not.toHaveClass(/hero-monitor-host--earth-front/, { timeout: 2_000 });
		await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', 'clouds');
		await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).tap();
		await page.getByRole('tab', { name: 'Planetas', exact: true }).tap();
		await page.getByRole('button', { name: 'Saturno', exact: true }).tap();
		await expect(page.locator('app-earth-globe')).toHaveAttribute('data-texture-style', 'saturn');
		await page.locator('.hero-monitor__earth-close').tap();

		await openRoute(page, { route: 'demos' });
		await page.locator('#showcase-tab-flow').tap();
		await page.locator('.showcase__activate').tap();
		await expect(page.locator('.showcase__stage')).toHaveAttribute('data-scene', 'flow');
		await page.locator('#demo-tab-dice').tap();
		await page.locator('.dice-game__die').tap();
		await expect(page.locator('.dice-game__history span')).not.toHaveCount(0);
		await page.locator('#arcade-tab-penalty').tap();
		const penalty = page.locator('app-penalty-game');
		await penalty.locator('[data-arcade-action="start"]').tap();
		await penalty.locator('.penalty-game__controls button').tap();
		await expect(penalty.locator('[data-hud-lives]')).toHaveText('4');
		await expectContained(page, '320px/coarse-touch/demos');
		await captureVisual(page, 'coarse-touch-320-demos-penalty');
	} finally {
		await context.close();
	}
});
