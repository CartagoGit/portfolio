import type { ITranslationMap } from '../types';

export const workFr: ITranslationMap['pages']['work'] = {
	eyebrow: '01 / Projets', titleLead: 'Des projets concrets, pas', titleEmphasis: 'des exemples de remplissage.', titleTail: '', subtitle: 'Projets en code libre qui représentent le mieux le travail technique.',
	pinnedLabel: 'Projet mis en avant', exploreRepo: 'Explorer le dépôt', mcpNumber: '01 — Infrastructure d’agents', mcpTitle: 'DelendAI', mcpDescription: 'Serveur MCP et système de plugins donnant à chaque projet des capacités concrètes pour des parcours reproductibles.', mcpBullets: '62 capacités|Architecture de plugins|CLI + contrôles CI',
	quickmodelNumber: '02 — Architecture TypeScript', quickmodelTitle: 'QuickModel', quickmodelDescription: 'Bibliothèque TypeScript de modélisation et sérialisation centrée sur les contrats explicites.', quickmodelBullets: 'Modèles sûrs|Sérialisation|Expérience développeur',
	keyerNumber: '03 — Outillage développeur', keyerTitle: 'Keyer', keyerDescription: 'CLI et bibliothèque TypeScript publiées pour gérer secrets et configuration avec une expérience propre.', keyerBullets: 'Conception CLI|Outillage Node.js|Paquet publié',
	alsoPinnedHeading: 'Également mis en avant', printCv: 'Print CV', printCvDetail: 'Vue, validation et E2E · dépôt', zoneless: 'Zoneless Calculator', zonelessDetail: 'Signaux Angular et tests · dépôt', nestgpt: 'NestGpt', nestgptDetail: 'Intégration NestJS et GPT · dépôt', viewOnNpm: 'Voir sur npm',
	directoryEyebrow: 'Surface publique', directoryTitleLead: 'Code, paquets', directoryTitleEmphasis: 'et démos.', directoryTitleTail: '', directorySubtitle: 'Liens publics directs regroupés séparément des dépôts mis en avant.',
	directoryCodeLabel: '01 / CODE', directoryCodeTitle: 'Profil GitHub', directoryCodeDetail: 'Dépôts, travail mis en avant et historique des contributions.', directoryShipLabel: '02 / LIVRAISON', directoryShipTitle: 'Docker Hub', directoryShipDetail: 'Images de conteneur publiques et contexte de livraison.', directoryDemoLabel: '03 / DÉMO', directoryDemoTitle: 'DeathBlitz', directoryDemoDetail: 'Expérience produit interactive publique.', directoryPlayLabel: '04 / JEU', directoryPlayTitle: 'Cartago Tetris', directoryPlayDetail: 'Interaction clavier et état de boucle de jeu.',
};

export const approachFr: ITranslationMap['pages']['approach'] = {
	eyebrow: '03 / Approche', titleLead: 'Des capacités reliées à', titleEmphasis: 'de vrais parcours.', titleTail: '', subtitle: 'Six capacités opérationnelles, chacune ancrée dans du travail produit livré plutôt que dans une ambition abstraite.',
	capabilityProductEyebrow: '01 / Interfaces produit', capabilityProductTitle: 'Opérationnel par conception.', capabilityProductDetail: 'Interfaces pour les personnes qui les utilisent toute la journée : information dense, actions claires et états vides soignés.', capabilityProductProof: 'Interfaces de parcours · formulaires complexes · design d’interaction',
	capabilityArchitectureEyebrow: '02 / Architecture Angular', capabilityArchitectureTitle: 'Explicitement réactif.', capabilityArchitectureDetail: 'Composants autonomes, signaux et contrats typés rendent les changements d’état testables et rapides.', capabilityArchitectureProof: 'Zoneless Calculator · motifs Angular en production',
	capabilityMobileEyebrow: '03 / Livraison mobile', capabilityMobileTitle: 'Un produit, plusieurs surfaces.', capabilityMobileDetail: 'Parcours web conçus pour le toucher, l’espace contraint et une livraison Android prête à publier.', capabilityMobileProof: 'Livraison opérationnelle web + Android',
	capabilityQualityEyebrow: '04 / Tests et qualité', capabilityQualityTitle: 'La confiance est une fonction.', capabilityQualityDetail: 'Une pyramide de tests ciblée, le HTML sémantique et les budgets de performance gardent le produit fiable.', capabilityQualityProof: 'Unitaire → intégration → versions fiables',
	capabilitySystemsEyebrow: '05 / Systèmes de design', capabilitySystemsTitle: 'Cohérent, pas répétitif.', capabilitySystemsDetail: 'Des primitives flexibles produisent des interfaces accessibles sans transformer chaque écran en gabarit.', capabilitySystemsProof: 'Motifs UI réutilisables · états · règles adaptables',
	capabilityToolingEyebrow: '06 / Outillage développeur', capabilityToolingTitle: 'Le frontend a une salle des machines.', capabilityToolingDetail: 'Contrats typés, CLI et MCP transforment le travail répété en parcours fiables.', capabilityToolingProof: 'DelendAI · QuickModel · Keyer',
	experienceEyebrow: '04 / Expérience professionnelle', experienceTitleLead: 'Des parcours complexes,', experienceTitleEmphasis: 'livrés sans bruit.', experienceTitleTail: '', experienceDetail: 'Je construis des interfaces réutilisées au quotidien lorsque rôles, règles durables et formulaires complexes doivent rester compréhensibles sans exposer le code client.', experienceBullets: 'Actions et permissions par rôle|Livraison web et Android|Formulaires résilients et validation progressive|Pratiques d’architecture et de test qui passent à l’échelle',
};

export const knowledgeFr: ITranslationMap['pages']['knowledge'] = {
	eyebrow: '04 / Compétences', titleLead: 'Notes, présentations et', titleEmphasis: 'références ouvertes.', titleTail: '', subtitle: 'Connaissances présentées comme des artefacts consultables plutôt que comme des billets éphémères.',
	tileFrontendLabel: 'Frontend', tileFrontendStack: 'Angular · TypeScript · SCSS', tileFrontendDetail: 'Signaux, SSR, interfaces adaptables et UI accessible pour de vrais parcours.',
	tileMobileLabel: 'Mobile', tileMobileStack: 'Ionic · Capacitor · Android', tileMobileDetail: 'Un même système produit porté du web à des versions tactiles.',
	tileQualityLabel: 'Qualité', tileQualityStack: 'Vitest · Accessibilité · Performance', tileQualityDetail: 'Tests, sémantique et budgets de performance pour exposer les risques tôt.',
	tileToolingLabel: 'Outillage', tileToolingStack: 'Node.js · MCP · Docker', tileToolingDetail: 'CLI, conteneurs et parcours d’agents typés pour une livraison répétable.',
	tileSystemsLabel: 'Systèmes', tileSystemsStack: 'CDK · Storybook · Tokens', tileSystemsDetail: 'Primitives réutilisables qui font évoluer un langage visuel sans tout aplatir.',
	tileBackendLabel: 'Bords backend', tileBackendStack: 'NestJS · API · GPT', tileBackendDetail: 'Frontières d’intégration claires lorsqu’une interface a besoin d’une couche service fiable.',
};

export const dockerFr: ITranslationMap['pages']['docker'] = {
	eyebrow: '05 / Docker', titleLead: 'Environnements', titleEmphasis: 'prêts à utiliser.', titleTail: '', subtitle: 'Images publiques qui réduisent les différences entre une installation locale, une CI et la livraison.',
	terminalHeading: 'Image publique', terminalPull: 'Commande de récupération', terminalStatus: 'Dépôt public vérifié', terminalOpen: 'Ouvrir Docker Hub ↗', terminalAngular: 'Angular', terminalNode: 'Node', terminalDelivery: 'Livraison',
	profileAria: 'Profil Docker Hub', catalogueAria: 'Images Docker publiques', dockerAlt: 'Docker', destinationsAria: 'Destinations de l’image Docker', hubLink: 'Docker Hub', sourceLink: 'Code source',
};
