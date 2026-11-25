import { expect, type Locator, type Page, test } from '@playwright/test';

const ROUTES = ['', 'work', 'lab', 'approach', 'knowledge', 'docker', 'demos', 'contact'] as const;
const VIEWPORTS = [
	{ name: 'desktop', width: 1440, height: 900 },
	{ name: 'laptop', width: 1024, height: 768 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'smartphone', width: 390, height: 844 },
] as const;
const THEMES = ['light', 'dark', 'solar', 'mono'] as const;

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

for (const viewport of VIEWPORTS) {
	test(`visual truth: ${viewport.name} contains every route and exposes no broken assets`, async ({ page }) => {
		test.setTimeout(90_000);
		await page.setViewportSize({ width: viewport.width, height: viewport.height });
		for (const route of ROUTES) {
			await openRoute(page, { route });
			await expectContained(page, `${viewport.name}/${route || 'home'}`);
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

test('visual truth: all themes keep monitor and globe controls in the active token system', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	for (const theme of THEMES) {
		await page.addInitScript((id) => localStorage.setItem('cartago-theme', id), theme);
		await openRoute(page);
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		await page.getByRole('button', { name: 'Abrir la Tierra interactiva' }).click();
		await expect(page.locator('.hero-monitor__earth-controls')).toHaveClass(/is-active/);
		await expectContained(page, `${theme}/globe`);
		await page.locator('.hero-monitor__earth-close').click();
	}
});

test('visual truth: interactive product surfaces keep an explicit fullscreen exit path', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await openRoute(page);
	await expect(page.locator('.hero-monitor__fullscreen')).toHaveCount(1);
	await page.locator('.hero-monitor__fullscreen').click();
	await expect(page.locator('app-hero-monitor')).toHaveClass(/hero-monitor-host--fullscreen/);
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
		return Math.max(Math.abs(matrix.a - expected), Math.abs(matrix.d - expected));
	})).toBeLessThan(0.001);
	const fullscreenTransform = await page.locator('.hero-monitor__interface').evaluate((element) => getComputedStyle(element).transform);
	await page.mouse.move(2, 2);
	await page.waitForTimeout(800);
	await expect(page.locator('.hero-monitor')).toHaveClass(/hero-monitor--expanded/);
	await expect(page.locator('.hero-monitor__interface')).toHaveCSS('transform', fullscreenTransform);
	await expect(page.locator('app-shell-header')).toHaveCSS('visibility', 'hidden');
	await expect(page.locator('app-shell-footer')).toHaveCSS('visibility', 'hidden');
	await expect(page.locator('[data-fullscreen-inert=""]')).not.toHaveCount(0);
	await expect(page.locator('app-home-intro')).toHaveAttribute('inert', '');
	await page.keyboard.press('Escape');
	await expect(page.locator('app-hero-monitor')).not.toHaveClass(/hero-monitor-host--fullscreen/);
	await expect(page.locator('app-shell-header')).not.toHaveCSS('visibility', 'hidden');
	await page.locator('.hero-monitor__fullscreen').click();
	await page.locator('.hero-monitor__fullscreen').click();
	await openRoute(page, { route: 'demos' });
	await expect(page.locator('.showcase__footer button')).toHaveCount(1);
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
	await page.keyboard.press('Escape');
});

test('visual truth: twenty locales render native primary copy and Arabic remains RTL', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	for (const locale of ['en', 'es', 'fr', 'de', 'it', 'pt-PT', 'pt-BR', 'ru', 'uk', 'pl', 'hr', 'tr', 'ar', 'hi', 'bn', 'zh-CN', 'zh-TW', 'ja', 'ko', 'id']) {
		await openRoute(page, { locale });
		await expectContained(page, locale);
		await expect(page.locator('.home-intro__description')).not.toHaveText(/^(?:pages|content)\./);
	}
	await openRoute(page, { locale: 'ar' });
	await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('visual truth: locale selector groups shared languages and always renders local flags', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await openRoute(page);
	await page.locator('.header__locale > button').click();
	const options = page.locator('.header__locale-menu [role="option"]');
	await expect(options).toHaveCount(19);
	await expect(options.locator('img.header__flag')).toHaveCount(19);
	await expect(options.filter({ hasText: 'Português' })).toHaveCount(1);
	const portuguese = options.filter({ hasText: 'Português' });
	await expect(portuguese.locator('small')).toHaveText('portugués');
	const nativeLabels = await options.locator('.header__language-native').allTextContents();
	const sorted = [...nativeLabels].sort((left, right) => left.localeCompare(right, 'en', { sensitivity: 'base' }));
	expect(nativeLabels).toEqual(sorted);
});
