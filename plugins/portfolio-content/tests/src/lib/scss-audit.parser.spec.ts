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
	it('parses multiline directives, selectors and custom properties structurally', () => {
		const parsed = parseScssSource(`@use 'tokens/index' as tokens with (
  $surface: var(--surface)
);
@forward 'motion/index' hide $private;
@import 'reset', 'legacy/theme';
.#{$state} .card[data-state="a.b"] {
  --card-accent:
    var(
      --cyan
    );
  &:hover { color: var(--ink); }
}
`);
		expect(parsed.dependencies).toEqual([
			{ kind: 'use', target: 'tokens/index', line: 1 },
			{ kind: 'forward', target: 'motion/index', line: 4 },
			{ kind: 'import', target: 'reset', line: 5 },
			{ kind: 'import', target: 'legacy/theme', line: 5 },
		]);
		expect(parsed.selectors.map(({ classNames, line }) => ({ classNames, line })))
			.toEqual([{ classNames: ['card'], line: 6 }]);
		expect(parsed.customProperties).toEqual([
			{ name: '--surface', line: 2, kind: 'reference' },
			{ name: '--cyan', line: 9, kind: 'reference' },
			{ name: '--card-accent', line: 7, kind: 'definition' },
			{ name: '--ink', line: 11, kind: 'reference' },
		]);
	});
});
