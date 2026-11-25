import { expect, test } from '@playwright/test';

const PLAYGROUNDS = [
	['workflow', 'app-workflow-playground'],
	['motion', 'app-motion-playground'],
	['accessibility', 'app-accessibility-playground'],
	['concurrency', 'app-concurrency-playground'],
	['responsive', 'app-responsive-playground'],
	['data', 'app-data-playground'],
	['state-machine', 'app-state-machine-playground'],
] as const;

test('Lab fullscreen panels reveal scroll-safe evidence without changing host proportion', async ({ page }) => {
	await page.goto('/es/lab', { waitUntil: 'networkidle' });
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');

	for (const [kind, selector] of PLAYGROUNDS) {
		const host = page.locator(selector);
		const evidence = host.locator(`app-lab-fullscreen-evidence[data-evidence-kind="${kind}"]`);
		const panel = evidence.locator('.lab-fullscreen-evidence__panel');

		await expect(evidence).toBeHidden();
		await host.locator(':scope > .interactive-fullscreen-control').click();
		await expect(host).toHaveClass(/is-fallback-fullscreen/);
		await expect(evidence).toBeVisible();
		expect(await evidence.locator('[data-evidence-sample]').count()).toBeGreaterThanOrEqual(3);
		await expect.poll(async () => {
			const bounds = await host.boundingBox();
			return bounds ? bounds.width / bounds.height : 0;
		}).toBeCloseTo(8 / 5, 1);

		const overflow = await panel.evaluate((element) => {
			const style = getComputedStyle(element);
			return {
				overflowY: style.overflowY,
				fitsHorizontally: element.scrollWidth <= element.clientWidth,
			};
		});
		expect(['auto', 'scroll']).toContain(overflow.overflowY);
		expect(overflow.fitsHorizontally).toBe(true);

		await page.keyboard.press('Escape');
		await expect(host).not.toHaveClass(/is-fallback-fullscreen/);
		await expect(evidence).toBeHidden();
	}
});
