/**
 * Links the local DelendAI install into `.cache/delendai-runtime` (gitignored)
 * so no committed file carries a machine path. The target is `$DELENDAI_PATH`,
 * or `~/.local/share/delendai/stable`.
 *
 *   bun tools/delendai-runtime.script.ts             fail when no install exists
 *   bun tools/delendai-runtime.script.ts --optional  warn and succeed (bun install, CI)
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

export const RUNTIME_LINK = '.cache/delendai-runtime';
const CLI_ENTRY = 'packages/cli/dist/index.js';
const optional = process.argv.includes('--optional');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(
	process.env['DELENDAI_PATH'] ?? join(homedir(), '.local/share/delendai/stable'),
);
const link = join(root, RUNTIME_LINK);

if (!existsSync(join(target, CLI_ENTRY))) {
	const message = `DelendAI install not found at ${target} (expected ${CLI_ENTRY}). Install it or set DELENDAI_PATH.`;
	if (optional) {
		console.warn(`delendai-runtime: ${message} Skipping the link.`);
		process.exit(0);
	}
	console.error(`delendai-runtime: ${message}`);
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
	console.log(`delendai-runtime: linked ${RUNTIME_LINK}`);
}
