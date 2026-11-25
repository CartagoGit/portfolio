import { ptPt } from './pt-pt.translation';
import { mapTranslationOverlay, type ISecondaryLocalePack } from '../secondary-locales.types';

const REGION_REPLACEMENTS = [
	['Portefólio', 'Portfólio'], ['portefólio', 'portfólio'], ['Contacto', 'Contato'], ['contacto', 'contato'],
	['Contactar', 'Contatar'], ['ecrã', 'tela'], ['Ecrã', 'Tela'], ['rato', 'mouse'], ['Rato', 'Mouse'],
	['ficheiro', 'arquivo'], ['Ficheiro', 'Arquivo'], ['utilizador', 'usuário'], ['Utilizador', 'Usuário'],
	['equipa', 'equipe'], ['Equipa', 'Equipe'], ['perspetiva', 'perspectiva'], ['Perspetiva', 'Perspectiva'],
	['conceção', 'concepção'], ['autónomo', 'autônomo'], ['repositório', 'repositório'], ['sítio web', 'site'],
	['Sítio web', 'Site'], ['arrastar e largar', 'arrastar e soltar'], ['Arraste e largue', 'Arraste e solte'],
	['repor', 'redefinir'], ['Repor', 'Redefinir'], ['controlos', 'controles'], ['Controlos', 'Controles'],
	['desfocad', 'desfocad'], ['AO VIVO', 'AO VIVO'], ['disponível', 'disponível'],
	['destinatários', 'destinatários'], ['foco', 'foco'], ['Ténis', 'Tênis'], ['Basquetebol', 'Basquete'],
	['Râguebi', 'Rúgbi'], ['canónico', 'canônico'], ['Vénus', 'Vênus'], ['Júpiter', 'Júpiter'],
] as const;

function brazilianPortuguese(value: string): string {
	return REGION_REPLACEMENTS.reduce(
		(current, [source, replacement]) => current.replaceAll(source, replacement),
		value,
	);
}

/** Brazilian Portuguese shares the terminology base, with explicit regional forms. */
export const ptBr: ISecondaryLocalePack = {
	translation: mapTranslationOverlay(ptPt.translation, brazilianPortuguese),
	earth: {
		categories: { earth: 'Terra', planets: 'Planetas', exoplanets: 'Exoplanetas', balls: 'Bolas', figures: 'Figuras', playful: 'Marca e rostos' },
		presets: { clouds: 'Nuvens reais', natural: 'Dia sem nuvens', night: 'Luzes noturnas', terrain: 'Topografia', bathymetry: 'Batimetria', infrared: 'Térmica', sun: 'Sol', moon: 'Lua', mercury: 'Mercúrio', venus: 'Vênus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno', uranus: 'Urano', neptune: 'Netuno', pluto: 'Plutão', 'kepler-186f': 'Kepler-186f · impressão artística', 'proxima-b': 'Proxima b · impressão artística', 'trappist-1e': 'TRAPPIST-1e · impressão artística', soccer: 'Futebol', basketball: 'Basquete', tennis: 'Tênis', golf: 'Golfe', rugby: 'Rúgbi', volleyball: 'Vôlei', 'beach-ball': 'Bola de praia', disco: 'Globo espelhado', 'cartago-mark': 'Marca Cartago', 'cartago-banner': 'Banner Cartago', portrait: 'Retrato Cartago' },
		origins: { observed: 'Mapa observado ou derivado de dados', artist: 'Impressão artística — não é uma observação', canonical: 'Padrão canônico original', owned: 'Conteúdo próprio da Cartago' },
		closeSphere: 'Fechar figura',
	},
} satisfies ISecondaryLocalePack;
