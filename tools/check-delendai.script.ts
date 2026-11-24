/**
 * `bun run mcp:check` — proves the DelendAI wiring end to end without
 * importing `@delendai/core`:
 *
 *   1. no committed file carries a machine path (`/home/`, `/Users/`);
 *   2. the linked stable CLI serves the workspace over stdio, the local
 *      plugin activates, every `delendai_portfolio_*` tool is listed and each
 *      read-only tool answers `ok`.
 *
 * The runtime is the machine's stable DelendAI, reached through the gitignored
 * `.cache/delendai-runtime` link (`bun run mcp:link`); CI installs the same
 * stable release before `bun install`.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(root, '.cache/delendai-runtime/packages/cli/dist/index.js');
const PLUGIN = 'portfolio-content';
/** Tool ids; the host serves each as `<core prefix>_<plugin prefix>_<id>`. */
const TOOL_PREFIX = 'delendai_portfolio';
const EXPECTED_TOOLS = [
	'architecture',
	'features',
	'domain',
	'scss_audit',
	'public_audit',
].map((id) => `${TOOL_PREFIX}_${id}`);
const MACHINE_PATH = /(?:^|[^A-Za-z0-9_.])\/(?:home|Users)\/[A-Za-z0-9_.-]+/;
const PATH_CHECK_EXEMPT = new Set([
	'bun.lock',
	'tools/check-delendai.script.ts',
]);
const TIMEOUT_MS = 60_000;

interface IRpcMessage {
	readonly id?: number;
	readonly result?: Record<string, unknown>;
	readonly error?: { readonly message: string };
}

const errors: string[] = [];

const findMachinePaths = (): string[] => {
	const listed = spawnSync('git', ['ls-files', '-z'], {
		cwd: root,
		encoding: 'utf8',
	});
	if (listed.status !== 0)
		return ['git ls-files failed; cannot check machine paths'];
	const hits: string[] = [];
	for (const file of listed.stdout.split('\0').filter(Boolean)) {
		if (PATH_CHECK_EXEMPT.has(file) || !existsSync(join(root, file)))
			continue;
		let text: string;
		try {
			text = readFileSync(join(root, file), 'utf8');
		} catch {
			continue;
		}
		if (text.includes('\0')) continue;
		const lines = text.split('\n');
		lines.forEach((line, index) => {
			if (MACHINE_PATH.test(line))
				hits.push(`${file}:${index + 1}: machine path committed`);
		});
	}
	return hits;
};

const probe = async (): Promise<{ tools: string[]; calls: string[] }> => {
	const proc = Bun.spawn(
		[
			'bun',
			CLI,
			'__serve',
			`--workspace=${root}`,
			`--config=${join(root, 'delendai.config.json')}`,
			'--preset=swarm',
		],
		{ cwd: root, stdin: 'pipe', stdout: 'pipe', stderr: 'pipe' }
	);
	const pending = new Map<number, (message: IRpcMessage) => void>();
	let buffer = '';
	void (async () => {
		const decoder = new TextDecoder();
		for await (const chunk of proc.stdout) {
			buffer += decoder.decode(chunk, { stream: true });
			let newline = buffer.indexOf('\n');
			while (newline >= 0) {
				const raw = buffer.slice(0, newline).trim();
				buffer = buffer.slice(newline + 1);
				newline = buffer.indexOf('\n');
				if (!raw.startsWith('{')) continue;
				try {
					const message = JSON.parse(raw) as IRpcMessage;
					if (message.id !== undefined)
						pending.get(message.id)?.(message);
				} catch {
					// not a JSON-RPC line
				}
			}
		}
	})();
	let nextId = 1;
	const send = (payload: object): void => {
		proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...payload })}\n`);
		proc.stdin.flush();
	};
	const request = (
		method: string,
		params: object
	): Promise<Record<string, unknown>> => {
		const id = nextId++;
		return new Promise((resolveRequest, reject) => {
			const timer = setTimeout(
				() => reject(new Error(`${method} timed out`)),
				TIMEOUT_MS
			);
			pending.set(id, (message) => {
				clearTimeout(timer);
				if (message.error)
					reject(new Error(`${method}: ${message.error.message}`));
				else resolveRequest(message.result ?? {});
			});
			send({ id, method, params });
		});
	};
	const callTool = async (
		name: string,
		args: object
	): Promise<Record<string, unknown>> => {
		const result = await request('tools/call', { name, arguments: args });
		if (result['isError'])
			throw new Error(
				`${name} returned an error: ${JSON.stringify(result['content'])}`
			);
		return (
			(result['structuredContent'] as
				Record<string, unknown> | undefined) ?? {}
		);
	};

	try {
		await request('initialize', {
			protocolVersion: '2025-06-18',
			capabilities: {},
			clientInfo: { name: 'portfolio-mcp-check', version: '1.0.0' },
		});
		send({ method: 'notifications/initialized' });
		const activation = await callTool('delendai_plugin_activate', {
			plugin: PLUGIN,
		});
		if (activation['ok'] === false)
			throw new Error(
				`activation refused: ${JSON.stringify(activation)}`
			);
		const listed = await request('tools/list', {});
		const tools = (
			(listed['tools'] as Array<{ name: string }> | undefined) ?? []
		).map((tool) => tool.name);
		const calls: string[] = [];
		for (const name of EXPECTED_TOOLS) {
			if (!tools.includes(name)) {
				errors.push(
					`tool ${name} is not listed after activating ${PLUGIN}`
				);
				continue;
			}
			const out = await callTool(name, {});
			if (out['ok'] === false)
				errors.push(
					`tool ${name} answered ok:false: ${JSON.stringify(out).slice(0, 300)}`
				);
			else calls.push(name);
		}
		return {
			tools: tools.filter((name) => name.startsWith(`${TOOL_PREFIX}_`)),
			calls,
		};
	} finally {
		proc.kill();
	}
};

errors.push(...findMachinePaths());

let report: { tools: string[]; calls: string[] } | undefined;
if (!existsSync(CLI)) {
	errors.push('DelendAI runtime link missing: run `bun run mcp:link`.');
} else {
	try {
		report = await probe();
	} catch (error) {
		errors.push(error instanceof Error ? error.message : String(error));
	}
}

if (errors.length > 0) {
	console.error(JSON.stringify({ ok: false, errors }, null, 2));
	process.exitCode = 1;
} else {
	console.log(
		JSON.stringify({ ok: true, machinePaths: 0, ...report }, null, 2)
	);
}
