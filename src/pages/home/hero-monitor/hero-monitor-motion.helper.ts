export interface IRovingIndexOptions {
	readonly key: string;
	readonly current: number;
	readonly count: number;
	readonly columns?: number;
}

/** Returns the next tab stop for a grid or tablist keyboard interaction. */
export function nextRovingIndex(options: IRovingIndexOptions): number | null {
	const { key, current, count } = options;
	if (count <= 0) return null;
	if (key === 'Home') return 0;
	if (key === 'End') return count - 1;
	const columns = Math.max(1, options.columns ?? 1);
	const movement = key === 'ArrowLeft'
		? -1
		: key === 'ArrowRight'
			? 1
			: key === 'ArrowUp'
				? -columns
				: key === 'ArrowDown'
					? columns
					: 0;
	if (movement === 0) return null;
	return (current + movement + count) % count;
}
