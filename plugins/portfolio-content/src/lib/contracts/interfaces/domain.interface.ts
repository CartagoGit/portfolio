/**
 * Domain introspection contracts. The engine reads
 * `src/domain/portfolio.types.ts` to extract the public type union
 * (`IPortfolioPageId`, `ICapabilityId`, …) — the contract surface every
 * feature talks to. Pure-static: no symbol resolver, just regex
 * extraction over the source.
 */

export type PortfolioDomainKind =
	| 'union'
	| 'interface'
	| 'type'
	| 'const';

export interface IPortfolioDomainContract {
	readonly name: string;
	readonly kind: PortfolioDomainKind;
	readonly members: readonly string[];
	readonly sourcePath: string;
	readonly line: number;
}

export interface IPortfolioDomainMap {
	readonly contracts: readonly IPortfolioDomainContract[];
	readonly generatedAt: string;
}

export interface IBuildDomainMapRequest {
	readonly kind?: PortfolioDomainKind;
}
