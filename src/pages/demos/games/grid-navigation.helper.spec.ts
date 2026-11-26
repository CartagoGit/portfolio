import { moveGridFocus } from './grid-navigation.helper';

function createGrid(size = 9): {
	readonly grid: HTMLDivElement;
	readonly buttons: readonly HTMLButtonElement[];
} {
	const grid = document.createElement('div');
	grid.setAttribute('data-roving-grid', '');
	const buttons = Array.from({ length: size }, () => {
		const button = document.createElement('button');
		button.type = 'button';
		grid.append(button);
		return button;
	});
	document.body.append(grid);
	return { grid, buttons };
}

describe('moveGridFocus', () => {
	afterEach(() => document.body.replaceChildren());

	it('moves by rows, reaches boundaries, and skips disabled cells', async () => {
		const { buttons } = createGrid();
		buttons[5]?.setAttribute('disabled', '');
		let result: ReturnType<typeof moveGridFocus> = null;
		buttons[4]?.addEventListener('keydown', (event) => {
			result = moveGridFocus(event, { index: 4, itemCount: 9, columns: 3 });
		});
		buttons[4]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		await Promise.resolve();

		expect(result).toEqual({ index: 6, changed: true });
		expect(document.activeElement).toBe(buttons[6]);

		buttons[6]?.addEventListener('keydown', (event) => {
			result = moveGridFocus(event, { index: 6, itemCount: 9, columns: 3 });
		});
		buttons[6]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
		await Promise.resolve();
		expect(document.activeElement).toBe(buttons[0]);
	});
});