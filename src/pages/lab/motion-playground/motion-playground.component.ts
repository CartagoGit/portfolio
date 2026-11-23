import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IMotionEasing = 'standard' | 'spring' | 'linear';

@Component({
	selector: 'app-motion-playground',
	imports: [FormsModule, TranslatePipe],
	templateUrl: './motion-playground.component.html',
	styleUrl: './motion-playground.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MotionPlaygroundComponent {
	readonly duration = signal(650);
	readonly easing = signal<IMotionEasing>('standard');
	readonly running = signal(false);
	readonly easingOptions: ReadonlyArray<{ id: IMotionEasing; key: string; value: string }> = [
		{ id: 'standard', key: 'pages.lab.easingStandard', value: 'cubic-bezier(.2,.8,.2,1)' },
		{ id: 'spring', key: 'pages.lab.easingSpring', value: 'cubic-bezier(.2,1.4,.4,1)' },
		{ id: 'linear', key: 'pages.lab.easingLinear', value: 'linear' },
	];

	play(): void {
		this.running.set(false);
		queueMicrotask(() => this.running.set(true));
	}

	easingValue(): string {
		return this.easingOptions.find(({ id }) => id === this.easing())?.value ?? 'ease';
	}
}
