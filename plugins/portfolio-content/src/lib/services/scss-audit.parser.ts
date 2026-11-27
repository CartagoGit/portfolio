import type {
	IScssDependency,
	IScssParseResult,
	IScssSelector,
} from './scss-audit.types';

function isIdentifierStart(char: string): boolean {
	return /[A-Za-z_-]/.test(char);
}

function isIdentifierPart(char: string): boolean {
	return /[A-Za-z0-9_-]/.test(char);
}

function withoutComments(source: string): string {
	let clean = '';
	let quote: string | null = null;
	let escaped = false;
	for (let index = 0; index < source.length; index += 1) {
		const char = source[index] ?? '';
		const next = source[index + 1] ?? '';
		if (quote) {
			clean += char;
			if (!escaped && char === quote) quote = null;
			escaped = !escaped && char === '\\';
			continue;
		}
		if (char === '"' || char === "'") {
			quote = char;
			clean += char;
			continue;
		}
		if (char === '/' && next === '/') {
			clean += '  ';
			index += 1;
			while (index + 1 < source.length && source[index + 1] !== '\n') {
				clean += ' ';
				index += 1;
			}
			continue;
		}
		if (char === '/' && next === '*') {
			clean += '  ';
			index += 1;
			while (index + 1 < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
				clean += source[index + 1] === '\n' ? '\n' : ' ';
				index += 1;
			}
			if (index + 1 < source.length) {
				clean += '  ';
				index += 1;
			}
			continue;
		}
		clean += char;
	}
	return clean;
}

function classNames(selector: string): readonly string[] {
	const names = new Set<string>();
	let quote: string | null = null;
	let escaped = false;
	for (let index = 0; index < selector.length; index += 1) {
		const char = selector[index] ?? '';
		if (quote) {
			if (!escaped && char === quote) quote = null;
			escaped = !escaped && char === '\\';
			continue;
		}
		if (char === '"' || char === "'") {
			quote = char;
			continue;
		}
		if (char !== '.' || !isIdentifierStart(selector[index + 1] ?? '')) continue;
		let end = index + 2;
		while (end < selector.length && isIdentifierPart(selector[end] ?? '')) end += 1;
		names.add(selector.slice(index + 1, end));
		index = end - 1;
	}
	return [...names];
}

function quotedStrings(value: string): readonly string[] {
	const strings: string[] = [];
	let quote: string | null = null;
	let escaped = false;
	let start = 0;
	for (let index = 0; index < value.length; index += 1) {
		const char = value[index] ?? '';
		if (quote) {
			if (!escaped && char === quote) {
				strings.push(value.slice(start, index));
				quote = null;
			}
			escaped = !escaped && char === '\\';
			continue;
		}
		if (char === '"' || char === "'") {
			quote = char;
			escaped = false;
			start = index + 1;
		}
	}
	return strings;
}

function directiveTargets(kind: IScssDependency['kind'], params: string): readonly string[] {
	const targets = quotedStrings(params);
	return kind === 'import' ? targets : targets.slice(0, 1);
}

function lineAt(value: string, offset: number, startLine: number): number {
	let line = startLine;
	for (let index = 0; index < offset; index += 1) {
		if (value[index] === '\n') line += 1;
	}
	return line;
}

function referenceNames(value: string, startLine: number): ReadonlyArray<{ name: string; line: number }> {
	const references: Array<{ name: string; line: number }> = [];
	let quote: string | null = null;
	let escaped = false;
	for (let index = 0; index < value.length; index += 1) {
		const char = value[index] ?? '';
		if (quote) {
			if (!escaped && char === quote) quote = null;
			escaped = !escaped && char === '\\';
			continue;
		}
		if (char === '"' || char === "'") {
			quote = char;
			continue;
		}
		if (value.slice(index, index + 3) !== 'var') continue;
		if (index > 0 && isIdentifierPart(value[index - 1] ?? '')) continue;
		let cursor = index + 3;
		while (/\s/.test(value[cursor] ?? '')) cursor += 1;
		if (value[cursor] !== '(') continue;
		cursor += 1;
		while (/\s/.test(value[cursor] ?? '')) cursor += 1;
		if (value.slice(cursor, cursor + 2) !== '--') continue;
		let end = cursor + 2;
		while (isIdentifierPart(value[end] ?? '')) end += 1;
		if (end > cursor + 2) {
			references.push({ name: value.slice(cursor, end), line: lineAt(value, cursor, startLine) });
			index = end - 1;
		}
	}
	return references;
}

interface IAtRuleStatement {
	readonly kind: IScssDependency['kind'] | null;
	readonly params: string;
}

function atRuleStatement(statement: string): IAtRuleStatement | undefined {
	const value = statement.trim();
	if (!value.startsWith('@')) return undefined;
	let end = 1;
	while (isIdentifierPart(value[end] ?? '')) end += 1;
	const name = value.slice(1, end);
	return {
		kind: name === 'use' || name === 'forward' || name === 'import' ? name : null,
		params: value.slice(end).trim(),
	};
}

function propertyValue(statement: string): { property: string; value: string; valueOffset: number } | undefined {
	let quote: string | null = null;
	let escaped = false;
	let parentheses = 0;
	let brackets = 0;
	for (let index = 0; index < statement.length; index += 1) {
		const char = statement[index] ?? '';
		if (quote) {
			if (!escaped && char === quote) quote = null;
			escaped = !escaped && char === '\\';
			continue;
		}
		if (char === '"' || char === "'") quote = char;
		else if (char === '(') parentheses += 1;
		else if (char === ')') parentheses = Math.max(0, parentheses - 1);
		else if (char === '[') brackets += 1;
		else if (char === ']') brackets = Math.max(0, brackets - 1);
		else if (char === ':' && parentheses === 0 && brackets === 0)
			return { property: statement.slice(0, index).trim(), value: statement.slice(index + 1), valueOffset: index + 1 };
	}
	return undefined;
}

/** Structural SCSS lexer: strings/comments and nested delimiters are consumed before statement classification. */
export function parseScssSource(source: string): IScssParseResult {
	const clean = withoutComments(source);
	const dependencies: IScssDependency[] = [];
	const selectors: IScssSelector[] = [];
	const customProperties: Array<{ name: string; line: number; kind: 'definition' | 'reference' }> = [];
	let statement = '';
	let statementLine = 1;
	let line = 1;
	let quote: string | null = null;
	let escaped = false;
	let parentheses = 0;
	let brackets = 0;
	let interpolation = 0;

	const resetStatement = (): void => {
		statement = '';
		statementLine = line;
	};
	const processStatement = (): void => {
		const trimmed = statement.trim();
		if (!trimmed) return;
		const atRule = atRuleStatement(statement);
		if (atRule) {
			for (const reference of referenceNames(statement, statementLine))
				customProperties.push({ ...reference, kind: 'reference' });
			if (atRule.kind) {
				for (const target of directiveTargets(atRule.kind, atRule.params))
					dependencies.push({ kind: atRule.kind, target, line: statementLine });
			}
			return;
		}
		const declaration = propertyValue(statement);
		if (!declaration) return;
		const valueLine = lineAt(statement, declaration.valueOffset, statementLine);
		for (const reference of referenceNames(declaration.value, valueLine))
			customProperties.push({ ...reference, kind: 'reference' });
		if (declaration.property.startsWith('--'))
			customProperties.push({ name: declaration.property, line: statementLine, kind: 'definition' });
	};

	for (let index = 0; index < clean.length; index += 1) {
		const char = clean[index] ?? '';
		const previous = clean[index - 1] ?? '';
		if (char === '\n') line += 1;
		if (quote) {
			statement += char;
			if (!escaped && char === quote) quote = null;
			escaped = !escaped && char === '\\';
			continue;
		}
		if (char === '"' || char === "'") {
			if (statement.length === 0) statementLine = line;
			quote = char;
			statement += char;
			continue;
		}
		if (char === '{' && (previous === '#' || interpolation > 0)) {
			interpolation += 1;
			statement += char;
			continue;
		}
		if (char === '}' && interpolation > 0) {
			interpolation -= 1;
			statement += char;
			continue;
		}
		if (char === '(') parentheses += 1;
		else if (char === ')') parentheses = Math.max(0, parentheses - 1);
		else if (char === '[') brackets += 1;
		else if (char === ']') brackets = Math.max(0, brackets - 1);
		const topLevel = parentheses === 0 && brackets === 0;
		if (topLevel && char === '{') {
			const selector = statement.trim();
			const atRule = atRuleStatement(statement);
			if (atRule) processStatement();
			else if (selector && !selector.startsWith('%')) {
				const names = classNames(selector);
				if (names.length > 0) selectors.push({ selector, classNames: names, line: statementLine });
			}
			resetStatement();
			continue;
		}
		if (topLevel && char === ';') {
			processStatement();
			resetStatement();
			continue;
		}
		if (topLevel && char === '}') {
			processStatement();
			resetStatement();
			continue;
		}
		if (statement.length === 0 && /\s/.test(char)) continue;
		if (statement.length === 0) statementLine = line;
		statement += char;
	}
	processStatement();
	return { dependencies, selectors, customProperties };
}
