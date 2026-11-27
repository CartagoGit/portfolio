import type {
	IChartType,
	IEarthTextureCategory,
	IEarthTextureOrigin,
	IEarthTextureStyle,
	ILocale,
} from '../domain/types.interface';
import {
	closeSphereLabel,
	EARTH_TEXTURE_CATEGORIES,
	EARTH_TEXTURE_OPTIONS,
	earthCategoryLabel,
	earthTextureLabel,
	earthTextureOriginLabel,
} from '../pages/home/hero-monitor/earth-texture.catalog';
import { chartLabel } from '../pages/home/hero-monitor/hero-monitor.catalog';
import { de } from './de.translation';
import { en } from './en.translation';
import { es } from './es.translation';
import { fr } from './fr.translation';
import { GLOBAL_TRANSLATIONS } from './global.translations';
import type { ITranslationMap } from './types.interface';

const immutablePath = (path: string): boolean =>
	/^chrome\.header\.(brand|navDocker|navDemos|navContact)$/.test(path) ||
	/^pages\.home\.monitor(Technologies|Destinations|Documentation|OpenSource)$/.test(path) ||
	/^pages\.home\.panel.+(Label|Metric)$/.test(path) ||
	path === 'pages.home.earthTextureNatural' ||
	path === 'pages.home.monitorLive' ||
	path === 'pages.lab.liveBadge' ||
	path === 'pages.lab.motionNoteCode' ||
	path === 'pages.lab.chartRadar' ||
	/\.titleTail$|TitleTail$/.test(path) ||
	/^pages\.work\.(mcpTitle|quickmodelTitle|keyerTitle|printCv|zoneless|nestgpt|directoryShipTitle|directoryDemoTitle|directoryPlayTitle)$/.test(path) ||
	/^pages\.work\.(directoryCodeLabel|directoryDemoLabel)$/.test(path) ||
	path === 'pages.approach.capabilityToolingProof' ||
	/^pages\.knowledge\.tile.*Stack$/.test(path) ||
	/^pages\.knowledge\.tile(Frontend|Mobile)Label$/.test(path) ||
	/^pages\.docker\.(eyebrow|terminalPull|terminalAngular|terminalNode|dockerAlt|hubLink|sourceLink)$/.test(path) ||
	/^pages\.contact\.(eyebrow|ctaLinkedin|ctaGithub|ctaDockerHub|ctaNpm)$/.test(path) ||
	path === 'pages.lab.easingLinear' ||
	/^pages\.demos\.eyebrow$/.test(path) ||
	/^content\.capabilities\.(tooling)\.proof$/.test(path) ||
	/^content\.terms\.(angular|scss|angular-22|zoneless|ionic|capacitor|android|vitest|performance|cdk|storybook|typescript|mcp|docker|ci|openapi|solid|npm|cli|vue|zod|tauri-2|sqlite)$/.test(path) ||
	/^lang\.languages\.(en|es|fr|de)\.(label|detail)$/.test(path) ||
	/^lang\.themes\./.test(path) ||
	path === 'pages.docker.terminalHeading';

function identicalLeaves(
	base: unknown,
	translated: unknown,
): readonly string[] {
	const result: string[] = [];
	const visit = (entry: { base: unknown; translated: unknown; path: string }): void => {
		if (typeof entry.base === 'string') {
			if (entry.base === entry.translated) result.push(entry.path);
			return;
		}
		if (
			entry.base &&
			typeof entry.base === 'object' &&
			entry.translated &&
			typeof entry.translated === 'object'
		) {
			for (const key of Object.keys(entry.base)) {
				visit({
					base: (entry.base as Record<string, unknown>)[key],
					translated: (entry.translated as Record<string, unknown>)[key],
					path: entry.path ? `${entry.path}.${key}` : key,
				});
			}
		}
	};
	visit({ base, translated, path: '' });
	return result;
}

const localized: ReadonlyArray<readonly [string, ITranslationMap]> = [
	['es', es],
	['fr', fr],
	['de', de],
];

const allLocales = [
	['en', en],
	...localized,
	...Object.entries(GLOBAL_TRANSLATIONS),
] as ReadonlyArray<readonly [ILocale, ITranslationMap]>;

const deepSecondaryRoots = [
	['pages.work', en.pages.work],
	['pages.knowledge', en.pages.knowledge],
	['content.projects', en.content.projects],
	['content.publicLinkDetails', en.content.publicLinkDetails],
	['content.knowledgeExamples', en.content.knowledgeExamples],
	['content.terms', en.content.terms],
	['content.technologies', en.content.technologies],
	['seo', en.seo],
] as const;

const deepSecondaryCases = Object.entries(GLOBAL_TRANSLATIONS).flatMap(([locale, map]) =>
	deepSecondaryRoots.map(([root, base]) => ({ locale: locale as ILocale, root, map, base })),
);

const priorityRoots = [
	['pages.home', en.pages.home],
	['pages.lab', en.pages.lab],
	['pages.approach', en.pages.approach],
	['pages.docker', en.pages.docker],
	['pages.demos', en.pages.demos],
	['pages.contact', en.pages.contact],
	['content.capabilities', en.content.capabilities],
	['content.dockerImages', en.content.dockerImages],
] as const;

function atPath(source: unknown, path: string): unknown {
	return path.split('.').reduce<unknown>(
		(value, segment) => value && typeof value === 'object'
			? (value as Record<string, unknown>)[segment]
			: undefined,
		undefined,
	);
}

function resolveMapPath(map: ITranslationMap, path: string): unknown {
	return atPath(map, path);
}

function priorityIdenticalPaths(map: ITranslationMap): readonly string[] {
	return priorityRoots.flatMap(([root, base]) =>
		identicalLeaves(base, resolveMapPath(map, root)).map((leaf) => `${root}.${leaf}`),
	);
}

function placeholders(value: string): readonly string[] {
	return [...value.matchAll(/\{\w+\}/g)].map(([token]) => token).sort();
}

function priorityPlaceholderMismatches(map: ITranslationMap): readonly string[] {
	const mismatches: string[] = [];
	for (const [root, base] of priorityRoots) {
		const translated = resolveMapPath(map, root);
		for (const path of identicalLeaves(base, base)) {
			const source = String(atPath(base, path));
			const target = String(atPath(translated, path));
			if (placeholders(source).join('|') !== placeholders(target).join('|')) {
				mismatches.push(`${root}.${path}`);
			}
		}
	}
	return mismatches;
}

function priorityImmutablePath(path: string): boolean {
	return immutablePath(path) ||
		path === 'pages.home.monitorRepository' ||
		path === 'pages.home.monitorChartArea' ||
		/^pages\.lab\.chart(Area|Radar)$/.test(path) ||
		/^pages\.lab\.easing(Standard|Linear|Label)$/.test(path) ||
		path === 'pages.lab.dataStatus' ||
		path === 'pages.demos.reactionStart' ||
		path === 'pages.contact.ctaEmail';
}

const earthCategories = EARTH_TEXTURE_CATEGORIES;
const earthStyles = [...new Set(EARTH_TEXTURE_OPTIONS.map(({ id }) => id))];
const earthOrigins = [...new Set(EARTH_TEXTURE_OPTIONS.map(({ origin }) => origin))];
const earthTechnicalStyles: ReadonlySet<IEarthTextureStyle> = new Set([
	'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
	'kepler-186f', 'proxima-b', 'trappist-1e', 'soccer', 'basketball', 'tennis', 'golf', 'rugby', 'volleyball',
]);
const earthTechnicalCategories: ReadonlySet<IEarthTextureCategory> = new Set(['figures']);
const chartTypes: readonly IChartType[] = [
	'bars', 'line', 'area', 'dots', 'pulse', 'wave', 'grid', 'stacked', 'scatter',
	'radar', 'donut', 'heatmap', 'treemap', 'stream',
];
const chartTechnicalTypes: ReadonlySet<IChartType> = new Set(['area', 'radar']);

describe('i18n parity', () => {
	it.each(localized)('%s has no visible English fallback outside immutable terms', (_id, map) => {
		const unexpected = identicalLeaves(en, map).filter((path) => !immutablePath(path));
		expect(unexpected).toEqual([]);
	});

	it.each(localized)('%s owns all localized project, capability and image records', (_id, map) => {
		expect(Object.keys(map.content.projects).sort()).toEqual([
			'delivery', 'mobile', 'overview', 'quality', 'tooling', 'workflows',
		]);
		expect(Object.keys(map.content.capabilities).sort()).toEqual([
			'architecture', 'mobile', 'product', 'quality', 'systems', 'tooling',
		]);
		expect(Object.keys(map.content.dockerImages).sort()).toEqual([
			'angular', 'docker-graphql', 'ionic-cover', 'nestjs-cover', 'nodebun', 'zsh',
		]);
		expect(Object.keys(map.content.technologies)).toHaveLength(41);
		expect(Object.keys(map.content.terms)).toHaveLength(31);
	});

	it('registers all 20 supported locales', () => {
		expect(allLocales.map(([locale]) => locale)).toHaveLength(20);
		expect(new Set(allLocales.map(([locale]) => locale))).toHaveLength(20);
	});

	it('keeps Portuguese regional variants distinct', () => {
		expect(GLOBAL_TRANSLATIONS['pt-PT'].pages.demos.subtitle)
			.not.toBe(GLOBAL_TRANSLATIONS['pt-BR'].pages.demos.subtitle);
		expect(GLOBAL_TRANSLATIONS['pt-PT'].pages.contact.formEmailPlaceholder)
			.toBe('voce@exemplo.pt');
		expect(GLOBAL_TRANSLATIONS['pt-BR'].pages.contact.formEmailPlaceholder)
			.toBe('voce@email.com');
	});

	it('keeps Chinese regional variants distinct', () => {
		expect(GLOBAL_TRANSLATIONS['zh-CN'].pages.home.monitorChartSignal)
			.not.toBe(GLOBAL_TRANSLATIONS['zh-TW'].pages.home.monitorChartSignal);
		expect(GLOBAL_TRANSLATIONS['zh-CN'].pages.contact.ctaEmail).toContain('电子');
		expect(GLOBAL_TRANSLATIONS['zh-TW'].pages.contact.ctaEmail).toContain('電子');
	});

	it.each(allLocales.filter(([locale]) => locale !== 'en'))(
		'%s localizes every priority block outside explicit technical terms',
		(_locale, map) => {
			const unexpected = priorityIdenticalPaths(map).filter((path) => !priorityImmutablePath(path));
			expect(unexpected).toEqual([]);
		},
	);

	it.each(allLocales)('%s preserves priority interpolation tokens', (_locale, map) => {
		expect(priorityPlaceholderMismatches(map)).toEqual([]);
	});

	it.each(deepSecondaryCases)(
		'$locale localizes $root outside technical identifiers',
		({ locale: _locale, root, map, base }) => {
			const unexpected = identicalLeaves(base, resolveMapPath(map, root))
				.map((leaf) => `${root}.${leaf}`)
				.filter((path) => !immutablePath(path));
			expect(unexpected).toEqual([]);
		},
	);

	it.each(allLocales.filter(([locale]) => locale !== 'en'))(
		'%s localizes globe controls outside proper or technical names',
		(locale) => {
			const unexpected: string[] = [];
			for (const category of earthCategories) {
				if (earthCategoryLabel(locale, category) === earthCategoryLabel('en', category)) {
					if (!earthTechnicalCategories.has(category)) unexpected.push(`categories.${category}`);
				}
			}
			for (const style of earthStyles) {
				if (
					earthTextureLabel(locale, style) === earthTextureLabel('en', style) &&
					!earthTechnicalStyles.has(style)
				) unexpected.push(`presets.${style}`);
			}
			for (const origin of earthOrigins as readonly IEarthTextureOrigin[]) {
				if (earthTextureOriginLabel(locale, EARTH_TEXTURE_OPTIONS.find((item) => item.origin === origin)!.id) === earthTextureOriginLabel('en', EARTH_TEXTURE_OPTIONS.find((item) => item.origin === origin)!.id)) {
					unexpected.push(`origins.${origin}`);
				}
			}
			if (closeSphereLabel(locale) === closeSphereLabel('en')) unexpected.push('closeSphere');
			expect(unexpected).toEqual([]);
		},
	);

	it.each(allLocales.filter(([locale]) => locale !== 'en'))(
		'%s localizes monitor chart controls outside standardized chart terms',
		(locale) => {
			const unexpected = chartTypes.filter((type) =>
				chartLabel(locale, type) === chartLabel('en', type) && !chartTechnicalTypes.has(type),
			);
			expect(unexpected).toEqual([]);
		},
	);
});
