import { readFile } from 'node:fs/promises';

import { definePlugin } from '@mcp-vertex/core/public';
import { z } from 'zod';

const OptionsSchema = z.object({
  contentPaths: z.array(z.string()).default(['src/app/portfolio-page.html']),
  forbiddenTerms: z.array(z.string()).default([]),
});

const CaseStudySchema = z.enum(['mcp-vertex', 'quickmodel', 'keyer', 'print-cv', 'zoneless-calculator', 'nestgpt']);

const caseStudies = {
  'mcp-vertex': {
    title: 'MCP Vertex',
    focus: 'TypeScript engineering',
    brief: 'Explain the plugin-oriented MCP server core through typed contracts, extensibility, documentation and tooling automation.',
    requiredSections: ['Context', 'Architecture', 'Extensibility', 'Typed contracts', 'Testing strategy', 'Result'],
  },
  quickmodel: {
    title: 'QuickModel',
    focus: 'TypeScript architecture',
    brief: 'Explain data modelling and serialization through explicit contracts, useful type boundaries and a pragmatic developer experience.',
    requiredSections: ['Context', 'Problem', 'API design', 'Type safety', 'Tests', 'Result'],
  },
  keyer: {
    title: 'Keyer',
    focus: 'Developer tooling',
    brief: 'Explain a CLI and library through its workflow, safe defaults, package distribution and the trade-offs behind its interface.',
    requiredSections: ['Context', 'Workflow', 'CLI design', 'Distribution', 'Testing strategy', 'Result'],
  },
  'print-cv': {
    title: 'Print CV',
    focus: 'Product interface',
    brief: 'Explain the public interface through information hierarchy, validation, print constraints and end-to-end confidence.',
    requiredSections: ['Context', 'Information design', 'Validation', 'Print behaviour', 'E2E testing', 'Result'],
  },
  'zoneless-calculator': {
    title: 'Zoneless Calculator',
    focus: 'Angular architecture',
    brief: 'Explain explicit Angular reactivity through signals, standalone components, tests and measured performance decisions.',
    requiredSections: ['Context', 'Architecture', 'Signals', 'Testing strategy', 'Performance', 'Result'],
  },
  nestgpt: {
    title: 'NestGpt',
    focus: 'Backend integration',
    brief: 'Explain an API integration through clear boundaries, service design and responsible handling of an AI provider dependency.',
    requiredSections: ['Context', 'Architecture', 'Integration boundary', 'Failure handling', 'Testing strategy', 'Result'],
  },
};

export default definePlugin({
  name: 'portfolio-content',
  version: '0.1.0',
  describe: 'Audits portfolio content for image placeholders and private-work references, and returns case-study writing briefs.',
  optionsSchema: OptionsSchema,
  register(ctx) {
    const options = OptionsSchema.parse(ctx.options ?? {});
    const contentPaths = options.contentPaths.map((contentPath) => ctx.workspace.resolve(contentPath));

    return {
      tools: [
        {
          id: 'portfolio_content_audit',
          register: async (server) => {
            server.registerTool(
              `${ctx.namespacePrefix}_content_audit`,
              {
                description: 'Read the public portfolio template and report image TODOs plus any configured private-work terms found in it.',
                inputSchema: z.object({}),
              },
              async () => {
                const documents = await Promise.all(contentPaths.map(async (contentPath) => ({ contentPath, content: await readFile(contentPath, 'utf8') })));
                const imageTodos = documents.flatMap(({ contentPath, content }) => [...content.matchAll(/TODO\(image\):\s*([^\n-]+)/g)].map((match) => ({ contentPath, request: match[1].trim() })));
                const publicContent = documents.map(({ content }) => content).join('\n').toLowerCase();
                const privateMatches = options.forbiddenTerms.filter((term) => publicContent.includes(term.toLowerCase()));
                const report = {
                  ok: privateMatches.length === 0,
                  contentPaths: options.contentPaths,
                  imageTodos,
                  privateMatches,
                  nextAction: privateMatches.length === 0
                    ? 'Replace stock placeholders only after providing approved public images.'
                    : 'Remove private-work references before publishing.',
                };
                return { content: [{ type: 'text', text: JSON.stringify(report) }], structuredContent: report };
              },
            );
          },
        },
        {
          id: 'portfolio_case_study_brief',
          register: async (server) => {
            server.registerTool(
              `${ctx.namespacePrefix}_case_study_brief`,
              {
                description: 'Return the public, non-confidential narrative structure for one featured portfolio case study.',
                inputSchema: z.object({ caseStudy: CaseStudySchema }),
              },
              async ({ caseStudy }) => {
                const brief = caseStudies[caseStudy];
                return { content: [{ type: 'text', text: JSON.stringify(brief) }], structuredContent: brief };
              },
            );
          },
        },
      ],
      knowledge: [{
        id: 'portfolio-content-boundaries',
        title: 'Public portfolio content boundaries',
        body: 'Use anonymised professional patterns only. Never add employer names, client names, product screenshots, source code, business rules or data. Audit image TODOs before publication.',
      }],
    };
  },
});
