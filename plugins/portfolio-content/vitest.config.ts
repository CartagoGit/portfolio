import { defineConfig } from 'vitest/config';

/**
 * `@delendai/core/public` resolves through `node_modules/@delendai/core`,
 * which `bun install` links to the machine's stable DelendAI
 * (`tools/link-delendai-core.script.ts`).
 */
export default defineConfig({
	test: {
		name: 'portfolio-content',
		include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		environment: 'node',
		globals: false,
	},
});
