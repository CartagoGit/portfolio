import type { ITranslationMap } from './types';

/**
 * English source of truth for the portfolio's UI copy.
 *
 * Every other locale file MUST satisfy the same `ITranslationMap`
 * shape; missing keys fail `tsc --noEmit`. The build pipeline relies
 * on this guarantee so the runtime can fall back to English for any
 * missing path without crashing.
 */
export const en: ITranslationMap = {
	chrome: {
		header: {
			brand: 'Cartago',
			navWork: 'Selected work',
			navLab: 'Frontend lab',
			navAbout: 'Approach',
			navKnowledge: 'Knowledge',
			navDocker: 'Docker',
			navDemos: 'Demos',
			navContact: 'Contact',
			themeAriaLabel: 'Toggle colour theme',
			themeOpenLabel: 'Open theme menu',
		},
		footer: {
			tagline: 'Cartago — Frontend product engineer.',
			availability: 'Available for thoughtful product work',
			connectLabel: 'Connect',
			rights: 'All rights reserved.',
		},
	},
	pages: {
		home: {
			eyebrow: 'Frontend product engineer',
			titleLead: 'Operational frontend for',
			titleEmphasis: 'product teams',
			titleTail: 'who ship every day.',
			subtitle:
				'Angular, TypeScript and mobile delivery, organised around workflows rather than vanity metrics.',
			role: 'Frontend engineer building operational web and mobile products.',
			intro: 'I combine product-focused frontend development with TypeScript architecture, testing and developer tooling.',
			ctaWork: 'View work',
			ctaContact: 'Start a conversation',
			capabilitiesTitle: 'Capabilities',
			playgroundTitle: 'Playground',
			telemetryTitle: 'Telemetry',
			panelOverviewLabel: 'Angular',
			panelOverviewMetric: 'UI',
			panelOverviewDetail:
				'Framework for structured, reactive web products with SSR and signals.',
			panelWorkflowsLabel: 'TypeScript',
			panelWorkflowsMetric: 'TS',
			panelWorkflowsDetail:
				'Typed contracts for interfaces, libraries and developer tooling.',
			panelQualityLabel: 'Vitest',
			panelQualityMetric: 'VT',
			panelQualityDetail:
				'Fast unit and integration testing that keeps frontend behaviour dependable.',
			panelMobileLabel: 'Ionic + Capacitor',
			panelMobileMetric: 'MOB',
			panelMobileDetail:
				'A shared product system delivered to web and native mobile surfaces.',
			panelToolingLabel: 'Bun',
			panelToolingMetric: 'BUN',
			panelToolingDetail:
				'A fast JavaScript runtime and toolkit used to keep local feedback loops short.',
			panelDeliveryLabel: 'Docker',
			panelDeliveryMetric: 'CTR',
			panelDeliveryDetail:
				'Containerised delivery for reproducible environments and public image distribution.',
			telemetryProductLabel: 'Product signal',
			telemetryProductTitle: 'A dashboard should reveal a decision.',
			telemetryProductValueLabel: 'workflow clarity',
			telemetryProductNote:
				'Signals are grouped by workflow, not by a vanity metric.',
			telemetryQualityLabel: 'Quality signal',
			telemetryQualityTitle: 'Quality is a visible operating metric.',
			telemetryQualityValueLabel: 'critical flow coverage',
			telemetryQualityNote:
				'Testing, semantics and performance share the same delivery conversation.',
			telemetryDeliveryLabel: 'Delivery signal',
			telemetryDeliveryTitle: 'One interface, more than one surface.',
			telemetryDeliveryValueLabel: 'web + Android delivery',
			telemetryDeliveryNote:
				'Responsive product work considers the next device before it becomes a rewrite.',
		},
		work: {
			eyebrow: '01 / Selected work',
			titleLead: 'Pinned work, not',
			titleEmphasis: 'filler examples.',
			titleTail: '',
			subtitle:
				'Open-source projects that best represent the technical focus.',
			pinnedLabel: 'Pinned project',
			exploreRepo: 'Explore repository',
			mcpNumber: '01 — Agent infrastructure',
			mcpTitle: 'MCP Vertex',
			mcpDescription:
				'An extensible MCP server core and plugin system for structured, repeatable agent workflows.',
			mcpBullets: 'Typed contracts|Plugin architecture|CLI tooling',
			quickmodelNumber: '02 — TypeScript architecture',
			quickmodelTitle: 'QuickModel',
			quickmodelDescription:
				'A TypeScript modelling and serialization library focused on explicit contracts and dependable data boundaries.',
			quickmodelBullets:
				'Type-safe models|Serialization|Developer experience',
			keyerNumber: '03 — Developer tooling',
			keyerTitle: 'Keyer',
			keyerDescription:
				'A published TypeScript CLI and library for managing secrets and configuration workflows with a cleaner developer experience.',
			keyerBullets: 'CLI design|Node.js tooling|Published package',
		},
		lab: {
			eyebrow: '02 / Frontend lab',
			titleLead: 'A lab for',
			titleEmphasis: 'interactive surfaces',
			titleTail: 'worth shipping.',
			subtitle:
				'Drag-and-drop a workflow, watch it light up, and inspect the underlying state.',
			playgroundHeading: 'Playground',
			playgroundDescription:
				'Order the four phases of a healthy product workflow. Re-arrange them and watch the readiness meter react.',
			playgroundReady: 'Workflow ready',
			playgroundReset: 'Reset order',
			playgroundDispatch: 'Dispatch',
			stepDiscoverLabel: 'Discover',
			stepDiscoverHint: 'Understand the person and the workflow.',
			stepModelLabel: 'Model',
			stepModelHint: 'Make state and constraints explicit.',
			stepBuildLabel: 'Build',
			stepBuildHint: 'Compose a useful, responsive interface.',
			stepVerifyLabel: 'Verify',
			stepVerifyHint: 'Test the journey before shipping.',
			demosHeading: 'Interactive demos',
		},
		approach: {
			eyebrow: '03 / Approach',
			titleLead: 'Capabilities wired to',
			titleEmphasis: 'real workflows.',
			titleTail: '',
			subtitle:
				'Six operating capabilities, each one anchored in shipped product work rather than abstract ambition.',
			capabilityProductEyebrow: '01 / Product interfaces',
			capabilityProductTitle: 'Operational by design.',
			capabilityProductDetail:
				'Interfaces for people who use them all day: dense information, clear next actions and graceful empty states.',
			capabilityProductProof:
				'Workflow interfaces · complex forms · interaction design',
			capabilityArchitectureEyebrow: '02 / Angular architecture',
			capabilityArchitectureTitle: 'Explicitly reactive.',
			capabilityArchitectureDetail:
				'Standalone components, signals and typed boundaries make state changes understandable, testable and fast.',
			capabilityArchitectureProof:
				'Zoneless Calculator · production Angular patterns',
			capabilityMobileEyebrow: '03 / Mobile delivery',
			capabilityMobileTitle: 'One product, more surfaces.',
			capabilityMobileDetail:
				'Web workflows designed for touch, constrained space and release-ready Android delivery — not simply shrunk desktop screens.',
			capabilityMobileProof: 'Web + Android operational delivery',
			capabilityQualityEyebrow: '04 / Testing & quality',
			capabilityQualityTitle: 'Confidence is a feature.',
			capabilityQualityDetail:
				'A focused testing pyramid, semantic HTML and performance budgets keep product work reliable as it grows.',
			capabilityQualityProof: 'Unit → integration → dependable releases',
			capabilitySystemsEyebrow: '05 / Design systems',
			capabilitySystemsTitle: 'Consistent, not repetitive.',
			capabilitySystemsDetail:
				'Flexible primitives turn a visual language into reusable, accessible interfaces without flattening every screen into a template.',
			capabilitySystemsProof:
				'Reusable UI patterns · states · responsive rules',
			capabilityToolingEyebrow: '06 / Developer tooling',
			capabilityToolingTitle: 'The frontend has an engine room.',
			capabilityToolingDetail:
				'Typed contracts, CLIs and MCP tooling turn repeated engineering work into dependable workflows for teams and agents.',
			capabilityToolingProof: 'MCP Vertex · QuickModel · Keyer',
		},
		knowledge: {
			eyebrow: '04 / Knowledge',
			titleLead: 'Notes, talks, and',
			titleEmphasis: 'open references.',
			titleTail: '',
			subtitle:
				'Knowledge surfaced as searchable artefacts rather than transient blog posts.',
		},
		docker: {
			eyebrow: '05 / Docker',
			titleLead: 'Reproducible',
			titleEmphasis: 'delivery surfaces.',
			titleTail: '',
			subtitle:
				'Container images that hold product and tooling environments together across machines.',
		},
		demos: {
			eyebrow: '06 / Demos',
			titleLead: 'Small experiments,',
			titleEmphasis: 'shipped for real.',
			titleTail: '',
			subtitle:
				'Each demo is a self-contained interface designed to be poked at — keyboard, mouse, or touch.',
			deprecatedNotice:
				'Some demos below are older Netlify builds; they remain linked as long as the originals are reachable.',
		},
		contact: {
			eyebrow: '07 / Contact',
			titleLead: 'Start a',
			titleEmphasis: 'thoughtful conversation.',
			titleTail: '',
			subtitle:
				'Pick the channel that fits the question. Short briefs are welcome; long ones even more so.',
			ctaEmail: 'Email',
			ctaLinkedin: 'LinkedIn',
			ctaGithub: 'GitHub',
		},
	},
	seo: {
		description:
			"Mario Cabrero Volarich's portfolio: product frontend, Angular, TypeScript, mobile delivery and developer tooling.",
	},
	lang: {
		languagesLabel: 'Languages',
		themeMenuLabel: 'Themes',
	},
};
