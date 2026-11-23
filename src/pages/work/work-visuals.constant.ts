import { TECHNOLOGY_MARQUEE } from '../../domain/data.constant';

export interface IWorkTechnologyVisual {
	iconPath: string;
	color: string;
}

const GENERIC_VISUALS: Readonly<Record<string, IWorkTechnologyVisual>> = {
	plugins: { iconPath: 'M8 3h3v3H8V3Zm5 15h3v3h-3v-3ZM3 13h3v3H3v-3Zm15-5h3v3h-3V8ZM8.7 6.3l1.4 1.4L7 10.8 5.6 9.4l3.1-3.1Zm5.6 11.4-1.4-1.4 3.1-3.1 1.4 1.4-3.1 3.1Z', color: 'var(--cyan)' },
	ci: { iconPath: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v14h10V5H7Zm2 3h6v2H9V8Zm0 4h4v2H9v-2Z', color: 'var(--lime)' },
	'static-analysis': { iconPath: 'M4 3h11l5 5v13H4V3Zm11 2.4V9h3.6L15 5.4ZM7 12v2h8v-2H7Zm0 4v2h5v-2H7Z', color: 'var(--cyan)' },
	openapi: { iconPath: 'M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2h8v2H8V9Zm0 4h5v2H8v-2Z', color: '#6ba539' },
	solid: { iconPath: 'm12 2 9 5v10l-9 5-9-5V7l9-5Zm0 2.3L5.8 8 12 11.7 18.2 8 12 4.3ZM5 9.7v6.1l6 3.4v-6.1L5 9.7Zm8 9.5 6-3.4V9.7l-6 3.5v6Z', color: '#7c6cff' },
	cli: { iconPath: 'M3 4h18v16H3V4Zm2 2v12h14V6H5Zm2 3 4 3-4 3v-3Zm6 5h4v2h-4v-2Z', color: 'var(--ink)' },
	'css-print': { iconPath: 'M6 2h9l3 3v7h-2V6h-2V4H8v16h6v-2h2v4H6V2Zm6 8h10v4h-2v6H10v-10h2Zm2 2v6h4v-4h-4v-2Z', color: '#1572b6' },
	'tauri-2': { iconPath: 'M5 3h14v18H5V3Zm2 2v14h10V5H7Zm2 2h6v2H9V7Zm0 4h6v6H9v-6Z', color: '#24c8db' },
	sqlite: { iconPath: 'M6 3c3-2 9-2 12 0v18c-3 2-9 2-12 0V3Zm2 2v3c2 1 6 1 8 0V5c-2-1-6-1-8 0Zm0 6v3c2 1 6 1 8 0v-3c-2 1-6 1-8 0Zm0 6v2c2 1 6 1 8 0v-2c-2 1-6 1-8 0Z', color: '#0f80cc' },
	desktop: { iconPath: 'M3 4h18v13H3V4Zm2 2v9h14V6H5Zm5 13h4v3h-4v-3Z', color: 'var(--cyan)' },
};

const FALLBACK: IWorkTechnologyVisual = {
	iconPath: 'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L17.7 7 12 9.7 6.3 7 12 4.3ZM5 8.7l6 3.3v7.2l-6-3.3V8.7Zm8 10.5V12l6-3.3v7.2l-6 3.3Z',
	color: 'var(--cyan)',
};

function slug(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function workTechnologyVisual(label: string): IWorkTechnologyVisual {
	const technology = TECHNOLOGY_MARQUEE.find((item) => item.label === label);
	if (technology) return { iconPath: technology.iconPath, color: technology.color };
	return GENERIC_VISUALS[slug(label)] ?? FALLBACK;
}
