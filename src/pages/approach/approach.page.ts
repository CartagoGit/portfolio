import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	type ElementRef,
	inject,
	PLATFORM_ID,
	signal,
	viewChild,
} from '@angular/core';
import { CAPABILITIES, FALLBACK_CAPABILITY } from '../../domain/data.constant';
import type { ICapability, ICapabilityId, ILocale } from '../../domain/types.interface';
import { TranslatePipe } from '../../lang/translate.pipe';
import { TranslateService } from '../../lang/translate.service';
import { contentKey } from '../../lang/content-key.helper';

interface ICapabilityVisual {
	iconPath: string;
	example: string;
}

const CAPABILITY_VISUALS: Readonly<Record<ICapabilityId, ICapabilityVisual>> = {
	product: {
		iconPath: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
		example: 'Dense workflows with clear next actions, role-aware forms and deliberate empty states.',
	},
	architecture: {
		iconPath: 'M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM5 15a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM10.5 8.5 6.2 15m7.3-6.5 4.3 6.5M8 18h8',
		example: 'Standalone Angular, explicit signals and typed boundaries keep monitor, renderer and shell independently testable.',
	},
	mobile: {
		iconPath: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 3v12h8V5H8Zm2 14h4v1h-4v-1Z',
		example: 'Responsive web journeys that can move to Android with Capacitor without shrinking the desktop interface.',
	},
	quality: {
		iconPath: 'M12 2 4 5v6c0 5.2 3.3 9.5 8 11 4.7-1.5 8-5.8 8-11V5l-8-3Zm-1.2 13.8-4-4 1.4-1.4 2.6 2.6 5.7-5.7 1.4 1.4-7.1 7.1Z',
		example: 'Unit gates, browser smoke, focus checks and production/SSR builds validate the same states users receive.',
	},
	systems: {
		iconPath: 'M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Zm-1-8h1v2h-1V5ZM5 12h2v1H5v-1Z',
		example: 'Tokens, card contracts and shared motion primitives keep monitor, Work and future routes coherent rather than cloned.',
	},
	tooling: {
		iconPath: 'M3 4h18v16H3V4Zm3 3 4 4-4 4v-3l1-1-1-1V7Zm7 8h5v2h-5v-2Z',
		example: 'DelendAI, QuickModel and Keyer turn repeated engineering work into typed, reviewable CLI and MCP workflows.',
	},
};

const INTERACTIVE_HINTS: Readonly<Record<ILocale, Readonly<Record<ICapabilityId, string>>>> = {
	en: { product: 'Advance the workflow and inspect what changes at each gate.', architecture: 'Pulse the graph to trace a state change from UI to boundary.', mobile: 'Switch the viewport; the content contract stays intact.', quality: 'Toggle each quality gate and watch the release evidence update.', systems: 'Change the token while the same component keeps its contract.', tooling: 'Run the typed pipeline one stage at a time.' },
	es: { product: 'Avanza el flujo y revisa qué cambia en cada puerta.', architecture: 'Pulsa la señal para seguir el cambio desde la interfaz al límite.', mobile: 'Cambia el viewport: el contrato de contenido se mantiene.', quality: 'Activa cada control y observa cómo cambia la evidencia de entrega.', systems: 'Cambia el token sin romper el contrato del componente.', tooling: 'Ejecuta la tubería tipada etapa a etapa.' },
	fr: { product: 'Avancez le flux et observez chaque validation.', architecture: 'Suivez le changement de la vue jusqu’au domaine.', mobile: 'Changez le viewport sans casser le contenu.', quality: 'Activez chaque garde et observez la preuve de livraison.', systems: 'Changez le jeton, pas le contrat du composant.', tooling: 'Exécutez le pipeline typé étape par étape.' },
	de: { product: 'Schalte den Ablauf vor und prüfe jedes Gate.', architecture: 'Verfolge den Zustandswechsel vom UI zur Grenze.', mobile: 'Wechsle das Viewport, ohne den Inhalt zu verlieren.', quality: 'Aktiviere jedes Gate und prüfe den Liefernachweis.', systems: 'Ändere den Token, nicht den Komponentenvertrag.', tooling: 'Führe die typisierte Pipeline schrittweise aus.' },
	it: { product: 'Avanza il flusso e verifica ogni controllo.', architecture: 'Segui il cambio dalla UI al confine del dominio.', mobile: 'Cambia viewport senza rompere il contenuto.', quality: 'Attiva ogni controllo e osserva la prova di rilascio.', systems: 'Cambia il token senza cambiare il contratto.', tooling: 'Esegui la pipeline tipizzata passo dopo passo.' },
	'pt-PT': { product: 'Avance o fluxo e reveja cada validação.', architecture: 'Siga a alteração da interface até ao domínio.', mobile: 'Mude o viewport sem quebrar o conteúdo.', quality: 'Ative cada controlo e veja a evidência de entrega.', systems: 'Mude o token sem alterar o contrato.', tooling: 'Execute a pipeline tipada passo a passo.' },
	'pt-BR': { product: 'Avance o fluxo e revise cada validação.', architecture: 'Siga a mudança da interface até o domínio.', mobile: 'Troque o viewport sem quebrar o conteúdo.', quality: 'Ative cada controle e veja a evidência de entrega.', systems: 'Troque o token sem alterar o contrato.', tooling: 'Execute a pipeline tipada etapa por etapa.' },
	ru: { product: 'Продвигайте поток и проверяйте каждое условие.', architecture: 'Проследите изменение от интерфейса к домену.', mobile: 'Меняйте размер экрана без потери контента.', quality: 'Включайте проверки и наблюдайте доказательства релиза.', systems: 'Меняйте токен, сохраняя контракт компонента.', tooling: 'Запускайте типизированный конвейер по шагам.' },
	uk: { product: 'Просувайте потік і перевіряйте кожну умову.', architecture: 'Простежте зміну від інтерфейсу до домену.', mobile: 'Змінюйте viewport без втрати вмісту.', quality: 'Увімкніть перевірки й перегляньте докази релізу.', systems: 'Змінюйте токен, зберігаючи контракт компонента.', tooling: 'Запускайте типізований конвеєр крок за кроком.' },
	pl: { product: 'Przesuwaj przepływ i sprawdzaj kolejne bramki.', architecture: 'Śledź zmianę od interfejsu do domeny.', mobile: 'Zmieniaj viewport bez utraty treści.', quality: 'Włączaj kontrole i obserwuj dowody wydania.', systems: 'Zmieniaj token bez zmiany kontraktu komponentu.', tooling: 'Uruchamiaj typowany potok krok po kroku.' },
	hr: { product: 'Pomaknite tok i pregledajte svaku provjeru.', architecture: 'Pratite promjenu od sučelja do domene.', mobile: 'Promijenite viewport bez gubitka sadržaja.', quality: 'Uključite svaku provjeru i pratite dokaz izdanja.', systems: 'Promijenite token bez promjene ugovora komponente.', tooling: 'Pokrenite tipizirani cjevovod korak po korak.' },
	tr: { product: 'Akışı ilerletip her geçidi inceleyin.', architecture: 'Değişikliği arayüzden alan sınırına izleyin.', mobile: 'İçeriği bozmadan görünümü değiştirin.', quality: 'Her kontrolü açın ve sürüm kanıtını izleyin.', systems: 'Bileşen sözleşmesini koruyup tokenı değiştirin.', tooling: 'Türlü hattı adım adım çalıştırın.' },
	ar: { product: 'تقدّم في التدفق وافحص كل بوابة.', architecture: 'اتبع تغيّر الحالة من الواجهة إلى حدود النطاق.', mobile: 'غيّر العرض مع بقاء عقد المحتوى.', quality: 'فعّل كل فحص وشاهد دليل التسليم.', systems: 'غيّر الرمز مع بقاء عقد المكوّن.', tooling: 'شغّل خط الأنابيب المنمّط خطوة بخطوة.' },
	hi: { product: 'फ्लो आगे बढ़ाकर हर जाँच देखें।', architecture: 'UI से डोमेन सीमा तक बदलाव ट्रेस करें।', mobile: 'व्यूपोर्ट बदलें, सामग्री अनुबंध नहीं।', quality: 'हर जाँच सक्रिय करें और रिलीज़ प्रमाण देखें।', systems: 'टोकन बदलें, घटक अनुबंध बनाए रखें।', tooling: 'टाइप्ड पाइपलाइन को चरण-दर-चरण चलाएँ।' },
	bn: { product: 'ফ্লো এগিয়ে প্রতিটি গেট পরীক্ষা করুন।', architecture: 'UI থেকে ডোমেন সীমা পর্যন্ত বদল অনুসরণ করুন।', mobile: 'কনটেন্ট ভাঙা ছাড়া ভিউপোর্ট বদলান।', quality: 'প্রতিটি পরীক্ষা চালু করে রিলিজ প্রমাণ দেখুন।', systems: 'কম্পোনেন্ট চুক্তি রেখে টোকেন বদলান।', tooling: 'টাইপড পাইপলাইন ধাপে ধাপে চালান।' },
	'zh-CN': { product: '推进流程并检查每个关卡。', architecture: '追踪状态从界面到领域边界的变化。', mobile: '切换视口，同时保留内容契约。', quality: '启用质量门禁并观察交付证据。', systems: '更换令牌，不改变组件契约。', tooling: '逐步运行类型化流水线。' },
	'zh-TW': { product: '推進流程並檢查每個關卡。', architecture: '追蹤狀態從介面到領域邊界的變化。', mobile: '切換視窗，同時保留內容契約。', quality: '啟用品質門檻並觀察交付證據。', systems: '更換權杖，不改變元件契約。', tooling: '逐步執行型別化流水線。' },
	ja: { product: 'フローを進めて各ゲートを確認します。', architecture: 'UI からドメイン境界まで状態変化を追跡します。', mobile: '表示幅を変えても内容契約を保ちます。', quality: '各品質ゲートを切り替えて証拠を確認します。', systems: 'トークンだけを変え、契約を保ちます。', tooling: '型付きパイプラインを一段ずつ実行します。' },
	ko: { product: '흐름을 진행하며 각 관문을 확인하세요.', architecture: 'UI에서 도메인 경계까지 상태 변화를 추적하세요.', mobile: '뷰포트를 바꿔도 콘텐츠 계약을 유지합니다.', quality: '품질 게이트를 켜고 릴리스 증거를 확인하세요.', systems: '토큰만 바꾸고 컴포넌트 계약은 유지하세요.', tooling: '타입 파이프라인을 단계별로 실행하세요.' },
	id: { product: 'Majukan alur dan periksa setiap gerbang.', architecture: 'Lacak perubahan dari UI ke batas domain.', mobile: 'Ganti viewport tanpa merusak konten.', quality: 'Aktifkan tiap pemeriksaan dan lihat bukti rilis.', systems: 'Ganti token tanpa mengubah kontrak komponen.', tooling: 'Jalankan pipeline bertipe tahap demi tahap.' },
};

@Component({
	selector: 'app-approach-page',
	imports: [TranslatePipe],
	templateUrl: './approach.page.html',
	styleUrl: './approach.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachPageComponent {
	private readonly _document = inject(DOCUMENT);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _translate = inject(TranslateService);
	private readonly _detail = viewChild<ElementRef<HTMLElement>>('detail');

	readonly capabilities = computed<readonly ICapability[]>(() =>
		CAPABILITIES.map((capability) => ({
			...capability,
			eyebrow: this._translate.instant(
				`content.capabilities.${capability.id}.eyebrow`,
			),
			title: this._translate.instant(
				`content.capabilities.${capability.id}.title`,
			),
			detail: this._translate.instant(
				`content.capabilities.${capability.id}.detail`,
			),
			proof: this._translate.instant(
				`content.capabilities.${capability.id}.proof`,
			),
		})),
	);
	readonly activeCapability = signal<ICapabilityId>('product');
	readonly selectedCapability = computed<ICapability>(
		() =>
			this.capabilities().find(({ id }) => id === this.activeCapability()) ??
			FALLBACK_CAPABILITY
	);
	readonly selectedVisual = computed(
		() => CAPABILITY_VISUALS[this.activeCapability()]
	);
	readonly selectedIndex = computed(() =>
		this.capabilities().findIndex(({ id }) => id === this.activeCapability())
	);
	/** Pipe-separated list of experience bullets; rendered through split('|')
	 * in the template so the translation map stays a flat string. */
	readonly experienceBullets = computed(() =>
		this._translate.instant('pages.approach.experienceBullets')
	);
	readonly interactionStep = signal(0);
	readonly mobileViewports = ['390', '768', '1280'] as const;
	readonly mobileViewport = signal<(typeof this.mobileViewports)[number]>('390');
	readonly qualityChecks = signal<readonly boolean[]>([true, true, false, false]);
	readonly qualityPassed = computed(() => this.qualityChecks().filter(Boolean).length);
	readonly systemAccent = signal(0);
	readonly interactiveHint = computed(() => INTERACTIVE_HINTS[this._translate.locale()][this.activeCapability()]);

	capabilityExample(id: ICapabilityId): string {
		return this._translate.instant(`content.capabilities.${id}.example`);
	}

	termLabel(value: string): string {
		return this._translate.instantOr(`content.terms.${contentKey(value)}`, value);
	}

	selectCapability(id: ICapabilityId): void {
		if (id === this.activeCapability()) return;
		this.activeCapability.set(id);
		this.interactionStep.set(0);
		queueMicrotask(() => this._animateDetail());
	}

	capabilityIconPath(id: ICapabilityId): string {
		return CAPABILITY_VISUALS[id].iconPath;
	}

	advanceInteraction(): void {
		this.interactionStep.update((step) => (step + 1) % 4);
	}

	setMobileViewport(viewport: '390' | '768' | '1280'): void {
		this.mobileViewport.set(viewport);
		this.interactionStep.set(viewport === '390' ? 0 : viewport === '768' ? 1 : 2);
	}

	toggleQualityCheck(index: number): void {
		this.qualityChecks.update((checks) => checks.map((checked, itemIndex) => itemIndex === index ? !checked : checked));
		this.interactionStep.set(this.qualityChecks().filter(Boolean).length);
	}

	setSystemAccent(index: number): void {
		this.systemAccent.set(index);
		this.interactionStep.set(index);
	}

	onTabKeydown(event: KeyboardEvent, index: number): void {
		const delta =
			event.key === 'ArrowRight' || event.key === 'ArrowDown'
				? 1
				: event.key === 'ArrowLeft' || event.key === 'ArrowUp'
					? -1
					: 0;
		if (!delta && event.key !== 'Home' && event.key !== 'End') return;
		event.preventDefault();
		const targetIndex =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? this.capabilities().length - 1
					: (index + delta + this.capabilities().length) % this.capabilities().length;
		const target = this.capabilities()[targetIndex];
		if (!target) return;
		this.selectCapability(target.id);
		queueMicrotask(() => {
			this._document.querySelector<HTMLButtonElement>(`#capability-tab-${target.id}`)?.focus();
		});
	}

	private _animateDetail(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		if (
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;
		const element = this._detail()?.nativeElement;
		if (!element || typeof element.animate !== 'function') return;
		const motion: Readonly<Record<ICapabilityId, readonly Keyframe[]>> = {
			product: [{ opacity: 0, transform: 'translateX(22px)' }, { opacity: 1, transform: 'translateX(0)' }],
			architecture: [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }],
			mobile: [{ opacity: 0, transform: 'translateY(24px) rotateX(8deg)' }, { opacity: 1, transform: 'translateY(0) rotateX(0)' }],
			quality: [{ opacity: 0.25, filter: 'brightness(1.8)' }, { opacity: 1, filter: 'brightness(1)' }],
			systems: [{ opacity: 0, transform: 'scale(.94) rotate(-2deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }],
			tooling: [{ opacity: 0, transform: 'translateX(-18px)', filter: 'blur(5px)' }, { opacity: 1, transform: 'translateX(0)', filter: 'blur(0)' }],
		};
		element.animate([...motion[this.activeCapability()]], {
			duration: 380,
			easing: 'cubic-bezier(.22, 1, .36, 1)',
		});
	}
}
