import { expect, type Page, test } from '@playwright/test';

const ROUTES = ['', 'work', 'lab', 'approach', 'knowledge', 'docker', 'demos', 'contact'] as const;

async function open(page: Page, route = '', locale = 'es'): Promise<void> {
	await page.goto(`/${locale}${route ? `/${route}` : ''}`, { waitUntil: 'networkidle' });
	await expect(page.locator('html')).toHaveAttribute('lang', locale);
}

test('A11Y-01 route navigation restores focus to truthful content', async ({ page }) => {
	await open(page);
	await page.getByRole('link', { name: 'Laboratorio', exact: true }).first().click();
	await expect(page).toHaveURL(/\/es\/lab$/);
	await expect(page.locator('#main-content')).toBeFocused();
	await expect(page.getByRole('heading', { name: /Interactivo|interactivo/i })).toBeVisible();
});

test('A11Y-02 every route stays accessible-named and contained at 390px', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	for (const route of ROUTES) {
		await open(page, route);
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
		expect(overflow, route || 'home').toBeLessThanOrEqual(0);
		const unnamed = await page.locator('button:visible, a:visible').evaluateAll((elements) => elements.filter((element) => {
			const name = element.getAttribute('aria-label') ?? element.textContent?.trim() ?? '';
			const imageName = element.querySelector('img')?.getAttribute('alt')?.trim() ?? '';
			return !name && !imageName;
		}).length);
		expect(unnamed, `${route || 'home'} has unnamed controls`).toBe(0);
	}
});

test('SEC-01 external new-tab links are HTTPS and use an opener-safe rel', async ({ page }) => {
	for (const route of ROUTES) {
		await open(page, route);
		const unsafe = await page.locator('a[target="_blank"]').evaluateAll((links) => links.filter((link) => {
			const href = link.getAttribute('href') ?? '';
			const rel = (link.getAttribute('rel') ?? '').split(/\s+/);
			return !href.startsWith('https://') || (!rel.includes('noreferrer') && !rel.includes('noopener'));
		}).map((link) => link.getAttribute('href')));
		expect(unsafe, route || 'home').toEqual([]);
	}
});

test('MOTION-01 reduced motion disables the evidence-card orbit', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await open(page, 'demos');
	await expect(page.locator('app-evidence-card .evidence-card').first()).toBeVisible();
	const animation = await page.locator('app-evidence-card .evidence-card').first().evaluate((element) => getComputedStyle(element, '::before').animationName);
	expect(animation).toBe('none');
});

test('WEBGL-01 repeated route entry owns a single canvas and no stale globe node', async ({ page }) => {
	for (let round = 0; round < 3; round += 1) {
		await open(page);
		await expect(page.locator('app-earth-globe canvas')).toHaveCount(1);
		await page.getByRole('link', { name: 'Proyectos', exact: true }).first().click();
		await expect(page.locator('app-earth-globe')).toHaveCount(0);
	}
});
