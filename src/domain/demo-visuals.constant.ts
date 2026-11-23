/** Visual ownership shared by the Demos and Work catalogues. */
export interface IDemoVisual {
	iconPath?: string;
	imageSrc?: string;
}

const DEMO_VISUALS: Readonly<Record<string, IDemoVisual>> = {
	DeathBlitz: {
		iconPath: 'M12 2a7 7 0 0 0-4.9 12L7 18h3v4h4v-4h3l-.1-4A7 7 0 0 0 12 2Zm-2 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-7.7 4.5h3.4L12 15l-1.7-2.5ZM3 19l3-1-1 3-3 1 1-3Zm18 0-3-1 1 3 3 1-1-3Z',
	},
	Tetris: {
		iconPath: 'M3 4h5v5H3V4Zm5 0h5v5H8V4Zm5 0h5v5h-5V4ZM8 10h5v5H8v-5Z M3 18h15v2H3v-2Z',
	},
	Snake: {
		iconPath: 'M4 6c0-2 2-4 5-4h3c4 0 7 3 7 6v1c0 3-2 5-5 5h-3c-2 0-3 1-3 2v2H5v-3c0-3 2-5 6-5h3c1 0 2-1 2-2 0-1-1-2-3-2H9c-1 0-2 1-2 2H4V6Zm14-2-2-2 4 1-2 1Z M10 5h.1v.1H10V5Z',
	},
	Minesweeper: {
		iconPath: 'M12 5a7 7 0 1 0 7 7 7 7 0 0 0-7-7Zm0-5h2v4h-2V0Zm0 20h2v4h-2v-4ZM0 10h4v2H0v-2Zm20 0h4v2h-4v-2ZM3.2 1.8l3 3-1.4 1.4-3-3 1.4-1.4Zm14.2 16 3 3-1.4 1.4-3-3 1.4-1.4Zm3-16 1.4 1.4-3 3-1.4-1.4 3-3Zm-16 16 1.4 1.4-3 3L.8 20.8l3-3Z M9 8a2 2 0 0 1 3 2c0 1-1 2-2 2s-2-1-2-2 0-2 1-2Z',
	},
	'Print CV': {
		imageSrc: '/icons/projects/print-cv.svg',
	},
};

export function demoVisual(title: string): IDemoVisual {
	return DEMO_VISUALS[title] ?? {};
}
