import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: 'portfolio-content',
		include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		environment: 'node',
		globals: false,
	},
});
