/**
 * Pure audit engine for the public portfolio's content templates. Reads
 * via the injected {@link IPortfolioAuditReader} so the engine stays
 * side-effect-free (the wrapper in `tools/audit-tool.ts` binds the
 * real `fs/promises` reader at register time).
 *
 * Severity ladder:
 *   - `error`   — private-work references that must be removed before publish.
 *   - `warning` — `TODO\(image\): ...` placeholders needing replacement.
 *   - `info`    — filesystem hygiene (missing or unreadable content files).
 */

import type {
	IPortfolioAuditFinding,
	IPortfolioAuditOptions,
	IPortfolioAuditReport,
	IPortfolioAuditSeverityCounts,
	IPortfolioAuditReader,
	PortfolioAuditSeverity,
} from '../contracts/interfaces/audit.interface';

const IMAGE_TODO_PATTERN = /TODO\(image\):\s*([^\n]+)/g;

const nextActionFor = (
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

const fileErrorInfo = (
	locale: 'en' | 'es',
	contentPath: string,
): IPortfolioAuditFinding => ({
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

const fileMissingInfo = (
	locale: 'en' | 'es',
	contentPath: string,
): IPortfolioAuditFinding => ({
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

const summarize = (
	findings: readonly IPortfolioAuditFinding[],
): IPortfolioAuditSeverityCounts => {
	const counts = { errors: 0, warnings: 0, info: 0 };
	const bump = (severity: PortfolioAuditSeverity): void => {
		if (severity === 'error') counts.errors += 1;
		else if (severity === 'warning') counts.warnings += 1;
		else counts.info += 1;
	};
	for (const finding of findings) bump(finding.severity);
	return counts;
};

const findImageTodos = (
	contentPath: string,
	content: string,
	locale: 'en' | 'es',
): IPortfolioAuditFinding[] => {
	const findings: IPortfolioAuditFinding[] = [];
	const lines = content.split('\n');
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex];
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
						? `Sustituye el comentario por una imagen pública aprobada.`
						: `Replace the comment with an approved public image.`,
			});
		}
	}
	return findings;
};

const findPrivateTerms = (
	content: string,
	forbiddenTerms: readonly string[],
): { term: string; index: number }[] => {
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

export const buildFsAuditReader = (): IPortfolioAuditReader => {
	// Lazy import keeps the engine free of `fs` when callers inject their
	// own reader (e.g. tests use an in-memory map).
	let loader: typeof import('node:fs/promises') | undefined;
	const readText = async (contentPath: string): Promise<string> => {
		loader ??= await import('node:fs/promises');
		return loader.readFile(contentPath, 'utf8');
	};
	const exists = async (contentPath: string): Promise<boolean> => {
		loader ??= await import('node:fs/promises');
		try {
			await loader.access(contentPath);
			return true;
		} catch {
			return false;
		}
	};
	return { readText, exists };
};

export const runPortfolioAudit = async (
	options: IPortfolioAuditOptions,
): Promise<IPortfolioAuditReport> => {
	const { contentPaths, forbiddenTerms, locale, reader } = options;
	const findings: IPortfolioAuditFinding[] = [];
	const seenPaths = new Set<string>();

	for (const contentPath of contentPaths) {
		if (seenPaths.has(contentPath)) {
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
		seenPaths.add(contentPath);

		if (!(await reader.exists(contentPath))) {
			findings.push(fileMissingInfo(locale, contentPath));
			continue;
		}

		let content: string;
		try {
			content = await reader.readText(contentPath);
		} catch {
			findings.push(fileErrorInfo(locale, contentPath));
			continue;
		}

		for (const privateHit of findPrivateTerms(content, forbiddenTerms)) {
			findings.push({
				id: 'private-term',
				severity: 'error',
				message:
					locale === 'es'
						? `Término privado detectado: "${privateHit.term}"`
						: `Private term detected: "${privateHit.term}"`,
				location: {
					contentPath,
					line: content.slice(0, privateHit.index).split('\n').length,
				},
				remediation:
					locale === 'es'
						? `Reescribe esta sección sin nombrar al employer o cliente.`
						: `Rewrite this section without naming the employer or client.`,
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
		nextAction: nextActionFor(locale, counts.errors > 0, counts.warnings > 0),
	};
};
