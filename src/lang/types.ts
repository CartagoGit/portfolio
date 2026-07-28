/**
 * Type contracts for the portfolio translation map.
 *
 * Each language file exports an object whose shape MUST satisfy
 * `ITranslationMap`. The `as const satisfies ITranslationMap` idiom
 * keeps literal types narrow while still letting the compiler reject
 * missing keys across locales.
 *
 * Interpolation uses `{name}` placeholders, e.g.
 * `"say-hi": "Hello, {name}!"`. The translate pipe accepts an
 * `args` record and substitutes placeholders before returning the
 * string.
 */
export interface ITranslationMap {
	chrome: {
		header: {
			brand: string;
			navWork: string;
			navLab: string;
			navAbout: string;
			navKnowledge: string;
			navDocker: string;
			navDemos: string;
			navContact: string;
			themeAriaLabel: string;
			themeOpenLabel: string;
		};
		footer: {
			tagline: string;
			availability: string;
			connectLabel: string;
			rights: string;
		};
	};
	pages: {
		home: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			role: string;
			intro: string;
			ctaWork: string;
			ctaContact: string;
			capabilitiesTitle: string;
			playgroundTitle: string;
			telemetryTitle: string;
			panelOverviewLabel: string;
			panelOverviewMetric: string;
			panelOverviewDetail: string;
			panelWorkflowsLabel: string;
			panelWorkflowsMetric: string;
			panelWorkflowsDetail: string;
			panelQualityLabel: string;
			panelQualityMetric: string;
			panelQualityDetail: string;
			panelMobileLabel: string;
			panelMobileMetric: string;
			panelMobileDetail: string;
			panelToolingLabel: string;
			panelToolingMetric: string;
			panelToolingDetail: string;
			panelDeliveryLabel: string;
			panelDeliveryMetric: string;
			panelDeliveryDetail: string;
			telemetryProductLabel: string;
			telemetryProductTitle: string;
			telemetryProductValueLabel: string;
			telemetryProductNote: string;
			telemetryQualityLabel: string;
			telemetryQualityTitle: string;
			telemetryQualityValueLabel: string;
			telemetryQualityNote: string;
			telemetryDeliveryLabel: string;
			telemetryDeliveryTitle: string;
			telemetryDeliveryValueLabel: string;
			telemetryDeliveryNote: string;
		};
		work: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			pinnedLabel: string;
			exploreRepo: string;
			mcpNumber: string;
			mcpTitle: string;
			mcpDescription: string;
			mcpBullets: readonly string[];
			quickmodelNumber: string;
			quickmodelTitle: string;
			quickmodelDescription: string;
			quickmodelBullets: readonly string[];
			keyerNumber: string;
			keyerTitle: string;
			keyerDescription: string;
			keyerBullets: readonly string[];
		};
		lab: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			playgroundHeading: string;
			playgroundDescription: string;
			playgroundReady: string;
			playgroundReset: string;
			playgroundDispatch: string;
			stepDiscoverLabel: string;
			stepDiscoverHint: string;
			stepModelLabel: string;
			stepModelHint: string;
			stepBuildLabel: string;
			stepBuildHint: string;
			stepVerifyLabel: string;
			stepVerifyHint: string;
			demosHeading: string;
		};
		approach: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			capabilityProductEyebrow: string;
			capabilityProductTitle: string;
			capabilityProductDetail: string;
			capabilityProductProof: string;
			capabilityArchitectureEyebrow: string;
			capabilityArchitectureTitle: string;
			capabilityArchitectureDetail: string;
			capabilityArchitectureProof: string;
			capabilityMobileEyebrow: string;
			capabilityMobileTitle: string;
			capabilityMobileDetail: string;
			capabilityMobileProof: string;
			capabilityQualityEyebrow: string;
			capabilityQualityTitle: string;
			capabilityQualityDetail: string;
			capabilityQualityProof: string;
			capabilitySystemsEyebrow: string;
			capabilitySystemsTitle: string;
			capabilitySystemsDetail: string;
			capabilitySystemsProof: string;
			capabilityToolingEyebrow: string;
			capabilityToolingTitle: string;
			capabilityToolingDetail: string;
			capabilityToolingProof: string;
		};
		knowledge: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
		};
		docker: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
		};
		demos: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			deprecatedNotice: string;
		};
		contact: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			ctaEmail: string;
			ctaLinkedin: string;
			ctaGithub: string;
		};
	};
	seo: {
		description: string;
	};
	lang: {
		languagesLabel: string;
		themeMenuLabel: string;
	};
}
