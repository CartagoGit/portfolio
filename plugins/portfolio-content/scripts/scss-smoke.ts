/**
 * SCSS audit smoke test: runs the new `portfolio_scss_audit` tool
 * against the legacy `src/app/portfolio-page.scss` and prints the
 * ownership report so we can slice the qs4 migration.
 */

import plugin from '../src/index';
import { captureHandlers, makeFakeContext } from '../tests/helpers/fake-context';

const main = async (): Promise<void> => {
	const ctx = makeFakeContext({
		scssAuditSourcePath: 'src/app/portfolio-page.scss',
	});
	const { handlers } = await captureHandlers(plugin, ctx);

	const handler = handlers.get('portfolio_scss_audit');
	if (!handler) {
		throw new Error('portfolio_scss_audit tool not registered');
	}

	const result = await handler({});
	const payload = result.structuredContent as {
		ok: true;
		sourcePath: string;
		totalSelectors: number;
		ownershipCounts: Record<string, number>;
		unmapped: Array<{ name: string; line: number }>;
		nextAction: string;
	};

	console.log('source:', payload.sourcePath);
	console.log('total selectors:', payload.totalSelectors);
	console.log('ownership counts:');
	for (const [k, v] of Object.entries(payload.ownershipCounts)) {
		if (v > 0) console.log(`  ${k}: ${v}`);
	}
	console.log('unmapped:', payload.unmapped.length);
	if (payload.unmapped.length > 0) {
		console.log('  examples:');
		for (const e of payload.unmapped.slice(0, 5)) {
			console.log(`    - ${e.name} (line ${e.line})`);
		}
	}
	console.log('next action:', payload.nextAction);
};

await main();
