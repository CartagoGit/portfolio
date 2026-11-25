import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

export const LAB_FULLSCREEN_EVIDENCE_KINDS = [
	'workflow',
	'motion',
	'accessibility',
	'concurrency',
	'responsive',
	'data',
	'state-machine',
] as const;

export type ILabFullscreenEvidenceKind = typeof LAB_FULLSCREEN_EVIDENCE_KINDS[number];

interface ILabFullscreenEvidenceSample {
	readonly id: string;
	readonly label?: string;
	readonly labelKey?: string;
	readonly detailKey?: string;
	readonly value: string;
	readonly level: number;
}

interface ILabFullscreenEvidenceDefinition {
	readonly eyebrowKey: string;
	readonly titleKey: string;
	readonly samples: readonly ILabFullscreenEvidenceSample[];
}

const LAB_FULLSCREEN_EVIDENCE: Readonly<
	Record<ILabFullscreenEvidenceKind, ILabFullscreenEvidenceDefinition>
> = {
	workflow: {
		eyebrowKey: 'pages.lab.workflowEyebrow',
		titleKey: 'pages.lab.playgroundHeading',
		samples: [
			{ id: 'discover', labelKey: 'pages.lab.stepDiscoverLabel', detailKey: 'pages.lab.stepDiscoverHint', value: '01', level: 25 },
			{ id: 'model', labelKey: 'pages.lab.stepModelLabel', detailKey: 'pages.lab.stepModelHint', value: '02', level: 50 },
			{ id: 'build', labelKey: 'pages.lab.stepBuildLabel', detailKey: 'pages.lab.stepBuildHint', value: '03', level: 75 },
			{ id: 'verify', labelKey: 'pages.lab.stepVerifyLabel', detailKey: 'pages.lab.stepVerifyHint', value: '04', level: 100 },
		],
	},
	motion: {
		eyebrowKey: 'pages.lab.motionEyebrow',
		titleKey: 'pages.lab.motionTitle',
		samples: [
			{ id: 'standard', labelKey: 'pages.lab.easingStandard', detailKey: 'pages.lab.durationLabel', value: '650 ms · cubic-bezier(.2,.8,.2,1)', level: 58 },
			{ id: 'spring', labelKey: 'pages.lab.easingSpring', detailKey: 'pages.lab.durationLabel', value: '900 ms · cubic-bezier(.2,1.4,.4,1)', level: 82 },
			{ id: 'linear', labelKey: 'pages.lab.easingLinear', detailKey: 'pages.lab.durationLabel', value: '350 ms · linear', level: 100 },
		],
	},
	accessibility: {
		eyebrowKey: 'pages.lab.a11yEyebrow',
		titleKey: 'pages.lab.a11yTitle',
		samples: [
			{ id: 'contrast', labelKey: 'pages.lab.highContrast', value: 'contrast ≥ 7:1 · WCAG AAA', level: 100 },
			{ id: 'focus', labelKey: 'pages.lab.showFocus', value: '3px · :focus-visible', level: 72 },
			{ id: 'validation', labelKey: 'pages.lab.formPreviewTest', detailKey: 'pages.lab.formPreviewError', value: 'aria-invalid · aria-describedby', level: 88 },
		],
	},
	concurrency: {
		eyebrowKey: 'pages.lab.concurrencyEyebrow',
		titleKey: 'pages.lab.concurrencyTitle',
		samples: [
			{ id: 'data', labelKey: 'pages.lab.concurrentData', detailKey: 'pages.lab.taskRunning', value: '600 ms · lane A', level: 38 },
			{ id: 'assets', labelKey: 'pages.lab.concurrentAssets', detailKey: 'pages.lab.taskRunning', value: '1100 ms · lane B', level: 68 },
			{ id: 'checks', labelKey: 'pages.lab.concurrentChecks', detailKey: 'pages.lab.taskRunning', value: '1600 ms · lane C', level: 100 },
		],
	},
	responsive: {
		eyebrowKey: 'pages.lab.layoutEyebrow',
		titleKey: 'pages.lab.layoutTitle',
		samples: [
			{ id: 'one-column', labelKey: 'pages.lab.layoutColumns', value: 'repeat(1, minmax(0, 1fr))', level: 34 },
			{ id: 'two-columns', labelKey: 'pages.lab.layoutColumns', value: 'repeat(2, minmax(0, 1fr))', level: 67 },
			{ id: 'four-columns', labelKey: 'pages.lab.layoutCompact', value: 'repeat(4, minmax(0, 1fr))', level: 100 },
		],
	},
	data: {
		eyebrowKey: 'pages.lab.dataEyebrow',
		titleKey: 'pages.lab.dataTitle',
		samples: [
			{ id: 'C-02', label: 'C-02', detailKey: 'pages.lab.dataReady', value: '97 · 31 ms', level: 97 },
			{ id: 'A-01', label: 'A-01', detailKey: 'pages.lab.dataReady', value: '94 · 38 ms', level: 94 },
			{ id: 'B-01', label: 'B-01', detailKey: 'pages.lab.dataReview', value: '62 · 91 ms', level: 62 },
		],
	},
	'state-machine': {
		eyebrowKey: 'pages.lab.stateEyebrow',
		titleKey: 'pages.lab.stateTitle',
		samples: [
			{ id: 'idle', labelKey: 'pages.lab.stateIdle', detailKey: 'pages.lab.stateIdleMessage', value: 'idle', level: 24 },
			{ id: 'running', labelKey: 'pages.lab.stateRunning', detailKey: 'pages.lab.stateRunningMessage', value: 'running', level: 52 },
			{ id: 'success', labelKey: 'pages.lab.stateSuccess', detailKey: 'pages.lab.stateSuccessMessage', value: 'success', level: 100 },
			{ id: 'error', labelKey: 'pages.lab.stateError', detailKey: 'pages.lab.stateErrorMessage', value: 'error', level: 38 },
		],
	},
};

@Component({
	selector: 'app-lab-fullscreen-evidence',
	imports: [TranslatePipe],
	templateUrl: './lab-fullscreen-evidence.component.html',
	styleUrl: './lab-fullscreen-evidence.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: { '[attr.data-evidence-kind]': 'kind()' },
})
export class LabFullscreenEvidenceComponent {
	readonly kind = input.required<ILabFullscreenEvidenceKind>();
	readonly evidence = computed(() => LAB_FULLSCREEN_EVIDENCE[this.kind()]);
}
