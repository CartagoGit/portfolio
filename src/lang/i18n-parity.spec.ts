import { de } from './de.translation';
import { en } from './en.translation';
import { es } from './es.translation';
import { fr } from './fr.translation';
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
});
