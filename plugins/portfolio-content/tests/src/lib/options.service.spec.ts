import { describe, expect, it } from 'vitest';

import { OptionsSchema } from '../../../src/lib/services/options.service';

describe('OptionsSchema', () => {
	it('is valid with no options and fills every default', () => {
		const parsed = OptionsSchema.parse({});
		expect(parsed.sourceRoot).toBe('src');
		expect(parsed.pagesRoot).toBe('src/pages');
		expect(parsed.contentRoots).toEqual(['src/app', 'src/pages']);
		expect(parsed.forbiddenTerms).toEqual([]);
		expect(parsed.locale).toBe('en');
	});

	it('rejects an unknown locale and empty roots', () => {
		expect(OptionsSchema.safeParse({ locale: 'fr' }).success).toBe(false);
		expect(OptionsSchema.safeParse({ contentRoots: [] }).success).toBe(false);
	});
});
