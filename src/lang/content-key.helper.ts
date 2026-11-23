/** Stable slug for translation content keys owned outside UI copy. */
export function contentKey(value: string): string {
	return value
		.trim()
		.toLocaleLowerCase('en')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
