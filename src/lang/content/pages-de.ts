import type { ITranslationMap } from '../types';

export const workDe: ITranslationMap['pages']['work'] = {
	eyebrow: '01 / Projekte', titleLead: 'Ausgewählte Arbeit, kein', titleEmphasis: 'Füllmaterial.', titleTail: '', subtitle: 'Freie Softwareprojekte, die den technischen Schwerpunkt am besten zeigen.',
	pinnedLabel: 'Hervorgehobenes Projekt', exploreRepo: 'Repository erkunden', mcpNumber: '01 — Agenten-Infrastruktur', mcpTitle: 'DelendAI', mcpDescription: 'MCP-Server und Pluginsystem mit konkreten Fähigkeiten für reproduzierbare Agentenabläufe.', mcpBullets: '62 Fähigkeiten|Plugin-Architektur|CLI + CI-Gates',
	quickmodelNumber: '02 — TypeScript-Architektur', quickmodelTitle: 'QuickModel', quickmodelDescription: 'TypeScript-Bibliothek für Modellierung und Serialisierung mit expliziten Verträgen.', quickmodelBullets: 'Typsichere Modelle|Serialisierung|Entwicklererfahrung',
	keyerNumber: '03 — Entwicklerwerkzeuge', keyerTitle: 'Keyer', keyerDescription: 'Veröffentlichte TypeScript-CLI und Bibliothek für Geheimnisse und Konfiguration mit klarer Bedienung.', keyerBullets: 'CLI-Design|Node.js-Tools|Veröffentlichtes Paket',
	alsoPinnedHeading: 'Ebenfalls ausgewählt', printCv: 'Print CV', printCvDetail: 'Vue, Validierung und E2E · Repository', zoneless: 'Zoneless Calculator', zonelessDetail: 'Angular-Signale und Tests · Repository', nestgpt: 'NestGpt', nestgptDetail: 'NestJS- und GPT-Integration · Repository', viewOnNpm: 'Auf npm ansehen',
	directoryEyebrow: 'Öffentliche Oberfläche', directoryTitleLead: 'Code, Pakete', directoryTitleEmphasis: 'und Demos.', directoryTitleTail: '', directorySubtitle: 'Direkte öffentliche Links, getrennt von den ausgewählten Repositories gruppiert.',
	directoryCodeLabel: '01 / CODE', directoryCodeTitle: 'GitHub-Profil', directoryCodeDetail: 'Repositories, ausgewählte Arbeit und Beitragshistorie.', directoryShipLabel: '02 / LIEFERUNG', directoryShipTitle: 'Docker Hub', directoryShipDetail: 'Öffentliche Container-Images und Lieferkontext.', directoryDemoLabel: '03 / DEMO', directoryDemoTitle: 'DeathBlitz', directoryDemoDetail: 'Öffentliches interaktives Produktexperiment.', directoryPlayLabel: '04 / SPIEL', directoryPlayTitle: 'Cartago Tetris', directoryPlayDetail: 'Tastaturinteraktion und Zustand der Spielschleife.',
};

export const approachDe: ITranslationMap['pages']['approach'] = {
	eyebrow: '03 / Ansatz', titleLead: 'Fähigkeiten verbunden mit', titleEmphasis: 'echte Abläufe.', titleTail: '', subtitle: 'Sechs operative Fähigkeiten, jeweils durch gelieferte Produktarbeit statt abstrakte Ambition belegt.',
	capabilityProductEyebrow: '01 / Produktoberflächen', capabilityProductTitle: 'Operational nach Entwurf.', capabilityProductDetail: 'Oberflächen für tägliche Nutzung: dichte Informationen, klare nächste Schritte und saubere Leerzustände.', capabilityProductProof: 'Ablauflächen · komplexe Formulare · Interaktion',
	capabilityArchitectureEyebrow: '02 / Angular-Architektur', capabilityArchitectureTitle: 'Explizit reaktiv.', capabilityArchitectureDetail: 'Standalone-Komponenten, Signale und typisierte Grenzen machen Zustandsänderungen verständlich und testbar.', capabilityArchitectureProof: 'Zoneless Calculator · Angular in Produktion',
	capabilityMobileEyebrow: '03 / Mobile Lieferung', capabilityMobileTitle: 'Ein Produkt, mehrere Oberflächen.', capabilityMobileDetail: 'Web-Abläufe für Touch, begrenzten Platz und veröffentlichungsbereites Android.', capabilityMobileProof: 'Operative Web- + Android-Lieferung',
	capabilityQualityEyebrow: '04 / Tests und Qualität', capabilityQualityTitle: 'Vertrauen ist ein Feature.', capabilityQualityDetail: 'Fokussierte Tests, semantisches HTML und Leistungsbudgets halten Produktarbeit zuverlässig.', capabilityQualityProof: 'Unittests → Integration → verlässliche Releases',
	capabilitySystemsEyebrow: '05 / Designsysteme', capabilitySystemsTitle: 'Konsistent, nicht repetitiv.', capabilitySystemsDetail: 'Flexible Primitive schaffen zugängliche Oberflächen, ohne jede Ansicht in eine Vorlage zu zwingen.', capabilitySystemsProof: 'UI-Muster · Zustände · anpassbare Regeln',
	capabilityToolingEyebrow: '06 / Entwicklerwerkzeuge', capabilityToolingTitle: 'Das Frontend hat einen Maschinenraum.', capabilityToolingDetail: 'Typisierte Verträge, CLIs und MCP-Werkzeuge machen wiederholte Arbeit zuverlässig.', capabilityToolingProof: 'DelendAI · QuickModel · Keyer',
	experienceEyebrow: '04 / Berufserfahrung', experienceTitleLead: 'Komplexe Abläufe,', experienceTitleEmphasis: 'leise geliefert.', experienceTitleTail: '', experienceDetail: 'Ich baue häufig genutzte Geschäftsobertflächen, in denen Rollen, langlebige Regeln und komplexe Formulare verständlich bleiben müssen, ohne Clientcode oder Daten offenzulegen.', experienceBullets: 'Rollenabhängige Aktionen und Rechte|Web- und Android-Lieferung|Resiliente Formulare und progressive Validierung|Architektur- und Testpraktiken, die skalieren',
};

export const knowledgeDe: ITranslationMap['pages']['knowledge'] = {
	eyebrow: '04 / Wissen', titleLead: 'Notizen, Vorträge und', titleEmphasis: 'offene Referenzen.', titleTail: '', subtitle: 'Wissen als durchsuchbare Artefakte statt flüchtiger Blogbeiträge.',
	tileFrontendLabel: 'Frontend', tileFrontendStack: 'Angular · TypeScript · SCSS', tileFrontendDetail: 'Signale, SSR, anpassbare Oberflächen und barrierefreie UI für reale Abläufe.',
	tileMobileLabel: 'Mobil', tileMobileStack: 'Ionic · Capacitor · Android', tileMobileDetail: 'Ein Produktsystem vom Web zu touch-orientierten Releases.',
	tileQualityLabel: 'Qualität', tileQualityStack: 'Vitest · Barrierefreiheit · Leistung', tileQualityDetail: 'Tests, Semantik und Leistungsbudgets machen Risiken früh sichtbar.',
	tileToolingLabel: 'Werkzeuge', tileToolingStack: 'Node.js · MCP · Docker', tileToolingDetail: 'CLIs, Container und typisierte Agentenabläufe für wiederholbare Lieferung.',
	tileSystemsLabel: 'Systeme', tileSystemsStack: 'CDK · Storybook · Tokens', tileSystemsDetail: 'Primitive, die eine visuelle Sprache skalieren, ohne sie zu verflachen.',
	tileBackendLabel: 'Backend-Grenzen', tileBackendStack: 'NestJS · APIs · GPT', tileBackendDetail: 'Klare Integrationsgrenzen, wenn ein Frontend eine verlässliche Serviceschicht braucht.',
};

export const dockerDe: ITranslationMap['pages']['docker'] = {
	eyebrow: '05 / Docker', titleLead: 'Entwicklungsumgebungen', titleEmphasis: 'direkt einsatzbereit.', titleTail: '', subtitle: 'Öffentliche Images reduzieren Unterschiede zwischen lokaler Installation, CI und Lieferung.',
	terminalHeading: 'Öffentliches Image', terminalPull: 'Abrufbefehl', terminalStatus: 'Öffentliches Repository geprüft', terminalOpen: 'Docker Hub öffnen ↗', terminalAngular: 'Angular', terminalNode: 'Node', terminalDelivery: 'Lieferung',
	profileAria: 'Docker-Hub-Profil', catalogueAria: 'Öffentliche Docker-Images', dockerAlt: 'Docker', destinationsAria: 'Ziele des Docker-Images', hubLink: 'Docker Hub', sourceLink: 'Quellcode',
};
