import type { IChartType, IEarthTextureStyle } from '../domain/types.interface';
import type { ISecondaryChartLabels, ISecondaryLocale, ISecondaryLocalePack, ITranslationOverlay } from './secondary-locales.types';
import { ar } from './secondary-locales/ar.translation';
import { bn } from './secondary-locales/bn.translation';
import { hi } from './secondary-locales/hi.translation';
import { hr } from './secondary-locales/hr.translation';
import { id } from './secondary-locales/id.translation';
import { it } from './secondary-locales/it.translation';
import { ja } from './secondary-locales/ja.translation';
import { ko } from './secondary-locales/ko.translation';
import { pl } from './secondary-locales/pl.translation';
import { ptBr } from './secondary-locales/pt-br.translation';
import { ptPt } from './secondary-locales/pt-pt.translation';
import { ru } from './secondary-locales/ru.translation';
import { tr } from './secondary-locales/tr.translation';
import { uk } from './secondary-locales/uk.translation';
import { zhCn } from './secondary-locales/zh-cn.translation';
import { zhTw } from './secondary-locales/zh-tw.translation';

const RAW_PACKS = {
	it, 'pt-PT': ptPt, 'pt-BR': ptBr, ru, uk, pl, hr, tr, ar, hi, bn, 'zh-CN': zhCn, 'zh-TW': zhTw, ja, ko, id,
} satisfies Readonly<Record<ISecondaryLocale, ISecondaryLocalePack>>;

const PAGE_BASE_OVERRIDES = {
	it: { pages: { lab: { eyebrow: '02 / Laboratorio frontend', commandPalette: 'Palette dei comandi' }, approach: { eyebrow: '03 / Metodo' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Demo' }, contact: { eyebrow: '07 / Contatto', ctaEmail: 'Email', formEmailPlaceholder: 'tu@email.com' } } },
	'pt-PT': { pages: { lab: { eyebrow: '02 / Laboratório frontend', commandPalette: 'Paleta de comandos' }, approach: { eyebrow: '03 / Método' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Demonstrações' }, contact: { eyebrow: '07 / Contacto', ctaEmail: 'Email', formEmailPlaceholder: 'voce@exemplo.pt' } } },
	'pt-BR': { pages: { lab: { eyebrow: '02 / Laboratório frontend', commandPalette: 'Paleta de comandos' }, approach: { eyebrow: '03 / Método' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Demos' }, contact: { eyebrow: '07 / Contato', ctaEmail: 'E-mail', formEmailPlaceholder: 'voce@email.com' } } },
	ru: { pages: { lab: { eyebrow: '02 / Фронтенд-лаборатория', commandPalette: 'Палитра команд' }, approach: { eyebrow: '03 / Подход' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Демо' }, contact: { eyebrow: '07 / Контакт', ctaEmail: 'Эл. почта', formEmailPlaceholder: 'вы@email.com' } } },
	uk: { pages: { lab: { eyebrow: '02 / Фронтенд-лабораторія', commandPalette: 'Палітра команд' }, approach: { eyebrow: '03 / Підхід' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Демо' }, contact: { eyebrow: '07 / Контакт', ctaEmail: 'Ел. пошта', formEmailPlaceholder: 'ви@email.com' } } },
	pl: { pages: { lab: { eyebrow: '02 / Laboratorium frontendu', commandPalette: 'Paleta poleceń' }, approach: { eyebrow: '03 / Podejście' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Dema' }, contact: { eyebrow: '07 / Kontakt', ctaEmail: 'E-mail', formEmailPlaceholder: 'ty@email.com' } } },
	hr: { pages: { lab: { eyebrow: '02 / Frontend laboratorij', commandPalette: 'Paleta naredbi' }, approach: { eyebrow: '03 / Pristup' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Demoi' }, contact: { eyebrow: '07 / Kontakt', ctaEmail: 'E-pošta', formEmailPlaceholder: 'vi@email.com' } } },
	tr: { pages: { lab: { eyebrow: '02 / Frontend laboratuvarı' }, approach: { eyebrow: '03 / Yaklaşım' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Demolar' }, contact: { eyebrow: '07 / İletişim' } } },
	ar: { pages: { lab: { eyebrow: '02 / مختبر الواجهات' }, approach: { eyebrow: '03 / المنهج' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / العروض' }, contact: { eyebrow: '07 / تواصل', formEmailPlaceholder: 'you@example.com' } } },
	hi: { pages: { lab: { eyebrow: '02 / फ्रंटएंड लैब' }, approach: { eyebrow: '03 / तरीका' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / डेमो' }, contact: { eyebrow: '07 / संपर्क', formEmailPlaceholder: 'aap@example.com' } } },
	bn: { pages: { lab: { eyebrow: '02 / ফ্রন্টএন্ড ল্যাব' }, approach: { eyebrow: '03 / পদ্ধতি' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / ডেমো' }, contact: { eyebrow: '07 / যোগাযোগ', formEmailPlaceholder: 'apni@example.com' } } },
	'zh-CN': { pages: { lab: { eyebrow: '02 / 前端实验室' }, approach: { eyebrow: '03 / 方法' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / 演示' }, contact: { eyebrow: '07 / 联系', formEmailPlaceholder: 'you@example.com' } } },
	'zh-TW': { pages: { lab: { eyebrow: '02 / 前端實驗室' }, approach: { eyebrow: '03 / 方法' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / 示範' }, contact: { eyebrow: '07 / 聯絡', formEmailPlaceholder: 'you@example.com' } } },
	ja: { pages: { lab: { eyebrow: '02 / フロントエンドラボ' }, approach: { eyebrow: '03 / 進め方' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / デモ' }, contact: { eyebrow: '07 / 連絡', formEmailPlaceholder: 'you@example.com' } } },
	ko: { pages: { lab: { eyebrow: '02 / 프론트엔드 랩' }, approach: { eyebrow: '03 / 접근법' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / 데모' }, contact: { eyebrow: '07 / 연락', formEmailPlaceholder: 'you@example.com' } } },
	id: { pages: { lab: { eyebrow: '02 / Lab frontend' }, approach: { eyebrow: '03 / Pendekatan' }, docker: { eyebrow: '05 / Docker' }, demos: { eyebrow: '06 / Demo' }, contact: { eyebrow: '07 / Kontak', formEmailPlaceholder: 'anda@contoh.com' } } },
} satisfies Readonly<Record<ISecondaryLocale, ITranslationOverlay>>;

const DEEP_COMPLETIONS: Readonly<Partial<Record<ISecondaryLocale, ITranslationOverlay>>> = {
	it: { pages: { docker: { sourceLink: 'Codice sorgente' } } },
	'pt-PT': {
		pages: { home: {
			panelOverviewDetail: 'Servidor MCP independente do projeto, com capacidades explícitas e fluxos de plugins para agentes.', panelWorkflowsDetail: 'Análise estática de fontes API com exportações para Postman, Bruno, Insomnia, HAR, OpenAPI e cURL.', panelQualityDetail: 'Biblioteca TypeScript de modelação, transformação e validação com cobertura Vitest exaustiva.', panelMobileDetail: 'CLI e pacote TypeScript publicados para cifrar chaves e ficheiros de ambiente.', panelToolingDetail: 'CV Vue bilingue validado com Zod e afinado para impressão em papel real.', panelDeliveryDetail: 'Gestor desktop local com Tauri e SQLite, sem conta cloud nem telemetria.',
		} },
	},
	'pt-BR': {
		pages: { home: {
			panelOverviewDetail: 'Servidor MCP independente do projeto, com capacidades explícitas e fluxos de plugins para agentes.', panelWorkflowsDetail: 'Análise estática de fontes API com exportações para Postman, Bruno, Insomnia, HAR, OpenAPI e cURL.', panelQualityDetail: 'Biblioteca TypeScript de modelagem, transformação e validação com cobertura Vitest completa.', panelMobileDetail: 'CLI e pacote TypeScript publicados para criptografar chaves e arquivos de ambiente.', panelToolingDetail: 'CV Vue bilíngue validado com Zod e ajustado para impressão em papel real.', panelDeliveryDetail: 'Gerenciador desktop local com Tauri e SQLite, sem conta na nuvem nem telemetria.',
		} },
	},
	ru: {
		pages: { home: {
			panelOverviewDetail: 'Независимый от проекта MCP-сервер с явными возможностями и потоками плагинов для агентов.', panelWorkflowsDetail: 'Статический анализ API-исходников с экспортом в Postman, Bruno, Insomnia, HAR, OpenAPI и cURL.', panelQualityDetail: 'Библиотека TypeScript для моделирования, преобразования и валидации с исчерпывающим покрытием Vitest.', panelMobileDetail: 'Опубликованные TypeScript CLI и пакет для шифрования ключей и файлов окружения.', panelToolingDetail: 'Двуязычное Vue-CV, проверенное Zod и настроенное для реальной печати.', panelDeliveryDetail: 'Локальный desktop-менеджер на Tauri и SQLite без облачной учётной записи и телеметрии.',
		} },
	},
	uk: {
		pages: {
			home: { panelOverviewDetail: 'Незалежний від проєкту MCP-сервер з явними можливостями і потоками плагінів для агентів.', panelWorkflowsDetail: 'Статичний аналіз API-вихідників з експортом у Postman, Bruno, Insomnia, HAR, OpenAPI і cURL.', panelQualityDetail: 'TypeScript-бібліотека моделювання, перетворення й валідації з вичерпним покриттям Vitest.', panelMobileDetail: 'Опубліковані TypeScript CLI і пакет для шифрування ключів та файлів середовища.', panelToolingDetail: 'Двомовне Vue-CV, перевірене Zod і налаштоване для реального друку.', panelDeliveryDetail: 'Локальний desktop-менеджер на Tauri й SQLite без хмарного облікового запису та телеметрії.', monitorChartSignal: 'сигнал продукту / 2026' },
			lab: { metricProductLabel: 'Сигнал продукту', metricProductTitle: 'Панель має розкрити рішення.', metricProductValueLabel: 'ясність процесу', metricProductNote: 'Сигнали згруповані за процесом, а не за показовою метрикою.', metricQualityLabel: 'Сигнал якості', metricQualityTitle: 'Якість — видима операційна метрика.', metricQualityValueLabel: 'покриття критичних шляхів', metricQualityNote: 'Тести, семантика і продуктивність належать до спільного обговорення доставки.', metricDeliveryLabel: 'Сигнал доставки', metricDeliveryTitle: 'Один інтерфейс — кілька поверхонь.', metricDeliveryValueLabel: 'доставка web + Android', metricDeliveryNote: 'Адаптивний продукт ураховує наступний пристрій до переписування.', demosHeading: 'Візуалізація даних', motionNote: 'Рух необов’язковий. Лабораторія залишається корисною, коли необов’язкову анімацію вимкнено.', kpiProductFlows: 'критичні процеси', kpiProductStates: 'перевірені стани UI', kpiProductBudget: 'бюджет взаємодії', kpiQualityIssues: 'блокувальні проблеми доступності', kpiQualityStates: 'перевірені стани', kpiQualityBudget: 'бюджет взаємодії', kpiDeliveryChecks: 'контрольні точки релізу', kpiDeliveryPaths: 'шляхи розгортання', kpiDeliveryUptime: 'доступність процесу' },
		},
	},
	pl: {
		pages: {
			home: { panelOverviewDetail: 'Niezależny od projektu serwer MCP z jawnymi możliwościami i przepływami wtyczek dla agentów.', panelWorkflowsDetail: 'Statyczna analiza źródeł API z eksportem do Postman, Bruno, Insomnia, HAR, OpenAPI i cURL.', panelQualityDetail: 'Biblioteka TypeScript do modelowania, transformacji i walidacji z pełnym zakresem testów Vitest.', panelMobileDetail: 'Opublikowane CLI i pakiet TypeScript do szyfrowania kluczy oraz plików środowiskowych.', panelToolingDetail: 'Dwujęzyczne CV Vue zweryfikowane przez Zod i dopasowane do prawdziwego wydruku.', panelDeliveryDetail: 'Lokalny menedżer desktopowy Tauri i SQLite bez konta chmurowego oraz telemetrii.', monitorChartSignal: 'sygnał produktu / 2026' },
			lab: { metricProductLabel: 'Sygnał produktu', metricProductTitle: 'Panel powinien ujawniać decyzję.', metricProductValueLabel: 'jasność procesu', metricProductNote: 'Sygnały są grupowane według procesu, nie metryki dla efektu.', metricQualityLabel: 'Sygnał jakości', metricQualityTitle: 'Jakość jest widoczną miarą operacyjną.', metricQualityValueLabel: 'pokrycie krytycznych ścieżek', metricQualityNote: 'Testy, semantyka i wydajność należą do tej samej rozmowy o dostawie.', metricDeliveryLabel: 'Sygnał dostarczenia', metricDeliveryTitle: 'Jeden interfejs, wiele powierzchni.', metricDeliveryValueLabel: 'dostawa web + Android', metricDeliveryNote: 'Praca responsywna uwzględnia następne urządzenie przed przepisaniem.', kpiProductFlows: 'krytyczne procesy', kpiProductStates: 'przetestowane stany UI', kpiProductBudget: 'budżet interakcji', kpiQualityIssues: 'blokujące problemy dostępności', kpiQualityStates: 'sprawdzone stany', kpiQualityBudget: 'budżet interakcji', kpiDeliveryChecks: 'punkty kontroli wydania', kpiDeliveryPaths: 'ścieżki wdrożenia', kpiDeliveryUptime: 'dostępność procesu' },
		},
	},
	hr: {
		pages: {
			home: { panelOverviewDetail: 'MCP poslužitelj neovisan o projektu s jasnim mogućnostima i tijekovima dodataka za agente.', panelWorkflowsDetail: 'Statička analiza API izvora s izvozom za Postman, Bruno, Insomnia, HAR, OpenAPI i cURL.', panelQualityDetail: 'TypeScript knjižnica modeliranja, pretvorbe i provjere s iscrpnom Vitest površinom.', panelMobileDetail: 'Objavljeni TypeScript CLI i paket za šifriranje ključeva i datoteka okruženja.', panelToolingDetail: 'Dvojezični Vue CV potvrđen Zodom i podešen za stvarni papirni ispis.', panelDeliveryDetail: 'Lokalni Tauri i SQLite desktop upravitelj bez računa u oblaku ili telemetrije.', monitorChartSignal: 'signal proizvoda / 2026' },
			lab: { metricProductLabel: 'Signal proizvoda', metricProductTitle: 'Nadzorna ploča treba otkriti odluku.', metricProductValueLabel: 'jasnoća tijeka', metricProductNote: 'Signali se grupiraju po tijeku, a ne po metričkoj vrijednosti za dojam.', metricQualityLabel: 'Signal kvalitete', metricQualityTitle: 'Kvaliteta je vidljiva operativna metrika.', metricQualityValueLabel: 'pokrivenost kritičnih tijekova', metricQualityNote: 'Testiranje, semantika i izvedba pripadaju istoj razgovoru o isporuci.', metricDeliveryLabel: 'Signal isporuke', metricDeliveryTitle: 'Jedno sučelje, više površina.', metricDeliveryValueLabel: 'web + Android isporuka', metricDeliveryNote: 'Prilagodljiv proizvod razmatra sljedeći uređaj prije prepisivanja.', weekStart: 'Tjedan 01', weekEnd: 'Tjedan 08', motionNote: 'Pokret nije obavezan. Laboratorij ostaje upotrebljiv kad se nebitna animacija isključi.', kpiProductFlows: 'kritični tijekovi', kpiProductStates: 'testirana UI stanja', kpiProductBudget: 'budžet interakcije', kpiQualityIssues: 'blokirajući problemi pristupačnosti', kpiQualityStates: 'provjerena stanja', kpiQualityBudget: 'budžet interakcije', kpiDeliveryChecks: 'kontrolne točke izdanja', kpiDeliveryPaths: 'putovi objave', kpiDeliveryUptime: 'dostupnost tijeka', experimentsEyebrow: 'Sustavi interakcije', motionEyebrow: 'Vrijeme gibanja', a11yEyebrow: 'Pristupačnost + obrasci', concurrencyEyebrow: 'Istodobno stanje', layoutEyebrow: 'Prilagodljiv laboratorij', dataEyebrow: 'Podatkovna površina', dataPlaceholder: 'Pokušajte A-02 ili C-01', stateEyebrow: 'Automat stanja' },
			demos: { showcaseEyebrow: '07 / Interaktivna vitrina', gamesFullscreen: 'Otvori igraonicu preko cijelog zaslona', gamesExitFullscreen: 'Vrati veličinu igraonice', showcaseDepthKicker: 'CSS prostorni sustav', showcaseFlowKicker: 'Generativna koreografija', showcaseSignalKicker: 'Prilagodljiva simulacija', deprecatedNotice: 'Neki su demoi ispod starije Netlify gradnje; poveznice ostaju dok su izvornici dostupni.', gameEyebrow: 'Laboratorij interakcije', reactionEyebrow: 'Vrijeme reakcije', memoryEyebrow: 'Raspodijeljeno stanje', diceEyebrow: 'Vjerojatnost', diceDetail: 'Šest jednakih ishoda, kratka povijest i bez postavljanja između rundi.', rpsEyebrow: 'Igra odluke', rpsTitle: 'Pročitajte sljedeći potez.', rpsDetail: 'Igrajte kamen, papir ili škare protiv novog izbora računala.', colorEyebrow: 'Percepcija boje', colorDetail: 'Odaberite točan token prije nego što se pojavi sljedeća boja.', colorScore: 'pogotci', tapEyebrow: 'Brza interakcija', tapDetail: 'Dodirujte dok prsten napretka ne dosegne cilj ove runde.', guessEyebrow: 'Pretraživanje broja' },
			contact: { portraitCaption: 'Frontend proizvoda · Angular · mobilna isporuka · alati' },
		},
	},
} satisfies Readonly<Partial<Record<ISecondaryLocale, ITranslationOverlay>>>;

function mergeOverlays(left: ITranslationOverlay, right: ITranslationOverlay): ITranslationOverlay {
	const merge = (a: unknown, b: unknown): unknown => {
		if (!b || typeof b !== 'object' || Array.isArray(b)) return b;
		if (!a || typeof a !== 'object' || Array.isArray(a)) return b;
		const result: Record<string, unknown> = { ...(a as Record<string, unknown>) };
		for (const [key, value] of Object.entries(b as Record<string, unknown>)) {
			result[key] = merge(result[key], value);
		}
		return result;
	};
	return merge(left, right) as ITranslationOverlay;
}

function selectPriorityOverlay(translation: ITranslationOverlay): ITranslationOverlay {
	return {
		pages: {
			home: translation.pages?.home,
			work: translation.pages?.work,
			lab: translation.pages?.lab,
			approach: translation.pages?.approach,
			knowledge: translation.pages?.knowledge,
			docker: translation.pages?.docker,
			demos: translation.pages?.demos,
			contact: translation.pages?.contact,
		},
		content: {
			projects: translation.content?.projects,
			capabilities: translation.content?.capabilities,
			knowledgeExamples: translation.content?.knowledgeExamples,
			dockerImages: translation.content?.dockerImages,
			publicLinkDetails: translation.content?.publicLinkDetails,
			terms: translation.content?.terms,
			technologies: translation.content?.technologies,
		},
		seo: translation.seo,
	};
}

const CAPABILITY_IDS = ['product', 'architecture', 'mobile', 'quality', 'systems', 'tooling'] as const;
const CAPABILITY_KEYS = {
	product: 'Product', architecture: 'Architecture', mobile: 'Mobile', quality: 'Quality', systems: 'Systems', tooling: 'Tooling',
} as const;

function deriveApproachOverlay(translation: ITranslationOverlay): ITranslationOverlay {
	const capabilities = translation.content?.capabilities;
	if (!capabilities) return {};
	const approach: Record<string, string> = {};
	for (const id of CAPABILITY_IDS) {
		const capability = capabilities[id];
		if (!capability) continue;
		const prefix = CAPABILITY_KEYS[id];
		if (capability.eyebrow) approach[`capability${prefix}Eyebrow`] = capability.eyebrow;
		if (capability.title) approach[`capability${prefix}Title`] = capability.title;
		if (capability.detail) approach[`capability${prefix}Detail`] = capability.detail;
		if (capability.proof) approach[`capability${prefix}Proof`] = capability.proof;
	}
	return { pages: { approach } };
}

export const SECONDARY_PRIORITY_OVERLAYS = Object.fromEntries(
	Object.entries(RAW_PACKS).map(([locale, pack]) => {
		const id = locale as ISecondaryLocale;
		const selected = selectPriorityOverlay(pack.translation);
		const completed = mergeOverlays(selected, DEEP_COMPLETIONS[id] ?? {});
		const withPageBase = mergeOverlays(completed, PAGE_BASE_OVERRIDES[id]);
		return [id, mergeOverlays(withPageBase, deriveApproachOverlay(withPageBase))];
	}),
) as Readonly<Record<ISecondaryLocale, ITranslationOverlay>>;

const EARTH_STYLES: readonly IEarthTextureStyle[] = ['clouds', 'natural', 'night', 'terrain', 'bathymetry', 'infrared', 'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'kepler-186f', 'proxima-b', 'trappist-1e', 'soccer', 'basketball', 'tennis', 'golf', 'rugby', 'volleyball', 'beach-ball', 'disco', 'cartago-mark', 'cartago-banner', 'portrait'];
const EARTH_COMPLETIONS: Readonly<Partial<Record<ISecondaryLocale, ITranslationOverlay | { readonly presets: Readonly<Record<string, string>> }>>> = {
	hr: { presets: { rugby: 'Ragbi', 'cartago-mark': 'Znak Cartago', 'cartago-banner': 'Pojas Cartago', portrait: 'Portret Cartago' } },
} satisfies Readonly<Partial<Record<ISecondaryLocale, ITranslationOverlay | { readonly presets: Readonly<Record<string, string>> }>>>;

export interface ICompleteEarthLocalLabels {
	readonly categories: ISecondaryLocalePack['earth']['categories'];
	readonly presets: Readonly<Record<IEarthTextureStyle, string>>;
	readonly origins: ISecondaryLocalePack['earth']['origins'];
	readonly closeSphere: string;
}

export const SECONDARY_EARTH_LABELS = Object.fromEntries(
	Object.entries(RAW_PACKS).map(([locale, pack]) => {
		const id = locale as ISecondaryLocale;
		const completion = EARTH_COMPLETIONS[id] as { readonly presets?: Readonly<Record<string, string>> } | undefined;
		const presets = { ...pack.earth.presets, ...completion?.presets };
		for (const style of EARTH_STYLES) {
			if (!presets[style]) throw new Error(`Missing ${id} Earth texture label: ${style}`);
		}
		return [id, { ...pack.earth, presets } as ICompleteEarthLocalLabels];
	}),
) as Readonly<Record<ISecondaryLocale, ICompleteEarthLocalLabels>>;

const CHART_FIELDS = {
	bars: 'chartBars', line: 'chartLine', area: 'chartArea', dots: 'chartDots', pulse: 'chartPulse', wave: 'chartWave', grid: 'chartGrid', stacked: 'chartStacked', scatter: 'chartScatter', radar: 'chartRadar', donut: 'chartDonut', heatmap: 'chartHeatmap', treemap: 'chartTreemap', stream: 'chartStream',
} as const satisfies Readonly<Record<IChartType, string>>;

export const SECONDARY_CHART_LABELS = Object.fromEntries(
	Object.entries(SECONDARY_PRIORITY_OVERLAYS).map(([locale, translation]) => {
		const lab = translation.pages?.lab;
		const labels = Object.fromEntries(
			Object.entries(CHART_FIELDS).map(([type, field]) => {
				const value = lab?.[field];
				if (!value) throw new Error(`Missing ${locale} chart label: ${type}`);
				return [type, value];
			}),
		) as unknown as ISecondaryChartLabels;
		return [locale, labels];
	}),
) as Readonly<Record<ISecondaryLocale, ISecondaryChartLabels>>;
