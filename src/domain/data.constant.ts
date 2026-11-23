import {
	siAngular,
	siBun,
	siCapacitor,
	siClaude,
	siDocker,
	siElectron,
	siEslint,
	siFirebase,
	siGit,
	siGithub,
	siGithubactions,
	siGithubcopilot,
	siGitlab,
	siIonic,
	siJest,
	siKotlin,
	siLinux,
	siMaterialdesign,
	siMinimax,
	siModelcontextprotocol,
	siMongodb,
	siMongoose,
	siNestjs,
	siNodedotjs,
	siNpm,
	siNx,
	siOpencode,
	siPrettier,
	siPrimeng,
	siPrisma,
	siReact,
	siReactivex,
	siSass,
	siStorybook,
	siTailwindcss,
	siTypescript,
	siVite,
	siVitest,
	siVuedotjs,
	siX,
	siZod,
} from 'simple-icons';
import type {
	ICapability,
	IDemo,
	IHeroPanel,
	ILanguageOption,
	IPlaygroundStep,
	IPlaygroundStepDefinition,
	IPublicLink,
	ITechnology,
	ITelemetry,
} from './types.interface';

const CURATED_PROJECT_ORDER = [
	'DelendAI',
	'Tanit',
	'QuickModel',
	'Print CV',
	'Steam Keys',
	'Keyer',
] as const;

function projectPriority(label: string): number {
	const normalized = label === 'API Source Tanit' ? 'Tanit' : label;
	const index = CURATED_PROJECT_ORDER.findIndex((project) => project === normalized);
	return index < 0 ? Number.MAX_SAFE_INTEGER : index;
}

const PUBLIC_LINK_ITEMS: readonly IPublicLink[] = [
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/mario-cabrero-volarich',
		group: 'platform',
		imageSrc: '/icons/linkedin.svg',
		detail: 'Professional profile, product engineering background and direct contact channel.',
	},
	{
		label: 'GitHub',
		href: 'https://github.com/CartagoGit',
		group: 'platform',
		iconPath: siGithub.path,
		detail: 'Public repositories, source history and the main delivery surface for open-source work.',
	},
	{
		label: 'Docker Hub',
		href: 'https://hub.docker.com/u/cartagodocker',
		group: 'platform',
		imageSrc: '/icons/projects/docker.svg',
		detail: 'Public container images for reproducible development and deployment environments.',
	},
	{
		label: 'npm',
		href: 'https://www.npmjs.com/~cartago-git',
		group: 'platform',
		iconPath: siNpm.path,
		color: '#cb3837',
		detail: 'Published TypeScript packages and command-line tooling delivered for real use.',
	},
	{
		label: 'DelendAI',
		href: 'https://github.com/CartagoGit/delendai',
		group: 'project',
		imageSrc: '/icons/delendai.svg',
		detail: 'MCP server and plugin system for structured agent workflows with explicit capabilities.',
	},
	{
		label: 'API Source Tanit',
		href: 'https://github.com/CartagoGit/api-source-tanit',
		group: 'project',
		imageSrc: '/icons/projects/tanit.svg',
		detail: 'Static API discovery across popular backend frameworks with portable export formats.',
	},
	{
		label: 'QuickModel',
		href: 'https://github.com/CartagoGit/quickmodel',
		group: 'project',
		imageSrc: '/icons/quickmodel.png',
		detail: 'Typed serialization and validation library built around SOLID transformation adapters.',
	},
	{
		label: 'Print CV',
		href: 'https://cartagogit.github.io/print-cv/',
		group: 'project',
		imageSrc: '/icons/projects/print-cv.svg',
		detail: 'Bilingual Vue CV builder with validation, tests and a deliberate paper layout.',
	},
	{
		label: 'Steam Keys',
		href: 'https://github.com/CartagoGit/steam-keys',
		group: 'project',
		imageSrc: '/icons/projects/steam-keys.svg',
		detail: 'Local-first Tauri desktop manager for private game-key records.',
	},
	{
		label: 'Keyer',
		href: 'https://github.com/CartagoGit/Keyer',
		group: 'project',
		imageSrc: '/icons/projects/keyer.svg',
		detail: 'Published CLI and library for encrypting secrets and environment files.',
	},
];

export const PUBLIC_LINKS: readonly IPublicLink[] = Object.freeze([
	...PUBLIC_LINK_ITEMS.filter(({ group }) => group === 'platform'),
	...PUBLIC_LINK_ITEMS.filter(({ group }) => group === 'project').sort(
		(left, right) => projectPriority(left.label) - projectPriority(right.label)
	),
]);

const HERO_PANEL_ITEMS: readonly IHeroPanel[] = [
	{
		id: 'overview',
		label: 'DelendAI',
		metric: 'MCP',
		detail: 'A project-agnostic MCP server that exposes isolated capabilities for structured agent workflows.',
		status: 'Open source · CLI + MCP server',
		stack: ['TypeScript', 'MCP', 'Plugins', 'CI'],
		iconPath: siModelcontextprotocol.path,
		color: '#32c8ff',
		iconAsset: '/icons/delendai.svg',
		href: 'https://github.com/CartagoGit/DelendAI',
	},
	{
		id: 'workflows',
		label: 'Tanit',
		metric: 'API',
		detail: 'Static API source discovery with exports for Postman, Bruno, Insomnia, HAR, OpenAPI and cURL.',
		status: 'Public repository · multi-format exports',
		stack: ['TypeScript', 'Static analysis', 'OpenAPI'],
		iconPath: siTypescript.path,
		color: '#ffc857',
		iconAsset: '/icons/projects/tanit.svg',
		href: 'https://github.com/CartagoGit/api-source-tanit',
	},
	{
		id: 'quality',
		label: 'QuickModel',
		metric: 'DX',
		detail: 'SOLID modelling, transformation and validation adapters with a deliberately exhaustive test surface.',
		status: 'Open source · tested library',
		stack: ['TypeScript', 'SOLID', 'Vitest'],
		iconPath: siTypescript.path,
		color: '#7c6cff',
		iconAsset: '/icons/quickmodel.png',
		href: 'https://github.com/CartagoGit/quickmodel',
	},
	{
		id: 'mobile',
		label: 'Keyer',
		metric: 'CLI',
		detail: 'A published TypeScript package for encrypting keys and environment files before delivery.',
		status: 'Published package · public CLI',
		stack: ['TypeScript', 'npm', 'CLI'],
		iconPath: siNpm.path,
		color: '#cb3837',
		iconAsset: '/icons/projects/keyer.svg',
		href: 'https://github.com/CartagoGit/Keyer',
	},
	{
		id: 'tooling',
		label: 'Print CV',
		metric: 'APP',
		detail: 'A bilingual, Zod-validated CV application with a print layout tuned for real paper.',
		status: 'Live demo · print-ready',
		stack: ['Vue', 'Zod', 'CSS print'],
		iconPath: siVuedotjs.path,
		color: '#42b883',
		iconAsset: '/icons/projects/print-cv.svg',
		href: 'https://cartagogit.github.io/print-cv/',
	},
	{
		id: 'delivery',
		label: 'Steam Keys',
		metric: 'APP',
		detail: 'A local-first Tauri and SQLite desktop manager with no cloud account or telemetry.',
		status: 'Desktop source · local-first',
		stack: ['Tauri 2', 'SQLite', 'Desktop'],
		iconPath: siElectron.path,
		color: '#5ea6ff',
		iconAsset: '/icons/projects/steam-keys.svg',
		href: 'https://github.com/CartagoGit/steam-keys',
	},
];

export const HERO_PANELS: readonly IHeroPanel[] = Object.freeze(
	[...HERO_PANEL_ITEMS].sort(
		(left, right) => projectPriority(left.label) - projectPriority(right.label)
	)
);

const TECHNOLOGY_ITEMS = [
	{ label: 'TypeScript', iconPath: siTypescript.path, color: '#3178c6' },
	{ label: 'Angular', iconPath: siAngular.path, color: '#ff2d95' },
	{ label: 'RxJS', iconPath: siReactivex.path, color: '#b7178c' },
	{ label: 'Ionic', iconPath: siIonic.path, color: '#3880ff' },
	{ label: 'Capacitor', iconPath: siCapacitor.path, color: '#119eff' },
	{
		label: 'Angular Material',
		iconPath: siMaterialdesign.path,
		color: '#757575',
	},
	{ label: 'Sass', iconPath: siSass.path, color: '#cc6699' },
	{ label: 'Bun', iconPath: siBun.path, color: '#f9f1e1' },
	{ label: 'Node.js', iconPath: siNodedotjs.path, color: '#339933' },
	{ label: 'NestJS', iconPath: siNestjs.path, color: '#e0234e' },
	{ label: 'npm', iconPath: siNpm.path, color: '#cb3837' },
	{ label: 'Docker', iconPath: siDocker.path, color: '#2496ed' },
	{ label: 'Git', iconPath: siGit.path, color: '#f05032' },
	{ label: 'GitLab CI', iconPath: siGitlab.path, color: '#fc6d26' },
	{ label: 'Vitest', iconPath: siVitest.path, color: '#6e9f18' },
	{ label: 'Jest', iconPath: siJest.path, color: '#c21325' },
	{
		label: 'GitHub Actions',
		iconPath: siGithubactions.path,
		color: '#2088ff',
	},
	{ label: 'Vue', iconPath: siVuedotjs.path, color: '#4fc08d' },
	{ label: 'React', iconPath: siReact.path, color: '#61dafb' },
	{ label: 'Electron', iconPath: siElectron.path, color: '#47848f' },
	{ label: 'Tailwind CSS', iconPath: siTailwindcss.path, color: '#06b6d4' },
	{ label: 'PrimeNG', iconPath: siPrimeng.path, color: '#dd0031' },
	{ label: 'Storybook', iconPath: siStorybook.path, color: '#ff4785' },
	{ label: 'Vite', iconPath: siVite.path, color: '#646cff' },
	{ label: 'Nx', iconPath: siNx.path, color: '#143055' },
	{ label: 'MongoDB', iconPath: siMongodb.path, color: '#47a248' },
	{ label: 'Mongoose', iconPath: siMongoose.path, color: '#880000' },
	{ label: 'Prisma', iconPath: siPrisma.path, color: '#2d3748' },
	{ label: 'Zod', iconPath: siZod.path, color: '#3e67b1' },
	{ label: 'Firebase', iconPath: siFirebase.path, color: '#dd2c00' },
	{ label: 'Linux', iconPath: siLinux.path, color: '#fcc624' },
	{ label: 'Kotlin', iconPath: siKotlin.path, color: '#7f52ff' },
	{ label: 'Claude', iconPath: siClaude.path, color: '#d97757' },
	{ label: 'MiniMax', iconPath: siMinimax.path, color: '#e8e8e8' },
	{ label: 'Grok', iconPath: siX.path, color: '#e8e8e8' },
	{ label: 'OpenCode', iconPath: siOpencode.path, color: '#e8e8e8' },
	{
		label: 'GitHub Copilot',
		iconPath: siGithubcopilot.path,
		color: '#ffffff',
	},
	{
		label: 'Model Context Protocol',
		iconPath: siModelcontextprotocol.path,
		color: '#ffffff',
	},
	{ label: 'ESLint', iconPath: siEslint.path, color: '#4b32c3' },
	{ label: 'Prettier', iconPath: siPrettier.path, color: '#f7b93e' },
	{ label: 'GitHub', iconPath: siGithub.path, color: '#ffffff' },
] as const satisfies ReadonlyArray<Omit<ITechnology, 'detail' | 'destinations'>>;

const TECHNOLOGY_DESCRIPTIONS: Readonly<
	Record<(typeof TECHNOLOGY_ITEMS)[number]['label'], string>
> = {
	Angular: 'Framework for typed standalone applications. It structures this portfolio, its lazy routes, SSR and signal-driven interaction state.',
	'Angular Material': 'Accessible component primitives for complex product screens. I use its design-system patterns for dense forms, tables and keyboard-ready controls.',
	Bun: 'Fast JavaScript runtime and package manager for TypeScript CLIs, tests and local scripts. It powers the portfolio and DelendAI validation workflows.',
	Capacitor: 'Bridge that packages web code as native Android/iOS applications. I use it when an operational web workflow also needs device APIs and store delivery.',
	Claude: 'Language-model assistant used in agentic development experiments and structured reviews. It is an external collaboration tool, not a portfolio runtime dependency.',
	Docker: 'Container packaging for reproducible environments and delivery. Public images and commands appear in the Docker catalogue to make setup repeatable.',
	Electron: 'Desktop shell for TypeScript interfaces that need OS APIs and local packaging. It represents a desktop delivery option alongside the newer Tauri work.',
	ESLint: 'Static-analysis engine for shared correctness rules. It prevents unsafe or inconsistent TypeScript and Angular patterns from reaching this codebase.',
	Firebase: 'Managed application services for authentication, storage and realtime data. I use it when a product needs a fast backend boundary without rebuilding those primitives.',
	Git: 'Distributed version control for traceable changes. It underpins the public project history, release workflow and direct collaboration model shown here.',
	GitHub: 'Source, issue, action and Pages platform for the public portfolio ecosystem. It is the primary evidence and publication surface for the projects displayed here.',
	'GitHub Actions': 'CI/CD automation for repeatable checks and deployments. This portfolio targets a gated preparation → tests → build → deploy workflow on Actions.',
	'GitHub Copilot': 'AI coding assistant used to implement, inspect and review this portfolio in an agent-aware workflow. It accelerates work without replacing typecheck, tests or review.',
	'GitLab CI': 'Pipeline runner for projects hosted outside GitHub. I use its jobs, rules and artifacts when a delivery pipeline belongs to a GitLab repository.',
	Grok: 'Research-oriented language-model service evaluated for code and product exploration. It remains an external tool rather than a browser dependency.',
	Ionic: 'Mobile UI components and navigation patterns for hybrid applications. It is used when the same operational workflow must work well on touch and Android.',
	Jest: 'JavaScript test runner with snapshots and mocks. I use it where an existing ecosystem expects Jest or where legacy behaviour needs regression coverage.',
	Kotlin: 'Typed JVM/Android language for native integrations and backend-adjacent work. It complements Ionic applications when platform code belongs outside TypeScript.',
	Linux: 'Primary development and deployment environment for the portfolio toolchain. It anchors shell automation, containers, permissions and reproducible builds.',
	MiniMax: 'Multimodal AI platform evaluated for text, image and media generation experiments. It is documented as an external creation tool, not bundled in the client.',
	'Model Context Protocol': 'Standard for exposing typed tools, resources and prompts to agents. DelendAI uses it to isolate capabilities and report public, structured errors.',
	MongoDB: 'Document database for product data with evolving schemas. It is useful when aggregate-shaped operational records benefit from flexible persistence.',
	Mongoose: 'Typed application layer over MongoDB for schemas, validation and persistence queries. It keeps Node services from scattering ad hoc document rules.',
	NestJS: 'Structured Node backend framework with modules, dependency injection and validation. It fits APIs that share typed contracts with Angular and MCP tooling.',
	'Node.js': 'JavaScript server runtime and API foundation. It hosts Angular SSR tooling and general package ecosystems where Bun is not the target runtime.',
	npm: 'Package registry and distribution client. Published tooling such as Keyer is consumed from npm, while project packages and docs remain centrally linked.',
	Nx: 'Monorepo orchestration with task graphs, caching and dependency boundaries. I use it when several applications and libraries need one explicit build system.',
	OpenCode: 'AI coding agent used to exercise repository workflows and compare agent behaviour. It is part of engineering experimentation, not shipped application code.',
	Prettier: 'Deterministic formatter for stable reviews and low-noise diffs. It keeps TypeScript, templates and configuration readable across contributors and agents.',
	PrimeNG: 'Angular component library for operational UIs such as tables, forms and overlays. It is useful when product delivery needs mature, themeable controls quickly.',
	Prisma: 'Typed database toolkit with schema-driven clients and migrations. It keeps data access and relational contracts explicit in TypeScript backend services.',
	React: 'Component library used for interface experiments and projects such as Steam Keys. Its role here is evidenced in public work rather than this Angular runtime.',
	RxJS: 'Observable stream model for cancellable, composable async work. Angular integrations and interactive data flows use it where event sequencing matters.',
	Sass: 'Structured CSS language with tokens, partials and reusable rules. It owns this portfolio’s visual layers, including responsive monitor and overlay contracts.',
	Storybook: 'Isolated component workbench for states, themes and accessibility checks. It supports reusable UI libraries without requiring a full application journey.',
	'Tailwind CSS': 'Utility-first CSS system for rapidly composed interfaces. I use it when project constraints favour tokenised utility composition over component SCSS ownership.',
	TypeScript: 'Typed JavaScript for frontend, backend and tooling contracts. It enforces the domain, renderer, proposal and component boundaries throughout this portfolio.',
	Vite: 'Fast frontend and library build tool with modern dev-server transforms. It supports the portfolio build toolchain and lightweight package development.',
	Vitest: 'Fast TypeScript unit and integration runner. It validates the portfolio components, data contracts and rendering boundaries with the current test suite.',
	Vue: 'Progressive component framework used by Print CV. Its composition API, Zod validation and print layout demonstrate a separate frontend delivery model.',
	Zod: 'Runtime schema validation that turns untrusted data into typed values. It protects form, CV and integration boundaries while TypeScript types serve compile time.',
};

export const TECHNOLOGY_MARQUEE: readonly ITechnology[] = Object.freeze(
	TECHNOLOGY_ITEMS.map((technology) => ({
		...technology,
		detail: TECHNOLOGY_DESCRIPTIONS[technology.label],
	})).sort((left, right) =>
		left.label.localeCompare(right.label, 'en', { sensitivity: 'base' })
	)
);

export const LANGUAGES: readonly ILanguageOption[] = [
	{ id: 'en', label: 'English', detail: 'US + UK', flag: '🇺🇸' },
	{ id: 'es', label: 'Español', detail: 'España', flag: '🇪🇸' },
];

/**
 * Default capability row used when the active signal doesn't match any
 * declared capability. Keeps the selected-card chrome stable while the
 * user navigates between capabilities; values render as muted
 * placeholders rather than 'undefined'.
 */
export const FALLBACK_CAPABILITY: ICapability = {
	id: 'product',
	eyebrow: '',
	title: '',
	detail: '',
	tools: [],
	proof: '',
};

export const CAPABILITIES: readonly ICapability[] = [
	{
		id: 'product',
		eyebrow: '01 / Product interfaces',
		title: 'Operational by design.',
		detail: 'Interfaces for people who use them all day: dense information, clear next actions and graceful empty states.',
		tools: ['Angular', 'SCSS', 'Responsive UI'],
		proof: 'Workflow interfaces · complex forms · interaction design',
	},
	{
		id: 'architecture',
		eyebrow: '02 / Angular architecture',
		title: 'Explicitly reactive.',
		detail: 'Standalone components, signals and typed boundaries make state changes understandable, testable and fast.',
		tools: ['Angular 22', 'Signals', 'Zoneless'],
		proof: 'Zoneless Calculator · production Angular patterns',
	},
	{
		id: 'mobile',
		eyebrow: '03 / Mobile delivery',
		title: 'One product, more surfaces.',
		detail: 'Web workflows designed for touch, constrained space and release-ready Android delivery — not simply shrunk desktop screens.',
		tools: ['Ionic', 'Capacitor', 'Android'],
		proof: 'Web + Android operational delivery',
	},
	{
		id: 'quality',
		eyebrow: '04 / Testing & quality',
		title: 'Confidence is a feature.',
		detail: 'A focused testing pyramid, semantic HTML and performance budgets keep product work reliable as it grows.',
		tools: ['Vitest', 'Accessibility', 'Performance'],
		proof: 'Unit → integration → dependable releases',
	},
	{
		id: 'systems',
		eyebrow: '05 / Design systems',
		title: 'Consistent, not repetitive.',
		detail: 'Flexible primitives turn a visual language into reusable, accessible interfaces without flattening every screen into a template.',
		tools: ['Tokens', 'CDK', 'Storybook'],
		proof: 'Reusable UI patterns · states · responsive rules',
	},
	{
		id: 'tooling',
		eyebrow: '06 / Developer tooling',
		title: 'The frontend has an engine room.',
		detail: 'Typed contracts, CLIs and MCP tooling turn repeated engineering work into dependable workflows for teams and agents.',
		tools: ['TypeScript', 'MCP', 'Docker'],
		proof: 'DelendAI · QuickModel · Keyer',
	},
];

export const PLAYGROUND_STEPS: readonly IPlaygroundStepDefinition[] = [
	{
		id: 'discover',
		label: 'Discover',
		hint: 'Understand the person and the workflow.',
	},
	{
		id: 'model',
		label: 'Model',
		hint: 'Make state and constraints explicit.',
	},
	{
		id: 'build',
		label: 'Build',
		hint: 'Compose a useful, responsive interface.',
	},
	{
		id: 'verify',
		label: 'Verify',
		hint: 'Test the journey before shipping.',
	},
];

/**
 * Canonical product-workflow order. The lab page renders the playground as a
 * drag-and-drop list whose shipping-ready state is this exact sequence;
 * keeping a single source here makes `lab.page.component.ts` declarative.
 */
export const PLAYGROUND_ORDER: readonly IPlaygroundStep[] = [
	'build',
	'discover',
	'verify',
	'model',
];
/**
 * Default telemetry row used when the active signal doesn't match any
 * declared panel. Empty strings keep the dashboard chrome stable while
 * the user navigates between perspectives; values render as muted
 * placeholders rather than 'undefined'.
 */
export const FALLBACK_TELEMETRY: ITelemetry = {
	id: 'product',
	label: '',
	title: '',
	value: '',
	valueLabel: '',
	kpis: [],
	bars: [],
	note: '',
};

/**
 * Default playground step definition, returned when a step id is no
 * longer in the registered steps list. Keeps the rendered card from
 * crashing if the order array references an unknown id.
 */
export const FALLBACK_PLAYGROUND_STEP: IPlaygroundStepDefinition = {
	id: 'discover',
	label: '',
	hint: '',
};
export const TELEMETRY: readonly ITelemetry[] = [
	{
		id: 'product',
		label: 'Product signal',
		title: 'A dashboard should reveal a decision.',
		value: '98%',
		valueLabel: 'workflow clarity',
		kpis: [
			['12', 'active patterns'],
			['4.2h', 'saved per flow'],
			['3', 'surfaces'],
		],
		bars: [34, 46, 42, 68, 61, 78, 88, 96],
		note: 'Signals are grouped by workflow, not by a vanity metric.',
	},
	{
		id: 'quality',
		label: 'Quality signal',
		title: 'Quality is a visible operating metric.',
		value: '94%',
		valueLabel: 'critical flow coverage',
		kpis: [
			['0', 'blocking a11y issues'],
			['18', 'checked states'],
			['1.8s', 'interaction budget'],
		],
		bars: [55, 58, 71, 67, 79, 85, 89, 94],
		note: 'Testing, semantics and performance share the same delivery conversation.',
	},
	{
		id: 'delivery',
		label: 'Delivery signal',
		title: 'One interface, more than one surface.',
		value: '2×',
		valueLabel: 'web + Android delivery',
		kpis: [
			['7', 'release checkpoints'],
			['3', 'deployment paths'],
			['99.9%', 'workflow availability'],
		],
		bars: [30, 38, 58, 55, 72, 69, 84, 91],
		note: 'Responsive product work considers the next device before it becomes a rewrite.',
	},
];

/** Interactive demos rendered as cards on the /demos page. */
export const DEMOS: readonly IDemo[] = [
	{
		number: '01',
		title: 'DeathBlitz',
		summaryKey: 'pages.demos.summaryDeathBlitz',
		url: 'https://deathblitz.netlify.app/',
	},
	{
		number: '02',
		title: 'Tetris',
		summaryKey: 'pages.demos.summaryTetris',
		url: 'https://cartago-tetris.netlify.app/',
	},
	{
		number: '03',
		title: 'Snake',
		summaryKey: 'pages.demos.summarySnake',
		url: 'https://cartago-snake.netlify.app/',
	},
	{
		number: '04',
		title: 'Minesweeper',
		summaryKey: 'pages.demos.summaryMinesweeper',
		url: 'https://cartago-minesweeper.netlify.app/',
	},
	{
		number: '05',
		title: 'Print CV',
		summaryKey: 'pages.demos.summaryPrintCv',
		url: 'https://cartagogit.github.io/print-cv/',
	},
] as const;
