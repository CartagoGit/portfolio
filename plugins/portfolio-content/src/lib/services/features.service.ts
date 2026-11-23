/**
 * Page-feature introspection engine. Walks `src/pages/<id>/` and surfaces
 * every Angular page and component the feature owns, including nested
 * component folders. Pure-static, no symbol resolution.
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

const COMPONENT_RE = /^(.+?)\.(page|component)\.ts$/;

const SKIP_NAMES = new Set(['node_modules', '.angular', 'dist', '.cache']);
const PAGES_ROOT = 'src/pages';

const describeFsError = (error: unknown): string =>
	error instanceof Error ? ` ${error.message}` : '';

const buildComponentPath = (
	entries: readonly string[],
	featureRoot: string,
	subFeature: string | undefined,
): readonly IPortfolioFeatureComponent[] =>
	entries
		.map((name) => COMPONENT_RE.exec(name))
		.filter((match): match is RegExpExecArray => match !== null)
		.map((match) => {
			const componentName = match[1] ?? '';
			const role = match[2] ?? 'component';
			const subSegment = subFeature ? `${subFeature}/` : '';
			return {
				name: `${componentName}.${role}`,
				path: `${featureRoot}/${subSegment}${componentName}.${role}.ts`,
				...(subFeature ? { subFeature } : {}),
			};
		})
		.sort((a, b) => a.path.localeCompare(b.path));

const collectComponents = async (
	fs: IFileSystem,
	featureRoot: string,
	currentRoot: string,
	subFeature?: string,
): Promise<IPortfolioFeatureComponent[]> => {
	let entries: readonly string[];
	try {
		entries = await fs.readDir(currentRoot);
	} catch (error) {
		throw new Error(
			`Cannot inspect portfolio page directory "${currentRoot}".${describeFsError(error)} ` +
				`Verify that it remains below "${PAGES_ROOT}" and update the portfolio-content configuration after an intentional move.`,
		);
	}

	const visibleEntries = entries.filter(
		(name) => !SKIP_NAMES.has(name) && !name.startsWith('.'),
	);
	const components = [...buildComponentPath(visibleEntries, featureRoot, subFeature)];

	for (const entry of visibleEntries) {
		const childRoot = `${currentRoot}/${entry}`;
		if (!(await fs.isDirectory(childRoot))) continue;
		const childSubFeature = subFeature ? `${subFeature}/${entry}` : entry;
		components.push(
			...(await collectComponents(
				fs,
				featureRoot,
				childRoot,
				childSubFeature,
			)),
		);
	}

	return components.sort((a, b) => a.path.localeCompare(b.path));
};

const buildFeature = async (
	fs: IFileSystem,
	featureId: PortfolioFeatureId,
	required: boolean,
): Promise<IPortfolioFeature | undefined> => {
	const featureRoot = `${PAGES_ROOT}/${featureId}`;
	if (!(await fs.exists(featureRoot))) {
		if (required) {
			throw new Error(
				`Portfolio page directory "${featureRoot}" is missing. ` +
					`Create it or update the requested feature id; the old "src/features/${featureId}" layout is stale.`,
			);
		}
		return undefined;
	}
	if (!(await fs.isDirectory(featureRoot))) {
		throw new Error(
			`Portfolio page path "${featureRoot}" exists but is not a directory. ` +
				'Restore it as a directory or update the portfolio-content page layout.',
		);
	}

	const components = await collectComponents(fs, featureRoot, featureRoot);
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
	if (!(await fs.exists(PAGES_ROOT)) || !(await fs.isDirectory(PAGES_ROOT))) {
		throw new Error(
			`Portfolio page root "${PAGES_ROOT}" is missing or is not a directory. ` +
				'Restore the current src/pages layout or update the portfolio-content service after an intentional move; src/features is stale.',
		);
	}

	const ids = request.featureId ? [request.featureId] : KNOWN_FEATURES;
	const features: IPortfolioFeature[] = [];
	for (const id of ids) {
		const feature = await buildFeature(fs, id, request.featureId !== undefined);
		if (feature) features.push(feature);
	}

	return {
		features,
		generatedAt: new Date().toISOString(),
	};
};
