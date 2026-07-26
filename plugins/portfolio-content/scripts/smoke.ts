/**
 * Smoke test against the real workspace. Imports the plugin from
 * `src/index.ts` and invokes the three introspection tools against
 * the actual `src/` tree so the live architecture / features /
 * domain surfaces are validated end-to-end.
 */

import plugin from '../src/index';
import { captureHandlers, makeFakeContext } from '../tests/helpers/fake-context';

const main = async (): Promise<void> => {
	const ctx = makeFakeContext();
	const { handlers } = await captureHandlers(plugin, ctx);

	const arch = await handlers.get('portfolio_architecture')!({});
	console.log('architecture layers:', arch.structuredContent?.['layers']?.length);

	const features = await handlers.get('portfolio_features')!({});
	console.log(
		'features:',
		(features.structuredContent?.['features'] as Array<{ id: string; components: unknown[] }>).map(
			(f) => `${f.id}:${f.components.length}`,
		),
	);

	const domain = await handlers.get('portfolio_domain')!({});
	const contracts = domain.structuredContent?.['contracts'] as Array<{ name: string; kind: string; members: string[] }>;
	console.log(
		'domain:',
		contracts?.slice(0, 8).map((c) => `${c.name}:${c.kind}${c.members.length ? `(${c.members.length})` : ''}`),
	);
};

await main();
