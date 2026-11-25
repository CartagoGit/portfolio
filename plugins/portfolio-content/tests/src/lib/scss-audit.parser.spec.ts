import { describe, expect, it } from 'vitest';
import { parseScssSource } from '../../../src/lib/services/scss-audit.parser';

describe('parseScssSource', () => {
	it('parses directives, selectors and custom properties structurally', () => {
		const parsed = parseScssSource(`@use 'tokens/index' as tokens;
/* .ignored { } */
.card {
  --card-accent: var(--cyan);
  &:hover { color: var(--ink); }
}
`);
		expect(parsed.dependencies).toEqual([{ kind: 'use', target: 'tokens/index', line: 1 }]);
		expect(parsed.selectors.map(({ classNames, line }) => ({ classNames, line })))
			.toEqual([{ classNames: ['card'], line: 3 }]);
		expect(parsed.customProperties).toEqual([
			{ name: '--cyan', line: 4, kind: 'reference' },
			{ name: '--card-accent', line: 4, kind: 'definition' },
			{ name: '--ink', line: 5, kind: 'reference' },
		]);
	});
});
