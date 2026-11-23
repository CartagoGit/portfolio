import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * `@delendai/core/public` resolves through the gitignored runtime link
 * (`bun tools/delendai-runtime.script.ts`), so no machine path is committed.
 */
const corePublic = fileURLToPath(
	new URL(
		'../../.cache/delendai-runtime/packages/core/src/public/index.ts',
		import.meta.url,
	),
);

export default defineConfig({
	resolve: { alias: { '@delendai/core/public': corePublic } },
	test: {
		name: 'portfolio-content',
		include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		environment: 'node',
		globals: false,
	},
});
