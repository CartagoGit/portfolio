/** Shared domain contracts for the portfolio screens. */
export type Locale = 'en' | 'es';
export type PortfolioPageId =
	| 'home'
	| 'work'
	| 'lab'
	| 'approach'
	| 'knowledge'
	| 'docker'
	| 'demos'
	| 'contact';
export type PlaygroundStep = 'discover' | 'model' | 'build' | 'verify';
export type CapabilityId =
	'product' | 'architecture' | 'mobile' | 'quality' | 'systems' | 'tooling';
export type HeroPanelId =
	'overview' | 'workflows' | 'quality' | 'mobile' | 'tooling' | 'delivery';
export type TelemetryId = 'product' | 'quality' | 'delivery';
export type ChartType =
	'bars' | 'line' | 'area' | 'dots' | 'pulse' | 'wave' | 'grid';
export type HeroEffect = 'idle' | 'shake' | 'glitch' | 'float' | 'spectrum';
export type HeroPalette = 'ocean' | 'heat' | 'lime';
export type HeroPanelTransition = 'slide' | 'flip' | 'scan';
export type EarthDepth =
	| 'behind'
	| 'out-behind'
	| 'front-ready'
	| 'front'
	| 'out-front'
	| 'behind-ready';

export interface Capability {
	id: CapabilityId;
	eyebrow: string;
	title: string;
	detail: string;
	tools: string[];
	proof: string;
}

export interface HeroPanel {
	id: HeroPanelId;
	label: string;
	metric: string;
	detail: string;
	iconPath: string;
	color: string;
	iconAsset?: string;
}

export interface Technology {
	label: string;
	iconPath: string;
	color: string;
}

export interface PublicLink {
	label: string;
	href: string;
	imageSrc?: string;
	iconPath?: string;
	color?: string;
}

export interface PortfolioCopy {
	navWork: string;
	navLab: string;
	navAbout: string;
	availability: string;
	viewWork: string;
	contact: string;
	role: string;
	intro: string;
}

export interface LanguageOption {
	id: Locale;
	label: string;
	detail: string;
}

export interface PlaygroundStepDefinition {
	id: PlaygroundStep;
	label: string;
	hint: string;
}

export interface Telemetry {
	id: TelemetryId;
	label: string;
	title: string;
	value: string;
	valueLabel: string;
	kpis: readonly (readonly [string, string])[];
	bars: readonly number[];
	note: string;
}
