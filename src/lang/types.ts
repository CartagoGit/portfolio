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
			backToTop: string;
		};
		commandPalette: {
			title: string;
			close: string;
			searchLabel: string;
			searchPlaceholder: string;
			cmdViewWork: string;
			cmdLab: string;
			cmdContact: string;
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
			mcpBullets: string;
			quickmodelNumber: string;
			quickmodelTitle: string;
			quickmodelDescription: string;
			quickmodelBullets: string;
			keyerNumber: string;
			keyerTitle: string;
			keyerDescription: string;
			keyerBullets: string;
			alsoPinnedHeading: string;
			printCv: string;
			printCvDetail: string;
			zoneless: string;
			zonelessDetail: string;
			nestgpt: string;
			nestgptDetail: string;
			viewOnNpm: string;
			directoryEyebrow: string;
			directoryTitleLead: string;
			directoryTitleEmphasis: string;
			directoryTitleTail: string;
			directorySubtitle: string;
			directoryCodeLabel: string;
			directoryCodeTitle: string;
			directoryCodeDetail: string;
			directoryShipLabel: string;
			directoryShipTitle: string;
			directoryShipDetail: string;
			directoryDemoLabel: string;
			directoryDemoTitle: string;
			directoryDemoDetail: string;
			directoryPlayLabel: string;
			directoryPlayTitle: string;
			directoryPlayDetail: string;
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
			chartPickerGroup: string;
			metricPickerGroup: string;
			commandPalette: string;
			visualiseAs: string;
			weekTrend: string;
			liveBadge: string;
			weekStart: string;
			weekEnd: string;
			completedCount: string;
			completedCountSingular: string;
			resetButton: string;
			motionNote: string;
			motionNoteCode: string;
			playgroundCompleteMessage: string;
			playgroundIncompleteMessage: string;
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
			experienceEyebrow: string;
			experienceTitleLead: string;
			experienceTitleEmphasis: string;
			experienceTitleTail: string;
			experienceDetail: string;
			experienceBullets: string;
		};
		knowledge: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			tileFrontendLabel: string;
			tileFrontendStack: string;
			tileFrontendDetail: string;
			tileMobileLabel: string;
			tileMobileStack: string;
			tileMobileDetail: string;
			tileQualityLabel: string;
			tileQualityStack: string;
			tileQualityDetail: string;
			tileToolingLabel: string;
			tileToolingStack: string;
			tileToolingDetail: string;
			tileSystemsLabel: string;
			tileSystemsStack: string;
			tileSystemsDetail: string;
			tileBackendLabel: string;
			tileBackendStack: string;
			tileBackendDetail: string;
		};
		docker: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			terminalHeading: string;
			terminalPull: string;
			terminalStatus: string;
			terminalOpen: string;
			terminalAngular: string;
			terminalNode: string;
			terminalDelivery: string;
		};
		demos: {
			eyebrow: string;
			titleLead: string;
			titleEmphasis: string;
			titleTail: string;
			subtitle: string;
			deprecatedNotice: string;
			openDemo: string;
			gameEyebrow: string;
			gameHeading: string;
			gameDetail: string;
			gameSignalsLabel: string;
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
			ctaDockerHub: string;
			formAria: string;
			formEmailLabel: string;
			formEmailPlaceholder: string;
			formMessageLabel: string;
			formMessagePlaceholder: string;
			formSubmit: string;
			formFeedback: string;
		};
	};
	seo: {
		description: string;
	};
	lang: {
		languagesLabel: string;
		themeMenuLabel: string;
		languages: {
			en: { label: string; detail: string };
			es: { label: string; detail: string };
		};
		themes: {
			dark: { label: string; detail: string };
			light: { label: string; detail: string };
			midnight: { label: string; detail: string };
			ocean: { label: string; detail: string };
			forest: { label: string; detail: string };
			sunset: { label: string; detail: string };
			solar: { label: string; detail: string };
			mono: { label: string; detail: string };
		};
	};
}
