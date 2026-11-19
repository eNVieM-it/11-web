/* Автотест інтерактивних модулів та практикуму Уроку 9 (css-animations.html) у jsdom.
   Запуск: node test/lesson9-animations.test.js */

const { check, section, boot, report } = require('./helpers');

section('Тестування інтерактивних модулів Уроку 9 (css-animations.html)');

const { dom, window, error } = boot('css-animations.html');
const doc = dom.window.document;

check('1. css-animations.html ініціалізовано без помилок', !error, error ? error.error : '');
check('Тест у кінці Уроку 9 відсутній (згідно з вимогою)', !doc.getElementById('test') && !doc.querySelector('.quiz-section'));

/* --- 1. Hero-демонстратор --- */
section('1. Hero-демонстратор живих CSS-ефектів');
const heroBtns = doc.querySelectorAll('.hero-demo-btn');
const heroTarget = doc.getElementById('heroDemoTarget');
const heroCode = doc.getElementById('heroDemoCode');
check('Є 3 кнопки режимів у Hero', heroBtns.length === 3);
heroBtns[2].click(); // spin
check('Клік на @keyframes застосовує клас demo-spin', heroTarget.classList.contains('demo-spin'));
check('Код Hero оновлюється під @keyframes spin', heroCode.textContent.includes('@keyframes spin'));

/* --- 2. Забіг функцій часу (Timing Functions Race) --- */
section('2. Забіг функцій часу (Timing Functions Race)');
const raceBtn = doc.getElementById('easingRaceStartBtn');
const raceTracks = doc.getElementById('easingRaceTracks');
check('Є 5 доріжок функцій часу', doc.querySelectorAll('.easing-runner').length === 5);
raceBtn.click();
check('Клік на старт запускає забіг (is-racing)', raceTracks.classList.contains('is-racing'));
raceBtn.click();
check('Повторний клік повертає кульки на старт', !raceTracks.classList.contains('is-racing'));

/* --- 3. Довідник 8 властивостей animation-* --- */
section('3. Довідник 8 властивостей animation-*');
const propChips = doc.querySelectorAll('.anim-prop-chip');
const propTitle = doc.getElementById('animPropTitle');
const propCode = doc.getElementById('animPropCode');
check('Є 8 чипів властивостей animation-*', propChips.length === 8);
const playStateChip = doc.querySelector('.anim-prop-chip[data-prop="animation-play-state"]');
playStateChip.click();
check('Клік на animation-play-state оновлює заголовок', propTitle.textContent.includes('animation-play-state'));
check('Приклад коду містить paused', propCode.textContent.includes('paused'));

/* --- 4. Вкладки CSS Animation Studio --- */
section('4. Таби CSS Animation Studio');
const tabBtns = doc.querySelectorAll('.astudio-tab-btn');
const panels = doc.querySelectorAll('.astudio-panel');
check('Є 3 кнопки табів студії', tabBtns.length === 3);
check('Є 3 панелі студії', panels.length === 3);
check('Панель 1 (transition) активна за замовчуванням', panels[0].classList.contains('active'));

tabBtns[1].click();
check('Клік на таб 2 активує студію @keyframes', panels[1].classList.contains('active') && !panels[0].classList.contains('active'));

tabBtns[2].click();
check('Клік на таб 3 активує Hover-галерею', panels[2].classList.contains('active') && !panels[1].classList.contains('active'));

tabBtns[0].click();
check('Повернення на таб 1 працює', panels[0].classList.contains('active'));

/* --- 5. Конструктор transform + transition --- */
section('5. Конструктор transform + transition');
const slRotate = doc.getElementById('trRotate');
const hoverChk = doc.getElementById('studioSimulateHover');
const trBox = doc.getElementById('studioTransformBox');
const trCss = doc.getElementById('transitionLiveCss');

slRotate.value = '135';
slRotate.dispatchEvent(new window.Event('input', { bubbles: true }));
hoverChk.checked = true;
hoverChk.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Зміна rotate(135deg) відображається на сцені', trBox.style.transform.includes('rotate(135deg)'));
check('CSS-код містить rotate(135deg)', trCss.textContent.includes('rotate(135deg)'));

/* --- 6. Студія @keyframes --- */
section('6. Студія @keyframes та animation');
const kfPreset = doc.getElementById('kfPresetSelect');
const kfActor = doc.getElementById('kfStudioActor');
const kfPauseBtn = doc.getElementById('kfPlayPauseBtn');
const kfCss = doc.getElementById('kfLiveCssCode');

kfPreset.value = 'bounce';
kfPreset.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Вибір пресету bounce оновлює animationName', kfActor.style.animationName === 'kfBounceBall');
check('Згенерований код містить @keyframes bounceBall', kfCss.textContent.includes('@keyframes bounceBall'));

kfPauseBtn.click();
check('Кнопка Пауза ставить animationPlayState = paused', kfActor.style.animationPlayState === 'paused');

/* --- 7. Hover-галерея --- */
section('7. Жива Hover-галерея');
const clipChk = doc.getElementById('galleryOverflowClip');
const firstFrame = doc.querySelector('.hover-gallery-frame');
clipChk.checked = false;
clipChk.dispatchEvent(new window.Event('change', { bubbles: true }));
check('Вимкнення overflow: hidden додає клас no-clip', firstFrame.classList.contains('no-clip'));

/* --- 8. Фулскрин студії --- */
section('8. Режим «На весь екран» студії');
const studioBox = doc.getElementById('animStudioBox');
const fsBtn = doc.getElementById('studioFullscreenBtn');
fsBtn.click();
check('Фулскрин студії активується', studioBox.classList.contains('is-fullscreen'));
doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
check('Escape згортає фулскрин студії', !studioBox.classList.contains('is-fullscreen'));

/* --- 9. Практикум: Жива пісочниця + Авточек-ліст --- */
section('9. Практикум (Жива пісочниця та авточек-ліст)');
const sbArea = doc.getElementById('animSandboxCodeArea');
const sbFrame = doc.getElementById('animSandboxIframe');
const sbBadge = doc.getElementById('pracValidatorBadge');
const hintBtn2 = doc.querySelector('.prac-hint-btn[data-hint="task2"]');

check('Пісочниця рендерить стартовий код у iframe.srcdoc', sbFrame.srcdoc.includes('@keyframes spin'));
check('Стартовий код проходить усі 5/5 перевірок', sbBadge.textContent.includes('5/5'));

hintBtn2.click();
check('Кнопка підказки №2 завантажує код @keyframes spin', sbArea.value.includes('Завдання 2'));
check('Авточек-ліст коректно оновлює оцінку (без :hover оцінка менша за 5/5)', !sbBadge.textContent.includes('5/5'));

/* --- 10. Пагінатор --- */
section('10. Навігація пагінатора');
const prevCard = doc.querySelector('.lesson-pager-card.prev');
check('Попередній урок веде на web-multimedia.html', !!prevCard && prevCard.getAttribute('href') === 'web-multimedia.html');

dom.window.close();
process.exit(report());
