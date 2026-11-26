/**
 * SCSS ownership audit contracts. A selector is owned by the directory
 * whose templates use its class; no ownership table exists.
 */

export interface IScssAuditEntry {
	readonly selector: string;
	readonly className: string;
	readonly line: number;
	/** Directories (pages or components) whose templates use the class. */
	readonly owners: readonly string[];
	/** Concrete template locations that establish each directory owner. */
	readonly ownerLocations: ReadonlyArray<{
		readonly directory: string;
		readonly filePath: string;
		readonly line: number;
	}>;
	/** `unused` (no template), `single' (one owner) or `shared`. */
	readonly status: 'unused' | 'single' | 'shared';
}

export interface IScssAuditReport {
	readonly sourcePath: string;
	readonly totalSelectors: number;
	readonly counts: { readonly unused: number; readonly single: number; readonly shared: number };
	readonly entries: readonly IScssAuditEntry[];
	readonly dependencies: ReadonlyArray<{
		readonly kind: 'use' | 'forward' | 'import';
		readonly target: string;
		readonly line: number;
		readonly importedBy?: string;
		readonly depth?: number;
		readonly resolvedPath?: string;
	}>;
	readonly customProperties: ReadonlyArray<{
		readonly name: string;
		readonly line: number;
		readonly kind: 'definition' | 'reference';
	}>;
	readonly nextAction: string;
}

export interface IRunScssAuditRequest {
	readonly sourcePath: string;
	readonly templateRoots: readonly string[];
}
