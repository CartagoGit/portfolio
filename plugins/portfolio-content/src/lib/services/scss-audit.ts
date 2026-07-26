/**
 * SCSS introspection engine. Reads a SCSS file (typical caller:
 * `src/app/portfolio-page.scss`) and emits a structured report of
 * every top-level selector it defines, plus a suggested owning
 * feature and target file. Pure-static: regex over the source, no
 * Sass compiler.
 *
 * The ownership map is a deliberately terse convention (see
 * `OWNERSHIP_MAP` below). Anything that doesn't match is flagged as
 * `unmapped` so the agent can decide. The mapping is intentionally
 * read-only here — a second pass that *moves* the selectors is the
 * author's job, not the engine's.
 */

import type {
	IBuildScssAuditOptions,
	IScssAuditReport,
	IScssSelectorEntry,
	ScssOwnership,
} from '../contracts/interfaces/scss-audit.interface';

interface IOwnershipPattern {
	readonly ownership: ScssOwnership;
	readonly target: string;
	readonly rationale: string;
	/** The selector substring to match against. */
	readonly match: (selector: string) => boolean;
}

const startsWith = (prefix: string) => (selector: string): boolean =>
	selector.startsWith(prefix);

const equals = (name: string) => (selector: string): boolean => selector === name;

const OWNERSHIP_MAP: readonly IOwnershipPattern[] = [
	// shell-level (`:root`, `.portfolio`, `.route-stage`, etc.) → `shell`.
	{
		ownership: 'shell',
		target: 'src/app/portfolio-page.scss',
		rationale: 'Shell-level container owned by the route shell.',
		match: (selector) =>
			equals('portfolio')(selector) ||
			equals('route-stage')(selector) ||
			equals('skip-link')(selector) ||
			equals('hero')(selector) ||
			equals('section')(selector) ||
			equals('section-heading')(selector),
	},
	// home/hero-monitor — `.orb*`, `.interface-shell*`, `.canvas-*`, `.layer-list`,
	// `.monitor-*`, `.hero-banner`, etc.
	{
		ownership: 'home/hero-monitor',
		target: 'src/features/home/hero-monitor/hero-monitor.component.scss',
		rationale: 'Hero monitor visual layer (interface shell, canvas, layers).',
		match: (selector) =>
			startsWith('orb')(selector) ||
			startsWith('interface-')(selector) ||
			startsWith('canvas-')(selector) ||
			startsWith('layer-list')(selector) ||
			startsWith('monitor-')(selector) ||
			equals('hero-banner')(selector) ||
			equals('hero-composition')(selector),
	},
	// home/earth-globe
	{
		ownership: 'home/earth-globe',
		target: 'src/features/home/earth-globe/earth-globe.component.scss',
		rationale: 'Earth globe visual layer.',
		match: (selector) =>
			startsWith('earth')(selector) ||
			startsWith('globe')(selector),
	},
	// home/home-intro — `.home-intro__*`, `.home-directory`, `.explore-banner`,
	// `.proof-strip`, `.directory-grid`.
	{
		ownership: 'home/home-intro',
		target: 'src/features/home/home-intro/home-intro.component.scss',
		rationale: 'Home intro / directory / proof strip.',
		match: (selector) =>
			startsWith('home-intro')(selector) ||
			startsWith('home-directory')(selector) ||
			startsWith('explore-banner')(selector) ||
			startsWith('directory-grid')(selector) ||
			startsWith('proof-strip')(selector) ||
			startsWith('hero-note')(selector),
	},
	// work — `.case-*`, `.work-page*`.
	{
		ownership: 'work',
		target: 'src/features/work/work-page.component.scss',
		rationale: 'Work page case grid.',
		match: (selector) =>
			startsWith('case-')(selector) ||
			startsWith('work-page')(selector),
	},
	// approach — `.approach*`.
	{
		ownership: 'approach',
		target: 'src/features/approach/approach-page.component.scss',
		rationale: 'Approach page.',
		match: (selector) => startsWith('approach')(selector),
	},
	// knowledge — `.knowledge*`, `.capability-*`, `.layer-card`.
	{
		ownership: 'knowledge',
		target: 'src/features/knowledge/knowledge-page.component.scss',
		rationale: 'Knowledge page grid + capability cards.',
		match: (selector) =>
			startsWith('knowledge')(selector) ||
			startsWith('capability')(selector),
	},
	// lab — `.lab-page*`, `.lab-card`, `.playground*`.
	{
		ownership: 'lab',
		target: 'src/features/lab/lab-page.component.scss',
		rationale: 'Lab playground.',
		match: (selector) =>
			startsWith('lab-')(selector) ||
			startsWith('playground')(selector),
	},
	// docker — `.docker*`.
	{
		ownership: 'docker',
		target: 'src/features/docker/docker-page.component.scss',
		rationale: 'Docker showcase.',
		match: (selector) => startsWith('docker')(selector),
	},
	// demos — `.demos*`.
	{
		ownership: 'demos',
		target: 'src/features/demos/demos-page.component.scss',
		rationale: 'Demos gallery.',
		match: (selector) => startsWith('demos')(selector),
	},
	// contact — `.contact-page*`.
	{
		ownership: 'contact',
		target: 'src/features/contact/contact-page.component.scss',
		rationale: 'Contact page.',
		match: (selector) => startsWith('contact')(selector),
	},
	// shared/ui — `.portfolio-header`, `.portfolio-footer`, `.command-palette`,
	// `.lab-card`, `.interface-shell` (if upstream).
	{
		ownership: 'shared/ui',
		target: 'src/shared/ui/<component>/<component>.component.scss',
		rationale: 'Reusable UI primitives owned by the shared layer.',
		match: (selector) =>
			startsWith('portfolio-header')(selector) ||
			startsWith('portfolio-footer')(selector) ||
			startsWith('command-palette')(selector),
	},
];

const classify = (selector: string, known: Map<string, ScssOwnership>): IOwnershipPattern => {
	for (const pattern of OWNERSHIP_MAP) {
		if (pattern.match(selector)) return pattern;
	}
	// Family inheritance: walk the selector from left to right and
	// adopt the first parent name that already has an owner. This is
	// how `.orb-one` → `home/hero-monitor` (parent: `.orb`), or
	// `.case-card-overlay` → `work` (parent: `.case-card`).
	for (const segment of selector.split(/[-_]/)) {
		const owner = known.get(segment);
		if (owner) {
			return {
				ownership: owner,
				target: targetForOwnership(owner),
				rationale: `Inherited from family root "${segment}".`,
				match: () => false,
			};
		}
	}
	return {
		ownership: 'unmapped',
		target: 'src/app/portfolio-page.scss',
		rationale:
			'No ownership pattern matched; resolve manually before migration.',
		match: () => false,
	};
};

const targetForOwnership = (ownership: ScssOwnership): string => {
	for (const pattern of OWNERSHIP_MAP) {
		if (pattern.ownership === ownership) return pattern.target;
	}
	return 'src/app/portfolio-page.scss';
};

// A "primary" selector is a single class name followed by EITHER a
// `{` (declaration block) OR a `,` (selector list). We deliberately
// skip nested combinators (` `, `>`, `+`, `~`, `:`, `.`) so a
// pseudo-class like `.hero::before` doesn't pollute the migration
// list — `.hero` is the one to migrate, `.hero::before` follows.
const SELECTOR_RE = /^(\.[A-Za-z][A-Za-z0-9_-]*)\s*(?:\{|,)/gm;

const lineOf = (source: string, index: number): number => {
	let line = 1;
	for (let i = 0; i < index; i += 1) {
		if (source.charCodeAt(i) === 10) line += 1;
	}
	return line;
};

export const runScssAudit = async (
	options: IBuildScssAuditOptions,
): Promise<IScssAuditReport> => {
	const { sourcePath, fs } = options;
	if (!(await fs.exists(sourcePath))) {
		return {
			sourcePath,
			totalSelectors: 0,
			ownershipCounts: emptyCounts(),
			entries: [],
			unmapped: [],
			nextAction: `Source file not found: ${sourcePath}`,
		};
	}

	const source = await fs.readText(sourcePath);
	const entries: IScssSelectorEntry[] = [];
	const seen = new Set<string>();
	// Forward declaration: a `.orb-one` wants to inherit from `.orb`,
	// so we walk the source top-to-bottom and classify selectors in
	// the order they appear. `known` accumulates the inferred owners
	// as we go.
	const known = new Map<string, ScssOwnership>();

	for (const match of source.matchAll(SELECTOR_RE)) {
		const selector = match[1];
		if (!selector) continue;
		const name = selector.slice(1); // drop the leading `.`
		if (seen.has(name)) continue;
		seen.add(name);
		const pattern = classify(name, known);
		entries.push({
			name,
			selector,
			line: lineOf(source, match.index ?? 0),
			ownership: pattern.ownership,
			target: pattern.target,
			rationale: pattern.rationale,
		});
		known.set(name, pattern.ownership);
	}

	entries.sort((a, b) => a.line - b.line);

	const counts = emptyCounts();
	for (const entry of entries) {
		counts[entry.ownership] += 1;
	}

	const unmapped = entries.filter((entry) => entry.ownership === 'unmapped');

	const nextAction = unmapped.length > 0
		? `Resolve the ${unmapped.length} unmapped selector(s) before slicing the migration.`
		: 'Every selector has an owner — ready to slice by ownership.';

	return {
		sourcePath,
		totalSelectors: entries.length,
		ownershipCounts: counts,
		entries,
		unmapped,
		nextAction,
	};
};

const emptyCounts = (): Record<ScssOwnership, number> => ({
	shell: 0,
	home: 0,
	'home/hero-monitor': 0,
	'home/earth-globe': 0,
	'home/home-intro': 0,
	work: 0,
	approach: 0,
	knowledge: 0,
	lab: 0,
	docker: 0,
	demos: 0,
	contact: 0,
	shared: 0,
	'shared/ui': 0,
	unmapped: 0,
});
