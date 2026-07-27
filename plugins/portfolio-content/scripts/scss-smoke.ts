/**
 * SCSS audit smoke test. Runs the new `portfolio_scss_audit` tool
 * against every partial of the shell composition (the entry point
 * `src/app/page.scss` and the eight siblings under
 * `src/app/_composition/`) so the migration plan stays reproducible
 * as the shell is split.
 *
 * Prints a per-file ownership report and a roll-up so the
 * migration slice author can see at a glance which feature should
 * own which block.
 */

import plugin from '../src/index';
import { captureHandlers, makeFakeContext } from '../tests/helpers/fake-context';

interface IScssReport {
	ok: true;
	sourcePath: string;
	totalSelectors: number;
	ownershipCounts: Record<string, number>;
	unmapped: Array<{ name: string; line: number }>;
	nextAction: string;
}

const SHELL_PARTIALS = [
	'src/app/page.scss',
	'src/app/_composition/_layout.scss',
	'src/app/_composition/_hero.scss',
	'src/app/_composition/_sections.scss',
	'src/app/_composition/_capabilities.scss',
	'src/app/_composition/_telemetry.scss',
	'src/app/_composition/_operational.scss',
	'src/app/_composition/_footer.scss',
	'src/app/_composition/_monitor.scss',
] as const;

const main = async (): Promise<void> => {
	const ctx = makeFakeContext();
	const { handlers } = await captureHandlers(plugin, ctx);

	const handler = handlers.get('portfolio_scss_audit');
	if (!handler) {
		throw new Error('portfolio_scss_audit tool not registered');
	}

	const rollup: Record<string, number> = {};
	let totalSelectors = 0;
	let totalUnmapped = 0;

	for (const sourcePath of SHELL_PARTIALS) {
		const result = await handler({ sourcePath });
		const payload = result.structuredContent as IScssReport;
		if (payload.totalSelectors === 0) {
			console.log(`\n${sourcePath}  (empty / missing)`);
			continue;
		}

		console.log(`\n${sourcePath}  →  ${payload.totalSelectors} selectors`);
		for (const [k, v] of Object.entries(payload.ownershipCounts)) {
			if (v === 0) continue;
			console.log(`  ${k}: ${v}`);
			rollup[k] = (rollup[k] ?? 0) + v;
		}
		if (payload.unmapped.length > 0) {
			console.log(`  unmapped: ${payload.unmapped.length}`);
			for (const e of payload.unmapped.slice(0, 3)) {
				console.log(`    - ${e.name} (line ${e.line})`);
			}
		}
		totalSelectors += payload.totalSelectors;
		totalUnmapped += payload.unmapped.length;
	}

	console.log('\n--- ROLLUP ---');
	console.log('total selectors across shell:', totalSelectors);
	for (const [k, v] of Object.entries(rollup).sort(([, a], [, b]) => b - a)) {
		console.log(`  ${k}: ${v}`);
	}
	console.log('total unmapped:', totalUnmapped);
};

await main();
