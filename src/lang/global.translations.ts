import type { ILocale } from '../domain/types.interface';
import { en } from './en.translation';
import type { ITranslationMap } from './types.interface';

type IGlobalLocale = Exclude<ILocale, 'en' | 'es' | 'fr' | 'de'>;
type IPageCopy = readonly [lead: string, emphasis: string, subtitle: string];

interface IGlobalCopy {
	readonly nav: readonly [string, string, string, string, string, string, string, string];
	readonly home: readonly [string, string, string, string, string, string, string, string];
	readonly pages: Readonly<Record<'work' | 'lab' | 'approach' | 'knowledge' | 'docker' | 'demos' | 'contact', IPageCopy>>;
	readonly skip: string;
	readonly send: string;
	readonly availability: string;
}

const COPY: Readonly<Record<IGlobalLocale, IGlobalCopy>> = {
	it: {
		nav: ['Home', 'Progetti', 'Laboratorio', 'Metodo', 'Competenze', 'Docker', 'Demo', 'Contatto'],
		home: ['Ingegneria frontend di prodotto', 'Il lavoro parla', 'prima delle parole.', '', 'Niente dimostra meglio il modo di lavorare degli esempi reali.', 'Esplora codice, interazioni e decisioni di consegna: questo portfolio è la prova.', 'Vedi i progetti', 'Parliamone'],
		pages: { work: ['Progetti', 'concreti.', 'Esempi open source che dimostrano il focus tecnico.'], lab: ['Laboratorio', 'interattivo.', 'Stato, movimento, accessibilità e dati da manipolare.'], approach: ['Metodo', 'operativo.', 'Sei capacità legate a consegne di prodotto reali.'], knowledge: ['Conoscenze', 'utili.', 'Riferimenti pratici organizzati per tecnologia e progetto.'], docker: ['Delivery', 'riproducibile.', 'Ambienti container coerenti tra macchine e team.'], demos: ['Esperimenti', 'interattivi.', 'Demo da esplorare con mouse, tastiera o touch.'], contact: ['Iniziamo una', 'conversazione utile.', 'Racconta obiettivo, contesto e vincoli.'] },
		skip: 'Vai al contenuto', send: 'Invia', availability: 'Disponibile per progetti di prodotto',
	},
	'pt-PT': {
		nav: ['Início', 'Projetos', 'Laboratório', 'Método', 'Conhecimentos', 'Docker', 'Demonstrações', 'Contacto'],
		home: ['Engenharia frontend de produto', 'O trabalho fala', 'antes das palavras.', '', 'Nada mostra melhor como alguém trabalha do que exemplos reais.', 'Explore código, interações e decisões de entrega: este portefólio é a prova.', 'Ver projetos', 'Falar comigo'],
		pages: { work: ['Projetos', 'concretos.', 'Exemplos de código aberto que mostram o foco técnico.'], lab: ['Laboratório', 'interativo.', 'Estado, movimento, acessibilidade e dados para experimentar.'], approach: ['Método', 'operacional.', 'Seis capacidades ligadas a entrega de produto real.'], knowledge: ['Conhecimentos', 'aplicados.', 'Referências práticas organizadas por tecnologia e projeto.'], docker: ['Entrega', 'reprodutível.', 'Ambientes container consistentes entre máquinas e equipas.'], demos: ['Experiências', 'interativas.', 'Demonstrações para explorar com rato, teclado ou toque.'], contact: ['Comece uma', 'conversa útil.', 'Partilhe objetivo, contexto e restrições.'] },
		skip: 'Ir para o conteúdo', send: 'Enviar', availability: 'Disponível para projetos de produto',
	},
	'pt-BR': {
		nav: ['Início', 'Projetos', 'Laboratório', 'Método', 'Conhecimentos', 'Docker', 'Demos', 'Contato'],
		home: ['Engenharia frontend de produto', 'O trabalho fala', 'antes das palavras.', '', 'Nada mostra melhor como alguém trabalha do que exemplos reais.', 'Explore código, interações e decisões de entrega: este portfólio é a prova.', 'Ver projetos', 'Vamos conversar'],
		pages: { work: ['Projetos', 'concretos.', 'Exemplos open source que mostram o foco técnico.'], lab: ['Laboratório', 'interativo.', 'Estado, movimento, acessibilidade e dados para experimentar.'], approach: ['Método', 'operacional.', 'Seis capacidades ligadas a entregas reais de produto.'], knowledge: ['Conhecimentos', 'aplicados.', 'Referências práticas organizadas por tecnologia e projeto.'], docker: ['Entrega', 'reproduzível.', 'Ambientes de contêiner consistentes entre máquinas e equipes.'], demos: ['Experimentos', 'interativos.', 'Demos para explorar com mouse, teclado ou toque.'], contact: ['Comece uma', 'conversa útil.', 'Conte objetivo, contexto e restrições.'] },
		skip: 'Ir para o conteúdo', send: 'Enviar', availability: 'Disponível para projetos de produto',
	},
	ru: {
		nav: ['Главная', 'Проекты', 'Лаборатория', 'Подход', 'Знания', 'Docker', 'Демо', 'Контакт'],
		home: ['Фронтенд-инженерия продукта', 'Работа говорит', 'раньше слов.', '', 'Лучше всего о работе человека говорят реальные примеры.', 'Изучайте код, взаимодействия и решения по доставке — этот портфель и есть доказательство.', 'Смотреть проекты', 'Обсудить задачу'],
		pages: { work: ['Реальные', 'проекты.', 'Открытые примеры, показывающие технический фокус.'], lab: ['Интерактивная', 'лаборатория.', 'Состояние, движение, доступность и данные для экспериментов.'], approach: ['Рабочий', 'подход.', 'Шесть компетенций, связанных с реальной продуктовой поставкой.'], knowledge: ['Полезные', 'знания.', 'Практические ссылки, сгруппированные по технологиям и проектам.'], docker: ['Воспроизводимая', 'доставка.', 'Согласованные контейнерные среды на разных машинах.'], demos: ['Живые', 'эксперименты.', 'Демо для мыши, клавиатуры и сенсорного экрана.'], contact: ['Начнём', 'полезный разговор.', 'Опишите цель, контекст и ограничения.'] },
		skip: 'Перейти к содержимому', send: 'Отправить', availability: 'Открыт к продуктовым проектам',
	},
	uk: {
		nav: ['Головна', 'Проєкти', 'Лабораторія', 'Підхід', 'Знання', 'Docker', 'Демо', 'Контакт'],
		home: ['Фронтенд-інженерія продукту', 'Робота говорить', 'раніше слів.', '', 'Найкраще про роботу людини розповідають реальні приклади.', 'Досліджуйте код, взаємодії та рішення доставки — це портфоліо є доказом.', 'Переглянути проєкти', 'Обговорити задачу'],
		pages: { work: ['Реальні', 'проєкти.', 'Відкриті приклади, що показують технічний фокус.'], lab: ['Інтерактивна', 'лабораторія.', 'Стан, рух, доступність і дані для експериментів.'], approach: ['Робочий', 'підхід.', 'Шість компетенцій, пов’язаних із реальною продуктовою роботою.'], knowledge: ['Практичні', 'знання.', 'Корисні посилання за технологіями та проєктами.'], docker: ['Відтворювана', 'доставка.', 'Узгоджені контейнерні середовища для різних машин.'], demos: ['Живі', 'експерименти.', 'Демо для миші, клавіатури та сенсорного екрана.'], contact: ['Почнімо', 'корисну розмову.', 'Опишіть мету, контекст і обмеження.'] },
		skip: 'Перейти до вмісту', send: 'Надіслати', availability: 'Відкритий до продуктових проєктів',
	},
	pl: {
		nav: ['Start', 'Projekty', 'Laboratorium', 'Podejście', 'Wiedza', 'Docker', 'Dema', 'Kontakt'],
		home: ['Inżynieria frontendu produktu', 'Praca mówi', 'przed słowami.', '', 'Nic lepiej nie pokazuje czyjejś pracy niż prawdziwe przykłady.', 'Poznaj kod, interakcje i decyzje wdrożeniowe — to portfolio jest dowodem.', 'Zobacz projekty', 'Porozmawiajmy'],
		pages: { work: ['Konkretne', 'projekty.', 'Otwarte przykłady pokazujące kierunek techniczny.'], lab: ['Interaktywne', 'laboratorium.', 'Stan, ruch, dostępność i dane do eksperymentów.'], approach: ['Operacyjne', 'podejście.', 'Sześć umiejętności związanych z realną dostawą produktu.'], knowledge: ['Praktyczna', 'wiedza.', 'Materiały pogrupowane według technologii i projektu.'], docker: ['Powtarzalna', 'dostawa.', 'Spójne środowiska kontenerowe na wielu maszynach.'], demos: ['Żywe', 'eksperymenty.', 'Dema do myszy, klawiatury i dotyku.'], contact: ['Zacznijmy', 'konkretną rozmowę.', 'Opisz cel, kontekst i ograniczenia.'] },
		skip: 'Przejdź do treści', send: 'Wyślij', availability: 'Dostępny dla projektów produktowych',
	},
	hr: {
		nav: ['Početna', 'Projekti', 'Laboratorij', 'Pristup', 'Znanje', 'Docker', 'Demoi', 'Kontakt'],
		home: ['Frontend inženjering proizvoda', 'Rad govori', 'prije riječi.', '', 'Ništa ne pokazuje nečiji način rada bolje od stvarnih primjera.', 'Istražite kod, interakcije i odluke isporuke — ovaj portfolio je dokaz.', 'Pogledaj projekte', 'Razgovarajmo'],
		pages: { work: ['Stvarni', 'projekti.', 'Otvoreni primjeri koji pokazuju tehnički fokus.'], lab: ['Interaktivni', 'laboratorij.', 'Stanje, pokret, pristupačnost i podaci za eksperimentiranje.'], approach: ['Operativni', 'pristup.', 'Šest vještina povezanih sa stvarnom isporukom proizvoda.'], knowledge: ['Praktično', 'znanje.', 'Reference organizirane po tehnologiji i projektu.'], docker: ['Ponovljiva', 'isporuka.', 'Dosljedna kontejnerska okruženja na različitim uređajima.'], demos: ['Živi', 'eksperimenti.', 'Demoi za miš, tipkovnicu i dodir.'], contact: ['Započnimo', 'koristan razgovor.', 'Opišite cilj, kontekst i ograničenja.'] },
		skip: 'Preskoči na sadržaj', send: 'Pošalji', availability: 'Dostupan za produktne projekte',
	},
	tr: {
		nav: ['Ana sayfa', 'Projeler', 'Laboratuvar', 'Yaklaşım', 'Bilgi', 'Docker', 'Demolar', 'İletişim'],
		home: ['Ürün frontend mühendisliği', 'Çalışma, sözlerden', 'önce konuşur.', '', 'Birinin nasıl çalıştığını gerçek örneklerden daha iyi hiçbir şey göstermez.', 'Kod, etkileşim ve teslim kararlarını inceleyin: bu portfolyo kanıttır.', 'Projeleri gör', 'Konuşalım'],
		pages: { work: ['Gerçek', 'projeler.', 'Teknik odağı gösteren açık kaynak örnekleri.'], lab: ['Etkileşimli', 'laboratuvar.', 'Durum, hareket, erişilebilirlik ve veriyi deneyin.'], approach: ['Operasyonel', 'yaklaşım.', 'Gerçek ürün teslimine bağlı altı yetkinlik.'], knowledge: ['Uygulanabilir', 'bilgi.', 'Teknoloji ve projeye göre düzenlenmiş pratik referanslar.'], docker: ['Tekrarlanabilir', 'teslimat.', 'Farklı makinelerde tutarlı konteyner ortamları.'], demos: ['Canlı', 'deneyler.', 'Fare, klavye veya dokunmatik için demolar.'], contact: ['Faydalı bir', 'konuşma başlatalım.', 'Hedefi, bağlamı ve kısıtları paylaşın.'] },
		skip: 'İçeriğe geç', send: 'Gönder', availability: 'Ürün projeleri için müsait',
	},
	ar: {
		nav: ['الرئيسية', 'المشاريع', 'المختبر', 'المنهج', 'المعرفة', 'دوكر', 'العروض', 'تواصل'],
		home: ['هندسة واجهات المنتج', 'العمل يتحدث', 'قبل الكلمات.', '', 'لا شيء يوضح طريقة عمل شخص أفضل من أمثلة حقيقية.', 'استكشف الشيفرة والتفاعل وقرارات التسليم: هذه المحفظة هي الدليل.', 'عرض المشاريع', 'لنتحدث'],
		pages: { work: ['مشاريع', 'حقيقية.', 'أمثلة مفتوحة المصدر توضح التركيز التقني.'], lab: ['مختبر', 'تفاعلي.', 'الحالة والحركة وإتاحة الوصول والبيانات للتجربة.'], approach: ['منهج', 'تشغيلي.', 'ست قدرات مرتبطة بتسليم منتجات حقيقية.'], knowledge: ['معرفة', 'عملية.', 'مراجع منظمة حسب التقنية والمشروع.'], docker: ['تسليم', 'قابل للتكرار.', 'بيئات حاويات متسقة عبر الأجهزة.'], demos: ['تجارب', 'تفاعلية.', 'عروض للفأرة ولوحة المفاتيح واللمس.'], contact: ['لنبدأ', 'محادثة مفيدة.', 'صف الهدف والسياق والقيود.'] },
		skip: 'الانتقال إلى المحتوى', send: 'إرسال', availability: 'متاح لمشاريع المنتجات',
	},
	hi: {
		nav: ['होम', 'प्रोजेक्ट', 'लैब', 'तरीका', 'ज्ञान', 'Docker', 'डेमो', 'संपर्क'],
		home: ['प्रोडक्ट फ्रंटएंड इंजीनियरिंग', 'काम बोलता है', 'शब्दों से पहले।', '', 'किसी के काम को वास्तविक उदाहरणों से बेहतर कुछ नहीं दिखाता।', 'कोड, इंटरैक्शन और डिलीवरी निर्णय देखें: यही पोर्टफोलियो प्रमाण है।', 'प्रोजेक्ट देखें', 'बात करें'],
		pages: { work: ['वास्तविक', 'प्रोजेक्ट।', 'तकनीकी फोकस दिखाते ओपन-सोर्स उदाहरण।'], lab: ['इंटरैक्टिव', 'लैब।', 'स्टेट, मोशन, एक्सेसिबिलिटी और डेटा के प्रयोग।'], approach: ['ऑपरेशनल', 'तरीका।', 'वास्तविक उत्पाद डिलीवरी से जुड़ी छह क्षमताएँ।'], knowledge: ['व्यावहारिक', 'ज्ञान।', 'तकनीक और प्रोजेक्ट के अनुसार उपयोगी संदर्भ।'], docker: ['दोहराने योग्य', 'डिलीवरी।', 'विभिन्न मशीनों पर सुसंगत कंटेनर वातावरण।'], demos: ['जीवंत', 'प्रयोग।', 'माउस, कीबोर्ड और टच के लिए इंटरैक्टिव डेमो।'], contact: ['एक उपयोगी', 'बात शुरू करें।', 'लक्ष्य, संदर्भ और सीमाएँ बताइए।'] },
		skip: 'सामग्री पर जाएँ', send: 'भेजें', availability: 'प्रोडक्ट प्रोजेक्ट के लिए उपलब्ध',
	},
	bn: {
		nav: ['হোম', 'প্রজেক্ট', 'ল্যাব', 'পদ্ধতি', 'জ্ঞান', 'Docker', 'ডেমো', 'যোগাযোগ'],
		home: ['প্রোডাক্ট ফ্রন্টএন্ড ইঞ্জিনিয়ারিং', 'কাজ কথা বলে', 'শব্দের আগে।', '', 'বাস্তব উদাহরণের চেয়ে কারও কাজের ধরন ভালোভাবে আর কিছু দেখাতে পারে না।', 'কোড, ইন্টারঅ্যাকশন ও ডেলিভারি সিদ্ধান্ত দেখুন: এই পোর্টফোলিওই প্রমাণ।', 'প্রজেক্ট দেখুন', 'কথা বলি'],
		pages: { work: ['বাস্তব', 'প্রজেক্ট।', 'প্রযুক্তিগত দিক দেখানো ওপেন সোর্স উদাহরণ।'], lab: ['ইন্টারঅ্যাক্টিভ', 'ল্যাব।', 'স্টেট, মোশন, অ্যাক্সেসিবিলিটি ও ডেটা পরীক্ষা করুন।'], approach: ['কর্মক্ষম', 'পদ্ধতি।', 'বাস্তব প্রোডাক্ট ডেলিভারির সঙ্গে যুক্ত ছয়টি দক্ষতা।'], knowledge: ['ব্যবহারিক', 'জ্ঞান।', 'প্রযুক্তি ও প্রজেক্ট অনুযায়ী সাজানো রেফারেন্স।'], docker: ['পুনরুৎপাদনযোগ্য', 'ডেলিভারি।', 'বিভিন্ন মেশিনে ধারাবাহিক কন্টেইনার পরিবেশ।'], demos: ['জীবন্ত', 'পরীক্ষা।', 'মাউস, কিবোর্ড ও টাচের ইন্টারঅ্যাক্টিভ ডেমো।'], contact: ['একটি দরকারি', 'আলাপ শুরু করি।', 'লক্ষ্য, প্রেক্ষাপট ও সীমাবদ্ধতা লিখুন।'] },
		skip: 'বিষয়বস্তুর দিকে যান', send: 'পাঠান', availability: 'প্রোডাক্ট প্রজেক্টের জন্য উপলব্ধ',
	},
	'zh-CN': {
		nav: ['首页', '项目', '实验室', '方法', '知识', 'Docker', '演示', '联系'],
		home: ['产品前端工程', '作品先于', '空谈。', '', '没有什么比真实示例更能说明一个人的工作方式。', '探索代码、交互与交付决策：这个作品集就是证据。', '查看项目', '开始交流'],
		pages: { work: ['真实', '项目。', '展示技术重点的开源案例。'], lab: ['交互', '实验室。', '亲手探索状态、动效、可访问性与数据。'], approach: ['可落地的', '方法。', '与真实产品交付相连的六项能力。'], knowledge: ['实用', '知识。', '按技术与项目整理的参考资料。'], docker: ['可复现的', '交付。', '跨机器保持一致的容器环境。'], demos: ['鲜活的', '实验。', '支持鼠标、键盘与触控的演示。'], contact: ['开始一次', '有价值的交流。', '告诉我目标、背景与约束。'] },
		skip: '跳到内容', send: '发送', availability: '可承接产品项目',
	},
	'zh-TW': {
		nav: ['首頁', '專案', '實驗室', '方法', '知識', 'Docker', '示範', '聯絡'],
		home: ['產品前端工程', '作品先於', '空談。', '', '沒有什麼比真實範例更能說明一個人的工作方式。', '探索程式碼、互動與交付決策：這份作品集就是證據。', '查看專案', '開始交流'],
		pages: { work: ['真實', '專案。', '展示技術重點的開源案例。'], lab: ['互動', '實驗室。', '親手探索狀態、動效、無障礙與資料。'], approach: ['可落地的', '方法。', '與真實產品交付相連的六項能力。'], knowledge: ['實用', '知識。', '依技術與專案整理的參考資料。'], docker: ['可重現的', '交付。', '跨機器保持一致的容器環境。'], demos: ['鮮活的', '實驗。', '支援滑鼠、鍵盤與觸控的示範。'], contact: ['開始一場', '有價值的交流。', '告訴我目標、背景與限制。'] },
		skip: '跳至內容', send: '送出', availability: '可承接產品專案',
	},
	ja: {
		nav: ['ホーム', '実績', 'ラボ', '進め方', '知識', 'Docker', 'デモ', '連絡'],
		home: ['プロダクトのフロントエンド', '仕事は言葉より', '先に語る。', '', '人の仕事ぶりを示すものに、実例ほど確かなものはない。', 'コード、操作感、配信判断を確かめてください。このポートフォリオが証拠です。', '実績を見る', '話しましょう'],
		pages: { work: ['実際の', 'プロジェクト。', '技術的な焦点を示すオープンソース例。'], lab: ['インタラクティブ', 'ラボ。', '状態、動き、アクセシビリティ、データを試す。'], approach: ['実用的な', '進め方。', '実際の製品提供につながる6つの能力。'], knowledge: ['実践的な', '知識。', '技術とプロジェクト別に整理した参照。'], docker: ['再現可能な', '配信。', '複数のマシンで一貫したコンテナ環境。'], demos: ['生きた', '実験。', 'マウス、キーボード、タッチで操作できるデモ。'], contact: ['役立つ', '会話を始めよう。', '目的、背景、制約を教えてください。'] },
		skip: '本文へ移動', send: '送信', availability: 'プロダクト案件に対応可能',
	},
	ko: {
		nav: ['홈', '프로젝트', '랩', '접근법', '지식', 'Docker', '데모', '연락'],
		home: ['제품 프론트엔드 엔지니어링', '말보다 먼저', '작업이 말한다.', '', '누군가의 작업 방식을 보여주는 데 실제 예시만큼 확실한 것은 없습니다.', '코드, 상호작용, 배포 결정을 살펴보세요. 이 포트폴리오가 증거입니다.', '프로젝트 보기', '대화하기'],
		pages: { work: ['실제', '프로젝트.', '기술 초점을 보여주는 오픈 소스 사례.'], lab: ['인터랙티브', '랩.', '상태, 모션, 접근성, 데이터를 직접 실험합니다.'], approach: ['운영 가능한', '접근법.', '실제 제품 배송과 연결된 여섯 가지 역량.'], knowledge: ['실용적인', '지식.', '기술과 프로젝트별로 정리한 참고자료.'], docker: ['재현 가능한', '배포.', '여러 머신에서 일관된 컨테이너 환경.'], demos: ['살아 있는', '실험.', '마우스, 키보드, 터치로 조작하는 데모.'], contact: ['유용한', '대화를 시작하세요.', '목표, 맥락, 제약 조건을 알려주세요.'] },
		skip: '본문으로 이동', send: '보내기', availability: '제품 프로젝트 진행 가능',
	},
	id: {
		nav: ['Beranda', 'Proyek', 'Lab', 'Pendekatan', 'Pengetahuan', 'Docker', 'Demo', 'Kontak'],
		home: ['Rekayasa frontend produk', 'Karya berbicara', 'sebelum kata-kata.', '', 'Tidak ada yang menunjukkan cara kerja seseorang lebih baik daripada contoh nyata.', 'Jelajahi kode, interaksi, dan keputusan pengiriman: portofolio ini adalah buktinya.', 'Lihat proyek', 'Mari bicara'],
		pages: { work: ['Proyek', 'nyata.', 'Contoh sumber terbuka yang menunjukkan fokus teknis.'], lab: ['Lab', 'interaktif.', 'Eksperimen dengan status, gerak, aksesibilitas, dan data.'], approach: ['Pendekatan', 'operasional.', 'Enam kemampuan yang terkait dengan pengiriman produk nyata.'], knowledge: ['Pengetahuan', 'praktis.', 'Referensi berdasarkan teknologi dan proyek.'], docker: ['Pengiriman', 'reproducibel.', 'Lingkungan container yang konsisten di berbagai mesin.'], demos: ['Eksperimen', 'interaktif.', 'Demo untuk mouse, keyboard, dan sentuhan.'], contact: ['Mari mulai', 'percakapan berguna.', 'Ceritakan tujuan, konteks, dan batasan.'] },
		skip: 'Lompat ke konten', send: 'Kirim', availability: 'Tersedia untuk proyek produk',
	},
};

function buildTranslation(copy: IGlobalCopy): ITranslationMap {
	const page = (id: keyof IGlobalCopy['pages']): { titleLead: string; titleEmphasis: string; titleTail: string; subtitle: string } => {
		const [lead, emphasis, subtitle] = copy.pages[id];
		return { titleLead: lead, titleEmphasis: emphasis, titleTail: '', subtitle };
	};
	const [homeEyebrow, homeLead, homeEmphasis, homeTail, homeSubtitle, homeIntro, homeWork, homeContact] = copy.home;
	return {
		...en,
		chrome: {
			...en.chrome,
			header: {
				...en.chrome.header,
				navHome: copy.nav[0], navWork: copy.nav[1], navLab: copy.nav[2], navAbout: copy.nav[3],
				navKnowledge: copy.nav[4], navDocker: copy.nav[5], navDemos: copy.nav[6], navContact: copy.nav[7],
			},
			footer: { ...en.chrome.footer, availability: copy.availability },
			skipToContent: copy.skip,
		},
		pages: {
			...en.pages,
			home: { ...en.pages.home, eyebrow: homeEyebrow, titleLead: homeLead, titleEmphasis: homeEmphasis, titleTail: homeTail, subtitle: homeSubtitle, intro: homeIntro, ctaWork: homeWork, ctaContact: homeContact },
			work: { ...en.pages.work, ...page('work') },
			lab: { ...en.pages.lab, ...page('lab') },
			approach: { ...en.pages.approach, ...page('approach') },
			knowledge: { ...en.pages.knowledge, ...page('knowledge') },
			docker: { ...en.pages.docker, ...page('docker') },
			demos: { ...en.pages.demos, ...page('demos') },
			contact: { ...en.pages.contact, ...page('contact'), formSubmit: copy.send },
		},
	};
}

export const GLOBAL_TRANSLATIONS = Object.fromEntries(
	Object.entries(COPY).map(([locale, copy]) => [locale, buildTranslation(copy)]),
) as Readonly<Record<IGlobalLocale, ITranslationMap>>;
