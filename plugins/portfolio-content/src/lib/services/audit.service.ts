/**
 * Public-content audit (support tool). Scans the listed public
 * templates for forbidden terms (employer/client names) and image
 * placeholders (`TODO(image):`). Severity ladder:
 *
 *   - `error`   — private-work references; publish blocker.
 *   - `warning` — `TODO(image)` placeholder; pre-publish hygiene.
 *   - `info`    — missing files / duplicates / IO errors.
 */

const IMAGE_TODO_PATTERN = /TODO\(image\):\s*([^\n]+)/g;

const nextAction = (
	locale: 'en' | 'es',
	hasError: boolean,
	hasWarning: boolean,
): string => {
	if (locale === 'es') {
		if (hasError)
			return 'Quita las referencias a employers o clientes antes de publicar.';
		if (hasWarning)
			return 'Sustituye los marcadores TODO(image) por imágenes públicas aprobadas.';
		return 'Revisa los marcadores solo cuando tengas imágenes públicas aprobadas.';
	}
	if (hasError) return 'Remove private-work references before publishing.';
	if (hasWarning) return 'Replace image placeholders with approved public images.';
	return 'Replace stock placeholders only after providing approved public images.';
};

const summarize = (
	findings: readonly { readonly severity: 'error' | 'warning' | 'info' }[],
): { errors: number; warnings: number; info: number } => {
	const counts = { errors: 0, warnings: 0, info: 0 };
	for (const finding of findings) {
		if (finding.severity === 'error') counts.errors += 1;
		else if (finding.severity === 'warning') counts.warnings += 1;
		else counts.info += 1;
	}
	return counts;
};

const findImageTodos = (
	contentPath: string,
	content: string,
	locale: 'en' | 'es',
): {
	readonly id: string;
	readonly severity: 'warning';
	readonly message: string;
	readonly location: { contentPath: string; line: number };
	readonly remediation: string;
}[] => {
	const findings: {
		readonly id: string;
		readonly severity: 'warning';
		readonly message: string;
		readonly location: { contentPath: string; line: number };
		readonly remediation: string;
	}[] = [];
	const lines = content.split('\n');
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex] ?? '';
		for (const match of line.matchAll(IMAGE_TODO_PATTERN)) {
			const request = (match[1] ?? '').trim();
			findings.push({
				id: 'image-todo',
				severity: 'warning',
				message:
					locale === 'es'
						? `Marcador TODO(image) pendiente: ${request}`
						: `Pending TODO(image) placeholder: ${request}`,
				location: { contentPath, line: lineIndex + 1 },
				remediation:
					locale === 'es'
						? 'Sustituye el comentario por una imagen pública aprobada.'
						: 'Replace the comment with an approved public image.',
			});
		}
	}
	return findings;
};

const findPrivateTerms = (
	content: string,
	forbiddenTerms: readonly string[],
): readonly { term: string; index: number }[] => {
	const matches: { term: string; index: number }[] = [];
	const haystack = content.toLowerCase();
	for (const term of forbiddenTerms) {
		const needle = term.toLowerCase();
		if (needle.length === 0) continue;
		const start = haystack.indexOf(needle);
		if (start >= 0) matches.push({ term, index: start });
	}
	return matches;
};

/**
 * Normalise a string so separator characters (`_`, `-`, `.`, `,`,
 * `/`, `\`, whitespace) collapse. Lets us match
 * `beateam-dev` or `beateam.dev` against the root `beateam`.
 */
const normaliseForPerSe = (raw: string): string =>
	raw.toLowerCase().replace(/[\s._,\-/\\]+/g, '');

/**
 * Map a normalised index (in the separator-collapsed string) back to
 * the corresponding raw index in the original content. We re-walk the
 * original string, accumulating the same collapsing rule until the
 * normalised counter reaches the target.
 */
const mapNormalisedIndexToRaw = (content: string, target: number): number => {
	let normalised = 0;
	for (let i = 0; i < content.length; i += 1) {
		if (normalised === target) return i;
		const char = content[i];
		if (char !== undefined && !/[\s._,\-/\\]/.test(char)) {
			normalised += 1;
		}
	}
	return content.length;
};

/**
 * Per-se root scanner. A root is a substring (in the normalised
 * haystack) that appears anywhere in the content. The location we
 * report points back to the closest raw index we can find by
 * re-scanning the first `n` characters of the original content.
 */
const findPerSeRoots = (
	content: string,
	perSeRoots: readonly string[],
): readonly { root: string; rawIndex: number }[] => {
	const matches: { root: string; rawIndex: number }[] = [];
	if (perSeRoots.length === 0) return matches;
	const haystack = normaliseForPerSe(content);
	for (const root of perSeRoots) {
		const needle = normaliseForPerSe(root);
		if (needle.length === 0) continue;
		const start = haystack.indexOf(needle);
		if (start < 0) continue;
		const rawIndex = mapNormalisedIndexToRaw(content, start);
		matches.push({ root, rawIndex });
	}
	return matches;
};

export interface IPublicAuditFinding {
	readonly id: string;
	readonly severity: 'error' | 'warning' | 'info';
	readonly message: string;
	readonly location: { readonly contentPath: string; readonly line?: number };
	readonly remediation: string;
}

export interface IPublicAuditReport {
	readonly ok: boolean;
	readonly contentPaths: readonly string[];
	readonly severity: { readonly errors: number; readonly warnings: number; readonly info: number };
	readonly findings: readonly IPublicAuditFinding[];
	readonly nextAction: string;
}

export interface IPublicAuditReader {
	readonly readText: (path: string) => Promise<string>;
	readonly exists: (path: string) => Promise<boolean>;
}

export interface IPublicAuditOptions {
	readonly contentPaths: readonly string[];
	readonly forbiddenTerms: readonly string[];
	/**
	 * Per-se forbidden roots. Optional; defaults to an empty list when
	 * the caller predates the per-se feature. New callers should always
	 * pass an explicit list (even if empty).
	 */
	readonly perSeRoots?: readonly string[];
	readonly locale: 'en' | 'es';
	readonly reader: IPublicAuditReader;
}

export const buildFsPublicAuditReader = async (): Promise<IPublicAuditReader> => {
	const loader = await import('node:fs/promises');
	const readText = async (path: string): Promise<string> =>
		loader.readFile(path, 'utf8');
	const exists = async (path: string): Promise<boolean> => {
		try {
			await loader.access(path);
			return true;
		} catch {
			return false;
		}
	};
	return { readText, exists };
};

export const runPublicAudit = async (
	options: IPublicAuditOptions,
): Promise<IPublicAuditReport> => {
	const {
		contentPaths,
		forbiddenTerms,
		perSeRoots = [],
		locale,
		reader,
	} = options;
	const findings: IPublicAuditFinding[] = [];
	const seen = new Set<string>();

	for (const contentPath of contentPaths) {
		if (seen.has(contentPath)) {
			findings.push({
				id: 'duplicated-content',
				severity: 'info',
				message:
					locale === 'es'
						? `Ruta duplicada en la configuración: ${contentPath}`
						: `Duplicate path in config: ${contentPath}`,
				location: { contentPath },
				remediation:
					locale === 'es'
						? 'Quita la entrada duplicada para reducir trabajo del audit.'
						: 'Remove the duplicate to reduce audit work.',
			});
			continue;
		}
		seen.add(contentPath);

		if (!(await reader.exists(contentPath))) {
			findings.push({
				id: 'missing-content',
				severity: 'info',
				message:
					locale === 'es'
						? `Ruta declarada pero sin archivo: ${contentPath}`
						: `Declared path has no file yet: ${contentPath}`,
				location: { contentPath },
				remediation:
					locale === 'es'
						? 'Crea el archivo o quítalo del campo `contentPaths` del plugin.'
						: 'Create the file or remove it from the plugin `contentPaths` config.',
			});
			continue;
		}

		let content: string;
		try {
			content = await reader.readText(contentPath);
		} catch {
			findings.push({
				id: 'unreadable-content',
				severity: 'info',
				message:
					locale === 'es'
						? `No se pudo leer el contenido de ${contentPath}; se omitió.`
						: `Could not read ${contentPath}; skipped.`,
				location: { contentPath },
				remediation:
					locale === 'es'
						? 'Comprueba los permisos del archivo o ajústalo a la configuración del plugin.'
						: 'Check file permissions or update the plugin configuration.',
			});
			continue;
		}

		for (const hit of findPrivateTerms(content, forbiddenTerms)) {
			findings.push({
				id: 'private-term',
				severity: 'error',
				message:
					locale === 'es'
						? `Término privado detectado: "${hit.term}"`
						: `Private term detected: "${hit.term}"`,
				location: {
					contentPath,
					line: content.slice(0, hit.index).split('\n').length,
				},
				remediation:
					locale === 'es'
						? 'Reescribe esta sección sin nombrar al employer o cliente.'
						: 'Rewrite this section without naming the employer or client.',
			});
		}

		for (const hit of findPerSeRoots(content, perSeRoots)) {
			findings.push({
				id: 'per-se-root',
				severity: 'error',
				message:
					locale === 'es'
						? `Raíz prohibida per-se: "${hit.root}"`
						: `Per-se forbidden root: "${hit.root}"`,
				location: {
					contentPath,
					line: content.slice(0, hit.rawIndex).split('\n').length,
				},
				remediation:
					locale === 'es'
						? 'Quita cualquier forma de esta raíz. Ningún derivado, sufijo ni compuesto está permitido.'
						: 'Remove every form of this root. No derivative, suffix, or compound is allowed.',
			});
		}

		findings.push(...findImageTodos(contentPath, content, locale));
	}

	const counts = summarize(findings);
	return {
		ok: counts.errors === 0,
		contentPaths,
		severity: counts,
		findings,
		nextAction: nextAction(locale, counts.errors > 0, counts.warnings > 0),
	};
};
