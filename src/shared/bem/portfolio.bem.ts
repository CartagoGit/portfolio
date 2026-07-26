/**
 * Block / Element / Modifier names for the portfolio pages.
 *
 * Keeping the strings in one place stops SCSS classes and TS selectors from
 * drifting apart. Every block below has its BEM root and the descendants
 * actually referenced in either the template or the SCSS partial. When the
 * designer renames a block the only place to update is this file (plus the
 * SCSS partial that owns the block).
 */

export const PORTFOLIO = {
	block: 'portfolio',
	modifiers: {
		lightMode: 'portfolio--light-mode',
	},
	elements: {
		routeStage: 'portfolio__route-stage',
		skipLink: 'portfolio__skip-link',
		hero: 'portfolio__hero',
		heroComposition: 'portfolio__hero-composition',
		heroOrb: 'portfolio__hero-orb',
		heroOrbOne: 'portfolio__hero-orb--one',
		heroOrbTwo: 'portfolio__hero-orb--two',
		heroBanner: 'portfolio__hero-banner',
		heroSocials: 'portfolio__hero-socials',
		heroNote: 'portfolio__hero-note',
		proofStrip: 'portfolio__proof-strip',
		exploreBanner: 'portfolio__explore-banner',
		exploreBannerAction: 'portfolio__explore-banner__action',
		homeDirectory: 'portfolio__home-directory',
		directoryGrid: 'portfolio__directory-grid',
		section: 'portfolio__section',
		sectionHeading: 'portfolio__section-heading',
		caseGrid: 'portfolio__case-grid',
		caseCard: 'portfolio__case-card',
		caseOverlay: 'portfolio__case-card__overlay',
		caseContent: 'portfolio__case-card__content',
		caseLabel: 'portfolio__case-card__label',
		caseNumber: 'portfolio__case-card__number',
		caseLink: 'portfolio__case-card__link',
		mcpVisual: 'portfolio__case-card__mcp-visual',
		secondaryWork: 'portfolio__secondary-work',
		capabilities: 'portfolio__capabilities',
		capabilityLayout: 'portfolio__capability-layout',
		capabilityTabs: 'portfolio__capability-tabs',
		capabilityDetail: 'portfolio__capability-detail',
		toolPills: 'portfolio__tool-pills',
		pulse: 'portfolio__pulse',
		operational: 'portfolio__operational',
		operationalCopy: 'portfolio__operational-copy',
		contact: 'portfolio__contact',
		contactImage: 'portfolio__contact-image',
		contactCopy: 'portfolio__contact-copy',
		contactLinks: 'portfolio__contact-links',
		formFeedback: 'portfolio__form-feedback',
		siteFooter: 'portfolio__site-footer',
		footerLinks: 'portfolio__footer-links',
		knowledgeGrid: 'portfolio__knowledge-grid',
		dockerTerminal: 'portfolio__docker-terminal',
		demoLinks: 'portfolio__demo-links',
		neonGame: 'portfolio__neon-game',
		neonGrid: 'portfolio__neon-grid',
		publicDirectory: 'portfolio__public-directory',
		monitor: 'portfolio__monitor',
		monitorChrome: 'portfolio__monitor__chrome',
		monitorHeader: 'portfolio__monitor__header',
		monitorSelector: 'portfolio__monitor__selector',
		monitorCanvas: 'portfolio__monitor__canvas',
	},
} as const;

export const INTERFACE = {
	block: 'interface',
	elements: {
		shell: 'interface-shell',
		topbar: 'interface-topbar',
		body: 'interface-body',
		sidebar: 'interface-sidebar',
		canvas: 'interface-canvas',
		heading: 'interface-heading',
		cards: 'interface-cards',
		chart: 'interface-chart',
		switcher: 'interface-switcher',
		description: 'interface-description',
		caption: 'interface-caption',
		banner: 'interface-banner',
		layerList: 'interface-layer-list',
		panel: 'interface-panel',
	},
} as const;

export const TELEM = {
	block: 'telemetry',
	elements: {
		dashboard: 'telemetry-dashboard',
		summary: 'telemetry-summary',
		chart: 'telemetry-chart',
		bars: 'telemetry-bars',
		kpis: 'telemetry-kpis',
	},
} as const;

export const LAB = {
	block: 'lab',
	elements: {
		root: 'lab',
		toolbar: 'lab-toolbar',
		grid: 'lab-grid',
		card: 'lab-card',
		cardHead: 'lab-card__head',
		miniTable: 'lab__mini-table',
		tableSearch: 'lab__table-search',
		tableRow: 'lab__table-row',
		tableHead: 'lab__table-head',
		ready: 'lab__ready',
		review: 'lab__review',
		fakeCommand: 'lab__fake-command',
		commandOptions: 'lab__command-options',
		commandButton: 'lab__command-button',
		signalDemo: 'lab__signal-demo',
		signalNode: 'lab__signal-node',
		motionNote: 'lab__motion-note',
	},
} as const;

export const PLAYGROUND = {
	block: 'playground',
	elements: {
		root: 'playground',
		copy: 'playground-copy',
		status: 'playground-status',
		board: 'playground-board',
		track: 'playground-track',
		steps: 'playground-steps',
	},
} as const;

export const COMMAND_DIALOG = {
	block: 'command-dialog',
	elements: {
		backdrop: 'command-dialog-backdrop',
		dialog: 'command-dialog',
	},
} as const;

export const PORTFOLIO_BEM = {
	PORTFOLIO,
	INTERFACE,
	TELEM,
	LAB,
	PLAYGROUND,
	COMMAND_DIALOG,
} as const;

export type IPortfolioBem = typeof PORTFOLIO_BEM;
