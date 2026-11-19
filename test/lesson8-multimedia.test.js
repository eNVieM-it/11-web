/* Автотест інтерактивної лабораторії Уроку 8 (web-multimedia.html) у jsdom.
   Запуск: node test/lesson8-multimedia.test.js */

const { check, section, boot, report } = require('./helpers');

section('Тестування інтерактивної лабораторії Уроку 8 (web-multimedia.html)');

const { dom, window, error } = boot('web-multimedia.html');
const doc = dom.window.document;

check('1. web-multimedia.html ініціалізовано без помилок', !error, error ? error.error : '');

/* --- 1. Фільтрація матриці MIME-типів та кодеків --- */
section('1. Фільтрація матриці MIME-типів та кодеків');
const mimeBtns = doc.querySelectorAll('.mime-filter-btn');
const mimeRows = doc.querySelectorAll('.mime-row');
check('Є 4 кнопки фільтрів матриці MIME', mimeBtns.length === 4);
check('Є 6 рядків форматів у матриці', mimeRows.length === 6);

mimeBtns[3].click(); // data-filter="modern"
const visibleModern = [...mimeRows].filter((r) => !r.classList.contains('hidden-row'));
check('Фільтр "Рекомендовані 2026" залишає 4 сучасні формати (WebM, MP4, Ogg/Opus, MP3)', visibleModern.length === 4);

mimeBtns[0].click(); // data-filter="all"
const visibleAll = [...mimeRows].filter((r) => !r.classList.contains('hidden-row'));
check('Повернення до "Усі формати" показує всі 6 рядків', visibleAll.length === 6);

/* --- 2. Довідник атрибутів <video> та <audio> --- */
section('2. Інтерактивний довідник атрибутів <video> та <audio>');
const attrChips = doc.querySelectorAll('.attr-chip-btn');
const attrTitle = doc.getElementById('attrDetailTitle');
const attrCode = doc.getElementById('attrDetailCode');
check('Є 8 кнопок атрибутів', attrChips.length === 8);

const trackBtn = doc.querySelector('.attr-chip-btn[data-attr="track"]');
trackBtn.click();
check('Клік на <track> оновлює заголовок довідника', attrTitle.textContent.includes('<track>'));
check('Клік на <track> показує приклад із srclang="uk"', attrCode.textContent.includes('srclang="uk"'));

/* --- 3. Вкладки лабораторії Web Multimedia Studio --- */
section('3. Таби лабораторії Web Multimedia Studio');
const tabBtns = doc.querySelectorAll('.mlab-tab-btn');
const panels = doc.querySelectorAll('.mlab-panel');
check('Є 3 кнопки табів студії', tabBtns.length === 3);
check('Є 3 панелі лабораторії', panels.length === 3);
check('Панель 1 (Симулятор плеєра) активна за замовчуванням', panels[0].classList.contains('active'));

tabBtns[1].click();
check('Клік на таб 2 активує тренажер відеогалереї (Практична №9)', panels[1].classList.contains('active') && !panels[0].classList.contains('active'));

tabBtns[2].click();
check('Клік на таб 3 активує конструктор медіа-коду', panels[2].classList.contains('active') && !panels[1].classList.contains('active'));

tabBtns[0].click();
check('Повернення на таб 1 працює', panels[0].classList.contains('active'));

/* --- 4. Симулятор HTML5 Плеєра та Autoplay Policy --- */
section('4. Симулятор HTML5 Плеєра та Autoplay Policy');
const chkAutoplay = doc.getElementById('simToggleAutoplay');
const chkMuted = doc.getElementById('simToggleMuted');
const verdictBox = doc.getElementById('simAutoplayVerdict');
const videoScreen = doc.getElementById('simVideoScreen');
const liveTagPreview = doc.getElementById('simLiveTagPreview');

chkAutoplay.checked = true;
chkAutoplay.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Увімкнення autoplay без muted блокується політикою браузера', verdictBox.classList.contains('status-blocked'));
check('Відео не запускається при заблокованому autoplay', !videoScreen.classList.contains('is-playing'));

chkMuted.checked = true;
chkMuted.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Комбінація autoplay + muted дозволяє автозапуск', verdictBox.classList.contains('status-ok'));
check('Відео автоматично переходить у стан is-playing', videoScreen.classList.contains('is-playing'));
check('Згенерована розмітка містить playsinline', liveTagPreview.textContent.includes('playsinline'));

/* --- 5. Тренажер відеогалереї (Практична робота №9 з підручника) --- */
section('5. Тренажер відеогалереї (Практична робота №9)');
const countSelect = doc.getElementById('galleryCountSelect');
const modeSelect = doc.getElementById('galleryModeSelect');
const previewRow = doc.getElementById('multimediaPreviewRow');
const galleryCssCode = doc.getElementById('galleryLiveCssCode');

check('За замовчуванням у галереї 3 відео в рядку (як у підручнику)', previewRow.querySelectorAll('.multimedia-video-card').length === 3);

countSelect.value = '4';
countSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Вибір 4 відео рендерить 4 картки у рядку', previewRow.querySelectorAll('.multimedia-video-card').length === 4);

modeSelect.value = 'float';
modeSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Режим класичної верстки з підручника генерує float: left та width: 25%', galleryCssCode.textContent.includes('float: left') && galleryCssCode.textContent.includes('width: 25%'));

/* --- 6. Конструктор семантичного медіа-коду --- */
section('6. Конструктор семантичного медіа-коду та чек-ліст');
const codeOut = doc.getElementById('mediaCodeOutput');
const scoreBadge = doc.getElementById('mediaScoreBadge');
const chkSubtitles = doc.getElementById('builderSubtitlesChk');

check('Початкова оцінка медіа-коду становить 5/5', scoreBadge.textContent.includes('5/5'));
check('Згенерований код містить каскад <source> та <track kind="subtitles">', codeOut.textContent.includes('type="video/webm"') && codeOut.textContent.includes('<track kind="subtitles"'));

chkSubtitles.checked = false;
chkSubtitles.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Вимкнення субтитрів знижує оцінку до 4/5', scoreBadge.textContent.includes('4/5'));

/* --- 7. Режим «На весь екран» --- */
section('7. Режим «На весь екран» для лабораторії');
const labBox = doc.getElementById('multimediaLabBox');
const fsBtn = doc.getElementById('labFullscreenBtn');
const fsLabel = doc.getElementById('labFullscreenLabel');

fsBtn.click();
check('Фулскрин активується: клас is-fullscreen додано до лабораторії', labBox.classList.contains('is-fullscreen'));
check('Клас sandbox-fullscreen-active додано до body', doc.body.classList.contains('sandbox-fullscreen-active'));
check('Текст кнопки змінився на Згорнути', fsLabel.textContent === 'Згорнути');

doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
check('Клавіша Escape згортає фулскрин', !labBox.classList.contains('is-fullscreen'));

/* --- 8. Самостійне опрацювання: живий <audio>, чек-ліст і навігація на Урок 9 --- */
section('8. Самостійний практикум та навігація Уроку 8');
const liveAudio = doc.getElementById('liveAudioDemoPlayer');
check('Є живий нативний аудіоплеєр <audio controls>', !!liveAudio && liveAudio.hasAttribute('controls'));
check('Аудіоплеєр має згенероване data:audio/wav джерело', !!liveAudio && (liveAudio.getAttribute('src') || '').startsWith('data:audio/wav;base64,'));

const selfChecks = doc.querySelectorAll('.self-check-checkbox');
const selfBadge = doc.getElementById('selfCheckProgressBadge');
check('Чек-ліст самоперевірки має 5 пунктів', selfChecks.length === 5);
selfChecks[0].checked = true;
selfChecks[0].dispatchEvent(new window.Event('change', { bubbles: true }));
check('Відмічання пункту оновлює лічильник до 1 / 5', !!selfBadge && selfBadge.textContent.includes('1 / 5'));

const nextPager = doc.querySelector('.lesson-pager-card.next');
check('Наступний урок у пагінаторі веде на css-animations.html', !!nextPager && nextPager.getAttribute('href') === 'css-animations.html');
check('Тест у кінці Уроку 8 відсутній', !doc.getElementById('test') && !doc.querySelector('.quiz-section'));

report();
