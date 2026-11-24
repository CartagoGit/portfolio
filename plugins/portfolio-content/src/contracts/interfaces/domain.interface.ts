/**
 * Domain introspection contracts. Every exported type, interface and
 * const found in the domain root is reported, in source order.
 */

export type PortfolioDomainKind = 'union' | 'interface' | 'type' | 'const';

export interface IPortfolioDomainContract {
	readonly name: string;
	readonly kind: PortfolioDomainKind;
	readonly members: readonly string[];
	readonly sourcePath: string;
	readonly line: number;
}

export interface IPortfolioDomainMap {
	readonly domainRoot: string;
	readonly contracts: readonly IPortfolioDomainContract[];
	readonly generatedAt: string;
}

export interface IBuildDomainMapRequest {
	readonly kind?: PortfolioDomainKind;
}
