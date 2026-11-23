/**
 * SCSS introspection contracts. The engine reads a SCSS file and
 * extracts every top-level selector + binding pair so an agent can
 * answer "what selectors does this stylesheet define, and which
 * feature should own each one?" without reading the file by hand.
 *
 * The selector → feature mapping is a static convention: the agent
 * declares which feature owns which namespace (e.g. `.case-*` →
 * `work`, `.orb` / `.canvas-*` → `home/hero-monitor`). Anything
 * unmatched is reported as `unmapped` so the shell can decide.
 */

import type { IFileSystem } from './fs.interface';

export type ScssOwnership =
	| 'home'
	| 'home/hero-monitor'
	| 'home/earth-globe'
	| 'home/home-intro'
	| 'work'
	| 'approach'
	| 'knowledge'
	| 'lab'
	| 'docker'
	| 'demos'
	| 'contact'
	| 'shared'
	| 'shared/ui'
	| 'shell'
	| 'unmapped';

export interface IScssSelectorEntry {
	/** Selector name (without the leading `.`), e.g. `case-card`. */
	readonly name: string;
	/** First-class selector pattern (e.g. `.case-card`). */
	readonly selector: string;
	/** 1-indexed line in the source file. */
	readonly line: number;
	/** Suggested owning feature/component. */
	readonly ownership: ScssOwnership;
	/** Suggested target file relative to the workspace root. */
	readonly target: string;
	/** Why the selector is suspected to belong there. */
	readonly rationale: string;
}

export interface IScssAuditReport {
	readonly sourcePath: string;
	readonly totalSelectors: number;
	readonly ownershipCounts: Readonly<Record<ScssOwnership, number>>;
	readonly entries: readonly IScssSelectorEntry[];
	readonly unmapped: readonly IScssSelectorEntry[];
	readonly nextAction: string;
}

export interface IBuildScssAuditOptions {
	readonly sourcePath: string;
	readonly fs: IFileSystem;
}
