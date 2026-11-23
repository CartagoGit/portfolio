import { siGithub, siNpm } from 'simple-icons';
import type {
	IChartOption,
	IChartType,
	IEffectOption,
	ILocale,
	IMonitorDestinationKind,
} from '../../../domain/types.interface';

const CHART_TYPES: readonly IChartType[] = ['bars', 'line', 'area', 'dots', 'pulse', 'wave', 'grid', 'stacked', 'scatter', 'radar', 'donut', 'heatmap', 'treemap', 'stream'];

const CHART_ICON_PATHS: Readonly<Record<IChartType, string>> = {
	bars: 'M4 20V12h3v8H4Zm6 0V5h3v15h-3Zm6 0V9h4v11h-4Z',
	line: 'M3 18 8 11l4 3 5-9 4 4',
	area: 'M3 19V16l5-6 4 3 5-8 4 4v10H3Z',
	dots: 'M5 16a1 1 0 1 0 .01 0M10 9a1 1 0 1 0 .01 0M15 13a1 1 0 1 0 .01 0M20 6a1 1 0 1 0 .01 0',
	pulse: 'M2 13h4l2-7 4 13 3-10 2 4h5',
	wave: 'M2 14c3-9 5 9 8 0s5 9 8 0 4-5 4-5',
	grid: 'M4 4h16v16H4V4Zm0 5h16M4 15h16M9 4v16m6-16v16',
	stacked: 'M4 20v-6h3v6H4Zm6 0V9h3v11h-3Zm6 0V5h4v15h-4ZM4 12h3m3-5h3m3-4h4',
	scatter: 'M4 18h.01M8 7h.01M12 14h.01M16 5h.01M20 11h.01M18 18h.01',
	radar: 'M12 3 20 9l-3 10H7L4 9l8-6Zm0 0v16M4 9l14 6M7 19l13-10',
	donut: 'M20 12a8 8 0 1 1-8-8v4a4 4 0 1 0 4 4h4Z M12 4h8v8h-4V8h-4V4Z',
	heatmap: 'M4 4h4v4H4V4Zm6 0h4v4h-4V4Zm6 0h4v4h-4V4ZM4 10h4v4H4v-4Zm6 0h4v4h-4v-4Zm6 0h4v4h-4v-4ZM4 16h4v4H4v-4Zm6 0h4v4h-4v-4Zm6 0h4v4h-4v-4Z',
	treemap: 'M4 4h9v10H4V4Zm11 0h5v6h-5V4ZM4 16h9v4H4v-4Zm11-4h5v8h-5v-8Z',
	stream: 'M2 8c4-5 7 4 11 0s7 3 9-1M2 13c4-5 7 4 11 0s7 3 9-1M2 18c4-5 7 4 11 0s7 3 9-1',
};

const CHART_LABELS: Readonly<Record<ILocale, Readonly<Record<IChartType, string>>>> = {
	en: { bars: 'Bars', line: 'Line', area: 'Area', dots: 'Dots', pulse: 'Pulse', wave: 'Wave', grid: 'Grid', stacked: 'Stacked', scatter: 'Scatter', radar: 'Radar', donut: 'Donut', heatmap: 'Heatmap', treemap: 'Treemap', stream: 'Stream' },
	es: { bars: 'Barras', line: 'Línea', area: 'Área', dots: 'Puntos', pulse: 'Pulso', wave: 'Onda', grid: 'Cuadrícula', stacked: 'Apilado', scatter: 'Dispersión', radar: 'Radar', donut: 'Rosquilla', heatmap: 'Mapa térmico', treemap: 'Mapa árbol', stream: 'Flujo' },
	fr: { bars: 'Barres', line: 'Ligne', area: 'Aire', dots: 'Points', pulse: 'Impulsion', wave: 'Onde', grid: 'Grille', stacked: 'Empilé', scatter: 'Dispersion', radar: 'Radar', donut: 'Anneau', heatmap: 'Carte thermique', treemap: 'Arborescence', stream: 'Flux' },
	de: { bars: 'Balken', line: 'Linie', area: 'Fläche', dots: 'Punkte', pulse: 'Impuls', wave: 'Welle', grid: 'Raster', stacked: 'Gestapelt', scatter: 'Streuung', radar: 'Radar', donut: 'Ring', heatmap: 'Wärmekarte', treemap: 'Baumkarte', stream: 'Strom' },
};

export const CHART_OPTIONS: readonly IChartOption[] = CHART_TYPES.map((id) => ({ id, label: CHART_LABELS.en[id], iconPath: CHART_ICON_PATHS[id] }));

export const DESTINATION_ICON_PATHS: Readonly<Record<IMonitorDestinationKind, string>> = {
	website: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-3.17a15.6 15.6 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8ZM12 4c.83 1.17 1.51 2.51 1.98 4h-3.96C10.49 6.51 11.17 5.17 12 4ZM9.62 4.44A15.6 15.6 0 0 0 8.24 8H5.07a8.03 8.03 0 0 1 4.55-3.56ZM4.26 10h3.39a17.1 17.1 0 0 0 0 4H4.26a8.08 8.08 0 0 1 0-4Zm.81 6h3.17a15.6 15.6 0 0 0 1.38 3.56A8.03 8.03 0 0 1 5.07 16ZM12 20c-.83-1.17-1.51-2.51-1.98-4h3.96C13.51 17.49 12.83 18.83 12 20Zm2.38-.44A15.6 15.6 0 0 0 15.76 16h3.17a8.03 8.03 0 0 1-4.55 3.56ZM16.35 14a17.1 17.1 0 0 0 0-4h3.39a8.08 8.08 0 0 1 0 4h-3.39Z',
	repository: siGithub.path,
	documentation: 'M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6v-2H5v-1.3c.3-.2.7-.3 1.2-.3H11v-2H6.2a4 4 0 0 0-1.2.2V5.5c0-.3.2-.5.5-.5h5.5v14h2V5h6c.3 0 .5.2.5.5v7h2v-7a2 2 0 0 0-2-2h-6a2.5 2.5 0 0 0-2 1A2.5 2.5 0 0 0 9.5 3H5Zm9 12-2 2 2 2 5-5-2-2-3 3Z',
	package: siNpm.path,
	release: 'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L17.7 7 12 9.7 6.3 7 12 4.3ZM5 8.7l6 3.3v7.2l-6-3.3V8.7Zm8 10.5V12l6-3.3v7.2l-6 3.3Z',
	profile: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.7-9 6v2h18v-2c0-3.3-4-6-9-6Z',
};

export const EFFECT_OPTIONS: readonly IEffectOption[] = [
	{ id: 'shake', symbol: '≈' },
	{ id: 'glitch', symbol: '⌘' },
	{ id: 'float', symbol: '↟' },
	{ id: 'spectrum', symbol: '◈' },
];

export const CONSOLE_EFFECTS = [
	{ id: 'palette', symbol: '◉', labelKey: 'pages.home.monitorEffectPalette' },
	{ id: 'shake', symbol: '≈', labelKey: 'pages.home.monitorEffectShake' },
	{ id: 'glitch', symbol: '⌘', labelKey: 'pages.home.monitorEffectGlitch' },
	{ id: 'float', symbol: '↟', labelKey: 'pages.home.monitorEffectFloat' },
	{ id: 'blur', symbol: '◌', labelKey: 'pages.home.monitorEffectBlur' },
	{ id: 'pulse', symbol: '✦', labelKey: 'pages.home.monitorEffectPulse' },
	{ id: 'spectrum', symbol: '◈', labelKey: 'pages.home.monitorEffectSpectrum' },
] as const;

export function chartLabel(locale: ILocale, type: IChartType): string {
	return CHART_LABELS[locale][type];
}
