/**
 * Domain contract introspection engine. Reads
 * `src/domain/portfolio.types.ts` and pulls out the exported unions
 * (`type X = 'a' | 'b' | ...`), interfaces, type aliases, and
 * const exports. Pure-static: line-by-line regex over the source
 * text — no TypeScript compiler API. Adequate for the size of this
 * workspace (the file is ~150 lines) and avoids the cost of a tsc
 * round-trip.
 *
 * Per-line scanning keeps the result deterministic: the order of the
 * output matches the order of declarations in the source. Multi-line
 * unions (`export type X =\n  | 'a'\n  | 'b';`) are stitched back
 * together by skipping continuation lines (those starting with `|`,
 * `&`, or whitespace + comma) until we see the closing `;`.
 */

import type {
	IBuildDomainMapRequest,
	IPortfolioDomainContract,
	IPortfolioDomainMap,
	PortfolioDomainKind,
} from '../contracts/interfaces/domain.interface';
import type { IFileSystem } from '../contracts/interfaces/fs.interface';

const HEAD_RE = /^export\s+(?:type|interface|const)\s+\w+/;

const LITERAL_RE = /'([^']+)'|"([^"]+)"/g;

const extractUnionMembers = (rhs: string): readonly string[] => {
	const members = new Set<string>();
	let match: RegExpExecArray | null = LITERAL_RE.exec(rhs);
	while (match !== null) {
		members.add((match[1] ?? match[2] ?? '').trim());
		match = LITERAL_RE.exec(rhs);
	}
	return [...members].sort((a, b) => a.localeCompare(b));
};

const stitchDeclaration = (
	lines: readonly string[],
	startIndex: number,
): { readonly text: string; readonly endIndex: number } => {
	let buffer = lines[startIndex] ?? '';
	let i = startIndex;
	// If the head line already contains `;` and it's a single-statement
	// type alias / const, return as-is.
	if (
		buffer.includes(';') &&
		!buffer.includes('{') &&
		!/^(export\s+interface)\b/.test(buffer.trimStart())
	) {
		return { text: buffer, endIndex: i };
	}
	// Otherwise (interface body or multi-line type alias) keep appending
	// until the buffer is balanced or contains `;` outside a block.
	let braceDepth = (buffer.match(/\{/g) ?? []).length - (buffer.match(/\}/g) ?? []).length;
	while (braceDepth > 0 || (!buffer.includes(';') && i + 1 < lines.length)) {
		i += 1;
		buffer += `\n${lines[i] ?? ''}`;
		braceDepth += ((lines[i] ?? '').match(/\{/g) ?? []).length;
		braceDepth -= ((lines[i] ?? '').match(/\}/g) ?? []).length;
		if (braceDepth <= 0 && buffer.includes(';')) break;
	}
	return { text: buffer, endIndex: i };
};

const classifyDeclaration = (
	declaration: string,
): { readonly name: string; readonly kind: PortfolioDomainKind; readonly members: readonly string[] } | null => {
	const trimmed = declaration.trim();
	if (/^export\s+interface\s+(\w+)\s*\{/.test(trimmed)) {
		const name = /^export\s+interface\s+(\w+)/.exec(trimmed)?.[1] ?? '';
		return { name, kind: 'interface', members: [] };
	}
	const unionMatch = /^export\s+type\s+(\w+)\s*=\s*([\s\S]+?);/.exec(trimmed);
	if (unionMatch && unionMatch[2]?.includes('|')) {
		return {
			name: unionMatch[1] ?? '',
			kind: 'union',
			members: extractUnionMembers(unionMatch[2] ?? ''),
		};
	}
	const aliasMatch = /^export\s+type\s+(\w+)\s*=\s*([\s\S]+?);/.exec(trimmed);
	if (aliasMatch) {
		return { name: aliasMatch[1] ?? '', kind: 'type', members: [] };
	}
	const constMatch = /^export\s+const\s+(\w+)/.exec(trimmed);
	if (constMatch) {
		return { name: constMatch[1] ?? '', kind: 'const', members: [] };
	}
	return null;
};

export const parseDomainSource = (
	source: string,
	sourcePath: string,
): readonly IPortfolioDomainContract[] => {
	const contracts: IPortfolioDomainContract[] = [];
	const lines = source.split('\n');
	let i = 0;
	while (i < lines.length) {
		const line = lines[i] ?? '';
		if (!HEAD_RE.test(line.trimStart())) {
			i += 1;
			continue;
		}
		const { text, endIndex } = stitchDeclaration(lines, i);
		const result = classifyDeclaration(text);
		i = endIndex + 1;
		if (!result) continue;
		contracts.push({
			name: result.name,
			kind: result.kind,
			members: result.members,
			sourcePath,
			line: i - (text.split('\n').length - 1) - 1 + 1,
		});
	}
	return contracts;
};

export const buildDomainMap = async (
	fs: IFileSystem,
	request: IBuildDomainMapRequest = {},
): Promise<IPortfolioDomainMap> => {
	const sourcePath = 'src/domain/portfolio.types.ts';
	if (!(await fs.exists(sourcePath))) {
		return { contracts: [], generatedAt: new Date().toISOString() };
	}
	const source = await fs.readText(sourcePath);
	const parsed = parseDomainSource(source, sourcePath);
	const filtered = request.kind
		? parsed.filter((contract) => contract.kind === request.kind)
		: parsed;
	return {
		contracts: filtered,
		generatedAt: new Date().toISOString(),
	};
};
