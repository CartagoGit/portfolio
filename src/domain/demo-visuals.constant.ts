/** Visual ownership shared by the Demos and Work catalogues. */
export interface IDemoVisual {
	iconPath?: string;
	imageSrc?: string;
}

const DEMO_VISUALS: Readonly<Record<string, IDemoVisual>> = {
	DeathBlitz: {
		imageSrc: '/images/games/deathblitz.png',
	},
	Tetris: {
		imageSrc: '/images/games/tetris.png',
	},
	Snake: {
		imageSrc: '/images/games/snake.png',
	},
	Minesweeper: {
		imageSrc: '/images/games/minesweeper.png',
	},
	'Print CV': {
		imageSrc: '/icons/projects/print-cv.svg',
	},
};

export function demoVisual(title: string): IDemoVisual {
	const visual = DEMO_VISUALS[title];
	if (!visual) throw new Error(`Missing canonical demo visual: ${title}`);
	return visual;
}
