import { glob, readFile } from 'node:fs/promises';

const failures: string[] = [];
for await (const path of glob('src/**/*.html')) {
	const source = await readFile(path, 'utf8');
	for (const match of source.matchAll(/<a\b[^>]*>/g)) {
		const tag = match[0];
		if (/\btarget=["']_blank["']/.test(tag)) {
			const rel = /\brel=["']([^"']*)["']/.exec(tag)?.[1]?.split(/\s+/) ?? [];
			if (!rel.includes('noopener') && !rel.includes('noreferrer')) failures.push(`${path}: _blank anchor lacks opener-safe rel`);
			const href = /\bhref=["'](?!\[)([^"']+)["']/.exec(tag)?.[1];
			if (href?.startsWith('http://')) failures.push(`${path}: non-HTTPS href ${href}`);
		}
	}
	if (/TODO\(image\):/.test(source)) failures.push(`${path}: unresolved image TODO`);
}
if (failures.length > 0) throw new Error(`Public boundary check failed:\n${failures.join('\n')}`);
console.log('public boundary: external links and image placeholders are clean');
