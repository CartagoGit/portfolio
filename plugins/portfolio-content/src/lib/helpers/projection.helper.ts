export interface ICompactProjectionOptions {
	readonly items: readonly Record<string, unknown>[];
	readonly fields?: readonly string[];
	readonly filter?: string;
	readonly offset?: number;
	readonly limit?: number;
	readonly tokenBudget?: number;
}

export interface ICompactProjection {
	readonly items: readonly Record<string, unknown>[];
	readonly count: number;
	readonly total: number;
	readonly offset: number;
	readonly truncated: boolean;
	readonly nextOffset?: number;
	readonly tokenEstimate: number;
}

const selectFields = (item: Record<string, unknown>, fields: readonly string[] | undefined): Record<string, unknown> => {
	if (!fields || fields.length === 0) return item;
	return Object.fromEntries(fields.filter((field) => field in item).map((field) => [field, item[field]]));
};

export function compactProjection(options: ICompactProjectionOptions): ICompactProjection {
	const needle = options.filter?.toLocaleLowerCase().trim() ?? '';
	const matched = options.items.filter((item) => !needle || JSON.stringify(item).toLocaleLowerCase().includes(needle));
	const total = matched.length;
	const offset = Math.max(0, options.offset ?? 0);
	const limit = Math.max(0, Math.min(100, options.limit ?? 20));
	const tokenBudget = Math.max(128, Math.min(4096, options.tokenBudget ?? 1200));
	const candidates = matched.slice(offset, offset + limit).map((item) => selectFields(item, options.fields));
	const items: Record<string, unknown>[] = [];
	for (const item of candidates) {
		const estimate = Math.ceil(JSON.stringify({ items: [...items, item] }).length / 4);
		if (estimate > tokenBudget) {
			if (items.length === 0)
				items.push({ __truncated: true, keys: Object.keys(item), reason: 'item exceeds token budget' });
			break;
		}
		items.push(item);
	}
	const truncated = offset + items.length < total;
	const payload = JSON.stringify({ items, count: items.length, total, offset, truncated });
	return {
		items,
		count: items.length,
		total,
		offset,
		truncated,
		...(truncated ? { nextOffset: offset + items.length } : {}),
		tokenEstimate: Math.ceil(payload.length / 4),
	};
}
