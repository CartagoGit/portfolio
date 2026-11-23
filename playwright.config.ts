import { defineConfig } from '@playwright/test';

const localChrome = process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE'] ?? '/usr/bin/google-chrome';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env['CI']),
	retries: process.env['CI'] ? 1 : 0,
	workers: process.env['CI'] ? 2 : undefined,
	reporter: [['list']],
	outputDir: '.cache/playwright',
	use: {
		baseURL: 'http://localhost:4410',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		viewport: { width: 1366, height: 768 },
		launchOptions: process.env['CI'] ? {} : { executablePath: localChrome },
	},
	webServer: {
		command: 'bun run start -- --port=4410',
		url: 'http://localhost:4410',
		reuseExistingServer: !process.env['CI'],
		timeout: 120_000,
	},
});
