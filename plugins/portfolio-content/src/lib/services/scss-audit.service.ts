/**
 * SCSS ownership audit. Lists every class selector of a stylesheet and
 * reports which directories' templates (html files and inline
 * `template:` strings) use that class. Ownership is read from the
 * templates found at call time; no selector-to-page table exists.
 */

import { posix as path } from 'node:path';

import type {
	IRunScssAuditRequest,
	IScssAuditEntry,
	IScssAuditReport,
} from '../../contracts/interfaces/scss-audit.interface';
import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { walkFiles } from './fs.service';
import { parseScssSource } from './scss-audit.parser';
import type { IScssDependency, IScssParseResult } from './scss-audit.types';

const CLASS_ATTR_RE = /\bclass(?:Name)?\s*=\s*["']([^"']+)["']/g;
const NG_CLASS_RE = /\[class\.([\w-]+)\]/g;

interface ITemplateClassLocation {
	readonly className: string;
	readonly line: number;
}

interface IQueuedScssSource {
	readonly path: string;
	readonly depth: number;
	readonly parsed?: IScssParseResult;
}

const dirname = (value: string): string => path.dirname(value) === '.' ? '' : path.dirname(value);

const lineAt = (source: string, offset: number): number =>
	source.slice(0, offset).split('\n').length;

const collectTemplateClasses = (source: string): readonly ITemplateClassLocation[] => {
	const locations: ITemplateClassLocation[] = [];
	for (const match of source.matchAll(CLASS_ATTR_RE)) {
		const line = lineAt(source, match.index);
		for (const className of (match[1] ?? '').split(/\s+/)) {
			if (/^[\w-]+$/.test(className)) locations.push({ className, line });
		}
	}
	for (const match of source.matchAll(NG_CLASS_RE)) {
		const className = match[1];
		if (className) locations.push({ className, line: lineAt(source, match.index) });
	}
	return locations;
};

const externalDependency = (target: string): boolean =>
	target.startsWith('sass:') || /^(?:https?:)?\/\//.test(target);

function dependencyCandidates(base: string): readonly string[] {
	const extension = path.extname(base);
	const directory = path.dirname(base);
	const name = path.basename(base, extension);
	const candidates = extension === '' ? [base, `${base}.scss`] : [base];
	candidates.push(path.join(directory, `_${name}${extension || '.scss'}`));
	if (extension === '') candidates.push(path.join(base, '_index.scss'));
	return [...new Set(candidates)];
}

async function resolveDependency(
	fs: IFileSystem,
	importedBy: string,
	target: string,
): Promise<string | undefined> {
	const relative = path.normalize(path.join(dirname(importedBy), target));
	const global = path.normalize(path.join('src/styles', target));
	const candidates = [...dependencyCandidates(relative), ...dependencyCandidates(global)];
	for (const candidate of candidates) {
		if (await fs.exists(candidate) && !await fs.isDirectory(candidate)) return candidate;
	}
	return undefined;
}

async function collectDependencies(
	fs: IFileSystem,
	sourcePath: string,
	rootParse: IScssParseResult,
): Promise<readonly IScssDependency[]> {
	const dependencies: IScssDependency[] = [];
	const visited = new Set<string>();
	const queue: IQueuedScssSource[] = [{ path: sourcePath, depth: 0, parsed: rootParse }];
	while (queue.length > 0) {
		const current = queue.shift();
		if (!current || visited.has(current.path)) continue;
		visited.add(current.path);
		const parsed = current.parsed ?? parseScssSource(await fs.readText(current.path));
		for (const dependency of parsed.dependencies) {
			if (externalDependency(dependency.target)) {
				dependencies.push({ ...dependency, importedBy: current.path, depth: current.depth });
				continue;
			}
			const resolvedPath = await resolveDependency(fs, current.path, dependency.target);
			dependencies.push({
				...dependency,
				importedBy: current.path,
				depth: current.depth,
				...(resolvedPath ? { resolvedPath } : {}),
			});
			if (resolvedPath && !visited.has(resolvedPath))
				queue.push({ path: resolvedPath, depth: current.depth + 1 });
		}
	}
	return dependencies;
}

const nextActionFor = (
	counts: IScssAuditReport['counts'],
	unresolved: number,
): string => {
	if (unresolved > 0)
		return 'Resolve missing SCSS partials before trusting ownership; dependency line evidence is attached to the audit report.';
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
	const owners = new Map<string, Map<string, {
		readonly directory: string;
		readonly filePath: string;
		readonly line: number;
	}>>();
	for (const root of request.templateRoots) {
		for (const file of await walkFiles(fs, root)) {
			if (!file.endsWith('.html') && !file.endsWith('.component.ts') && !file.endsWith('.page.ts'))
				continue;
			for (const use of collectTemplateClasses(await fs.readText(file))) {
				const locations = owners.get(use.className) ?? new Map();
				const directory = dirname(file);
				locations.set(`${file}:${use.line}`, { directory, filePath: file, line: use.line });
				owners.set(use.className, locations);
			}
		}
	}

	const source = await fs.readText(request.sourcePath);
	const parsed = parseScssSource(source);
	const dependencies = await collectDependencies(fs, request.sourcePath, parsed);

	const entries: IScssAuditEntry[] = [];
	const seen = new Set<string>();
	for (const selector of parsed.selectors) {
		for (const className of selector.classNames) {
			if (seen.has(className)) continue;
			seen.add(className);
			const ownerLocations = [...(owners.get(className)?.values() ?? [])]
				.sort((left, right) => left.filePath.localeCompare(right.filePath) || left.line - right.line);
			const found = [...new Set(ownerLocations.map(({ directory }) => directory))].sort();
			entries.push({
				selector: `.${className}`,
				className,
				line: selector.line,
				owners: found,
				ownerLocations,
				status: found.length === 0 ? 'unused' : found.length === 1 ? 'single' : 'shared',
			});
		}
	}

	const counts = {
		unused: entries.filter((entry) => entry.status === 'unused').length,
		single: entries.filter((entry) => entry.status === 'single').length,
		shared: entries.filter((entry) => entry.status === 'shared').length,
	};
	const unresolved = dependencies.filter((dependency) =>
		!externalDependency(dependency.target) && !dependency.resolvedPath
	).length;
	return {
		sourcePath: request.sourcePath,
		totalSelectors: entries.length,
		counts,
		entries,
		dependencies,
		customProperties: parsed.customProperties,
		nextAction: nextActionFor(counts, unresolved),
	};
};
