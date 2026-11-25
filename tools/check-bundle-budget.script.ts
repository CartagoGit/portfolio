import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const browserRoot = join(process.cwd(), 'dist/portfolio/browser');
const files = (await readdir(browserRoot)).filter((file) => file.endsWith('.js'));
if (files.length === 0) throw new Error('No browser JavaScript chunks found; run the production build first.');

const limits = { initial: 360_000, lazy: 260_000 } as const;
const violations: string[] = [];
for (const file of files) {
	const size = (await stat(join(browserRoot, file))).size;
	const limit = file.startsWith('main-') || file === 'polyfills.js' ? limits.initial : limits.lazy;
	if (size > limit) violations.push(`${file}: ${size} bytes > ${limit} bytes`);
}
if (!files.some((file) => file.startsWith('chunk-') && !file.startsWith('main-')))
	throw new Error('No lazy chunks found: route splitting is not active.');
if (violations.length > 0) throw new Error(`Bundle budget exceeded:\n${violations.join('\n')}`);
console.log(`bundle budgets: ${files.length} JS chunks within ${limits.initial}/${limits.lazy} byte initial/lazy caps`);
