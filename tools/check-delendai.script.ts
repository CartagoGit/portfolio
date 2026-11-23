import { existsSync, readFileSync } from 'node:fs';
import { assembleCliConfig, parseCliArgs } from '@delendai/core/public';

interface IDelendaiConfig {
	plugins?: Record<string, { path?: string }>;
}

const args = parseCliArgs(
	['--workspace=.', '--config=delendai.config.json', '--preset=swarm'],
	process.cwd()
);
const { loadResult } = await assembleCliConfig(args);
const declared = (JSON.parse(readFileSync('delendai.config.json', 'utf8')) as IDelendaiConfig).plugins ?? {};
const localPath = declared['portfolio-content']?.path;
const errors = [...loadResult.errors, ...loadResult.registerErrors].map((error) =>
	'message' in error && typeof error.message === 'string'
		? error.message
		: String(error)
);
if (!localPath || !existsSync(localPath)) {
	errors.push(`portfolio-content plugin path is missing: ${localPath ?? '(not declared)'}`);
}

if (errors.length > 0) {
	console.error(JSON.stringify({ ok: false, errors }, null, 2));
	process.exitCode = 1;
} else {
	console.log(
		JSON.stringify(
			{ ok: true, declared: Object.keys(declared), localPlugin: true },
			null,
			2
		)
	);
}
