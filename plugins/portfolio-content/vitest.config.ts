import { defineConfig } from 'vitest/config';

/**
 * Plugin-local vitest config. The host workspace already loads vitest
 * 4 + jsdom via `package.json#devDependencies`; this config scopes
 * the runner to this plugin's `tests/` folder.
 */
export default defineConfig({
	test: {
		name: 'portfolio-content',
		include: ['tests/**/*.spec.ts'],
		exclude: ['**/node_modules/**', '**/.dist/**', '**/dist/**'],
		environment: 'node',
		globals: false,
	},
});
