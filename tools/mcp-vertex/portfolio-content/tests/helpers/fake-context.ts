/**
 * Fake `IMcpPluginContext` for plugin tests. Mirrors the
 * `custom-plugin/tests/wordcount.spec.ts` pattern: a tiny in-memory MCP
 * server captures the registered handlers so the test can invoke them
 * directly, with no transport.
 */

import type {
	IMcpPlugin,
	IMcpPluginContext,
	IMcpPluginRegistrations,
	IToolRegistration,
} from '@mcp-vertex/core/public';

export type ToolHandler = (
	args: Record<string, unknown>,
) => Promise<{
	content: Array<{ type: string; text: string }>;
	structuredContent?: Record<string, unknown>;
	isError?: boolean;
}>;

export const makeFakeContext = (
	options: Record<string, unknown> = {},
	namespacePrefix = 'portfolio',
): IMcpPluginContext =>
	({
		workspace: { root: '/ws', resolve: (p: string) => `/ws/${p}` },
		corePaths: {
			cacheDir: '.cache/mcp-vertex',
			docsDir: 'docs/mcp-vertex',
		},
		cacheDir: '.cache/mcp-vertex',
		docsDir: 'docs/mcp-vertex',
		keepLegacy: false,
		pluginCacheDir: '.cache/mcp-vertex/portfolio-content',
		pluginDocsDir: 'docs/mcp-vertex/portfolio-content',
		namespacePrefix,
		options,
		args: {},
	}) satisfies IMcpPluginContext;

export const captureHandlers = async (
	plugin: IMcpPlugin,
	ctx: IMcpPluginContext,
): Promise<{
	toolIds: string[];
	knowledgeIds: string[];
	handlers: Map<string, ToolHandler>;
}> => {
	const reg: IMcpPluginRegistrations = await plugin.register(ctx);
	const handlers = new Map<string, ToolHandler>();
	const fakeServer = {
		registerTool: (name: string, _cfg: unknown, handler: ToolHandler) =>
			handlers.set(name, handler),
	};
	const tools = (reg.tools ?? []) as readonly IToolRegistration[];
	for (const tool of tools) {
		await tool.register(fakeServer as never);
	}
	return {
		toolIds: tools.map((t) => t.id),
		handlers,
		knowledgeIds: (reg.knowledge ?? []).map((k) => k.id),
	};
};
