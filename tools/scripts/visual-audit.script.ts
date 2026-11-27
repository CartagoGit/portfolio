import { spawnSync } from 'node:child_process';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { EARTH_TEXTURE_OPTIONS } from '../../src/pages/home/hero-monitor/earth-texture.catalog';

const ROOT = join(process.cwd(), '.cache', 'visual-audit');
const ROUTES = [
	'',
	'work',
	'lab',
	'approach',
	'knowledge',
	'docker',
	'demos',
	'contact',
] as const;
const VIEWPORTS = [
	{ id: 'desktop', width: 1440, height: 900 },
	{ id: 'laptop', width: 1024, height: 768 },
	{ id: 'tablet', width: 768, height: 1024 },
	{ id: 'tablet-landscape', width: 1024, height: 600 },
	{ id: 'smartphone', width: 390, height: 844 },
	{ id: 'small-touch', width: 320, height: 568 },
] as const;
const THEMES = [
	'dark',
	'light',
	'midnight',
	'ocean',
	'forest',
	'sunset',
	'solar',
	'mono',
] as const;
const LOCALES = [
	'en',
	'es',
	'fr',
	'de',
	'it',
	'pt-PT',
	'pt-BR',
	'ru',
	'uk',
	'pl',
	'hr',
	'tr',
	'ar',
	'hi',
	'bn',
	'zh-CN',
	'zh-TW',
	'ja',
	'ko',
	'id',
] as const;
const PRIORITY_LOCALE_ROUTES = [
	'approach',
	'demos',
	'docker',
	'contact',
] as const;
const MODEL_OPTIONS = EARTH_TEXTURE_OPTIONS.filter(({ id }) => id.startsWith('model-'));
const NAMED_STATE_CAPTURE_COUNT = 3;
const EXPECTED_CAPTURE_COUNT =
	ROUTES.length * VIEWPORTS.length +
	THEMES.length * (1 + MODEL_OPTIONS.length) +
	EARTH_TEXTURE_OPTIONS.length * VIEWPORTS.length +
	LOCALES.length * PRIORITY_LOCALE_ROUTES.length +
	NAMED_STATE_CAPTURE_COUNT;

async function pngFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const paths: string[] = [];
	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) paths.push(...(await pngFiles(path)));
		else if (entry.name.endsWith('.png')) paths.push(path);
	}
	return paths;
}

await rm(ROOT, { recursive: true, force: true });
await mkdir(ROOT, { recursive: true });

const command = process.platform === 'win32' ? 'bunx.exe' : 'bunx';
const audit = spawnSync(
	command,
	['playwright', 'test', 'e2e/visual-truth.spec.ts'],
	{
		cwd: process.cwd(),
		env: { ...process.env, VISUAL_AUDIT_CAPTURE: '1' },
		stdio: 'inherit',
	}
);
if (audit.error) throw audit.error;
if (audit.status !== 0) process.exit(audit.status ?? 1);

const captures = (await pngFiles(ROOT)).sort();
if (captures.length !== EXPECTED_CAPTURE_COUNT)
	throw new Error(
		`Visual audit produced ${captures.length} captures; expected ${EXPECTED_CAPTURE_COUNT}.`
	);

await writeFile(
	join(ROOT, 'manifest.json'),
	`${JSON.stringify(
		{
			generatedAt: new Date().toISOString(),
			routes: ROUTES,
			viewports: VIEWPORTS,
			themes: THEMES,
			locales: LOCALES,
			priorityLocaleRoutes: PRIORITY_LOCALE_ROUTES,
			presets: EARTH_TEXTURE_OPTIONS.map(({ id, category, origin }) => ({
				id,
				category,
				origin,
			})),
			captureCount: captures.length,
			captures: captures.map((path) => path.slice(ROOT.length + 1)),
		},
		null,
		2
	)}\n`,
	'utf8'
);

console.log(
	`visual audit: ${captures.length} captures and manifest written to ${ROOT}`
);
