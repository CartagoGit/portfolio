import { expect, type Page, test } from '@playwright/test';

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
	await openRoute(page, { route: 'demos' });
	await expect(page.locator('.showcase__footer button')).toHaveCount(1);
	await expect(page.locator('.showcase__stage .showcase__fullscreen svg')).toHaveCount(1);
	await expect(page.locator('.demo-games__fullscreen svg')).toHaveCount(1);
	await expect(page.locator('.demo-games__stage > .demo-games__fullscreen')).toHaveCount(1);
	await openRoute(page, { route: 'lab' });
	await expect(page.locator('.lab-page__signal-card > .lab-page__fullscreen')).toHaveCount(3);
	await expect(page.locator('.lab-page__signal-gallery > header button')).toHaveCount(0);
	for (const control of await page.locator('.interactive-fullscreen-control').all())
		await expect(control).toHaveText('');
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
