import type {
	IScssDependency,
	IScssParseResult,
	IScssSelector,
} from './scss-audit.types';

const stripComments = (source: string): string =>
	source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (comment) => comment.replace(/[^\n]/g, ' '));

function classNames(selector: string): readonly string[] {
	const names = new Set<string>();
	const pattern = /\.(-?[_a-zA-Z][\w-]*)/g;
	for (const match of selector.matchAll(pattern)) if (match[1]) names.add(match[1]);
	return [...names];
}

/** Small brace/statement scanner: comments are erased before structural parsing. */
export function parseScssSource(source: string): IScssParseResult {
	const clean = stripComments(source);
	const lines = clean.split('\n');
	const dependencies: IScssDependency[] = [];
	const customProperties = [] as Array<{ name: string; line: number; kind: 'definition' | 'reference' }>;
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? '';
		const directive = line.match(/^\s*@(use|forward|import)\s+['"]([^'"]+)['"]/);
		if (directive?.[1] && directive[2])
			dependencies.push({ kind: directive[1] as IScssDependency['kind'], target: directive[2], line: index + 1 });
		for (const match of line.matchAll(/var\(\s*(--[\w-]+)/g))
			if (match[1]) customProperties.push({ name: match[1], line: index + 1, kind: 'reference' });
		for (const match of line.matchAll(/(?:^|[;{])\s*(--[\w-]+)\s*:/g))
			if (match[1]) customProperties.push({ name: match[1], line: index + 1, kind: 'definition' });
	}

	const selectors: IScssSelector[] = [];
	let statement = '';
	let statementLine = 1;
	let line = 1;
	let stringQuote: string | null = null;
	let escaped = false;
	for (let index = 0; index < clean.length; index += 1) {
		const char = clean[index] ?? '';
		if (char === '\n') line += 1;
		if (stringQuote) {
			statement += char;
			if (!escaped && char === stringQuote) stringQuote = null;
			escaped = !escaped && char === '\\';
			continue;
		}
		if (char === '"' || char === "'") {
			stringQuote = char;
			statement += char;
			continue;
		}
		if (char === ';' || char === '}') {
			statement = '';
			statementLine = line;
			continue;
		}
		if (char === '{') {
			const selector = statement.trim();
			if (selector && !selector.startsWith('@') && !selector.startsWith('%')) {
				const names = classNames(selector);
				if (names.length > 0) selectors.push({ selector, classNames: names, line: statementLine });
			}
			statement = '';
			statementLine = line;
			continue;
		}
		if (statement.length === 0 && /\s/.test(char)) {
			statementLine = line;
			continue;
		}
		statement += char;
	}
	return { dependencies, selectors, customProperties };
}
