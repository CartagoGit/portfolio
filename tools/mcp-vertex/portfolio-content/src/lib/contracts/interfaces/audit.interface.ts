/**
 * Audit-tool contracts. The plugin must surface findings with severity,
 * location and remediation so an agent can render them in the IDE without
 * re-parsing the JSON text — `outputSchema` in `audit-tool.ts` mirrors
 * these types directly.
 */

export type PortfolioAuditSeverity = 'error' | 'warning' | 'info';

export type PortfolioAuditFindingId =
	| 'private-term'
	| 'image-todo'
	| 'unreadable-content'
	| 'missing-content'
	| 'duplicated-content';

export interface IPortfolioAuditFindingLocation {
	readonly contentPath: string;
	readonly line?: number;
}

export interface IPortfolioAuditFinding {
	readonly id: PortfolioAuditFindingId;
	readonly severity: PortfolioAuditSeverity;
	/** Short human label, e.g. `Private term "Beateam"`. */
	readonly message: string;
	readonly location: IPortfolioAuditFindingLocation;
	/** Actionable next step the agent should take before publishing. */
	readonly remediation: string;
}

export interface IPortfolioAuditSeverityCounts {
	readonly errors: number;
	readonly warnings: number;
	readonly info: number;
}

export interface IPortfolioAuditReport {
	/** False when at least one `error`-severity finding is present. */
	readonly ok: boolean;
	readonly contentPaths: readonly string[];
	readonly severity: IPortfolioAuditSeverityCounts;
	readonly findings: readonly IPortfolioAuditFinding[];
	readonly nextAction: string;
}

/** Injectable I/O contract so the audit service is side-effect-free. */
export interface IPortfolioAuditReader {
	readonly readText: (contentPath: string) => Promise<string>;
	readonly exists: (contentPath: string) => Promise<boolean>;
}

export interface IPortfolioAuditOptions {
	readonly contentPaths: readonly string[];
	readonly forbiddenTerms: readonly string[];
	/** Locale for `nextAction` messages; defaults to `en`. */
	readonly locale: 'en' | 'es';
	readonly reader: IPortfolioAuditReader;
}
