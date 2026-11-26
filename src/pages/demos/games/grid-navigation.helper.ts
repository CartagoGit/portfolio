export interface IGridNavigationResult {
	readonly index: number;
	readonly changed: boolean;
}

interface IGridNavigationOptions {
	readonly index: number;
	readonly itemCount: number;
	readonly columns: number;
}

function nextIndex(
	key: string,
	{ index, itemCount, columns }: IGridNavigationOptions,
): number | null {
	switch (key) {
		case 'ArrowLeft':
			return (index - 1 + itemCount) % itemCount;
		case 'ArrowRight':
			return (index + 1) % itemCount;
		case 'ArrowUp':
			return (index - columns + itemCount) % itemCount;
		case 'ArrowDown':
			return (index + columns) % itemCount;
		case 'Home':
			return 0;
		case 'End':
			return itemCount - 1;
		default:
			return null;
	}
}

export function moveGridFocus(
	event: KeyboardEvent,
	options: IGridNavigationOptions,
): IGridNavigationResult | null {
	const { index, itemCount } = options;
	const destination = nextIndex(event.key, options);
	if (destination === null) return null;
	event.preventDefault();
	const grid = (event.currentTarget as HTMLElement | null)?.closest<HTMLElement>('[data-roving-grid]');
	const buttons = Array.from(grid?.querySelectorAll<HTMLButtonElement>('button') ?? []);
	let target = destination;
	const step = event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'End' ? -1 : 1;
	for (let attempts = 0; attempts < buttons.length; attempts += 1) {
		if (!buttons[target]?.disabled) break;
		target = (target + step + itemCount) % itemCount;
	}
	queueMicrotask(() => buttons[target]?.focus({ preventScroll: true }));
	return { index: target, changed: target !== index };
}
