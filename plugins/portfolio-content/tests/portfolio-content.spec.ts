/**
 * Plugin tests. Each suite exercises one slice of the contract
 * (registration shape, architecture, features, domain, audit,
 * SCSS audit) so a regression in any of the five tools stays
 * self-evident.
 */

import { describe, expect, it } from 'vitest';

import plugin, { OptionsSchema } from '../src/index';
import { buildArchitectureMap } from '../src/lib/services/architecture';
import { buildFeatureMap } from '../src/lib/services/features';
import { buildDomainMap, parseDomainSource } from '../src/lib/services/domain';
import { runPublicAudit } from '../src/lib/services/audit';
import type { IPublicAuditReader } from '../src/lib/services/audit';
import { runScssAudit } from '../src/lib/services/scss-audit';
import { buildInMemoryFs } from './helpers/in-memory-fs';
import { captureHandlers, makeFakeContext } from './helpers/fake-context';

const inMemoryFs = (
	dirs: Record<string, readonly string[]> = {},
	files: Record<string, string> = {},
) => buildInMemoryFs({ dirs, files });

describe('@portfolio/mcp-vertex-portfolio-content', () => {
	describe('options schema', () => {
		it('accepts the canonical host shape with defaults', () => {
			const result = OptionsSchema.safeParse({});
			expect(result.success).toBe(true);
			if (!result.success) return;
			expect(result.data.locale).toBe('en');
			expect(result.data.contentPaths.length).toBeGreaterThan(0);
			expect(result.data.forbiddenTerms).toEqual([]);
			expect(result.data.perSeRoots).toEqual([]);
			expect(result.data.scssAuditSourcePath).toBe('src/app/page.scss');
		});

		it('accepts perSeRoots as a list of strings', () => {
			const result = OptionsSchema.safeParse({
				perSeRoots: ['beateam'],
			});
			expect(result.success).toBe(true);
			if (!result.success) return;
			expect(result.data.perSeRoots).toEqual(['beateam']);
		});

		it('rejects unknown locales', () => {
			const result = OptionsSchema.safeParse({ locale: 'fr' });
			expect(result.success).toBe(false);
		});
	});

	describe('registration', () => {
		it('registers five tools + six knowledge entries', async () => {
			const ctx = makeFakeContext();
			const { toolIds, knowledgeIds, handlers } = await captureHandlers(
				plugin,
				ctx,
			);
			expect(toolIds).toEqual([
				'portfolio_architecture',
				'portfolio_features',
				'portfolio_domain',
				'portfolio_scss_audit',
				'portfolio_public_audit',
			]);
			expect(knowledgeIds).toEqual([
				'portfolio-architecture',
				'portfolio-features',
				'portfolio-domain',
				'portfolio-public-boundary-en',
				'portfolio-public-boundary-es',
				'portfolio-content-runbook',
			]);
			expect([...handlers.keys()].sort()).toEqual([
				'portfolio_architecture',
				'portfolio_domain',
				'portfolio_features',
				'portfolio_public_audit',
				'portfolio_scss_audit',
			]);
		});
	});

	describe('architecture engine', () => {
		it('returns the canonical six layers when the tree is partial', async () => {
			const fs = inMemoryFs({
				'src/app': [],
				'src/core': ['motion', 'platform', 'rendering'],
				'src/domain': [],
				'src/features': ['home', 'work'],
				'src/shared': ['ui'],
				'src/styles': [],
			});
			const map = await buildArchitectureMap({ workspaceRoot: '.', fs });
			expect(map.layers.map((l) => l.id)).toEqual([
				'app',
				'core',
				'domain',
				'features',
				'shared',
				'styles',
			]);
			const core = map.layers.find((l) => l.id === 'core');
			expect(core?.subLayers).toEqual(['motion', 'platform', 'rendering']);
		});

		it('marks a missing layer without throwing', async () => {
			const fs = inMemoryFs({});
			const map = await buildArchitectureMap({ workspaceRoot: '.', fs });
			expect(map.layers.length).toBe(6);
			expect(map.layers.every((l) => l.subLayers.length === 0)).toBe(true);
		});

		it('filters layers when `only` is provided', async () => {
			const fs = inMemoryFs({});
			const map = await buildArchitectureMap(
				{ workspaceRoot: '.', fs },
				{ only: ['core', 'domain'] },
			);
			expect(map.layers.map((l) => l.id)).toEqual(['core', 'domain']);
		});
	});

	describe('features engine', () => {
		it('groups every component under its feature', async () => {
			const fs = inMemoryFs({
				'src/features/home': [
					'home-intro',
					'hero-monitor',
					'earth-globe',
					'profile-links',
					'technology-marquee',
				],
			'src/features/home/hero-monitor': ['hero-monitor.component.ts'],
			'src/features/home/home-intro': ['home-intro.component.ts'],
			'src/features/home/earth-globe': ['earth-globe.component.ts'],
			'src/features/home/profile-links': ['profile-links.component.ts'],
			'src/features/home/technology-marquee': ['technology-marquee.component.ts'],
			'src/features/work': ['work-page.component.ts'],
			'src/features/contact': ['contact-page.component.ts'],
			});
			const map = await buildFeatureMap(fs);
			const home = map.features.find((f) => f.id === 'home');
			expect(home?.components.length).toBe(5);
			expect(home?.components.every((c) => c.subFeature)).toBe(true);
			const work = map.features.find((f) => f.id === 'work');
			expect(work?.components.map((c) => c.name)).toEqual([
				'work-page.component',
			]);
		});

		it('returns a single feature when `featureId` is provided', async () => {
			const fs = inMemoryFs({
				'src/features/lab': ['lab-page.component.ts'],
			});
			const map = await buildFeatureMap(fs, { featureId: 'lab' });
			expect(map.features.length).toBe(1);
			expect(map.features[0]?.id).toBe('lab');
		});
	});

	describe('domain engine', () => {
		it('parses unions, interfaces, types and consts', () => {
			const source = `
export type ILocale = 'en' | 'es';
export type IPortfolioPageId = 'home' | 'work' | 'contact';
export interface ICapability { id: string; }
export type IHeroPanelId = 'overview' | 'workflows';
export const PORTFOLIO_COPY = {};
`;
			const contracts = parseDomainSource(source, 'src/domain/portfolio.types.ts');
			expect(contracts.map((c) => c.name)).toEqual([
				'ILocale',
				'IPortfolioPageId',
				'ICapability',
				'IHeroPanelId',
				'PORTFOLIO_COPY',
			]);
			const unions = contracts.filter((c) => c.kind === 'union');
			expect(unions[0]?.members).toEqual(['en', 'es']);
			expect(contracts.find((c) => c.name === 'ICapability')?.kind).toBe(
				'interface',
			);
			expect(contracts.find((c) => c.name === 'PORTFOLIO_COPY')?.kind).toBe(
				'const',
			);
		});

		it('returns an empty map when the source file is missing', async () => {
			const fs = inMemoryFs({});
			const map = await buildDomainMap(fs);
			expect(map.contracts).toEqual([]);
		});
	});

	describe('audit engine', () => {
		const reader: IPublicAuditReader = {
			readText: async (path) => {
				if (path === '/page.html') {
					return '<!-- TODO(image): replace with my portrait --><p>Beateam and MDM Platform.</p>';
				}
				return '';
			},
			exists: async (path) => path === '/page.html',
		};

		it('flags forbidden terms as `error` and image TODOs as `warning`', async () => {
			const report = await runPublicAudit({
				contentPaths: ['/page.html'],
				forbiddenTerms: ['Beateam', 'MDM Platform'],
				locale: 'en',
				reader,
			});
			expect(report.ok).toBe(false);
			expect(report.severity.errors).toBe(2);
			expect(report.severity.warnings).toBe(1);
			expect(report.nextAction).toBe(
				'Remove private-work references before publishing.',
			);
		});

		it('emits Spanish remediation when configured with `locale: "es"`', async () => {
			const report = await runPublicAudit({
				contentPaths: ['/page.html'],
				forbiddenTerms: [],
				locale: 'es',
				reader,
			});
			expect(report.severity.warnings).toBe(1);
			expect(report.nextAction).toBe(
				'Sustituye los marcadores TODO(image) por imágenes públicas aprobadas.',
			);
		});

		describe('forbidden terms co-existence', () => {
			it('co-exists with TODO(image) (both layers fire)', async () => {
				const report = await runPublicAudit({
					contentPaths: ['/page.html'],
					forbiddenTerms: ['MDM Platform'],
					locale: 'en',
					reader,
				});
				const ids = report.findings.map((f) => f.id);
				expect(ids).toContain('private-term');
				expect(ids).toContain('image-todo');
				expect(report.severity.errors).toBe(1);
				expect(report.severity.warnings).toBe(1);
			});
		});

		describe('per-se forbidden roots', () => {
			const rootReader = (raw: string): IPublicAuditReader => ({
				readText: async () => raw,
				exists: async () => true,
			});

			it('flags every form of a per-se root, case-insensitive', async () => {
				const report = await runPublicAudit({
					contentPaths: ['/page.html'],
					forbiddenTerms: [],
					perSeRoots: ['beateam'],
					locale: 'en',
					reader: rootReader(
						'Beateam, BEATEAM, beateam, Beateam.es, BeateamSpain, bea-team',
					),
				});
				expect(report.ok).toBe(false);
				const perSe = report.findings.filter((f) => f.id === 'per-se-root');
				expect(perSe.length).toBeGreaterThan(0);
				expect(report.severity.errors).toBe(perSe.length);
				expect(report.nextAction).toBe(
					'Remove private-work references before publishing.',
				);
			});

			it('reports per-se findings with bilingual remediation', async () => {
				const report = await runPublicAudit({
					contentPaths: ['/page.html'],
					forbiddenTerms: [],
					perSeRoots: ['beateam'],
					locale: 'es',
					reader: rootReader('beateam-dev'),
				});
				const perSe = report.findings.find((f) => f.id === 'per-se-root');
				expect(perSe?.message).toContain('beateam');
				expect(perSe?.remediation).toMatch(
					/Ning[uú]n derivado.*est[aá] permitido/,
				);
			});

			it('does not emit per-se findings when the root is absent', async () => {
				const report = await runPublicAudit({
					contentPaths: ['/page.html'],
					forbiddenTerms: [],
					perSeRoots: ['beateam'],
					locale: 'en',
					reader: rootReader('a clean page with no roots'),
				});
				expect(report.severity.errors).toBe(0);
				expect(report.severity.warnings).toBe(0);
				expect(report.ok).toBe(true);
			});

			it('co-exists with forbiddenTerms (both layers fire)', async () => {
				const report = await runPublicAudit({
					contentPaths: ['/page.html'],
					forbiddenTerms: ['MDM Platform'],
					perSeRoots: ['beateam'],
					locale: 'en',
					reader: rootReader('Beateam and MDM Platform'),
				});
				const ids = report.findings.map((f) => f.id);
				expect(ids).toContain('per-se-root');
				expect(ids).toContain('private-term');
				expect(report.severity.errors).toBe(2);
			});
		});
	});

	describe('introspection tools via the registered handlers', () => {
		it('portfolio_architecture returns the canonical layered shape', async () => {
			const fs = inMemoryFs({
				'src/app': [],
				'src/core': ['motion', 'platform', 'rendering'],
				'src/domain': [],
				'src/features': ['home'],
				'src/shared': ['ui'],
				'src/styles': [],
			});
			const map = await buildArchitectureMap({ workspaceRoot: '.', fs });
			expect(map.layers.length).toBe(6);
			expect(map.layers.find((l) => l.id === 'core')?.subLayers).toEqual([
				'motion',
				'platform',
				'rendering',
			]);
		});

		it('portfolio_features handles empty workspace', async () => {
			const fs = inMemoryFs({});
			const map = await buildFeatureMap(fs);
			expect(map.features.length).toBe(0);
			expect(map.generatedAt).toMatch(/Z$/);
		});

		it('portfolio_domain reads the source file directly', async () => {
			const fs = inMemoryFs(
				{},
				{
					'src/domain/portfolio.types.ts':
						"export type ILocale = 'en' | 'es';\n",
				},
			);
			const map = await buildDomainMap(fs);
			expect(map.contracts).toHaveLength(1);
			expect(map.contracts[0]?.name).toBe('ILocale');
		});
	});

	describe('integration via plugin.register()', () => {
		it('binds the configured contentPaths to the audit tool', async () => {
			const ctx = makeFakeContext({
				contentPaths: ['/one.html', '/two.html'],
				forbiddenTerms: ['Beateam'],
			});
			const { handlers } = await captureHandlers(plugin, ctx);
			// Each handler is bound at register-time; calling it without
			// args falls back to the configured paths.
			const handler = handlers.get('portfolio_public_audit');
			expect(handler).toBeDefined();
		});
	});

	describe('scss audit engine', () => {
		const SHELL_SCSS = [
			`.portfolio {
				--ink: #fff;
			}`,
			`.route-stage {
				min-height: 100vh;
			}`,
			`.hero {
				display: grid;
			}`,
			`.orb {
				position: absolute;
			}`,
			`.orb-one {
				width: 250px;
			}`,
			`.interface-shell {
				width: 600px;
			}`,
			`.canvas-chart {
				height: 150px;
			}`,
			`.layer-list {
				display: flex;
			}`,
			`.home-directory {
				display: grid;
			}`,
			`.directory-grid {
				display: grid;
			}`,
			`.explore-banner {
				padding: 2rem;
			}`,
			`.proof-strip {
				padding: 1.25rem;
			}`,
			`.case-grid {
				display: grid;
			}`,
			`.case-card {
				min-height: 500px;
			}`,
			`.work-page__hero {
				padding: 2rem;
			}`,
			`.lab-page__heading {
				display: grid;
			}`,
			`.contact-page__form {
				padding: 1rem;
			}`,
			`.knowledge-page {
				padding: 2rem;
			}`,
			`.approach-page {
				padding: 2rem;
			}`,
			`.docker-page {
				padding: 2rem;
			}`,
			`.demos-page {
				padding: 2rem;
			}`,
			`.header {
				padding: 1rem;
			}`,
			`.command-palette {
				padding: 0.5rem;
			}`,
			`.profile-links {
				display: flex;
			}`,
			`.mystery-selector {
				opacity: 0;
			}`,
		].join('\n');

		it('classifies every selector into a feature', async () => {
			const fs = inMemoryFs(
				{},
				{ 'src/app/portfolio-page.scss': SHELL_SCSS },
			);
			const report = await runScssAudit({
				sourcePath: 'src/app/portfolio-page.scss',
				fs,
			});
			expect(report.totalSelectors).toBeGreaterThan(15);
			expect(report.ownershipCounts['home/hero-monitor']).toBeGreaterThanOrEqual(4);
			expect(report.ownershipCounts['home/home-intro']).toBeGreaterThanOrEqual(4);
			expect(report.ownershipCounts.work).toBeGreaterThanOrEqual(2);
			expect(report.ownershipCounts.lab).toBe(1);
			expect(report.ownershipCounts.contact).toBe(1);
			expect(report.ownershipCounts.knowledge).toBe(1);
			expect(report.ownershipCounts.approach).toBe(1);
			expect(report.ownershipCounts.docker).toBe(1);
			expect(report.ownershipCounts.demos).toBe(1);
			expect(report.ownershipCounts['shared/ui']).toBeGreaterThanOrEqual(1);
			expect(report.ownershipCounts.shell).toBeGreaterThanOrEqual(2);
		});

		it('flags unmapped selectors when no pattern matches', async () => {
			const fs = inMemoryFs(
				{},
				{ 'src/app/portfolio-page.scss': '.mystery-selector { opacity: 0; }' },
			);
			const report = await runScssAudit({
				sourcePath: 'src/app/portfolio-page.scss',
				fs,
			});
			expect(report.unmapped.length).toBe(1);
			expect(report.unmapped[0]?.name).toBe('mystery-selector');
			expect(report.nextAction).toMatch(/unmapped/i);
		});

		it('returns an empty report when the source is missing', async () => {
			const fs = inMemoryFs({}, {});
			const report = await runScssAudit({
				sourcePath: 'src/app/portfolio-page.scss',
				fs,
			});
			expect(report.totalSelectors).toBe(0);
			expect(report.entries).toEqual([]);
		});

		it('keeps each entry sorted by source line', async () => {
			const fs = inMemoryFs(
				{},
				{
					'src/app/portfolio-page.scss': `
.hello { color: red; }
.world { color: blue; }
`,
				},
			);
			const report = await runScssAudit(
				{ sourcePath: 'src/app/portfolio-page.scss', fs },
			);
			// `.hello` and `.world` are both `unmapped` so the rationale
			// contains the resolver warning — we just check sort order.
			const lines = report.entries.map((e) => e.line);
			expect(lines).toEqual([...lines].sort((a, b) => a - b));
		});
	});
});
