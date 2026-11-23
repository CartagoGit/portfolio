/** Visual ownership shared by the Demos and Work catalogues. */
export interface IDemoVisual {
	iconPath?: string;
	imageSrc?: string;
}

const DEMO_VISUALS: Readonly<Record<string, IDemoVisual>> = {
	DeathBlitz: {
		iconPath: 'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',
	},
	'Cartago Tetris': {
		iconPath: 'M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z',
	},
	'Cartago Snake': {
		iconPath: 'M4 6h10c3 0 4 2 4 4s-1 4-4 4H8c-2 0-3 1-3 3s1 3 3 3h12v-3H8c-1 0-1-1 0-1h6c5 0 7-2.5 7-6s-2-6-7-6H4v2Z',
	},
	Minesweeper: {
		iconPath: 'M6 3v18M7 5h12l-3 4 3 4H7V5Zm1 15h10v2H8v-2Z',
	},
	'Print CV': {
		imageSrc: '/icons/projects/print-cv.svg',
	},
};

export function demoVisual(title: string): IDemoVisual {
	return DEMO_VISUALS[title] ?? {};
}
