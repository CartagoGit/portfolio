/**
 * Links `node_modules/@delendai/core` to the machine's DelendAI install, the
 * same one the global `delendai` command runs: `$DELENDAI_PATH`, else
 * `~/.local/share/delendai/stable`. DelendAI is not on npm yet; once it is,
 * `@delendai/core` becomes an ordinary dependency and this script goes away.
 * The plugin's types and tests import `@delendai/core/public` through it.
 *
 *   bun tools/link-delendai-core.script.ts             fail when no install exists
 *   bun tools/link-delendai-core.script.ts --optional  warn and succeed (bun install)
 */
import {
	existsSync,
	lstatSync,
	mkdirSync,
	readlinkSync,
	rmSync,
	symlinkSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CORE_ENTRY = 'dist/public/index.js';
const optional = process.argv.includes('--optional');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const install = resolve(
	process.env['DELENDAI_PATH'] ??
		join(homedir(), '.local/share/delendai/stable')
);
const target = join(install, 'packages/core');
const link = join(root, 'node_modules/@delendai/core');

if (!existsSync(join(target, CORE_ENTRY))) {
	const message = `DelendAI install not found at ${install} (expected packages/core/${CORE_ENTRY}). Install the stable channel or set DELENDAI_PATH.`;
	if (optional) {
		console.warn(`link-delendai-core: ${message} Skipping the link.`);
		process.exit(0);
	}
	console.error(`link-delendai-core: ${message}`);
	process.exit(1);
}

const current = (() => {
	try {
		return lstatSync(link).isSymbolicLink() ? readlinkSync(link) : null;
	} catch {
		return null;
	}
})();
if (current !== target) {
	mkdirSync(dirname(link), { recursive: true });
	rmSync(link, { force: true, recursive: true });
	symlinkSync(target, link, 'dir');
	console.log('link-delendai-core: linked node_modules/@delendai/core');
}
