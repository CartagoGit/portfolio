/**
 * Resolved `plugins.portfolio-content.options` block. Every field has a
 * default so a host with an empty block still introspects the portfolio;
 * the zod schema in `lib/services/options.service.ts` is the source of
 * truth and this interface mirrors its output.
 */
export interface IPortfolioContentOptions {
	/** Directory whose sub-directories are the architecture layers. */
	readonly sourceRoot: string;
	/** Directory whose sub-directories are the public pages. */
	readonly pagesRoot: string;
	/** Directory holding the exported domain contracts. */
	readonly domainRoot: string;
	/** Roots scanned (recursively) for `*.html` public templates. */
	readonly contentRoots: readonly string[];
	/** Extra workspace-relative globs added to the audited templates. */
	readonly contentIncludeGlobs: readonly string[];
	/** Globs removed from the audited templates. */
	readonly contentExcludeGlobs: readonly string[];
	/** Employer/client names matched as case-insensitive substrings. */
	readonly forbiddenTerms: readonly string[];
	/** Roots that must never appear, even split by separators. */
	readonly perSeRoots: readonly string[];
	/** Language of the audit's remediation text. */
	readonly locale: 'en' | 'es';
	/** SCSS file the SCSS audit reads when the caller gives no path. */
	readonly scssAuditSourcePath: string;
}
