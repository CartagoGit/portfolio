import type {
	IEarthTextureCategory,
	IEarthTextureOption,
	IEarthTextureOrigin,
	IEarthTextureStyle,
	ILocale,
} from '../../../domain/types.interface';
import { SECONDARY_EARTH_LABELS } from '../../../lang/secondary-priority.overlays';

interface IEarthLocalLabels {
	categories: Readonly<Record<IEarthTextureCategory, string>>;
	presets: Readonly<Record<IEarthTextureStyle, string>>;
	origins: Readonly<Record<IEarthTextureOrigin, string>>;
	closeSphere: string;
}

const EARTH_TEXTURE_LABELS: Readonly<Partial<Record<ILocale, IEarthLocalLabels>>> = {
	en: {
		categories: { earth: 'Earth', planets: 'Planets', exoplanets: 'Exoplanets', balls: 'Balls', figures: 'Figures', playful: 'Brand & faces' },
		presets: {
			clouds: 'Real clouds', natural: 'Cloudless day', night: 'City lights', terrain: 'Topography', bathymetry: 'Bathymetry', infrared: 'Thermal', sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto', 'kepler-186f': 'Kepler-186f · artist impression', 'proxima-b': 'Proxima b · artist impression', 'trappist-1e': 'TRAPPIST-1e · artist impression', soccer: 'Football', basketball: 'Basketball', tennis: 'Tennis', golf: 'Golf', rugby: 'Rugby', volleyball: 'Volleyball', 'beach-ball': 'Beach ball', disco: 'Disco ball', 'cartago-mark': 'Cartago mark', 'cartago-banner': 'Cartago banner', portrait: 'Cartago portrait', 'model-gamepad': '3D gamepad', 'model-football': 'American football 3D', 'model-elephant': 'Carved elephant 3D', 'model-moon-rock': 'Lunar rock 3D',
		},
		origins: { observed: 'Observed/derived source map', artist: 'Artist impression — not an observation', canonical: 'Original canonical pattern', owned: 'Owned Cartago content', licensed: 'Downloaded 3D model · Poly Haven CC0' },
		closeSphere: 'Close figure',
	},
	es: {
		categories: { earth: 'Tierra', planets: 'Planetas', exoplanets: 'Exoplanetas', balls: 'Pelotas', figures: 'Figuras', playful: 'Marca y caras' },
		presets: {
			clouds: 'Nubes reales', natural: 'Día sin nubes', night: 'Luces nocturnas', terrain: 'Topografía', bathymetry: 'Batimetría', infrared: 'Térmica', sun: 'Sol', moon: 'Luna', mercury: 'Mercurio', venus: 'Venus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno', uranus: 'Urano', neptune: 'Neptuno', pluto: 'Plutón', 'kepler-186f': 'Kepler-186f · impresión artística', 'proxima-b': 'Próxima b · impresión artística', 'trappist-1e': 'TRAPPIST-1e · impresión artística', soccer: 'Fútbol', basketball: 'Baloncesto', tennis: 'Tenis', golf: 'Golf', rugby: 'Rugby', volleyball: 'Voleibol', 'beach-ball': 'Pelota de playa', disco: 'Bola de discoteca', 'cartago-mark': 'Logotipo Cartago', 'cartago-banner': 'Banner Cartago', portrait: 'Retrato Cartago', 'model-gamepad': 'Mando 3D', 'model-football': 'Balón americano 3D', 'model-elephant': 'Elefante tallado 3D', 'model-moon-rock': 'Roca lunar 3D',
		},
		origins: { observed: 'Mapa observado o derivado de datos', artist: 'Impresión artística — no es una observación', canonical: 'Patrón canónico original', owned: 'Contenido propio de Cartago', licensed: 'Modelo 3D descargado · Poly Haven CC0' },
		closeSphere: 'Cerrar figura',
	},
	fr: {
		categories: { earth: 'Terre', planets: 'Planètes', exoplanets: 'Exoplanètes', balls: 'Ballons', figures: 'Figures', playful: 'Marque et visages' },
		presets: {
			clouds: 'Nuages réels', natural: 'Jour sans nuages', night: 'Lumières nocturnes', terrain: 'Topographie', bathymetry: 'Bathymétrie', infrared: 'Thermique', sun: 'Soleil', moon: 'Lune', mercury: 'Mercure', venus: 'Vénus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturne', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluton', 'kepler-186f': 'Kepler-186f · illustration', 'proxima-b': 'Proxima b · illustration', 'trappist-1e': 'TRAPPIST-1e · illustration', soccer: 'Football', basketball: 'Basket-ball', tennis: 'Tennis', golf: 'Golf', rugby: 'Rugby', volleyball: 'Volley-ball', 'beach-ball': 'Ballon de plage', disco: 'Boule disco', 'cartago-mark': 'Marque Cartago', 'cartago-banner': 'Bannière Cartago', portrait: 'Portrait Cartago', 'model-gamepad': 'Manette 3D', 'model-football': 'Ballon de football américain 3D', 'model-elephant': 'Éléphant sculpté 3D', 'model-moon-rock': 'Roche lunaire 3D',
		},
		origins: { observed: 'Carte observée ou dérivée de données', artist: 'Illustration — pas une observation', canonical: 'Motif canonique original', owned: 'Contenu Cartago original', licensed: 'Modèle 3D téléchargé · Poly Haven CC0' },
		closeSphere: 'Fermer la figure',
	},
	de: {
		categories: { earth: 'Erde', planets: 'Planeten', exoplanets: 'Exoplaneten', balls: 'Bälle', figures: 'Figuren', playful: 'Marke und Gesichter' },
		presets: {
			clouds: 'Echte Wolken', natural: 'Wolkenloser Tag', night: 'Nachtlichter', terrain: 'Topografie', bathymetry: 'Bathymetrie', infrared: 'Thermisch', sun: 'Sonne', moon: 'Mond', mercury: 'Merkur', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptun', pluto: 'Pluto', 'kepler-186f': 'Kepler-186f · Künstlerdarstellung', 'proxima-b': 'Proxima b · Künstlerdarstellung', 'trappist-1e': 'TRAPPIST-1e · Künstlerdarstellung', soccer: 'Fußball', basketball: 'Basketball', tennis: 'Tennis', golf: 'Golf', rugby: 'Rugby', volleyball: 'Volleyball', 'beach-ball': 'Wasserball', disco: 'Discokugel', 'cartago-mark': 'Cartago-Marke', 'cartago-banner': 'Cartago-Banner', portrait: 'Cartago-Porträt', 'model-gamepad': '3D-Gamepad', 'model-football': 'American-Football 3D', 'model-elephant': 'Geschnitzter Elefant 3D', 'model-moon-rock': 'Mondgestein 3D',
		},
		origins: { observed: 'Beobachtete oder abgeleitete Karte', artist: 'Künstlerdarstellung — keine Beobachtung', canonical: 'Originales kanonisches Muster', owned: 'Eigene Cartago-Inhalte', licensed: 'Heruntergeladenes 3D-Modell · Poly Haven CC0' },
		closeSphere: 'Figur schließen',
	},
	...SECONDARY_EARTH_LABELS,
};

export const EARTH_TEXTURE_CATEGORIES: readonly IEarthTextureCategory[] = ['earth', 'planets', 'exoplanets', 'balls', 'figures', 'playful'];

export const EARTH_TEXTURE_OPTIONS = [
	{ id: 'clouds', category: 'earth', origin: 'observed' },
	{ id: 'natural', category: 'earth', origin: 'observed' },
	{ id: 'night', category: 'earth', origin: 'observed' },
	{ id: 'terrain', category: 'earth', origin: 'observed' },
	{ id: 'bathymetry', category: 'earth', origin: 'observed' },
	{ id: 'infrared', category: 'earth', origin: 'observed' },
	{ id: 'sun', category: 'planets', origin: 'observed' },
	{ id: 'moon', category: 'planets', origin: 'observed' },
	{ id: 'mercury', category: 'planets', origin: 'observed' },
	{ id: 'venus', category: 'planets', origin: 'observed' },
	{ id: 'mars', category: 'planets', origin: 'observed' },
	{ id: 'jupiter', category: 'planets', origin: 'observed' },
	{ id: 'saturn', category: 'planets', origin: 'observed' },
	{ id: 'uranus', category: 'planets', origin: 'observed' },
	{ id: 'neptune', category: 'planets', origin: 'observed' },
	{ id: 'pluto', category: 'planets', origin: 'observed' },
	{ id: 'kepler-186f', category: 'exoplanets', origin: 'artist' },
	{ id: 'proxima-b', category: 'exoplanets', origin: 'artist' },
	{ id: 'trappist-1e', category: 'exoplanets', origin: 'artist' },
	{ id: 'soccer', category: 'balls', origin: 'canonical' },
	{ id: 'basketball', category: 'balls', origin: 'canonical' },
	{ id: 'tennis', category: 'balls', origin: 'canonical' },
	{ id: 'golf', category: 'balls', origin: 'canonical' },
	{ id: 'volleyball', category: 'balls', origin: 'canonical' },
	{ id: 'rugby', category: 'figures', origin: 'canonical' },
	{ id: 'beach-ball', category: 'figures', origin: 'canonical' },
	{ id: 'disco', category: 'figures', origin: 'canonical' },
	{ id: 'model-gamepad', category: 'figures', origin: 'licensed' },
	{ id: 'model-football', category: 'figures', origin: 'licensed' },
	{ id: 'model-elephant', category: 'figures', origin: 'licensed' },
	{ id: 'model-moon-rock', category: 'figures', origin: 'licensed' },
	{ id: 'cartago-mark', category: 'playful', origin: 'owned' },
	{ id: 'cartago-banner', category: 'playful', origin: 'owned' },
	{ id: 'portrait', category: 'playful', origin: 'owned' },
] as const satisfies readonly IEarthTextureOption[];

export function earthCategoryLabel(locale: ILocale, category: IEarthTextureCategory): string {
	return (EARTH_TEXTURE_LABELS[locale] ?? EARTH_TEXTURE_LABELS.en)!.categories[category];
}

export function earthTextureLabel(locale: ILocale, style: IEarthTextureStyle): string {
	return (EARTH_TEXTURE_LABELS[locale] ?? EARTH_TEXTURE_LABELS.en)!.presets[style];
}

export function earthTextureOriginLabel(locale: ILocale, style: IEarthTextureStyle): string {
	const option = EARTH_TEXTURE_OPTIONS.find(({ id }) => id === style);
	return option ? (EARTH_TEXTURE_LABELS[locale] ?? EARTH_TEXTURE_LABELS.en)!.origins[option.origin] : '';
}

export function closeSphereLabel(locale: ILocale): string {
	return (EARTH_TEXTURE_LABELS[locale] ?? EARTH_TEXTURE_LABELS.en)!.closeSphere;
}
