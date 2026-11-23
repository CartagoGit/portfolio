import { TestBed } from '@angular/core/testing';
import { MotionPlaygroundComponent } from './motion-playground.component';

describe('MotionPlaygroundComponent', () => {
	it('updates easing and can replay the same motion state', async () => {
		await TestBed.configureTestingModule({ imports: [MotionPlaygroundComponent] }).compileComponents();
		const component = TestBed.createComponent(MotionPlaygroundComponent).componentInstance;
		component.duration.set(900);
		component.easing.set('spring');
		component.play();
		await Promise.resolve();
		expect(component.duration()).toBe(900);
		expect(component.easingValue()).toContain('1.4');
		expect(component.running()).toBe(true);
	});
});
