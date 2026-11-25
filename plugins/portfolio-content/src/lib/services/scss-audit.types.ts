export type IScssDirectiveKind = 'use' | 'forward' | 'import';

export interface IScssDependency {
	readonly kind: IScssDirectiveKind;
	readonly target: string;
	readonly line: number;
}

export interface IScssSelector {
	readonly selector: string;
	readonly classNames: readonly string[];
	readonly line: number;
}

export interface IScssCustomProperty {
	readonly name: string;
	readonly line: number;
	readonly kind: 'definition' | 'reference';
}

export interface IScssParseResult {
	readonly dependencies: readonly IScssDependency[];
	readonly selectors: readonly IScssSelector[];
	readonly customProperties: readonly IScssCustomProperty[];
}
