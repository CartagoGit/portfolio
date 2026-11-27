import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

interface ISelectorRule {
	readonly selector: string;
	readonly signature: string;
	readonly line: number;
}

interface IScope {
	readonly kind: 'rule' | 'at-rule';
	readonly signature: string;
}

interface IFileCounts {
	flatBem: number;
	mixedBem: number;
	duplicateRules: number;
	featureLeakage: number;
}

interface IFileAnalysis {
	readonly counts: IFileCounts;
	readonly flat: ReadonlyArray<{ readonly line: number; readonly selector: string }>;
	readonly mixed: ReadonlyArray<{ readonly line: number; readonly selector: string }>;
	readonly duplicates: ReadonlyArray<{ readonly line: number; readonly selector: string }>;
	readonly leakage: ReadonlyArray<{ readonly line: number; readonly selector: string; readonly owner: string }>;
}

interface IBaseline {
	readonly version: 1;
	readonly files: Readonly<Record<string, Readonly<IFileCounts>>>;
}

const ROOT = process.cwd();
const SOURCE_ROOT = join(ROOT, 'src');
const BASELINE_PATH = join(ROOT, 'tools', 'check-bem-boundaries.baseline.json');
const CLASS_PATTERN = /\.([A-Za-z_][\w-]*)|class\s*~?=\s*['"]([^'"]+)['"]/g;
const COMPONENT_PATTERN = /\b(app-[a-z][\w-]*)/gu;
const AT_RULE = /^\s*@/u;
const AMPERSAND_BEM = /&(?:__|--|\.[A-Za-z_][\w-]*(?:__|--))/u;
const BEM_CLASS = /^(?<block>[A-Za-z_][\w-]*?)(?:__|--).+$/u;
const ZERO_COUNTS: Readonly<IFileCounts> = {
	flatBem: 0,
	mixedBem: 0,
	duplicateRules: 0,
	featureLeakage: 0,
};
const SHELL_CLASS_ALLOWLIST: Readonly<Record<string, ReadonlySet<string>>> = {
	'src/app/page.scss': new Set([
		'portfolio',
		'light-mode',
		'skip-link',
		'route-stage',
		'hero',
	]),
	'src/styles.scss': new Set([
		'sr-only',
		'skip-link',
		'interactive-fullscreen-control',
		'interactive-fullscreen-host',
		'is-fallback-fullscreen',
		'portfolio-fullscreen-mode',
		'app-shell-header',
		'app-shell-footer',
		'app-command-palette',
	]),
};

async function scssFiles(directory: string): Promise<string[]> {
	const result: string[] = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) result.push(...await scssFiles(path));
		else if (entry.isFile() && entry.name.endsWith('.scss')) result.push(path);
	}
	return result;
}

function classNames(selector: string): string[] {
	const names: string[] = [];
	for (const match of selector.matchAll(CLASS_PATTERN)) {
		if (match[1]) names.push(match[1]);
		if (match[2]) names.push(...match[2].trim().split(/\s+/u));
	}
	return names;
}

function parseRules(source: string): readonly ISelectorRule[] {
	const rules: ISelectorRule[] = [];
	const scopes: IScope[] = [];
	let buffer = '';
	let bufferLine = 1;
	let line = 1;
	let quote: '"' | "'" | null = null;
	let lineComment = false;
	let blockComment = false;
	let escape = false;

	const resetBuffer = (nextLine: number): void => {
		buffer = '';
		bufferLine = nextLine;
	};

	for (let index = 0; index < source.length; index += 1) {
		const char = source[index] ?? '';
		const next = source[index + 1] ?? '';
		if (char === '\n') line += 1;

		if (lineComment) {
			if (char === '\n') lineComment = false;
			else continue;
		}
		if (blockComment) {
			if (char === '*' && next === '/') {
				blockComment = false;
				index += 1;
			}
			continue;
		}
		if (!quote && char === '/' && next === '/') {
			lineComment = true;
			index += 1;
			continue;
		}
		if (!quote && char === '/' && next === '*') {
			blockComment = true;
			index += 1;
			continue;
		}
		if (quote) {
			buffer += char;
			if (escape) escape = false;
			else if (char === '\\') escape = true;
			else if (char === quote) quote = null;
			continue;
		}
		if (char === '"' || char === "'") {
			quote = char;
			buffer += char;
			continue;
		}
		if (char === ';') {
			resetBuffer(line);
			continue;
		}
		if (char === '{') {
			const selector = buffer.trim().replace(/\s+/gu, ' ');
			if (selector) {
				const isAtRule = AT_RULE.test(selector);
				const signature = isAtRule
					? `${scopes.map(({ signature }) => signature).filter(Boolean).join(' > ')} ${selector}`
					: `${scopes.map(({ signature }) => signature).filter(Boolean).join(' > ')} >> ${selector}`;
				scopes.push({ kind: isAtRule ? 'at-rule' : 'rule', signature });
				if (!isAtRule) rules.push({ selector, signature, line: bufferLine });
			}
			resetBuffer(line);
			continue;
		}
		if (char === '}') {
			if (scopes.length > 0) scopes.pop();
			resetBuffer(line);
			continue;
		}
		if (buffer.length === 0 && /\S/u.test(char)) bufferLine = line;
		buffer += char;
	}
	return rules;
}

function analyzeFile(path: string, source: string): IFileAnalysis {
	const rules = parseRules(source);
	let flatBem = 0;
	let mixedBem = 0;
	let featureLeakage = 0;
	const flat: Array<{ readonly line: number; readonly selector: string }> = [];
	const mixed: Array<{ readonly line: number; readonly selector: string }> = [];
	const leakage: Array<{ readonly line: number; readonly selector: string; readonly owner: string }> = [];
	const locations = new Map<string, ISelectorRule>();
	const signatures = new Map<string, number>();
	for (const rule of rules) {
		const names = classNames(rule.selector);
		if (!AMPERSAND_BEM.test(rule.selector)) {
			for (const name of names) {
				const match = BEM_CLASS.exec(name);
				if (match?.groups?.['block']) {
					flatBem += 1;
					flat.push({ line: rule.line, selector: rule.selector });
				}
			}
		}
		if (/\.[A-Za-z_][\w-]*\.[A-Za-z_][\w-]*(?:__|--)/u.test(rule.selector)) {
			mixedBem += 1;
			mixed.push({ line: rule.line, selector: rule.selector });
		}
		const shellAllowlist = SHELL_CLASS_ALLOWLIST[path];
		if (shellAllowlist) {
			const owners = [
				...names,
				...[...rule.selector.matchAll(COMPONENT_PATTERN)].map((match) => match[1] ?? ''),
			];
			for (const owner of new Set(owners.filter((name) => name && !shellAllowlist.has(name)))) {
				featureLeakage += 1;
				leakage.push({ line: rule.line, selector: rule.selector, owner });
			}
		}
		signatures.set(rule.signature, (signatures.get(rule.signature) ?? 0) + 1);
		if (!locations.has(rule.signature)) locations.set(rule.signature, rule);
	}
	const duplicateRules = [...signatures.values()].reduce(
		(total, count) => total + Math.max(0, count - 1),
		0,
	);
	const duplicates = [...signatures.entries()]
		.filter(([, count]) => count > 1)
		.map(([signature]) => {
			const rule = locations.get(signature);
			return { line: rule?.line ?? 1, selector: rule?.selector ?? signature };
		});
	return {
		counts: { flatBem, mixedBem, duplicateRules, featureLeakage },
		flat,
		mixed,
		duplicates,
		leakage,
	};
}

function sameCounts(left: IFileCounts, right: IFileCounts): boolean {
	return left.flatBem === right.flatBem
		&& left.mixedBem === right.mixedBem
		&& left.duplicateRules === right.duplicateRules
		&& left.featureLeakage === right.featureLeakage;
}

function baselineCounts(counts: IFileCounts | undefined): IFileCounts {
	return { ...ZERO_COUNTS, ...counts };
}

const files = (await scssFiles(SOURCE_ROOT)).sort();
const current: Record<string, IFileCounts> = {};
const analyses = new Map<string, IFileAnalysis>();
for (const file of files) {
	const path = relative(ROOT, file).replaceAll('\\', '/');
	const analysis = analyzeFile(path, await readFile(file, 'utf8'));
	analyses.set(path, analysis);
	current[path] = analysis.counts;
}

const inventory: IBaseline = { version: 1, files: current };
if (process.argv.includes('--inventory')) {
	const debt = Object.fromEntries(
		Object.entries(inventory.files).filter(([, counts]) => !sameCounts(counts, ZERO_COUNTS)),
	);
	console.log(JSON.stringify({ version: 1, files: debt }));
	process.exit(0);
}

const baseline = JSON.parse(await readFile(BASELINE_PATH, 'utf8')) as IBaseline;
if (baseline.version !== 1) throw new Error('Unsupported BEM baseline version.');
const failures: string[] = [];
for (const [path, counts] of Object.entries(current)) {
	const expected = baselineCounts(baseline.files[path]);
	for (const key of ['flatBem', 'mixedBem', 'duplicateRules', 'featureLeakage'] as const) {
		if (counts[key] > expected[key])
			failures.push(`${path}: ${key} increased ${expected[key]} → ${counts[key]}`);
	}
	if (failures.at(-1)?.startsWith(path) && !process.argv.includes('--quiet-findings')) {
		const analysis = analyses.get(path);
		for (const finding of [...analysis?.flat ?? [], ...analysis?.mixed ?? [], ...analysis?.duplicates ?? []])
			failures.push(`  L${finding.line}: ${finding.selector} — nest it as &__element / &--modifier or consolidate the repeated rule`);
		for (const finding of analysis?.leakage ?? [])
			failures.push(`  L${finding.line}: ${finding.selector} — move ${finding.owner} into its feature-owned SCSS or approve a shell primitive`);
	}
}
const strict = process.argv.includes('--strict');
if (strict) {
	for (const [path, counts] of Object.entries(current)) {
		if (!sameCounts(counts, ZERO_COUNTS)) failures.push(`${path}: strict BEM mode requires zero flat/mixed/duplicate/leakage rules`);
	}
}

if (failures.length > 0) {
	console.error('SCSS BEM boundary check failed:');
	for (const failure of failures) console.error(`- ${failure}`);
	console.error('Nest the element below its block (`.block { &__element {} }`), use `&--modifier`, or consolidate duplicate rules.');
	process.exitCode = 1;
} else {
	const totals = Object.values(current).reduce(
		(sum, counts) => ({
			flatBem: sum.flatBem + counts.flatBem,
			mixedBem: sum.mixedBem + counts.mixedBem,
			duplicateRules: sum.duplicateRules + counts.duplicateRules,
			featureLeakage: sum.featureLeakage + counts.featureLeakage,
		}),
		{ ...ZERO_COUNTS },
	);
	console.log(`BEM boundary check: ${files.length} SCSS files; flat ${totals.flatBem}, mixed ${totals.mixedBem}, duplicates ${totals.duplicateRules}, shell leakage ${totals.featureLeakage}; no regression.`);
}
