const { read, check, section, boot, report } = require('./helpers');

section('Тестування інтерактивної лабораторії Уроку 7 (web-graphics.html)');

const { dom, window, error } = boot('web-graphics.html');
check('1. web-graphics.html ініціалізовано без помилок', !error, error ? error.file + ' → ' + error.error : '');

const doc = window.document;

// 1. Таби лабораторії
section('1. Таби лабораторії Web Graphics Lab');
const tabs = doc.querySelectorAll('.lab-tab-btn');
const panels = doc.querySelectorAll('.lab-panel');
check('Є 3 кнопки табів', tabs.length === 3);
check('Є 3 панелі лабораторії', panels.length === 3);
check('Панель 1 (Симулятор) активна за замовчуванням', doc.getElementById('panelSimulator').classList.contains('active'));

tabs[1].dispatchEvent(new window.Event('click'));
check('Клік на таб 2 активує кейс-тренажер', doc.getElementById('panelArchitect').classList.contains('active') && !doc.getElementById('panelSimulator').classList.contains('active'));

tabs[2].dispatchEvent(new window.Event('click'));
check('Клік на таб 3 активує HTML-конструктор', doc.getElementById('panelGenerator').classList.contains('active'));

tabs[0].dispatchEvent(new window.Event('click'));
check('Повернення на таб 1 працює', doc.getElementById('panelSimulator').classList.contains('active'));

// 2. Симулятор Zoom & Compression
section('2. Симулятор Zoom & Compression');
const zoomSlider = doc.getElementById('zoomRange');
const zoomVal = doc.getElementById('zoomVal');
const vectorView = doc.getElementById('vectorZoomView');
const rasterView = doc.getElementById('rasterZoomView');

check('Елементи зуму присутні', !!zoomSlider && !!zoomVal && !!vectorView && !!rasterView);
if (zoomSlider) {
  zoomSlider.value = '400';
  zoomSlider.dispatchEvent(new window.Event('input'));
  check('Повзунок масштабу оновлює напис (400%)', zoomVal.textContent === '400%');
  check('Векторне прев\'ю масштабується у 4 рази', vectorView.style.transform === 'scale(4)');
  check('Растрове прев\'ю отримує pixelated рендер', rasterView.classList.contains('pixel-grid-active'));
}

const qualitySlider = doc.getElementById('qualityRange');
const qualityVal = doc.getElementById('qualityVal');
const metricSize = doc.getElementById('metricFileSize');
const metricSavings = doc.getElementById('metricSavings');
const metricTime3G = doc.getElementById('metricTime3G');
const metricTime4G = doc.getElementById('metricTime4G');
const metricRating = doc.getElementById('metricQualityRating');

check('Метрики стиснення присутні', !!qualitySlider && !!qualityVal && !!metricSize && !!metricSavings && !!metricTime3G && !!metricTime4G && !!metricRating);

if (qualitySlider) {
  qualitySlider.value = '50';
  qualitySlider.dispatchEvent(new window.Event('input'));
  check('Повзунок якості оновлює відсоток (50%)', qualityVal.textContent === '50%');
  check('Вага у КБ перераховується', parseInt(metricSize.textContent, 10) > 0);
}

const fmtAvif = doc.querySelector('.sim-fmt-btn[data-format="avif"]');
if (fmtAvif) {
  fmtAvif.dispatchEvent(new window.Event('click'));
  check('Формат AVIF стає активним', fmtAvif.classList.contains('active'));
  check('Оцінка якості містить ультра-стиснення', metricRating.textContent.includes('Ультра-стиснення') || metricRating.textContent.includes('Супер-баланс'));
}

// 3. Кейс-тренажер «Архітектор форматів»
section('3. Кейс-тренажер «Архітектор форматів»');
const scBadge = doc.getElementById('scBadge');
const scQuestion = doc.getElementById('scQuestion');
const scOptionsGrid = doc.getElementById('scOptionsGrid');
const scFeedback = doc.getElementById('scFeedback');
const scFeedbackTitle = doc.getElementById('scFeedbackTitle');
const scNextBtn = doc.getElementById('scNextBtn');

check('Елементи кейс-тренажера присутні', !!scBadge && !!scQuestion && !!scOptionsGrid && !!scFeedback && !!scNextBtn);
const options = scOptionsGrid.querySelectorAll('.scenario-opt-btn');
check('Згенеровано кнопки варіантів вибору (5)', options.length === 5);

const svgBtn = [...options].find(b => b.dataset.val === 'svg');
if (svgBtn) {
  svgBtn.dispatchEvent(new window.Event('click'));
  check('Вибір правильної відповіді SVG показує успіх', scFeedback.classList.contains('correct'));
  check('Кнопка «Наступний кейс» з\'являється', scNextBtn.style.display !== 'none');
}

if (scNextBtn) {
  scNextBtn.dispatchEvent(new window.Event('click'));
  check('Перехід до кейсу 2 виконано', scBadge.textContent.includes('КЕЙС 2'));
}

// 4. HTML-конструктор та перевірка ліцензій
section('4. HTML-конструктор безпечного коду');
const genImgUrl = doc.getElementById('genImgUrl');
const genImgAlt = doc.getElementById('genImgAlt');
const genWidth = doc.getElementById('genImgWidth');
const genHeight = doc.getElementById('genImgHeight');
const genCheckPicture = doc.getElementById('genCheckPicture');
const genCheckLazy = doc.getElementById('genCheckLazy');
const genCode = doc.getElementById('genCodeDisplay');
const genCopy = doc.getElementById('genCopyBtn');
const altWarning = doc.getElementById('genAltWarning');

check('Поля HTML-конструктора присутні', !!genImgUrl && !!genImgAlt && !!genWidth && !!genHeight && !!genCheckPicture && !!genCheckLazy && !!genCode && !!genCopy);

if (genImgAlt && genCode) {
  genImgAlt.value = 'Школярі пишуть код у кабінеті інформатики';
  genImgAlt.dispatchEvent(new window.Event('input'));
  check('Валідатор alt хвалить змістовний опис', altWarning.textContent.includes('Чудово'));
  check('Згенерований код містить <picture>', genCode.textContent.includes('<picture>'));
  check('Згенерований код містить loading="lazy"', genCode.textContent.includes('loading="lazy"'));
  check('Згенерований код містить <figcaption> з ліцензією', genCode.textContent.includes('<figcaption>'));

  const liveImg = doc.getElementById('genLiveImg');
  const liveSourceAvif = doc.getElementById('genLiveSourceAvif');
  const liveSourceWebp = doc.getElementById('genLiveSourceWebp');
  const errBadge = doc.getElementById('genImgLoadError');
  check('Живе зображення genLiveImg присутнє та має валідний src', !!liveImg && liveImg.getAttribute('src').includes('school-project.jpg'));
  check('Джерело AVIF присутнє та посилається на avif', !!liveSourceAvif && liveSourceAvif.getAttribute('srcset').includes('.avif'));
  check('Джерело WebP присутнє та посилається на webp', !!liveSourceWebp && liveSourceWebp.getAttribute('srcset').includes('.webp'));
  check('Оновлення alt синхронізується з liveImg.alt', liveImg.alt === 'Школярі пишуть код у кабінеті інформатики');
  check('Бейдж помилки завантаження genImgLoadError присутній', !!errBadge);

  // Тест введення стороннього URL (Unsplash)
  const unsplashUrl = 'https://images.unsplash.com/photo-1792208900103-cd3088eec006?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D';
  genImgUrl.value = unsplashUrl;
  genImgUrl.dispatchEvent(new window.Event('input'));
  check('Стороннє посилання Unsplash успішно застосовується до liveImg.src', liveImg.src === unsplashUrl);
  check('Для сторонніх URL зайві джерела <source> прибираються з прев\'ю', !doc.getElementById('genLiveSourceAvif') && !doc.getElementById('genLiveSourceWebp'));

  // Повернення до шкільного проєкту відновлює <source>
  genImgUrl.value = 'img/school-project.jpg';
  genImgUrl.dispatchEvent(new window.Event('input'));
  check('Повернення до шкільного зразка відновлює джерела <source>', !!doc.getElementById('genLiveSourceAvif') && !!doc.getElementById('genLiveSourceWebp'));
}

// 5. Фільтрація шпаргалки форматів
section('5. Фільтрація матриці форматів');
const filterBtns = doc.querySelectorAll('.matrix-filter-btn');
const rows = doc.querySelectorAll('.matrix-table tbody tr');
check('Є 4 кнопки фільтрів матриці', filterBtns.length === 4);
check('Є 6 рядків форматів', rows.length === 6);

const modernBtn = doc.querySelector('.matrix-filter-btn[data-filter="modern"]');
if (modernBtn) {
  modernBtn.dispatchEvent(new window.Event('click'));
  const visibleRows = [...rows].filter(r => r.style.display !== 'none');
  check('Фільтр "Сучасні стандарти" залишає 3 формати (SVG, WebP, AVIF)', visibleRows.length === 3);
}

// 6. Режим «На весь екран» для лабораторії
section('6. Режим «На весь екран» для лабораторії');
const labBox = doc.getElementById('graphicsLabBox');
const fsBtn = doc.getElementById('labFullscreenBtn');
check('Контейнер лабораторії та кнопка фулскрину присутні', !!labBox && !!fsBtn);
check('Тест у кінці уроку успішно прибрано', !doc.getElementById('quiz') && !doc.getElementById('lesson7QuizForm'));

if (labBox && fsBtn) {
  fsBtn.dispatchEvent(new window.Event('click'));
  check('Фулскрин активується: клас is-fullscreen додано до лабораторії', labBox.classList.contains('is-fullscreen'));
  check('Клас sandbox-fullscreen-active додано до body', doc.body.classList.contains('sandbox-fullscreen-active'));
  check('Текст кнопки змінився на Згорнути', fsBtn.textContent.includes('Згорнути'));

  // Закриття через клік
  fsBtn.dispatchEvent(new window.Event('click'));
  check('Фулскрин вимикається: клас is-fullscreen знято', !labBox.classList.contains('is-fullscreen'));
  check('Клас sandbox-fullscreen-active знято з body', !doc.body.classList.contains('sandbox-fullscreen-active'));
  check('Текст кнопки повернувся на На весь екран', fsBtn.textContent.includes('На весь екран'));

  // Закриття через клавішу Escape
  fsBtn.dispatchEvent(new window.Event('click'));
  check('Фулскрин знову увімкнено перед тестом Escape', labBox.classList.contains('is-fullscreen'));
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  check('Клавіша Escape згортає фулскрин', !labBox.classList.contains('is-fullscreen') && !doc.body.classList.contains('sandbox-fullscreen-active'));
}

dom.window.close();
process.exit(report());