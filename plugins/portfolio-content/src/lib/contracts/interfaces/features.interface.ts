/**
 * Feature introspection contracts. The engine walks
 * `src/features/<id>/` and groups every `*.component.ts` (including
 * sub-feature folders) into a {@link IPortfolioFeature} so an agent
 * can answer questions like "what's in the home feature?" without
 * reading the disk by hand.
 */

export type PortfolioFeatureId =
	| 'home'
	| 'work'
	| 'approach'
	| 'knowledge'
	| 'lab'
	| 'docker'
	| 'demos'
	| 'contact';

export interface IPortfolioFeatureComponent {
	readonly name: string;
	readonly path: string;
	/** Sub-feature folder (e.g. `home/hero-monitor`). */
	readonly subFeature?: string;
}

export interface IPortfolioFeature {
	readonly id: PortfolioFeatureId;
	readonly label: string;
	readonly path: string;
	readonly components: readonly IPortfolioFeatureComponent[];
}

export interface IPortfolioFeatureMap {
	readonly features: readonly IPortfolioFeature[];
	readonly generatedAt: string;
}

export interface IBuildFeatureMapRequest {
	readonly featureId?: PortfolioFeatureId;
}
