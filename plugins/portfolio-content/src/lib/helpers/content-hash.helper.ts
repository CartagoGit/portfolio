import { createHash } from 'node:crypto';

/** Stable SHA-256 fingerprint for an exact UTF-8 source snapshot. */
export function contentDigest(source: string): string {
	return createHash('sha256').update(source, 'utf8').digest('hex');
}
