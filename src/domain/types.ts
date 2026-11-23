/** Shared domain contracts for the portfolio screens. */
export type ILocale = 'en' | 'es' | 'fr' | 'de';
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
	'bars'
	| 'line'
	| 'area'
	| 'dots'
	| 'pulse'
	| 'wave'
	| 'grid'
	| 'stacked'
	| 'scatter'
	| 'radar'
	| 'donut'
	| 'heatmap'
	| 'treemap'
	| 'stream';
export type IHeroEffect = 'idle' | 'shake' | 'glitch' | 'float' | 'spectrum';
export type IHeroPalette = 'ocean' | 'heat' | 'lime';
export type IHeroPanelTransition = 'slide' | 'flip' | 'scan';
export type IEarthTextureStyle =
	| 'clouds'
	| 'natural'
	| 'night'
	| 'terrain'
	| 'infrared'
	| 'sun'
	| 'moon'
	| 'mercury'
	| 'venus'
	| 'mars'
	| 'jupiter'
	| 'saturn'
	| 'uranus'
	| 'neptune'
	| 'pluto'
	| 'kepler-186f'
	| 'proxima-b'
	| 'trappist-1e'
	| 'soccer'
	| 'basketball'
	| 'tennis'
	| 'golf'
	| 'beach-ball'
	| 'disco'
	| 'cartago-mark'
	| 'cartago-banner'
	| 'portrait';
export type IEarthTextureCategory =
	| 'earth'
	| 'planets'
	| 'exoplanets'
	| 'balls'
	| 'playful';
export type IEarthTextureOrigin = 'observed' | 'artist' | 'canonical' | 'owned';
export type IEarthDepth =
	| 'behind'
	| 'out-behind'
	| 'front-ready'
	| 'front'
	| 'out-front'
	| 'behind-ready';
export type IMonitorDestinationKind =
	| 'website'
	| 'repository'
	| 'documentation'
	| 'package'
	| 'release'
	| 'profile';

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
	status: string;
	stack: readonly string[];
	iconPath: string;
	color: string;
	iconAsset?: string;
	href?: string;
	destinations?: readonly IMonitorDestination[];
}

export interface ITechnology {
	label: string;
	iconPath: string;
	color: string;
	detail?: string;
	destinations?: readonly IMonitorDestination[];
}

export interface IPublicLink {
	label: string;
	href: string;
	group: 'platform' | 'project';
	detail?: string;
	imageSrc?: string;
	iconPath?: string;
	color?: string;
	destinations?: readonly IMonitorDestination[];
}

export interface IMonitorPreview {
	kind: 'platform' | 'project' | 'technology';
	label: string;
	detail: string;
	href?: string;
	status?: string;
	stack: readonly string[];
	imageSrc?: string;
	iconPath?: string;
	color?: string;
	destinations?: readonly IMonitorDestination[];
}

export interface ILanguageOption {
	id: ILocale;
	label: string;
	detail: string;
	flag: string;
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
	iconPath: string;
}

/** A grouped globe preset exposed by the hero's interactive catalogue. */
export interface IEarthTextureOption {
	id: IEarthTextureStyle;
	category: IEarthTextureCategory;
	origin: IEarthTextureOrigin;
}

/** An effect-picker button rendered inside the hero monitor detail panel. */
export interface IEffectOption {
	id: Exclude<IHeroEffect, 'idle'>;
	symbol: string;
}

export interface IMonitorDestination {
	kind: IMonitorDestinationKind;
	label: string;
	href: string;
}
