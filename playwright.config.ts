import { defineConfig } from '@playwright/test';

const localChrome = process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE'] ?? '/usr/bin/google-chrome';
const port = Number.parseInt(process.env['PORTFOLIO_E2E_PORT'] ?? '4410', 10);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env['CI']),
	timeout: 60_000,
	retries: process.env['CI'] ? 1 : 0,
	workers: 2,
	reporter: [['list']],
	outputDir: '.cache/playwright',
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		viewport: { width: 1366, height: 768 },
		launchOptions: process.env['CI'] ? {} : { executablePath: localChrome },
	},
	webServer: {
		command: `bun run start -- --port=${port}`,
		url: baseURL,
		reuseExistingServer: !process.env['CI'] && process.env['PORTFOLIO_E2E_REUSE'] === '1',
		timeout: 120_000,
	},
});
