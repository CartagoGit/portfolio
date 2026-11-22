import type { ITranslationMap } from './types';

/**
 * Spanish translation map. Every key must satisfy `ITranslationMap`;
 * a missing key fails the typecheck. This is the runtime fallback
 * target for `TranslateService` when English is unavailable.
 */
export const es: ITranslationMap = {
	chrome: {
		header: {
			brand: 'Cartago',
			navWork: 'Proyectos',
			navLab: 'Laboratorio',
			navAbout: 'Enfoque',
			navKnowledge: 'Conocimientos',
			navDocker: 'Docker',
			navDemos: 'Demos',
			navContact: 'Contacto',
			themeAriaLabel: 'Cambiar tema de color',
			themeOpenLabel: 'Abrir menú de temas',
		},
		footer: {
			tagline: 'Cartago — Frontend product engineer.',
			availability: 'Disponible para proyectos de producto',
			connectLabel: 'Conectar',
			rights: 'Todos los derechos reservados.',
			backToTop: 'Volver arriba ↑',
		},
		commandPalette: {
			title: 'Paleta de comandos',
			close: 'Cerrar paleta de comandos',
			searchLabel: 'Buscar comandos de producto',
			searchPlaceholder: 'Prueba con ‘work’ o ‘contact’',
			cmdViewWork: 'Ver trabajo seleccionado',
			cmdLab: 'Explorar el laboratorio frontend',
			cmdContact: 'Iniciar una conversación',
		},
	},
	pages: {
		home: {
			eyebrow: 'Frontend product engineer',
			titleLead: 'Frontend operacional para',
			titleEmphasis: 'equipos de producto',
			titleTail: 'que entregan todos los días.',
			subtitle:
				'Angular, TypeScript y entrega móvil, organizados en torno a workflows y no métricas de vanidad.',
			role: 'Construyo el frontend de sistemas que se usan todo el día: web, Android y puntos de interacción.',
			intro: 'ERP, logística, inventario y personal con permisos por rol, reglas de negocio y arquitecturas frontend que pueden mantenerse durante años. Angular + SCSS, Ionic cuando hace falta Android, Material para el sistema de diseño.',
			ctaWork: 'Ver trabajo',
			ctaContact: 'Hablemos',
			capabilitiesTitle: 'Capacidades',
			playgroundTitle: 'Playground',
			telemetryTitle: 'Telemetría',
			panelOverviewLabel: 'Angular',
			panelOverviewMetric: 'UI',
			panelOverviewDetail:
				'Servidor MCP agnóstico al proyecto con capacidades explícitas y workflows de plugins para agentes.',
			panelWorkflowsLabel: 'TypeScript',
			panelWorkflowsMetric: 'TS',
			panelWorkflowsDetail:
				'Análisis estático de fuentes API con exportación a Postman, Bruno, Insomnia, HAR, OpenAPI y cURL.',
			panelQualityLabel: 'Vitest',
			panelQualityMetric: 'VT',
			panelQualityDetail:
				'Librería TypeScript de modelado, transformación y validación con una superficie Vitest exhaustiva.',
			panelMobileLabel: 'Ionic + Capacitor',
			panelMobileMetric: 'MOB',
			panelMobileDetail:
				'CLI y paquete TypeScript publicado para cifrar claves y archivos de entorno.',
			panelToolingLabel: 'Bun',
			panelToolingMetric: 'BUN',
			panelToolingDetail:
				'CV bilingüe en Vue, validado con Zod y ajustado para impresión real.',
			panelDeliveryLabel: 'Docker',
			panelDeliveryMetric: 'CTR',
			panelDeliveryDetail:
				'Gestor de escritorio local-first con Tauri y SQLite, sin cuenta cloud ni telemetría.',
			monitorChrome: 'consola interactiva de proyectos',
			monitorProjects: 'Proyectos',
			monitorTechnologies: 'Tecnologías',
			monitorPlatforms: 'Plataformas',
			monitorChoose: 'Elige un proyecto para ver su alcance y estado verificados. Usa los controles de visualización para explorar la demo.',
			monitorOpen: 'Abrir destino ↗',
			monitorProjectStatus: 'Proyecto open source público',
			monitorPlatformStatus: 'Plataforma pública de entrega o contacto',
			monitorTechnologyStatus: 'Tecnología del toolkit de producción',
			monitorPlatformDetail: '{label} es un destino público para mi trabajo, publicaciones, código o contacto profesional directo.',
			monitorTechnologyDetail: '{label} forma parte del toolkit frontend y de entrega usado para construir, probar y publicar estos proyectos.',
			monitorPublicProfile: 'Perfil público',
			monitorNoteLead: 'Construido con estado explícito,',
			monitorNoteTail: 'mejora progresiva y cuidado.',
			telemetryProductLabel: 'Señal de producto',
			telemetryProductTitle: 'Un dashboard debe revelar una decisión.',
			telemetryProductValueLabel: 'claridad de workflow',
			telemetryProductNote:
				'Las señales se agrupan por workflow, no por una métrica de vanidad.',
			telemetryQualityLabel: 'Señal de calidad',
			telemetryQualityTitle:
				'La calidad es una métrica visible de operación.',
			telemetryQualityValueLabel: 'cobertura de flujo crítico',
			telemetryQualityNote:
				'Testing, semántica y rendimiento comparten la misma conversación de entrega.',
			telemetryDeliveryLabel: 'Señal de entrega',
			telemetryDeliveryTitle: 'Una interfaz, más de una superficie.',
			telemetryDeliveryValueLabel: 'entrega web + Android',
			telemetryDeliveryNote:
				'El producto responsive piensa en el siguiente dispositivo antes de que se convierta en reescritura.',
		},
		work: {
			eyebrow: '01 / Proyectos',
			titleLead: 'Trabajo destacado, no',
			titleEmphasis: 'relleno.',
			titleTail: '',
			subtitle:
				'Proyectos open-source que mejor representan el foco técnico.',
			pinnedLabel: 'Proyecto destacado',
			exploreRepo: 'Explorar repositorio',
			mcpNumber: '01 — Infraestructura de agentes',
			mcpTitle: 'DelendAI',
			mcpDescription:
				'Un servidor MCP y sistema de plugins que da a cada proyecto capacidades concretas para workflows de agentes reproducibles.',
			mcpBullets: '62 capacidades|Arquitectura de plugins|CLI + controles CI',
			quickmodelNumber: '02 — Arquitectura TypeScript',
			quickmodelTitle: 'QuickModel',
			quickmodelDescription:
				'Una librería TypeScript de modelado y serialización centrada en contratos explícitos y fronteras de datos fiables.',
			quickmodelBullets:
				'Modelos type-safe|Serialización|Developer experience',
			keyerNumber: '03 — Tooling para developers',
			keyerTitle: 'Keyer',
			keyerDescription:
				'Un CLI y librería TypeScript publicados para gestionar secretos y flujos de configuración con una developer experience más limpia.',
			keyerBullets: 'CLI design|Node.js tooling|Paquete publicado',
			alsoPinnedHeading: 'También destacado',
			printCv: 'Print CV',
			printCvDetail: 'Vue, validación y E2E · repositorio',
			zoneless: 'Zoneless Calculator',
			zonelessDetail: 'Signals de Angular y tests · repositorio',
			nestgpt: 'NestGpt',
			nestgptDetail: 'Integración NestJS y GPT · repositorio',
			viewOnNpm: 'Ver en npm',
			directoryEyebrow: 'Superficie pública',
			directoryTitleLead: 'Código, paquetes',
			directoryTitleEmphasis: 'y demos.',
			directoryTitleTail: '',
			directorySubtitle:
				'Enlaces públicos directos agrupados aparte de los repositorios destacados.',
			directoryCodeLabel: '01 / CÓDIGO',
			directoryCodeTitle: 'Perfil de GitHub',
			directoryCodeDetail:
				'Repositorios, trabajo destacado y trayectoria de contribuciones.',
			directoryShipLabel: '02 / ENTREGA',
			directoryShipTitle: 'Docker Hub',
			directoryShipDetail:
				'Imágenes de contenedor públicas y contexto de entrega.',
			directoryDemoLabel: '03 / DEMO',
			directoryDemoTitle: 'DeathBlitz',
			directoryDemoDetail: 'Experimento público interactivo de producto.',
			directoryPlayLabel: '04 / JUEGO',
			directoryPlayTitle: 'Cartago Tetris',
			directoryPlayDetail:
				'Interacción de teclado y estado de game-loop.',
		},
		lab: {
			eyebrow: '02 / Laboratorio',
			titleLead: 'Un laboratorio para',
			titleEmphasis: 'superficies interactivas',
			titleTail: 'que merecen entregarse.',
			subtitle:
				'Reordena un workflow, observa cómo se ilumina y revisa el estado subyacente.',
			playgroundHeading: 'Playground',
			playgroundDescription:
				'Ordena las cuatro fases de un workflow de producto saludable. Reordénalas y observa cómo reacciona el medidor de readiness.',
			playgroundReady: 'Workflow listo',
			playgroundReset: 'Restablecer orden',
			playgroundDispatch: 'Despachar',
			stepDiscoverLabel: 'Descubrir',
			stepDiscoverHint: 'Entender a la persona y al workflow.',
			stepModelLabel: 'Modelar',
			stepModelHint: 'Hacer explícitos el estado y las restricciones.',
			stepBuildLabel: 'Construir',
			stepBuildHint: 'Componer una interfaz útil y responsive.',
			stepVerifyLabel: 'Verificar',
			stepVerifyHint: 'Probar el journey antes de entregar.',
			demosHeading: 'Demos interactivos',
			chartPickerGroup: 'Elige una representación del gráfico',
			metricPickerGroup: 'Elige una perspectiva del dashboard',
			commandPalette: 'Paleta de comandos',
			visualiseAs: 'Visualizar como',
			weekTrend: 'Tendencia 8 semanas',
			liveBadge: 'EN VIVO',
			weekStart: 'Semana 01',
			weekEnd: 'Semana 08',
			completedCount: '{count} loops completados',
			completedCountSingular: '{count} loop completado',
			resetButton: 'Reiniciar',
			motionNote:
				'La animación es opcional. Esta página respeta prefers-reduced-motion y se queda totalmente usable sin ella.',
			motionNoteCode: 'prefers-reduced-motion',
			playgroundCompleteMessage:
				'Loop completo — el workflow de producto está en un orden deliberado.',
			playgroundIncompleteMessage:
				'Arrastra los pasos al orden en el que un producto debería entregarse.',
		},
		approach: {
			eyebrow: '03 / Enfoque',
			titleLead: 'Capacidades conectadas a',
			titleEmphasis: 'workflows reales.',
			titleTail: '',
			subtitle:
				'Seis capacidades operativas, cada una anclada en trabajo de producto entregado y no en ambición abstracta.',
			capabilityProductEyebrow: '01 / Interfaces de producto',
			capabilityProductTitle: 'Operacional por diseño.',
			capabilityProductDetail:
				'Interfaces para personas que las usan todo el día: información densa, próximas acciones claras y empty states elegantes.',
			capabilityProductProof:
				'Interfaces de workflow · formularios complejos · interaction design',
			capabilityArchitectureEyebrow: '02 / Arquitectura Angular',
			capabilityArchitectureTitle: 'Explícitamente reactivo.',
			capabilityArchitectureDetail:
				'Componentes standalone, signals y fronteras tipadas hacen que los cambios de estado sean comprensibles, testeables y rápidos.',
			capabilityArchitectureProof:
				'Zoneless Calculator · patrones Angular en producción',
			capabilityMobileEyebrow: '03 / Entrega móvil',
			capabilityMobileTitle: 'Un producto, más superficies.',
			capabilityMobileDetail:
				'Workflows web diseñados para touch, espacio limitado y entrega Android release-ready — no simples pantallas de escritorio encogidas.',
			capabilityMobileProof: 'Entrega operacional web + Android',
			capabilityQualityEyebrow: '04 / Testing y calidad',
			capabilityQualityTitle: 'La confianza es una feature.',
			capabilityQualityDetail:
				'Una pirámide de testing enfocada, HTML semántico y presupuestos de rendimiento mantienen el producto fiable según crece.',
			capabilityQualityProof: 'Unit → integración → releases fiables',
			capabilitySystemsEyebrow: '05 / Design systems',
			capabilitySystemsTitle: 'Consistente, no repetitivo.',
			capabilitySystemsDetail:
				'Primitivas flexibles convierten un lenguaje visual en interfaces reutilizables y accesibles sin aplanar cada pantalla en una plantilla.',
			capabilitySystemsProof:
				'Patrones UI reutilizables · estados · reglas responsive',
			capabilityToolingEyebrow: '06 / Tooling para developers',
			capabilityToolingTitle: 'El frontend tiene una sala de máquinas.',
			capabilityToolingDetail:
				'Contratos tipados, CLIs y tooling MCP convierten el trabajo repetitivo de ingeniería en workflows fiables para equipos y agentes.',
			capabilityToolingProof: 'DelendAI · QuickModel · Keyer',
			experienceEyebrow: '04 / Experiencia profesional',
			experienceTitleLead: 'Workflows complejos,',
			experienceTitleEmphasis: 'entregados en silencio.',
			experienceTitleTail: '',
			experienceDetail:
				'Construyo interfaces de uso repetido donde roles, reglas longevas y formularios complejos deben seguir siendo entendibles. Puedo hablar de patrones y decisiones sin exponer código de cliente, datos ni detalles de producto.',
			experienceBullets:
				'Acciones y permisos por rol|Entrega web + Android|Formularios resilientes con validación progresiva|Prácticas de arquitectura y testing que escalan',
		},
		knowledge: {
			eyebrow: '04 / Conocimientos',
			titleLead: 'Notas, charlas y',
			titleEmphasis: 'referencias abiertas.',
			titleTail: '',
			subtitle:
				'Conocimiento expuesto como artefactos buscables en lugar de posts de blog efímeros.',
			tileFrontendLabel: 'Frontend',
			tileFrontendStack: 'Angular · TypeScript · SCSS',
			tileFrontendDetail:
				'Signals, SSR, interfaces responsive y UI accesible para workflows reales.',
			tileMobileLabel: 'Móvil',
			tileMobileStack: 'Ionic · Capacitor · Android',
			tileMobileDetail:
				'Un mismo sistema de producto llevado de web a entregas touch-first.',
			tileQualityLabel: 'Calidad',
			tileQualityStack: 'Vitest · Accesibilidad · Rendimiento',
			tileQualityDetail:
				'Tests, semántica y presupuestos de rendimiento que exponen el riesgo temprano.',
			tileToolingLabel: 'Tooling',
			tileToolingStack: 'Node.js · MCP · Docker',
			tileToolingDetail:
				'CLIs, contenedores y workflows de agentes tipados para entrega repetible.',
			tileSystemsLabel: 'Sistemas',
			tileSystemsStack: 'CDK · Storybook · Tokens',
			tileSystemsDetail:
				'Primitivas reutilizables que hacen escalar un lenguaje visual sin aplanarlo.',
			tileBackendLabel: 'Bordes backend',
			tileBackendStack: 'NestJS · APIs · GPT',
			tileBackendDetail:
				'Fronteras de integración claras cuando un frontend necesita una capa de servicio fiable.',
		},
		docker: {
			eyebrow: '05 / Docker',
			titleLead: 'Superficies de entrega',
			titleEmphasis: 'reproducibles.',
			titleTail: '',
			subtitle:
				'Imágenes de contenedor que mantienen juntos los entornos de producto y tooling entre máquinas.',
			terminalHeading: 'Docker Hub / cartagodocker',
			terminalPull: '$ docker pull cartagodocker/<image>',
			terminalStatus: 'imágenes públicas disponibles',
			terminalOpen: 'Abrir Docker Hub ↗',
			terminalAngular: 'Angular',
			terminalNode: 'Node',
			terminalDelivery: 'Entrega',
		},
		demos: {
			eyebrow: '06 / Demos',
			titleLead: 'Pequeños experimentos,',
			titleEmphasis: 'entregados de verdad.',
			titleTail: '',
			subtitle:
				'Cada demo es una interfaz autocontenida pensada para que se le pueda tocar — teclado, ratón o touch.',
			deprecatedNotice:
				'Algunas demos siguientes son builds antiguas en Netlify; permanecen enlazadas mientras los originales sigan accesibles.',
			openDemo: 'Abrir demo ↗',
			gameEyebrow: 'Laboratorio de interacción',
			gameHeading: 'Prueba reflejos y feedback inmediato.',
			gameDetail:
				'Pulsa la señal activa y observa cómo cambia el estado sin recargar la interfaz.',
			gameSignalsLabel: 'señales atrapadas',
			reactionEyebrow: 'Tiempo de respuesta',
			reactionHeading: 'Espera, observa y pulsa.',
			reactionDetail:
				'Una superficie mide una acción simple y muestra el mejor tiempo de reacción de la sesión.',
			memoryEyebrow: 'Estado distribuido',
			memoryHeading: 'Encuentra las seis parejas.',
			memoryDetail:
				'Cada carta conserva su estado abierto, emparejado u oculto durante la sesión.',
			tabReflex: 'Reflejos',
			tabReaction: 'Reacción',
			tabMemory: 'Memoria',
			reactionStart: 'Empezar',
			reactionWait: 'Espera…',
			reactionNow: '¡Ahora!',
			reactionEarly: 'Muy pronto · repetir',
			reactionAgain: 'otra vez',
			reactionBest: 'Mejor',
			memoryReset: 'Reiniciar',
			memoryMoves: 'movimientos',
		},
		contact: {
			eyebrow: '07 / Contacto',
			titleLead: 'Empieza una',
			titleEmphasis: 'conversación con cabeza.',
			titleTail: '',
			subtitle:
				'Elige el canal que mejor se adapte a la pregunta. Los briefs cortos son bienvenidos; los largos, más aún.',
			ctaEmail: 'Email',
			ctaLinkedin: 'LinkedIn',
			ctaGithub: 'GitHub',
			ctaDockerHub: 'Docker Hub',
			formAria: 'Formulario de contacto',
			formEmailLabel: 'Tu email',
			formEmailPlaceholder: 'tu@empresa.com',
			formMessageLabel: '¿Qué estás construyendo?',
			formMessagePlaceholder: 'Unos cuantos detalles útiles…',
			formSubmit: 'Enviar una presentación',
			formFeedback:
				'Gracias — esta demo valida la interacción. Conéctala al email o servicio de formularios que prefieras antes del lanzamiento.',
		},
	},
	seo: {
		description:
			'Portfolio de Mario Cabrero Volarich: frontend de producto, Angular, TypeScript, móvil y tooling.',
	},
	lang: {
		languagesLabel: 'Idiomas',
		themeMenuLabel: 'Temas',
		languages: {
			en: { label: 'English', detail: 'US + UK' },
			es: { label: 'Español', detail: 'España' },
			fr: { label: 'Français', detail: 'Francia' },
			de: { label: 'Deutsch', detail: 'Alemania' },
		},
		themes: {
			dark: { label: 'Medianoche', detail: 'Por defecto · cian neón' },
			light: { label: 'Papel', detail: 'Claro · azul cobalto' },
			midnight: { label: 'Azul profundo', detail: 'Violeta · cian' },
			ocean: { label: 'Marea', detail: 'Teal · aqua' },
			forest: { label: 'Bosque', detail: 'Verde · mostaza' },
			sunset: { label: 'Atardecer', detail: 'Coral · ámbar' },
			solar: { label: 'Solar', detail: 'Ámbar · rosa' },
			mono: { label: 'Grafito', detail: 'Escala de grises · tinta' },
		},
	},
};
