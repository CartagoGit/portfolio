/**
 * Minimal glob matcher for workspace-relative paths: `**` crosses
 * directories, `*` and `?` stay inside one segment.
 */

const escapeRegExp = (value: string): string =>
	value.replace(/[.+^${}()|[\]\\]/g, '\\$&');

export const globToRegExp = (glob: string): RegExp => {
	let source = '';
	for (let i = 0; i < glob.length; i += 1) {
		const char = glob[i] ?? '';
		if (char === '*' && glob[i + 1] === '*') {
			const slash = glob[i + 2] === '/';
			source += slash ? '(?:.*/)?' : '.*';
			i += slash ? 2 : 1;
		} else if (char === '*') source += '[^/]*';
		else if (char === '?') source += '[^/]';
		else source += escapeRegExp(char);
	}
	return new RegExp(`^${source}$`);
};

export const matchesAnyGlob = (
	path: string,
	globs: readonly string[],
): boolean => globs.some((glob) => globToRegExp(glob).test(path));
