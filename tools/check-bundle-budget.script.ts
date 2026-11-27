import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const browserRoot = join(process.cwd(), 'dist/portfolio/browser');
const files = (await readdir(browserRoot)).filter((file) => file.endsWith('.js'));
if (files.length === 0) throw new Error('No browser JavaScript chunks found; run the production build first.');

const limits = { initial: 360_000, lazy: 260_000, sharedLocale: 760_000 } as const;
const oversized: string[] = [];
const violations: string[] = [];
for (const file of files) {
	const path = join(browserRoot, file);
	const size = (await stat(path)).size;
	const initial = file.startsWith('main-') || file === 'polyfills.js';
	if (initial && size > limits.initial) violations.push(`${file}: ${size} bytes > ${limits.initial} bytes`);
	if (!initial && size > limits.lazy) oversized.push(file);
}
for (const file of oversized) {
	const size = (await stat(join(browserRoot, file))).size;
	const source = await readFile(join(browserRoot, file), 'utf8');
	const isLocaleCorpus = /\p{Script=Arabic}/u.test(source) && /\p{Script=Han}/u.test(source);
	if (size > limits.sharedLocale || !isLocaleCorpus)
		violations.push(`${file}: oversized lazy chunk is not the 20-locale corpus (${size} bytes)`);
}
if (oversized.length > 1) violations.push(`Expected one shared locale corpus, found ${oversized.length}: ${oversized.join(', ')}`);
if (!files.some((file) => file.startsWith('chunk-') && !file.startsWith('main-')))
	throw new Error('No lazy chunks found: route splitting is not active.');
if (violations.length > 0) throw new Error(`Bundle budget exceeded:\n${violations.join('\n')}`);
console.log(`bundle budgets: ${files.length} JS chunks; initial <= ${limits.initial}, product lazy <= ${limits.lazy}, shared 20-locale corpus <= ${limits.sharedLocale}`);
