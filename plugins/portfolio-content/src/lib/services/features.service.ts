/**
 * Feature introspection engine. Walks `src/features/<id>/` and surfaces
 * every Angular component the feature owns. Components are split into
 * top-level `*.component.ts` (the public page) and sub-feature
 * folders (e.g. `home/hero-monitor/`). Pure-static, no symbol
 * resolution.
 */

import type {
	IBuildFeatureMapRequest,
	IPortfolioFeature,
	IPortfolioFeatureComponent,
	IPortfolioFeatureMap,
	PortfolioFeatureId,
} from '../contracts/interfaces/features.interface';
import type { IFileSystem } from '../contracts/interfaces/fs.interface';

const FEATURE_LABELS: Readonly<Record<PortfolioFeatureId, string>> = {
	home: 'Home',
	work: 'Work',
	approach: 'Approach',
	knowledge: 'Knowledge',
	lab: 'Lab',
	docker: 'Docker',
	demos: 'Demos',
	contact: 'Contact',
};

const COMPONENT_RE = /^(.+?)\.component\.ts$/;

const SKIP_NAMES = new Set(['node_modules', '.angular', 'dist', '.cache']);

const buildComponentPath = (
	entries: readonly string[],
	featureRoot: string,
	subFeature: string | undefined,
): readonly IPortfolioFeatureComponent[] =>
	entries
		.map((name) => COMPONENT_RE.exec(name))
		.filter((match): match is RegExpExecArray => match !== null)
		.map((match) => {
			const componentName = match[1];
			const subSegment = subFeature ? `${subFeature}/` : '';
			return {
				name: `${componentName}.component`,
				path: `${featureRoot}/${subSegment}${componentName}.component.ts`,
				...(subFeature ? { subFeature } : {}),
			};
		})
		.sort((a, b) => a.path.localeCompare(b.path));

const buildFeature = async (
	fs: IFileSystem,
	featureId: PortfolioFeatureId,
): Promise<IPortfolioFeature | undefined> => {
	const featureRoot = `src/features/${featureId}`;
	if (!(await fs.exists(featureRoot))) return undefined;

	const topLevel = (await fs.readDir(featureRoot)).filter(
		(name) => !SKIP_NAMES.has(name) && !name.startsWith('.'),
	);
	const components: IPortfolioFeatureComponent[] = [];

	// Top-level page components (`<id>-page.component.ts`).
	components.push(...buildComponentPath(topLevel, featureRoot, undefined));

	// Sub-feature folders: every sub-folder that contains a component.
	for (const entry of topLevel) {
		const subFeatureRoot = `${featureRoot}/${entry}`;
		// Test whether `subFeatureRoot` is a real directory; `exists`
		// returns true for files too, so without `isDirectory` we'd
		// try to read a `*.component.ts` as a directory and crash.
		if (!(await fs.isDirectory(subFeatureRoot))) continue;
		const subEntries = (await fs.readDir(subFeatureRoot)).filter(
			(name) => !SKIP_NAMES.has(name) && !name.startsWith('.'),
		);
		components.push(...buildComponentPath(subEntries, featureRoot, entry));
	}

	components.sort((a, b) => a.path.localeCompare(b.path));

	return {
		id: featureId,
		label: FEATURE_LABELS[featureId],
		path: featureRoot,
		components,
	};
};

export const KNOWN_FEATURES: readonly PortfolioFeatureId[] = [
	'home',
	'work',
	'approach',
	'knowledge',
	'lab',
	'docker',
	'demos',
	'contact',
];

export const buildFeatureMap = async (
	fs: IFileSystem,
	request: IBuildFeatureMapRequest = {},
): Promise<IPortfolioFeatureMap> => {
	const ids = request.featureId ? [request.featureId] : KNOWN_FEATURES;
	const features: IPortfolioFeature[] = [];
	for (const id of ids) {
		const feature = await buildFeature(fs, id);
		if (feature) features.push(feature);
	}
	return {
		features,
		generatedAt: new Date().toISOString(),
	};
};
