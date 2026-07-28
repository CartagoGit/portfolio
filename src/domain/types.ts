/** Shared domain contracts for the portfolio screens. */
export type ILocale = 'en' | 'es';
export type IThemeId =
	| 'dark'
	| 'light'
	| 'midnight'
	| 'ocean'
	| 'forest'
	| 'sunset'
	| 'solar'
	| 'mono';
export type IPageComponentId =
	| 'home'
	| 'work'
	| 'lab'
	| 'approach'
	| 'knowledge'
	| 'docker'
	| 'demos'
	| 'contact';
export type IPlaygroundStep = 'discover' | 'model' | 'build' | 'verify';
export type ICapabilityId =
	'product' | 'architecture' | 'mobile' | 'quality' | 'systems' | 'tooling';
export type IHeroPanelId =
	'overview' | 'workflows' | 'quality' | 'mobile' | 'tooling' | 'delivery';
export type ITelemetryId = 'product' | 'quality' | 'delivery';
export type IChartType =
	'bars' | 'line' | 'area' | 'dots' | 'pulse' | 'wave' | 'grid';
export type IHeroEffect = 'idle' | 'shake' | 'glitch' | 'float' | 'spectrum';
export type IHeroPalette = 'ocean' | 'heat' | 'lime';
export type IHeroPanelTransition = 'slide' | 'flip' | 'scan';
export type IEarthDepth =
	| 'behind'
	| 'out-behind'
	| 'front-ready'
	| 'front'
	| 'out-front'
	| 'behind-ready';

export interface ICapability {
	id: ICapabilityId;
	eyebrow: string;
	title: string;
	detail: string;
	tools: string[];
	proof: string;
}

export interface IHeroPanel {
	id: IHeroPanelId;
	label: string;
	metric: string;
	detail: string;
	iconPath: string;
	color: string;
	iconAsset?: string;
}

export interface ITechnology {
	label: string;
	iconPath: string;
	color: string;
}

export interface IPublicLink {
	label: string;
	href: string;
	imageSrc?: string;
	iconPath?: string;
	color?: string;
}

export interface IPortfolioCopy {
	navWork: string;
	navLab: string;
	navAbout: string;
	availability: string;
	viewWork: string;
	contact: string;
	role: string;
	intro: string;
}

export interface ILanguageOption {
	id: ILocale;
	label: string;
	detail: string;
}

export interface IPlaygroundStepDefinition {
	id: IPlaygroundStep;
	label: string;
	hint: string;
}

export interface ITelemetry {
	id: ITelemetryId;
	label: string;
	title: string;
	value: string;
	valueLabel: string;
	kpis: ReadonlyArray<readonly [string, string]>;
	bars: readonly number[];
	note: string;
}

/** Interactive demo cards surfaced on the /demos page. */
export interface IDemo {
	number: string;
	title: string;
	summary: string;
	url: string;
}

/** A chart-type picker button rendered inside the hero monitor. */
export interface IChartOption {
	id: IChartType;
	label: string;
}

/** An effect-picker button rendered inside the hero monitor detail panel. */
export interface IEffectOption {
	id: Exclude<IHeroEffect, 'idle'>;
	symbol: string;
}
