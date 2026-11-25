import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOTS = ['src', 'config', 'tools', 'plugins', 'e2e'] as const;
const ROLES = new Set([
	'adapter', 'barrel', 'browser', 'catalog', 'component', 'config', 'connector', 'constant',
	'content', 'data', 'directive', 'entrypoint', 'facade', 'helper', 'interface', 'locale', 'model', 'overlays', 'page',
	'pipe', 'plugin', 'parser', 'registry', 'renderer', 'routes', 'routing', 'script', 'seo', 'server',
	'service', 'spec', 'theme', 'tool', 'translation', 'translations', 'types', 'visuals',
]);
const SKIPPED_DIRECTORIES = new Set(['node_modules', '.dist', 'dist', '.angular', '.cache']);

async function collectTsFiles(directory: string, result: string[]): Promise<void> {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		if (entry.isDirectory()) {
			if (!SKIPPED_DIRECTORIES.has(entry.name)) await collectTsFiles(join(directory, entry.name), result);
			continue;
		}
		if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts'))
			result.push(join(directory, entry.name));
	}
}

const files: string[] = [];
for (const root of ROOTS) await collectTsFiles(root, files);
// The delendai plugin scaffold names a plugin's entry and public barrel `index.ts`.
const PLUGIN_SCAFFOLD_ENTRY = /^plugins\/[^/]+\/src\/(public\/)?index\.ts$/;
const invalid = files.filter((file) => {
	if (PLUGIN_SCAFFOLD_ENTRY.test(relative(process.cwd(), file).replaceAll('\\', '/'))) return false;
	const stem = file.slice(0, -3).split(/[\/]/).at(-1) ?? '';
	const parts = stem.split('.');
	return parts.length < 2 || !ROLES.has(parts.at(-1) ?? '');
});

if (invalid.length) {
	console.error('TypeScript files must use the `{name}.{role}.ts` convention:');
	for (const file of invalid) console.error(`- ${relative(process.cwd(), file)}`);
	process.exitCode = 1;
} else {
	console.log(`File naming convention OK: ${files.length} TypeScript files.`);
}
