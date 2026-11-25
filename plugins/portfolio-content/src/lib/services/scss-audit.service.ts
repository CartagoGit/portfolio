/**
 * SCSS ownership audit. Lists every class selector of a stylesheet and
 * reports which directories' templates (html files and inline
 * `template:` strings) use that class. Ownership is read from the
 * templates found at call time; no selector-to-page table exists.
 */

import type {
	IRunScssAuditRequest,
	IScssAuditEntry,
	IScssAuditReport,
} from '../../contracts/interfaces/scss-audit.interface';
import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { walkFiles } from './fs.service';
import { parseScssSource } from './scss-audit.parser';

const CLASS_ATTR_RE = /\bclass(?:Name)?\s*=\s*["']([^"']+)["']/g;
const NG_CLASS_RE = /\[class\.([\w-]+)\]/g;

const dirname = (path: string): string => path.slice(0, path.lastIndexOf('/'));

const collectTemplateClasses = (source: string): ReadonlySet<string> => {
	const classes = new Set<string>();
	for (const match of source.matchAll(CLASS_ATTR_RE)) {
		for (const token of (match[1] ?? '').split(/\s+/)) {
			if (/^[\w-]+$/.test(token)) classes.add(token);
		}
	}
	for (const match of source.matchAll(NG_CLASS_RE)) classes.add(match[1] ?? '');
	return classes;
};

const nextActionFor = (counts: IScssAuditReport['counts']): string => {
	if (counts.unused > 0)
		return 'Review the unused selectors: no template references them, so they are dead or dynamically applied.';
	if (counts.shared > 0)
		return 'Shared selectors are used by several directories; keep them in a shared stylesheet.';
	return 'Every selector has a single owning directory.';
};

export interface IScssAuditDeps {
	readonly fs: IFileSystem;
}

export const runScssAudit = async (
	deps: IScssAuditDeps,
	request: IRunScssAuditRequest,
): Promise<IScssAuditReport> => {
	const { fs } = deps;
	const owners = new Map<string, Set<string>>();
	for (const root of request.templateRoots) {
		for (const file of await walkFiles(fs, root)) {
			if (!file.endsWith('.html') && !file.endsWith('.component.ts') && !file.endsWith('.page.ts'))
				continue;
			for (const className of collectTemplateClasses(await fs.readText(file))) {
				const set = owners.get(className) ?? new Set<string>();
				set.add(dirname(file));
				owners.set(className, set);
			}
		}
	}

	const source = await fs.readText(request.sourcePath);
	const parsed = parseScssSource(source);
	const dependencies = await Promise.all(parsed.dependencies.map(async (dependency) => {
		if (dependency.target.startsWith('sass:') || /^(https?:)?\/\//.test(dependency.target)) return dependency;
		const base = `${dirname(request.sourcePath)}/${dependency.target}`.replace(/^\.\//, '');
		const lastSlash = base.lastIndexOf('/');
		const dir = lastSlash < 0 ? '' : base.slice(0, lastSlash + 1);
		const name = base.slice(lastSlash + 1);
		const candidates = [
			base,
			`${base}.scss`,
			`${dir}_${name}.scss`,
			`src/styles/${dependency.target}.scss`,
			`src/styles/${dependency.target}/_index.scss`,
		];
		const resolvedPath = (await Promise.all(candidates.map(async (candidate) => ({ candidate, exists: await fs.exists(candidate) })))).find(({ exists }) => exists)?.candidate;
		return resolvedPath ? { ...dependency, resolvedPath } : dependency;
	}));

	const entries: IScssAuditEntry[] = [];
	const seen = new Set<string>();
	for (const selector of parsed.selectors) {
		for (const className of selector.classNames) {
			if (seen.has(className)) continue;
			seen.add(className);
			const found = [...(owners.get(className) ?? [])].sort((a, b) => a.localeCompare(b));
			entries.push({
				selector: `.${className}`,
				className,
				line: selector.line,
				owners: found,
				status: found.length === 0 ? 'unused' : found.length === 1 ? 'single' : 'shared',
			});
		}
	}

	const counts = {
		unused: entries.filter((entry) => entry.status === 'unused').length,
		single: entries.filter((entry) => entry.status === 'single').length,
		shared: entries.filter((entry) => entry.status === 'shared').length,
	};
	return {
		sourcePath: request.sourcePath,
		totalSelectors: entries.length,
		counts,
		entries,
		dependencies,
		customProperties: parsed.customProperties,
		nextAction: nextActionFor(counts),
	};
};
