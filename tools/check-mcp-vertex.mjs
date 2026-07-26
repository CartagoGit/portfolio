import { assembleCliConfig, parseCliArgs } from '@mcp-vertex/core/public';

const args = parseCliArgs(
  ['--workspace=.', '--config=mcp-vertex.config.json', '--preset=swarm'],
  process.cwd(),
);
const { loadResult } = await assembleCliConfig(args);
const loaded = loadResult.loaded.map(({ plugin }) => plugin.name);

if (loadResult.errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors: loadResult.errors.map(({ message }) => message) }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, loaded, localPlugin: loaded.includes('portfolio-content') }, null, 2));
}
