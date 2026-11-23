import { contentKey } from './content-key';

describe('contentKey', () => {
	it.each([
		['GitHub Actions', 'github-actions'],
		['Node.js', 'node-js'],
		['Model Context Protocol', 'model-context-protocol'],
		['  npm  ', 'npm'],
	])('normalizes %s to %s', (label, expected) => {
		expect(contentKey(label)).toBe(expected);
	});
});
