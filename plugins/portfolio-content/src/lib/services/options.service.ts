/**
 * Plugin options schema. Every field has a default, so the plugin is
 * useful with an empty `options` block (required for project-local
 * plugins, which must declare an `optionsSchema`).
 */

import { z } from 'zod';

export const OptionsSchema = z.object({
	/** Directory whose sub-directories are the architecture layers. */
	sourceRoot: z.string().min(1).default('src'),
	/** Directory whose sub-directories are the public pages. */
	pagesRoot: z.string().min(1).default('src/pages'),
	/** Directory holding the exported domain contracts. */
	domainRoot: z.string().min(1).default('src/domain'),
	/** Roots scanned recursively for `*.html` public templates. */
	contentRoots: z.array(z.string().min(1)).min(1).default(['src/app', 'src/pages']),
	/** Extra workspace-relative globs added to the audited templates. */
	contentIncludeGlobs: z.array(z.string().min(1)).default([]),
	/** Globs removed from the audited templates. */
	contentExcludeGlobs: z.array(z.string().min(1)).default([]),
	/** Employer/client names matched as case-insensitive substrings. */
	forbiddenTerms: z.array(z.string()).default([]),
	/**
	 * Roots that must never reach the public site under any form
	 * (case-insensitive, even split by `.`, `_`, `-`, `,` or whitespace).
	 */
	perSeRoots: z.array(z.string().min(1)).default([]),
	/** Language of the audit's remediation text. */
	locale: z.enum(['en', 'es']).default('en'),
	/** SCSS file the SCSS audit reads when the caller gives no path. */
	scssAuditSourcePath: z.string().default('src/app/page.scss'),
});

export type PortfolioContentOptions = z.infer<typeof OptionsSchema>;
