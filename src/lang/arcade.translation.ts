import type { ILocale } from '../domain/types.interface';
import type { IArcadeTranslationMap } from './types.interface';

export const ARCADE_COPY_KEYS = [
	'eyebrow', 'title', 'detail', 'tabsAria', 'lives', 'time',
	'ready', 'running', 'won', 'lost', 'hit', 'goal', 'saved',
	'runner', 'shooter', 'lanes', 'penalty', 'rpg', 'maze',
	'runnerDetail', 'shooterDetail', 'lanesDetail', 'penaltyDetail', 'rpgDetail', 'mazeDetail',
	'jump', 'fire', 'left', 'right', 'up', 'down', 'shoot', 'attack', 'guard', 'spell',
	'heal', 'keeper', 'round', 'shots', 'zone', 'collectibles', 'centre',
	'controls', 'dpadAction', 'input', 'keysTouch', 'fullscreen', 'exitView', 'expandView', 'directionalControls', 'touch',
] as const;

export type IArcadeCopyKey = typeof ARCADE_COPY_KEYS[number];

type IArcadeCopyValues = readonly string[] & {
	readonly length: typeof ARCADE_COPY_KEYS.length;
};

function defineArcadeCopy(values: IArcadeCopyValues): IArcadeTranslationMap {
	return Object.fromEntries(
		ARCADE_COPY_KEYS.map((key, index) => [key, values[index] ?? key]),
	) as unknown as IArcadeTranslationMap;
}

const en = defineArcadeCopy([
	'06.1 / Playable arcade', 'Playable arcade', 'Six score-driven mini-games with keyboard, pointer and touch controls.', 'Choose an arcade mini-game', 'Lives', 'Time',
	'Ready to play', 'Game in progress', 'Victory', 'Game over', 'Collision', 'Goal', 'Saved',
	'Endless runner', 'Aim shooter', 'Lane rush', 'Five-shot penalty', 'Turn-based RPG', 'Maze collector',
	'Jump obstacles, protect your lives and keep the run alive.', 'Aim quickly before each timed target disappears.', 'Change lanes, avoid traffic and survive the crossing.', 'Choose a target and beat the keeper in five attempts.', 'Defeat three enemies with attack, guard, spell and healing.', 'Collect every crystal while the maze guardian gives chase.',
	'Jump', 'Fire', 'Left', 'Right', 'Up', 'Down', 'Shoot', 'Attack', 'Guard', 'Spell', 'Heal', 'Keeper', 'Round', 'Shots', 'Zone', 'Crystals', 'Centre',
	'Controls', 'D-pad + action', 'Input', 'Keys + touch', 'Fullscreen', 'Exit view', 'Expand view', 'Directional controls', 'Touch',
] as const);

const es = defineArcadeCopy([
	'06.1 / Arcade jugable', 'Arcade jugable', 'Seis minijuegos con puntuación y controles de teclado, puntero y pantalla táctil.', 'Elige un minijuego del arcade', 'Vidas', 'Tiempo',
	'Listo para jugar', 'Partida en curso', 'Victoria', 'Fin de la partida', 'Colisión', 'Gol', 'Parada',
	'Corredor sin fin', 'Tiro de precisión', 'Carrera por carriles', 'Penalti de cinco tiros', 'RPG por turnos', 'Coleccionista del laberinto',
	'Salta obstáculos, protege tus vidas y mantén la carrera.', 'Apunta rápido antes de que desaparezca cada objetivo.', 'Cambia de carril, evita el tráfico y supera el cruce.', 'Elige zona y supera al portero en cinco intentos.', 'Derrota a tres enemigos con ataque, guardia, hechizo y curación.', 'Recoge todos los cristales mientras el guardián te persigue.',
	'Saltar', 'Disparar', 'Izquierda', 'Derecha', 'Arriba', 'Abajo', 'Chutar', 'Atacar', 'Guardia', 'Hechizo', 'Curar', 'Portero', 'Ronda', 'Tiros', 'Zona', 'Cristales', 'Centro',
	'Controles', 'D-pad + acción', 'Entrada', 'Teclas + táctil', 'Pantalla completa', 'Salir de vista', 'Expandir vista', 'Controles direccionales', 'Táctil',
] as const);

const fr = defineArcadeCopy([
	'06.1 / Arcade jouable', 'Arcade jouable', 'Six mini-jeux à score avec commandes clavier, pointeur et tactiles.', 'Choisir un mini-jeu d’arcade', 'Vies', 'Temps',
	'Prêt à jouer', 'Partie en cours', 'Victoire', 'Partie terminée', 'Impact', 'But', 'Arrêt',
	'Course sans fin', 'Tir de précision', 'Course par voies', 'Penalty en cinq tirs', 'Combat au tour par tour', 'Explorateur du labyrinthe',
	'Sautez les obstacles, gardez vos vies et prolongez la course.', 'Visez vite avant la disparition de chaque cible chronométrée.', 'Changez de voie, évitez le trafic et traversez le parcours.', 'Choisissez une zone et battez le gardien en cinq essais.', 'Battez trois ennemis avec attaque, garde, sort et soin.', 'Collectez chaque cristal pendant que le gardien vous poursuit.',
	'Sauter', 'Tirer', 'Gauche', 'Droite', 'Haut', 'Bas', 'Frapper', 'Attaquer', 'Garder', 'Sort', 'Soigner', 'Gardien', 'Manche', 'Tirs', 'Secteur', 'Cristaux', 'Milieu',
	'Contrôles', 'Croix directionnelle + action', 'Entrée', 'Touches + tactile', 'Plein écran', 'Quitter la vue', 'Étendre la vue', 'Contrôles directionnels', 'Tactile',
] as const);

const de = defineArcadeCopy([
	'06.1 / Spielbare Arcade', 'Spielbare Arcade', 'Sechs punktebasierte Minispiele mit Tastatur-, Maus- und Touchsteuerung.', 'Arcade-Minispiel auswählen', 'Leben', 'Zeit',
	'Bereit zum Spielen', 'Spiel läuft', 'Sieg', 'Spiel beendet', 'Kollision', 'Tor', 'Gehalten',
	'Endlosläufer', 'Zielschießen', 'Spurenrennen', 'Fünf-Elfmeter-Serie', 'Rundenkampf', 'Labyrinthsammler',
	'Überspringe Hindernisse, schütze deine Leben und halte den Lauf.', 'Ziele rasch an, bevor die befristeten Ziele verschwinden.', 'Wechsle Spuren, weiche Verkehr aus und überstehe die Strecke.', 'Wähle eine Ecke und bezwinge den Torwart in fünf Versuchen.', 'Besiege drei Gegner mit Angriff, Deckung, Zauber und Heilung.', 'Sammle alle Kristalle, während der Wächter dich verfolgt.',
	'Springen', 'Feuern', 'Links', 'Rechts', 'Oben', 'Unten', 'Schießen', 'Angreifen', 'Deckung', 'Zauber', 'Heilen', 'Torwart', 'Runde', 'Schüsse', 'Bereich', 'Kristalle', 'Mitte',
	'Steuerung', 'D-Pad + Aktion', 'Eingabe', 'Tasten + Berührung', 'Vollbild', 'Ansicht verlassen', 'Ansicht erweitern', 'Richtungssteuerung', 'Berührung',
] as const);

const it = defineArcadeCopy([
	'06.1 / Arcade giocabile', 'Arcade giocabile', 'Sei minigiochi reali con controlli da tastiera, puntatore e tocco.', 'Scegli un minigioco arcade', 'Vite', 'Tempo',
	'Pronto a giocare', 'Partita in corso', 'Vittoria', 'Partita finita', 'Impatto', 'Gol', 'Parata',
	'Corsa infinita', 'Tiro di precisione', 'Corsa a corsie', 'Rigore da cinque tiri', 'Duello a turni', 'Raccoglitore nel labirinto',
	'Salta gli ostacoli, proteggi le vite e continua a correre.', 'Mira in fretta prima che ogni bersaglio scada.', 'Cambia corsia, evita il traffico e supera l’attraversamento.', 'Scegli una zona e supera il portiere in cinque tentativi.', 'Sconfiggi tre nemici con attacco, guardia, magia e cura.', 'Raccogli ogni cristallo mentre il guardiano ti insegue.',
	'Salta', 'Fuoco', 'Sinistra', 'Destra', 'Su', 'Giù', 'Calcia', 'Attacca', 'Difendi', 'Incantesimo', 'Cura', 'Portiere', 'Turno', 'Tiri', 'Zona', 'Cristalli', 'Centro',
	'Controlli', 'D-pad + azione', 'Input', 'Tasti + tocco', 'Schermo intero', 'Esci dalla vista', 'Espandi vista', 'Controlli direzionali', 'Tocco',
] as const);

const ptPt = defineArcadeCopy([
	'06.1 / Arcade jogável', 'Arcade jogável', 'Seis minijogos reais com comandos de teclado, ponteiro e toque.', 'Escolha um minijogo arcade', 'Vidas', 'Tempo',
	'Pronto para jogar', 'Partida em curso', 'Vitória', 'Fim da partida', 'Colisão', 'Golo', 'Defesa',
	'Corrida infinita', 'Tiro de precisão', 'Corrida por faixas', 'Penálti de cinco remates', 'Combate por turnos', 'Colecionador do labirinto',
	'Salte obstáculos, proteja as vidas e mantenha a corrida.', 'Aponte depressa antes de cada alvo temporizado desaparecer.', 'Mude de faixa, evite o trânsito e conclua o percurso.', 'Escolha uma zona e vença o guarda-redes em cinco tentativas.', 'Derrote três inimigos com ataque, defesa, feitiço e cura.', 'Recolha todos os cristais enquanto o guardião o persegue.',
	'Saltar', 'Disparar', 'Esquerda', 'Direita', 'Cima', 'Baixo', 'Rematar', 'Atacar', 'Defender', 'Feitiço', 'Curar', 'Guarda-redes', 'Ronda', 'Remates', 'Zona', 'Cristais', 'Centro',
	'Comandos', 'D-pad + ação', 'Entrada', 'Teclas + toque', 'Ecrã inteiro', 'Sair da vista', 'Expandir vista', 'Comandos direcionais', 'Toque',
] as const);

const ptBr = defineArcadeCopy([
	'06.1 / Fliperama jogável', 'Fliperama jogável', 'Seis minijogos reais com controles de teclado, ponteiro e toque.', 'Escolha um minijogo do fliperama', 'Vidas', 'Tempo',
	'Pronto para jogar', 'Partida em andamento', 'Vitória', 'Fim de jogo', 'Colisão', 'Gol', 'Defesa',
	'Corrida infinita', 'Tiro de precisão', 'Corrida nas pistas', 'Pênalti de cinco chutes', 'Batalha por turnos', 'Coletor do labirinto',
	'Pule obstáculos, proteja suas vidas e continue correndo.', 'Mire rápido antes que cada alvo temporizado desapareça.', 'Troque de pista, desvie do tráfego e termine o trajeto.', 'Escolha a zona e vença o goleiro em cinco tentativas.', 'Derrote três inimigos usando ataque, defesa, magia e cura.', 'Colete todos os cristais enquanto o guardião persegue você.',
	'Pular', 'Disparar', 'Esquerda', 'Direita', 'Cima', 'Baixo', 'Chutar', 'Atacar', 'Defender', 'Magia', 'Curar', 'Goleiro', 'Rodada', 'Chutes', 'Zona', 'Cristais', 'Centro',
	'Controles', 'D-pad + ação', 'Entrada', 'Teclas + toque', 'Tela cheia', 'Sair da tela', 'Expandir tela', 'Controles direcionais', 'Toque',
] as const);

const ru = defineArcadeCopy([
	'06.1 / Игровая аркада', 'Игровая аркада', 'Шесть полноценных мини-игр для клавиатуры, указателя и касаний.', 'Выберите аркадную мини-игру', 'Жизни', 'Время',
	'Готов к игре', 'Игра идёт', 'Победа', 'Игра окончена', 'Столкновение', 'Гол', 'Сейв',
	'Бесконечный бег', 'Стрельба по целям', 'Гонки по полосам', 'Серия из пяти пенальти', 'Пошаговый бой', 'Собиратель лабиринта',
	'Перепрыгивай препятствия, береги жизни и продолжай бег.', 'Целься быстро, пока временная мишень не исчезла.', 'Меняй полосы, избегай машин и добеги до конца.', 'Выбери зону и переиграй вратаря за пять попыток.', 'Победи трёх врагов атакой, защитой, заклинанием и лечением.', 'Собери все кристалы, пока страж преследует тебя.',
	'Прыжок', 'Выстрел', 'Влево', 'Вправо', 'Вверх', 'Вниз', 'Ударить', 'Атаковать', 'Защита', 'Заклинание', 'Лечение', 'Вратарь', 'Раунд', 'Удары', 'Зона', 'Кристаллы', 'Центр',
	'Управление', 'D-pad + действие', 'Ввод', 'Клавиши + касание', 'Во весь экран', 'Выйти из вида', 'Развернуть вид', 'Управление направлениями', 'Касание',
] as const);

const uk = defineArcadeCopy([
	'06.1 / Ігрова аркада', 'Ігрова аркада', 'Шість повноцінних мініігор для клавіатури, вказівника й дотику.', 'Виберіть аркадну мінігру', 'Життя', 'Час',
	'Готовий до гри', 'Гра триває', 'Перемога', 'Гру завершено', 'Зіткнення', 'Гол', 'Відбито',
	'Нескінченний біг', 'Стрільба по цілях', 'Перегони по смугах', 'Серія з п’яти пенальті', 'Покроковий бій', 'Збирач лабіринту',
	'Стрибай через перешкоди, бережи життя та продовжуй біг.', 'Цілься швидко, доки тимчасова мішень не зникла.', 'Змінюй смугу, уникай транспорту та пройди маршрут.', 'Вибери зону й переграй воротаря за п’ять спроб.', 'Подолай трьох ворогів атакою, захистом, чарами й лікуванням.', 'Збери всі кристали, поки вартовий переслідує тебе.',
	'Стрибок', 'Постріл', 'Ліворуч', 'Праворуч', 'Вгору', 'Вниз', 'Бити', 'Атакувати', 'Захист', 'Чари', 'Лікувати', 'Воротар', 'Раунд', 'Удари', 'Зона', 'Кристали', 'Центр',
	'Керування', 'D-pad + дія', 'Введення', 'Клавіші + дотик', 'На весь екран', 'Вийти з виду', 'Розгорнути вид', 'Керування напрямками', 'Дотик',
] as const);

const pl = defineArcadeCopy([
	'06.1 / Grywalna arkada', 'Grywalna arkada', 'Sześć rzeczywistych minigier z obsługą klawiatury, kursora i dotyku.', 'Wybierz minigrę zręcznościową', 'Życia', 'Czas',
	'Gotowe do gry', 'Gra trwa', 'Zwycięstwo', 'Koniec gry', 'Kolizja', 'Gol', 'Obrona',
	'Bieg bez końca', 'Strzelanie do celu', 'Wyścig po pasach', 'Pięć rzutów karnych', 'Walka turowa', 'Zbieracz labiryntu',
	'Przeskakuj przeszkody, chroń życia i kontynuuj bieg.', 'Celuj szybko, zanim zniknie każdy limitowany cel.', 'Zmieniaj pasy, unikaj ruchu i przejedź cały odcinek.', 'Wybierz strefę i pokonaj bramkarza w pięciu próbach.', 'Pokonaj trzech wrogów atakiem, gardą, zaklęciem i leczeniem.', 'Zbierz wszystkie kryształy, gdy strażnik cię ściga.',
	'Skok', 'Strzał', 'Lewo', 'Prawo', 'Góra', 'Dół', 'Kopnij', 'Atak', 'Garda', 'Zaklęcie', 'Leczenie', 'Bramkarz', 'Runda', 'Strzały', 'Strefa', 'Kryształy', 'Środek',
	'Sterowanie', 'D-pad + akcja', 'Wprowadzanie', 'Przyciski + dotyk', 'Pełny ekran', 'Wyjdź z widoku', 'Rozwiń widok', 'Sterowanie kierunkowe', 'Dotyk',
] as const);

const hr = defineArcadeCopy([
	'06.1 / Igriva arkada', 'Igriva arkada', 'Šest stvarnih miniigara za tipkovnicu, pokazivač i dodir.', 'Odaberi miniigru arkade', 'Životi', 'Vrijeme',
	'Pripremljeno za igru', 'Igra u tijeku', 'Pobjeda', 'Igra je završila', 'Sudar', 'Gol', 'Obrana',
	'Beskrajno trčanje', 'Precizno gađanje', 'Utrka po trakama', 'Pet kaznenih udaraca', 'Borba na poteze', 'Skupljač labirinta',
	'Preskači prepreke, sačuvaj živote i nastavi trčati.', 'Brzo ciljaj prije nego vremenski cilj nestane.', 'Mijenjaj traku, izbjegni promet i prijeđi stazu.', 'Odaberi zonu i pobijedi vratara u pet pokušaja.', 'Pobijedi tri neprijatelja napadom, gardom, čarolijom i liječenjem.', 'Skupi sve kristale dok te čuvar progoni.',
	'Skok', 'Pucaj', 'Lijevo', 'Desno', 'Gore', 'Dolje', 'Udarac', 'Napad', 'Garda', 'Čarolija', 'Liječenje', 'Vratar', 'Krug', 'Udarci', 'Zona', 'Kristali', 'Sredina',
	'Kontrole', 'D-pad + akcija', 'Unos', 'Tipke + dodir', 'Cijeli ekran', 'Izlaz iz prikaza', 'Proširi prikaz', 'Smjerne kontrole', 'Dodir',
] as const);

const tr = defineArcadeCopy([
	'06.1 / Oynanabilir oyun alanı', 'Oynanabilir oyun alanı', 'Klavye, işaretçi ve dokunma kontrollü altı gerçek mini oyun.', 'Bir atari mini oyunu seçin', 'Canlar', 'Süre',
	'Oynamaya hazır', 'Oyun sürüyor', 'Zafer', 'Oyun bitti', 'Çarpışma', 'Gol', 'Kurtarış',
	'Sonsuz koşu', 'Nişan atışı', 'Şerit yarışı', 'Beş penaltılık seri', 'Sıra tabanlı savaş', 'Labirent toplayıcısı',
	'Engelleri atla, canlarını koru ve koşuya devam et.', 'Süreli her hedef kaybolmadan önce hızlıca nişan al.', 'Şerit değiştir, trafiği atlat ve parkuru tamamla.', 'Bir bölge seçip beş denemede kaleciyi geç.', 'Saldırı, savunma, büyü ve iyileştirme ile üç düşmanı yen.', 'Muhafız seni takip ederken bütün kristalleri topla.',
	'Zıpla', 'Ateş et', 'Sol', 'Sağ', 'Yukarı', 'Aşağı', 'Vur', 'Saldır', 'Savun', 'Büyü', 'İyileş', 'Kaleci', 'Tur', 'Atışlar', 'Bölge', 'Kristaller', 'Orta',
	'Kontroller', 'D-pad + işlem', 'Giriş', 'Tuşlar + dokunma', 'Tam ekran', 'Görünümden çık', 'Görünümü genişlet', 'Yön kontrolleri', 'Dokunma',
] as const);

const ar = defineArcadeCopy([
	'06.1 / أركيد قابل للعب', 'أركيد قابل للعب', 'ست ألعاب صغيرة حقيقية بلوحة مفاتيح ومؤشر وتحكم باللمس.', 'اختر لعبة أركيد صغيرة', 'أرواح', 'الوقت',
	'جاهز للعب', 'اللعبة جارية', 'انتصار', 'انتهت اللعبة', 'اصطدام', 'هدف', 'تصدي',
	'عدّاء بلا نهاية', 'تصويب دقيق', 'سباق المسارات', 'خمس ركلات جزاء', 'قتال بالأدوار', 'جامع المتاهة',
	'اقفز فوق العوائق واحم الأرواح وأبقِ الجري مستمراً.', 'صوّب بسرعة قبل اختفاء كل هدف مؤقت.', 'غيّر المسار وتجنب السيارات وأكمل العبور.', 'اختر منطقة وتغلّب على الحارس في خمس محاولات.', 'اهزم ثلاثة أعداء بالهجوم والحراسة والسحر والعلاج.', 'اجمع كل البلورات بينما يطاردك الحارس.',
	'اقفز', 'أطلق', 'يسار', 'يمين', 'أعلى', 'أسفل', 'سدّد', 'هاجم', 'تحصّن', 'تعويذة', 'عالج', 'الحارس', 'جولة', 'محاولات', 'منطقة', 'بلورات', 'الوسط',
	'التحكم', 'D-pad + إجراء', 'الإدخال', 'المفاتيح + اللمس', 'ملء الشاشة', 'الخروج من العرض', 'توسيع العرض', 'التحكم الاتجاهي', 'اللمس',
] as const);

const hi = defineArcadeCopy([
	'06.1 / खेलने योग्य आर्केड', 'खेलने योग्य आर्केड', 'कीबोर्ड, पॉइंटर और टच नियंत्रण वाले छह असली मिनी गेम।', 'एक आर्केड मिनी गेम चुनें', 'जीवन', 'समय',
	'खेलने के लिए तैयार', 'खेल चल रहा है', 'जीत', 'खेल समाप्त', 'टक्कर', 'गोल', 'बचाव',
	'अनंत दौड़', 'निशाना शूटर', 'लेन रेस', 'पाँच शॉट की पेनल्टी', 'बारी आधारित युद्ध', 'भूलभुलैया संग्रहकर्ता',
	'बाधाएँ कूदें, जीवन बचाएँ और दौड़ जारी रखें।', 'समयबद्ध लक्ष्य गायब होने से पहले जल्दी निशाना लगाएँ।', 'लेन बदलें, ट्रैफिक बचाएँ और रास्ता पूरा करें।', 'कोना चुनें और पाँच कोशिशों में गोलकीपर को हराएँ।', 'हमला, रक्षा, जादू और उपचार से तीन शत्रु हराएँ।', 'रक्षक के पीछा करते हुए सभी क्रिस्टल इकट्ठे करें।',
	'कूदें', 'फायर', 'बाएँ', 'दाएँ', 'ऊपर', 'नीचे', 'शूट करें', 'हमला', 'रक्षा', 'जादू', 'उपचार', 'गोलकीपर', 'दौर', 'शॉट', 'क्षेत्र', 'क्रिस्टल', 'मध्य',
	'नियंत्रण', 'D-पैड + कार्रवाई', 'इनपुट', 'कुंजियाँ + टच', 'पूर्ण स्क्रीन', 'दृश्य से बाहर', 'दृश्य विस्तार', 'दिशात्मक नियंत्रण', 'टच',
] as const);

const bn = defineArcadeCopy([
	'06.1 / খেলার যোগ্য আর্কেড', 'খেলার যোগ্য আর্কেড', 'কীবোর্ড, পয়েন্টার ও স্পর্শ নিয়ন্ত্রণে ছয়টি সত্যিকারের মিনিগেম।', 'একটি আর্কেড মিনিগেম বেছে নিন', 'জীবন', 'সময়',
	'খেলার জন্য প্রস্তুত', 'খেলা চলছে', 'জয়', 'খেলা শেষ', 'সংঘর্ষ', 'গোল', 'রক্ষা',
	'অবিরাম দৌড়', 'নিশানা শুটার', 'লেন দৌড়', 'পাঁচ শটের পেনাল্টি', 'টার্নভিত্তিক যুদ্ধ', 'গোলকধাঁহা সংগ্রাহক',
	'বাধা লাফিয়ে পার হন, জীবন বাঁচান ও দৌড় চালিয়ে যান।', 'সময়মতো লক্ষ্য হারানোর আগে দ্রুত নিশানা করুন।', 'লেন বদলান, যানজট এড়ান ও পথ শেষ করুন।', 'জায়গা বেছে পাঁচ চেষ্টায় গোলরক্ষককে হারান।', 'আক্রমণ, রক্ষা, জাদু ও চিকিৎসায় তিন শত্রু হারান।', 'রক্ষক পিছু ধাওয়া করার সময় সব স্ফটিক সংগ্রহ করুন।',
	'লাফ', 'গুলিচালনা', 'বাম', 'ডান', 'উপরে', 'নিচে', 'শুট', 'আক্রমণ', 'রক্ষা', 'জাদু', 'চিকিৎসা', 'গোলরক্ষক', 'রাউন্ড', 'শট', 'অঞ্চল', 'স্ফটিক', 'মধ্য',
	'নিয়ন্ত্রণ', 'D-প্যাড + ক্রিয়া', 'ইনপুট', 'কী + টাচ', 'পূর্ণ পর্দা', 'দৃশ্য থেকে বেরুন', 'দৃশ্য বিস্তার', 'দিকনির্দেশক নিয়ন্ত্রণ', 'টাচ',
] as const);

const zhCn = defineArcadeCopy([
	'06.1 / 可玩街机', '可玩街机', '六款支持键盘、指针与触控的真正小游戏。', '选择街机小游戏', '生命', '时间',
	'准备开始', '游戏进行中', '胜利', '游戏结束', '碰撞', '进球', '扑救',
	'无限跑酷', '瞄准射击', '车道竞速', '五次点球', '回合战斗', '迷宫收集',
	'跳过障碍，保护生命，让奔跑持续下去。', '在限时目标消失前快速瞄准射击。', '切换车道、避开车流并完成穿越。', '选择射门区域，用五次机会战胜门将。', '用攻击、防守、法术和治疗击败三个敌人。', '在守卫追逐时收集迷宫中的全部水晶。',
	'跳跃', '开火', '向左', '向右', '向上', '向下', '射门', '攻击', '防守', '法术', '治疗', '守门员', '回合', '射门次数', '区域', '水晶', '中路',
	'控制', 'D-pad + 动作', '输入', '按键 + 触摸', '全屏', '退出视图', '展开视图', '方向控制', '触摸',
] as const);

const zhTw = defineArcadeCopy([
	'06.1 / 可玩街機', '可玩街機', '六款支援鍵盤、指標與觸控的真正小遊戲。', '選擇街機小遊戲', '生命', '時間',
	'準備開始', '遊戲進行中', '勝利', '遊戲結束', '碰撞', '進球', '撲救',
	'無限跑酷', '瞄準射擊', '車道競速', '五次點球', '回合戰鬥', '迷宮收集',
	'跳過障礙，保護生命，讓奔跑持續。', '在限時目標消失前快速瞄準射擊。', '切換車道、避開車流並完成穿越。', '選擇射門區域，以五次機會擊敗守門員。', '用攻擊、防禦、法術與治療擊敗三個敵人。', '在守衛追逐時收集迷宮中的所有水晶。',
	'跳躍', '開火', '向左', '向右', '向上', '向下', '射門', '攻擊', '防禦', '法術', '治療', '守門員', '回合', '射門次數', '區域', '水晶', '中路',
	'控制', 'D-pad + 動作', '輸入', '按鍵 + 觸控', '全螢幕', '退出視圖', '展開視圖', '方向控制', '觸控',
] as const);

const ja = defineArcadeCopy([
	'06.1 / 遊べるアーケード', '遊べるアーケード', 'キーボード、ポインター、タッチで遊べる本格ミニゲーム6本。', 'アーケードミニゲームを選ぶ', 'ライフ', '時間',
	'プレイ準備完了', 'ゲーム進行中', '勝利', 'ゲーム終了', '衝突', 'ゴール', 'セーブ',
	'エンドレスラン', '照準シューター', 'レーンレース', '5本のペナルティ', 'ターン制バトル', '迷路コレクター',
	'障害物を飛び越え、ライフを守って走り続けよう。', '制限時間付きの標的が消える前に素早く狙おう。', 'レーンを変え、交通を避けてコースを走破しよう。', '狙う場所を選び、5回でキーパーを破ろう。', '攻撃、防御、魔法、回復で3体の敵を倒そう。', '番人に追われながら迷路のクリスタルをすべて集めよう。',
	'ジャンプ', '発射', '左', '右', '上', '下', 'シュート', '攻撃', '防御', '魔法', '回復', 'キーパー', 'ラウンド', '本数', 'エリア', 'クリスタル', '中央',
	'コントロール', 'D-pad + アクション', '入力', 'キー + タッチ', 'フルスクリーン', 'ビューを終了', 'ビューを展開', '方向コントロール', 'タッチ',
] as const);

const ko = defineArcadeCopy([
	'06.1 / 플레이 가능한 아케이드', '플레이 가능한 아케이드', '키보드, 포인터, 터치를 지원하는 실제 미니 게임 여섯 개.', '아케이드 미니 게임 선택', '생명', '시간',
	'플레이 준비 완료', '게임 진행 중', '승리', '게임 종료', '충돌', '골', '선방',
	'무한 달리기', '조준 슈팅', '차선 레이스', '다섯 번의 페널티', '턴제 전투', '미로 수집가',
	'장애물을 뛰어넘고 생명을 지키며 계속 달리세요.', '시간 제한 목표가 사라지기 전에 빠르게 조준하세요.', '차선을 바꾸고 교통을 피해 코스를 통과하세요.', '구역을 선택해 다섯 번의 기회로 골키퍼를 이기세요.', '공격, 방어, 마법, 치유로 적 셋을 물리치세요.', '수호자에게 쫓기며 미로의 모든 수정을 모으세요.',
	'점프', '발사', '왼쪽', '오른쪽', '위', '아래', '슈팅', '공격', '방어', '마법', '치유', '골키퍼', '라운드', '횟수', '구역', '수정', '중앙',
	'조작', 'D-pad + 액션', '입력', '키 + 터치', '전체 화면', '보기 종료', '보기 확장', '방향 조작', '터치',
] as const);

const id = defineArcadeCopy([
	'06.1 / Arkade yang dapat dimainkan', 'Arkade yang dapat dimainkan', 'Enam gim mini nyata dengan kontrol kibor, penunjuk, dan sentuh.', 'Pilih gim mini arkade', 'Nyawa', 'Waktu',
	'Siap bermain', 'Permainan berlangsung', 'Kemenangan', 'Permainan selesai', 'Tabrakan', 'Gol', 'Penyelamatan',
	'Lari tanpa akhir', 'Penembak sasaran', 'Balap jalur', 'Lima tendangan penalti', 'Pertarungan bergiliran', 'Pengumpul labirin',
	'Lompati rintangan, jaga nyawa, dan terus berlari.', 'Bidik cepat sebelum setiap sasaran berwaktu menghilang.', 'Pindah jalur, hindari lalu lintas, dan selesaikan lintasan.', 'Pilih zona dan kalahkan kiper dalam lima percobaan.', 'Kalahkan tiga musuh dengan serangan, siaga, mantra, dan penyembuhan.', 'Kumpulkan semua kristal saat penjaga mengejar Anda.',
	'Lompat', 'Tembak', 'Kiri', 'Kanan', 'Atas', 'Bawah', 'Tendang', 'Serang', 'Siaga', 'Mantra', 'Sembuhkan', 'Kiper', 'Ronde', 'Tendangan', 'Zona', 'Kristal', 'Tengah',
	'Kontrol', 'D-pad + aksi', 'Masukan', 'Tombol + sentuh', 'Layar penuh', 'Keluar dari tampilan', 'Perluas tampilan', 'Kontrol arah', 'Sentuh',
] as const);

export const ARCADE_TRANSLATIONS = {
	en, es, fr, de, it, 'pt-PT': ptPt, 'pt-BR': ptBr, ru, uk, pl, hr, tr, ar, hi, bn,
	'zh-CN': zhCn, 'zh-TW': zhTw, ja, ko, id,
} satisfies Readonly<Record<ILocale, IArcadeTranslationMap>>;
