import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HeroMonitorComponent } from './hero-monitor.component';
import { TranslateService } from '../../../lang/translate.service';

describe('HeroMonitorComponent', () => {
	it('renders the interactive monitor', async () => {
		await TestBed.configureTestingModule({
			imports: [HeroMonitorComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(HeroMonitorComponent);
		fixture.componentRef.setInput('locale', 'es');
		fixture.componentRef.setInput('technologies', []);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.hero-monitor__interface')
		).toBeTruthy();
		expect(
			fixture.nativeElement.querySelector('.hero-monitor__destinations')
		).toBeTruthy();
	});

	it('returns to its resting pose after an external preview loses hover', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({
				imports: [HeroMonitorComponent],
			}).compileComponents();
			const fixture = TestBed.createComponent(HeroMonitorComponent);
			fixture.componentRef.setInput('locale', 'es');
			fixture.componentRef.setInput('technologies', []);
			fixture.detectChanges();
			const component = fixture.componentInstance;
			component.showPreview({
				kind: 'platform',
				label: 'GitHub',
				detail: 'Public profile',
				stack: [],
				href: 'https://github.com/CartagoGit',
			});
			vi.advanceTimersByTime(720);
			component.showPreview(null);
			vi.advanceTimersByTime(180);
			expect(component.monitorExpanded()).toBe(false);
			expect(component.activePreview()?.label).toBe('GitHub');
			fixture.destroy();
		} finally {
			vi.useRealTimers();
		}
	});

	it('owns the complete readable catalogue and permanently mounted overlay', async () => {
		await TestBed.configureTestingModule({
			imports: [HeroMonitorComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(HeroMonitorComponent);
		fixture.componentRef.setInput('locale', 'es');
		fixture.componentRef.setInput('technologies', []);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const element = fixture.nativeElement as HTMLElement;

		expect(component.chartOptions).toHaveLength(14);
		expect(element.querySelectorAll('.hero-monitor__chart-switcher button span')).toHaveLength(14);
		expect(component.earthTextureOptions).toHaveLength(34);
		expect(component.earthTextureOptions.map(({ id }) => id)).toEqual(
			expect.arrayContaining(['bathymetry', 'rugby', 'volleyball', 'model-gamepad', 'model-elephant', 'portrait'])
		);
		expect(
			new Set(component.earthTextureOptions.map(({ category }) => category))
		).toEqual(new Set(['earth', 'planets', 'exoplanets', 'balls', 'figures', 'playful']));
		expect(component.earthTextureLabel('kepler-186f')).toContain('impresión artística');
		expect(element.querySelectorAll('.hero-monitor__globe-scrim')).toHaveLength(1);
		expect(element.querySelectorAll('app-earth-globe-controls')).toHaveLength(1);
		expect(element.querySelectorAll('.hero-monitor__earth-controls')).toHaveLength(1);

		component.selectEarthTexture('saturn', new Event('click'));
		expect(component.earthTexture()).toBe('saturn');
		expect(component.earthTextureCategory()).toBe('planets');
	});

	it('keeps the selected figure during exit and resets after the globe parks', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({ imports: [HeroMonitorComponent] }).compileComponents();
			const fixture = TestBed.createComponent(HeroMonitorComponent);
			fixture.componentRef.setInput('locale', 'es');
			fixture.componentRef.setInput('technologies', []);
			fixture.detectChanges();
			const component = fixture.componentInstance;
			component.selectEarthTexture('model-elephant', new Event('click'));
			component.showEarthInFront(new MouseEvent('click'));
			vi.runAllTimers();
			fixture.detectChanges();
			expect(component.earthDepth()).toBe('front');
			component.dismissEarth(new MouseEvent('click'));
			expect(component.earthTexture()).toBe('model-elephant');
			vi.runAllTimers();
			fixture.detectChanges();
			expect(component.earthDepth()).toBe('behind');
			expect(component.earthTexture()).toBe('clouds');
			expect(component.earthTextureCategory()).toBe('earth');
			fixture.destroy();
		} finally {
			vi.useRealTimers();
		}
	});

	it('keeps specific platform and technology definitions with useful portfolio context', async () => {
		await TestBed.configureTestingModule({
			imports: [HeroMonitorComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(HeroMonitorComponent);
		const technology = {
			label: 'TypeScript',
			iconPath: '',
			color: '#3178c6',
			detail: 'Tipa contratos de dominio, renderizado y herramientas en este portfolio.',
		};
		fixture.componentRef.setInput('locale', 'es');
		fixture.componentRef.setInput('technologies', [technology]);
		TestBed.inject(TranslateService).setLocale('es');
		fixture.detectChanges();

		fixture.componentInstance.previewTechnology(technology);
		const technologyDetail = fixture.componentInstance.previewItems()[0]?.detail ?? '';
		expect(technologyDetail).not.toBe(technology.detail);
		expect(technologyDetail).toContain('Lenguaje tipado');
		expect(technologyDetail).toContain('TypeScript forma parte');
		expect(technologyDetail.length).toBeGreaterThan(140);

		fixture.componentInstance.showLinkPreview(fixture.componentInstance.platformLinks[0]!);
		const platformDetail = fixture.componentInstance.previewItems()[0]?.detail ?? '';
		expect(platformDetail).toContain('Perfil profesional');
		expect(platformDetail).toContain('LinkedIn es un destino público');
		expect(platformDetail.length).toBeGreaterThan(140);
		TestBed.inject(TranslateService).setLocale('en');
	});

	it('opens a stable CSS fullscreen state without the browser Fullscreen API', async () => {
		await TestBed.configureTestingModule({ imports: [HeroMonitorComponent] }).compileComponents();
		const fixture = TestBed.createComponent(HeroMonitorComponent);
		fixture.componentRef.setInput('locale', 'es');
		fixture.componentRef.setInput('technologies', []);
		fixture.detectChanges();
		(fixture.nativeElement as HTMLElement)
			.querySelector<HTMLButtonElement>('.hero-monitor__fullscreen')
			?.click();
		fixture.detectChanges();
		expect(fixture.componentInstance.monitorFullscreen()).toBe(true);
		expect((fixture.nativeElement as HTMLElement).classList.contains('app-hero-monitor--fullscreen')).toBe(true);
		expect(fixture.componentInstance.monitorExpanded()).toBe(true);
	});
});
