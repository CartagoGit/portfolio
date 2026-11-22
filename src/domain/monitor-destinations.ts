import type {
	IMonitorDestination,
	IMonitorDestinationKind,
	IMonitorPreview,
} from './types';

type IDestinationTuple = readonly [label: string, href: string];

interface ITechnologyDestinationSource {
	website?: IDestinationTuple;
	documentation?: IDestinationTuple;
	package?: IDestinationTuple;
	repository?: IDestinationTuple;
}

const destination = (
	kind: IMonitorDestinationKind,
	...[label, href]: IDestinationTuple
): IMonitorDestination => ({ kind, label, href });

const fromSource = (
	source: ITechnologyDestinationSource
): readonly IMonitorDestination[] => {
	const result: IMonitorDestination[] = [];
	if (source.website)
		result.push(destination('website', ...source.website));
	if (source.documentation)
		result.push(destination('documentation', ...source.documentation));
	if (source.package)
		result.push(destination('package', ...source.package));
	if (source.repository)
		result.push(destination('repository', ...source.repository));
	return result;
};

const PROJECT_DESTINATIONS: Readonly<
	Record<string, readonly IMonitorDestination[]>
> = {
	DelendAI: [
		destination('website', 'cartagogit.github.io/DelendAI', 'https://cartagogit.github.io/DelendAI/'),
		destination('documentation', 'docs/delendai', 'https://github.com/CartagoGit/DelendAI/blob/develop/docs/delendai/README.md'),
		destination('repository', 'CartagoGit/DelendAI', 'https://github.com/CartagoGit/DelendAI'),
		destination('release', 'CartagoGit/DelendAI/releases', 'https://github.com/CartagoGit/DelendAI/releases'),
	],
	Tanit: [
		destination('repository', 'CartagoGit/api-source-tanit', 'https://github.com/CartagoGit/api-source-tanit'),
		destination('documentation', 'api-source-tanit/docs/INSTALL.md', 'https://github.com/CartagoGit/api-source-tanit/blob/main/docs/INSTALL.md'),
		destination('release', 'api-source-tanit/releases', 'https://github.com/CartagoGit/api-source-tanit/releases'),
	],
	QuickModel: [
		destination('website', 'cartagogit.github.io/quickmodel', 'https://cartagogit.github.io/quickmodel/'),
		destination('documentation', 'quickmodel / guide / installation', 'https://cartagogit.github.io/quickmodel/en/guide/installation'),
		destination('repository', 'CartagoGit/quickmodel', 'https://github.com/CartagoGit/quickmodel'),
	],
	Keyer: [
		destination('package', '@cartago-git/keyer', 'https://www.npmjs.com/package/@cartago-git/keyer'),
		destination('repository', 'CartagoGit/Keyer', 'https://github.com/CartagoGit/Keyer'),
		destination('documentation', 'Keyer / README.md', 'https://github.com/CartagoGit/Keyer#readme'),
	],
	'Print CV': [
		destination('website', 'cartagogit.github.io/print-cv', 'https://cartagogit.github.io/print-cv/'),
		destination('repository', 'CartagoGit/print-cv', 'https://github.com/CartagoGit/print-cv'),
		destination('documentation', 'print-cv / README.md', 'https://github.com/CartagoGit/print-cv#readme'),
	],
	'Steam Keys': [
		destination('repository', 'CartagoGit/steam-keys', 'https://github.com/CartagoGit/steam-keys'),
		destination('documentation', 'steam-keys / README.md', 'https://github.com/CartagoGit/steam-keys#readme'),
	],
};

const TECHNOLOGY_SOURCES: Readonly<
	Record<string, ITechnologyDestinationSource>
> = {
	TypeScript: {
		website: ['TypeScript', 'https://www.typescriptlang.org/'],
		documentation: ['Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html'],
		package: ['typescript', 'https://www.npmjs.com/package/typescript'],
		repository: ['microsoft/TypeScript', 'https://github.com/microsoft/TypeScript'],
	},
	Angular: {
		website: ['Angular', 'https://angular.dev/'],
		documentation: ['Angular guide', 'https://angular.dev/overview'],
		package: ['@angular/core', 'https://www.npmjs.com/package/@angular/core'],
		repository: ['angular/angular', 'https://github.com/angular/angular'],
	},
	RxJS: {
		website: ['RxJS', 'https://rxjs.dev/'],
		documentation: ['RxJS guide', 'https://rxjs.dev/guide/overview'],
		package: ['rxjs', 'https://www.npmjs.com/package/rxjs'],
		repository: ['ReactiveX/rxjs', 'https://github.com/ReactiveX/rxjs'],
	},
	Ionic: {
		website: ['Ionic', 'https://ionicframework.com/'],
		documentation: ['Ionic docs', 'https://ionicframework.com/docs'],
		package: ['@ionic/angular', 'https://www.npmjs.com/package/@ionic/angular'],
		repository: ['ionic-team/ionic-framework', 'https://github.com/ionic-team/ionic-framework'],
	},
	Capacitor: {
		website: ['Capacitor', 'https://capacitorjs.com/'],
		documentation: ['Capacitor docs', 'https://capacitorjs.com/docs'],
		package: ['@capacitor/core', 'https://www.npmjs.com/package/@capacitor/core'],
		repository: ['ionic-team/capacitor', 'https://github.com/ionic-team/capacitor'],
	},
	'Angular Material': {
		website: ['Angular Material', 'https://material.angular.dev/'],
		documentation: ['Material docs', 'https://material.angular.dev/components/categories'],
		package: ['@angular/material', 'https://www.npmjs.com/package/@angular/material'],
		repository: ['angular/components', 'https://github.com/angular/components'],
	},
	Sass: {
		website: ['Sass', 'https://sass-lang.com/'],
		documentation: ['Sass guide', 'https://sass-lang.com/guide/'],
		package: ['sass', 'https://www.npmjs.com/package/sass'],
		repository: ['sass/dart-sass', 'https://github.com/sass/dart-sass'],
	},
	Bun: {
		website: ['Bun', 'https://bun.sh/'],
		documentation: ['Bun docs', 'https://bun.sh/docs'],
		repository: ['oven-sh/bun', 'https://github.com/oven-sh/bun'],
	},
	'Node.js': {
		website: ['Node.js', 'https://nodejs.org/'],
		documentation: ['Node.js docs', 'https://nodejs.org/docs/latest/api/'],
		repository: ['nodejs/node', 'https://github.com/nodejs/node'],
	},
	NestJS: {
		website: ['NestJS', 'https://nestjs.com/'],
		documentation: ['NestJS docs', 'https://docs.nestjs.com/'],
		package: ['@nestjs/core', 'https://www.npmjs.com/package/@nestjs/core'],
		repository: ['nestjs/nest', 'https://github.com/nestjs/nest'],
	},
	npm: {
		website: ['npm', 'https://www.npmjs.com/'],
		documentation: ['npm docs', 'https://docs.npmjs.com/'],
		repository: ['npm/cli', 'https://github.com/npm/cli'],
	},
	Docker: {
		website: ['Docker', 'https://www.docker.com/'],
		documentation: ['Docker docs', 'https://docs.docker.com/'],
		package: ['Docker Hub', 'https://hub.docker.com/'],
		repository: ['docker/cli', 'https://github.com/docker/cli'],
	},
	Git: {
		website: ['Git', 'https://git-scm.com/'],
		documentation: ['Git reference', 'https://git-scm.com/docs'],
		repository: ['git/git', 'https://github.com/git/git'],
	},
	'GitLab CI': {
		website: ['GitLab', 'https://about.gitlab.com/'],
		documentation: ['CI/CD docs', 'https://docs.gitlab.com/ci/'],
		repository: ['gitlabhq/gitlabhq', 'https://github.com/gitlabhq/gitlabhq'],
	},
	Vitest: {
		website: ['Vitest', 'https://vitest.dev/'],
		documentation: ['Vitest guide', 'https://vitest.dev/guide/'],
		package: ['vitest', 'https://www.npmjs.com/package/vitest'],
		repository: ['vitest-dev/vitest', 'https://github.com/vitest-dev/vitest'],
	},
	Jest: {
		website: ['Jest', 'https://jestjs.io/'],
		documentation: ['Jest docs', 'https://jestjs.io/docs/getting-started'],
		package: ['jest', 'https://www.npmjs.com/package/jest'],
		repository: ['jestjs/jest', 'https://github.com/jestjs/jest'],
	},
	'GitHub Actions': {
		website: ['GitHub Actions', 'https://github.com/features/actions'],
		documentation: ['Actions docs', 'https://docs.github.com/actions'],
		repository: ['actions/runner', 'https://github.com/actions/runner'],
	},
	Vue: {
		website: ['Vue', 'https://vuejs.org/'],
		documentation: ['Vue guide', 'https://vuejs.org/guide/'],
		package: ['vue', 'https://www.npmjs.com/package/vue'],
		repository: ['vuejs/core', 'https://github.com/vuejs/core'],
	},
	React: {
		website: ['React', 'https://react.dev/'],
		documentation: ['React docs', 'https://react.dev/learn'],
		package: ['react', 'https://www.npmjs.com/package/react'],
		repository: ['facebook/react', 'https://github.com/facebook/react'],
	},
	Electron: {
		website: ['Electron', 'https://www.electronjs.org/'],
		documentation: ['Electron docs', 'https://www.electronjs.org/docs/latest/'],
		package: ['electron', 'https://www.npmjs.com/package/electron'],
		repository: ['electron/electron', 'https://github.com/electron/electron'],
	},
	'Tailwind CSS': {
		website: ['Tailwind CSS', 'https://tailwindcss.com/'],
		documentation: ['Tailwind docs', 'https://tailwindcss.com/docs'],
		package: ['tailwindcss', 'https://www.npmjs.com/package/tailwindcss'],
		repository: ['tailwindlabs/tailwindcss', 'https://github.com/tailwindlabs/tailwindcss'],
	},
	PrimeNG: {
		website: ['PrimeNG', 'https://primeng.org/'],
		documentation: ['PrimeNG docs', 'https://primeng.org/configuration'],
		package: ['primeng', 'https://www.npmjs.com/package/primeng'],
		repository: ['primefaces/primeng', 'https://github.com/primefaces/primeng'],
	},
	Storybook: {
		website: ['Storybook', 'https://storybook.js.org/'],
		documentation: ['Storybook docs', 'https://storybook.js.org/docs'],
		package: ['storybook', 'https://www.npmjs.com/package/storybook'],
		repository: ['storybookjs/storybook', 'https://github.com/storybookjs/storybook'],
	},
	Vite: {
		website: ['Vite', 'https://vite.dev/'],
		documentation: ['Vite guide', 'https://vite.dev/guide/'],
		package: ['vite', 'https://www.npmjs.com/package/vite'],
		repository: ['vitejs/vite', 'https://github.com/vitejs/vite'],
	},
	Nx: {
		website: ['Nx', 'https://nx.dev/'],
		documentation: ['Nx docs', 'https://nx.dev/getting-started/intro'],
		package: ['nx', 'https://www.npmjs.com/package/nx'],
		repository: ['nrwl/nx', 'https://github.com/nrwl/nx'],
	},
	MongoDB: {
		website: ['MongoDB', 'https://www.mongodb.com/'],
		documentation: ['MongoDB docs', 'https://www.mongodb.com/docs/'],
		package: ['mongodb', 'https://www.npmjs.com/package/mongodb'],
		repository: ['mongodb/node-mongodb-native', 'https://github.com/mongodb/node-mongodb-native'],
	},
	Mongoose: {
		website: ['Mongoose', 'https://mongoosejs.com/'],
		documentation: ['Mongoose docs', 'https://mongoosejs.com/docs/guide.html'],
		package: ['mongoose', 'https://www.npmjs.com/package/mongoose'],
		repository: ['Automattic/mongoose', 'https://github.com/Automattic/mongoose'],
	},
	Prisma: {
		website: ['Prisma', 'https://www.prisma.io/'],
		documentation: ['Prisma docs', 'https://www.prisma.io/docs'],
		package: ['prisma', 'https://www.npmjs.com/package/prisma'],
		repository: ['prisma/prisma', 'https://github.com/prisma/prisma'],
	},
	Zod: {
		website: ['Zod', 'https://zod.dev/'],
		documentation: ['Zod docs', 'https://zod.dev/'],
		package: ['zod', 'https://www.npmjs.com/package/zod'],
		repository: ['colinhacks/zod', 'https://github.com/colinhacks/zod'],
	},
	Firebase: {
		website: ['Firebase', 'https://firebase.google.com/'],
		documentation: ['Firebase docs', 'https://firebase.google.com/docs'],
		package: ['firebase', 'https://www.npmjs.com/package/firebase'],
		repository: ['firebase/firebase-js-sdk', 'https://github.com/firebase/firebase-js-sdk'],
	},
	Linux: {
		website: ['Linux', 'https://www.kernel.org/'],
		documentation: ['Kernel docs', 'https://docs.kernel.org/'],
		repository: ['torvalds/linux', 'https://github.com/torvalds/linux'],
	},
	Kotlin: {
		website: ['Kotlin', 'https://kotlinlang.org/'],
		documentation: ['Kotlin docs', 'https://kotlinlang.org/docs/home.html'],
		repository: ['JetBrains/kotlin', 'https://github.com/JetBrains/kotlin'],
	},
	Claude: {
		website: ['Claude', 'https://claude.ai/'],
		documentation: ['Anthropic docs', 'https://docs.anthropic.com/'],
	},
	MiniMax: {
		website: ['MiniMax', 'https://www.minimax.io/'],
		documentation: ['MiniMax platform', 'https://platform.minimax.io/docs'],
	},
	Grok: {
		website: ['Grok', 'https://x.ai/grok'],
		documentation: ['xAI docs', 'https://docs.x.ai/'],
	},
	OpenCode: {
		website: ['OpenCode', 'https://opencode.ai/'],
		documentation: ['OpenCode docs', 'https://opencode.ai/docs'],
		repository: ['anomalyco/opencode', 'https://github.com/anomalyco/opencode'],
	},
	'GitHub Copilot': {
		website: ['GitHub Copilot', 'https://github.com/features/copilot'],
		documentation: ['Copilot docs', 'https://docs.github.com/copilot'],
	},
	'Model Context Protocol': {
		website: ['MCP', 'https://modelcontextprotocol.io/'],
		documentation: ['MCP docs', 'https://modelcontextprotocol.io/docs'],
		repository: ['modelcontextprotocol', 'https://github.com/modelcontextprotocol'],
	},
	ESLint: {
		website: ['ESLint', 'https://eslint.org/'],
		documentation: ['ESLint docs', 'https://eslint.org/docs/latest/'],
		package: ['eslint', 'https://www.npmjs.com/package/eslint'],
		repository: ['eslint/eslint', 'https://github.com/eslint/eslint'],
	},
	Prettier: {
		website: ['Prettier', 'https://prettier.io/'],
		documentation: ['Prettier docs', 'https://prettier.io/docs/en/'],
		package: ['prettier', 'https://www.npmjs.com/package/prettier'],
		repository: ['prettier/prettier', 'https://github.com/prettier/prettier'],
	},
	GitHub: {
		website: ['GitHub', 'https://github.com/'],
		documentation: ['GitHub docs', 'https://docs.github.com/'],
	},
};

const TECHNOLOGY_DESTINATIONS: Record<
	string,
	readonly IMonitorDestination[]
> = {};
for (const [label, source] of Object.entries(TECHNOLOGY_SOURCES))
	TECHNOLOGY_DESTINATIONS[label] = fromSource(source);

export const DEFAULT_MONITOR_DESTINATIONS: readonly IMonitorDestination[] = [
	destination('profile', 'CartagoGit', 'https://github.com/CartagoGit'),
	destination('website', 'cartagogit.github.io', 'https://cartagogit.github.io/'),
	destination('repository', 'CartagoGit/portfolio', 'https://github.com/CartagoGit/portfolio'),
];

export function technologyDestinations(
	label: string
): readonly IMonitorDestination[] {
	return TECHNOLOGY_DESTINATIONS[label] ?? [];
}

export function primaryTechnologyDestination(
	label: string
): IMonitorDestination | undefined {
	return technologyDestinations(label)[0];
}

export function monitorDestinations(
	preview: IMonitorPreview | null
): readonly IMonitorDestination[] {
	if (!preview) return DEFAULT_MONITOR_DESTINATIONS;
	if (preview.destinations?.length) return preview.destinations;
	if (preview.kind === 'technology')
		return technologyDestinations(preview.label);
	if (preview.kind === 'project') {
		const name = preview.label === 'API Source Tanit' ? 'Tanit' : preview.label;
		return PROJECT_DESTINATIONS[name] ?? [];
	}
	return preview.href
		? [destination('profile', preview.label, preview.href)]
		: [];
}
