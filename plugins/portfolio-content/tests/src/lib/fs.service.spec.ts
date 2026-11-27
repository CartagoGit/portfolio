import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertWorkspaceRelativePath, buildNodeFileSystem } from '../../../src/lib/services/fs.service';

const cleanup: string[] = [];
afterEach(() => {
	for (const path of cleanup.splice(0)) rmSync(path, { recursive: true, force: true });
});

describe('workspace file-system boundary', () => {
	it.each(['../secret', 'src/../../secret', '/etc/passwd', 'C:\\secret'])('rejects non-contained input %s', (path) => {
		expect(() => assertWorkspaceRelativePath(path)).toThrow('Path escapes workspace boundary');
	});

	it('allows ordinary relative paths', () => {
		expect(assertWorkspaceRelativePath('./src/pages/home')).toBe('src/pages/home');
	});

	it('rejects symlinks whose real target leaves the workspace', async () => {
		const sandbox = mkdtempSync(join(tmpdir(), 'portfolio-fs-'));
		cleanup.push(sandbox);
		const workspace = join(sandbox, 'workspace');
		const outside = join(sandbox, 'outside');
		mkdirSync(workspace);
		mkdirSync(outside);
		writeFileSync(join(outside, 'secret.txt'), 'private');
		symlinkSync(outside, join(workspace, 'escape'), 'dir');
		const fs = await buildNodeFileSystem(workspace);
		await expect(fs.readText('escape/secret.txt')).rejects.toThrow('Path escapes workspace boundary');
	});
});
