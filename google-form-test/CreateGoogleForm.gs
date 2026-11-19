/**
 * Тест «Вебтехнології: уроки 4–7» — створення Google Форми одним запуском.
 *
 * ЯК ЗАПУСТИТИ (2 хвилини, див. README.md, див. README.md):
 * 1. Відкрийте https://script.google.com → Новий проєкт.
 * 2. Видаліть вміст Code.gs і вставте ВЕСЬ цей файл.
 * 3. Виберіть функцію createTestForm → Run (▶).
 * 4. Дозвольте доступ своєму Google-акаунту (Continue → Allow).
 * 5. У журналі виконання (Executions / Logs) з'явиться посилання на форму.
 *
 * Форма створюється ПРЯМО У ВАШОМУ акаунті — я не маю доступу до нього,
 * тому скрипт виконується вами, а не мною.
 */

var QUESTIONS = [
  {
    "lesson": "Урок 4",
    "type": "single",
    "points": 1,
    "title": "У якому порядку від центру назовні розташовані шари CSS Box Model?",
    "choices": [
      "Content → Padding → Border → Margin",
      "Border → Margin → Content → Padding",
      "Margin → Border → Padding → Content",
      "Padding → Content → Margin → Border"
    ],
    "correct": [
      0
    ],
    "explain": "Від центру: контент, потім внутрішній відступ (padding), рамка (border) і зовнішній відступ (margin)."
  },
  {
    "lesson": "Урок 4",
    "type": "single",
    "points": 1,
    "title": "Чим padding відрізняється від margin?",
    "choices": [
      "Padding — внутрішній відступ між контентом і рамкою; margin — зовнішній відступ між елементом та іншими елементами",
      "Нічим, це одне й те саме",
      "Padding задає рамку, margin — колір фону",
      "Padding — зовнішній, margin — внутрішній"
    ],
    "correct": [
      0
    ],
    "explain": "Padding «роздуває» блок зсередини, margin відсуває його від сусідів ззовні."
  },
  {
    "lesson": "Урок 4",
    "type": "multiple",
    "points": 2,
    "title": "За значення content-box (замовчування) загальна ширина блоку = width + … Оберіть УСІ правильні варіанти:",
    "choices": [
      "border",
      "тільки content",
      "padding",
      "margin"
    ],
    "correct": [
      0,
      2
    ],
    "explain": "За content-box ширина = width + padding + border. Margin у ширину блоку не входить (він — поза блоком)."
  },
  {
    "lesson": "Урок 4",
    "type": "single",
    "points": 1,
    "title": "Що робить box-sizing: border-box?",
    "choices": [
      "Робить усі блоки однакового кольору",
      "Вимикає рамки на сторінці",
      "Забороняє margin",
      "Включає padding і border у заданий width, тому розмір блоку не «роздувається»"
    ],
    "correct": [
      3
    ],
    "explain": "З border-box width вже містить padding і border — верстка стає передбачуванішою."
  },
  {
    "lesson": "Урок 4",
    "type": "multiple",
    "points": 2,
    "title": "Які властивості задають рамку (border)? Оберіть УСІ правильні варіанти:",
    "choices": [
      "border-style (solid, dashed, dotted…)",
      "border-width",
      "border-radius — заокруглює кути рамки",
      "border-color"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "explain": "Повний запис: border: 2px solid #333; а border-radius додає заокруглення кутів."
  },
  {
    "lesson": "Урок 5",
    "type": "single",
    "points": 1,
    "title": "Що означає принцип Mobile First?",
    "choices": [
      "Сайт показується лише на мобільних",
      "Можна не перевіряти сайт на комп’ютері",
      "Спочатку створюємо базові стилі для смартфонів, потім додаємо стилі для більших екранів",
      "Спочатку робимо стилі для великих моніторів"
    ],
    "correct": [
      2
    ],
    "explain": "Mobile First: база — мобільний, далі — розширення для планшетів і десктопів."
  },
  {
    "lesson": "Урок 5",
    "type": "single",
    "points": 1,
    "title": "Для чого потрібен мета-тег viewport?",
    "choices": [
      "Щоб прискорити завантаження картинок",
      "Щоб мобільний браузер масштабував сторінку під ширину екрана пристрою",
      "Щоб додати заголовок сторінки",
      "Щоб увімкнути темну тему"
    ],
    "correct": [
      1
    ],
    "explain": "Без <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> мобільні браузери показують сторінку «зменшеною»."
  },
  {
    "lesson": "Урок 5",
    "type": "single",
    "points": 1,
    "title": "Коли застосовуються стилі всередині @media?",
    "choices": [
      "Тільки для друку сторінки",
      "Тільки коли виконується умова медіазапиту (напр., ширина екрана ≥ 768px)",
      "Лише у темній темі",
      "Завжди, у всіх браузерах"
    ],
    "correct": [
      1
    ],
    "explain": "Медіазапити дозволяють мати різні стилі для різних розмірів екрана."
  },
  {
    "lesson": "Урок 5",
    "type": "multiple",
    "points": 2,
    "title": "Які значення може мати flex-direction? Оберіть УСІ правильні варіанти:",
    "choices": [
      "row",
      "column",
      "row-reverse",
      "column-reverse"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "explain": "row/column задають напрям головної осі, а -reverse міняють порядок елементів місцями."
  },
  {
    "lesson": "Урок 5",
    "type": "single",
    "points": 1,
    "title": "Що НЕ допомагає адаптивності само по собі?",
    "choices": [
      "Гнучкий Flexbox-лейаут",
      "max-width для зображень",
      "Відносні одиниці (%)",
      "Фіксована ширина 1200px для всього сайту без медіазапитів"
    ],
    "correct": [
      3
    ],
    "explain": "Фіксована широка верстка ламається на вузьких екранах; % і max-width — гнучкі."
  },
  {
    "lesson": "Урок 6",
    "type": "single",
    "points": 1,
    "title": "Який рушій (browser engine) до якого браузера? Оберіть правильний рядок:",
    "choices": [
      "WebKit — Chrome/Edge; Gecko — Safari; Blink — Firefox",
      "Gecko — Chrome; Blink — Firefox; WebKit — Opera",
      "Усі браузери мають один рушій",
      "Blink — Chrome/Edge; WebKit — Safari/iOS; Gecko — Firefox"
    ],
    "correct": [
      3
    ],
    "explain": "Blink (Chrome, Edge), WebKit (Safari, iOS) і Gecko (Firefox) — три головні рушії."
  },
  {
    "lesson": "Урок 6",
    "type": "single",
    "points": 1,
    "title": "Для чого потрібні вендорні префікси (-webkit-, -moz-)?",
    "choices": [
      "Щоб приховати код від пошуковиків",
      "Щоб змінити назву сайту",
      "Щоб нові властивості CSS працювали в браузерах із різними рушіями",
      "Щоб зробити сайт платним"
    ],
    "correct": [
      2
    ],
    "explain": "Префікс вказує рушій: -webkit- — Blink/WebKit, -moz- — Gecko."
  },
  {
    "lesson": "Урок 6",
    "type": "single",
    "points": 1,
    "title": "Що робить директива @supports?",
    "choices": [
      "Створює копію сайту",
      "Прискорює завантаження шрифтів",
      "Забороняє підтримку старих браузерів",
      "Перевіряє, чи підтримує браузер конкретну властивість/значення CSS, і застосовує стилі лише якщо так"
    ],
    "correct": [
      3
    ],
    "explain": "@supports — прогресивне покращення: якщо браузер вміє — застосовуємо, якщо ні — працює базовий варіант."
  },
  {
    "lesson": "Урок 6",
    "type": "multiple",
    "points": 2,
    "title": "Що прискорює завантаження сайту? Оберіть УСІ правильні варіанти:",
    "choices": [
      "Сучасні формати зображень WebP/AVIF замість важкого JPEG",
      "loading=\"lazy\" для зображень поза екраном",
      "Мініфікація CSS/JS (видалення зайвих пробілів і коментарів)",
      "defer для скриптів"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "explain": "Менший обсяг файлів + відкладене завантаження = швидший сайт і кращий Lighthouse."
  },
  {
    "lesson": "Урок 6",
    "type": "single",
    "points": 1,
    "title": "Як працює lazy loading для зображень?",
    "choices": [
      "Картинки не завантажуються взагалі",
      "Усі картинки завантажуються одночасно при відкритті сторінки",
      "Зображення, яких не видно на екрані, завантажуються лише при наближенні до них під час прокрутки",
      "Сайт працює без інтернету"
    ],
    "correct": [
      2
    ],
    "explain": "loading=\"lazy\" економить трафік і прискорює перший показ сторінки."
  },
  {
    "lesson": "Урок 7",
    "type": "single",
    "points": 1,
    "title": "Який формат найкращий для логотипів, іконок та інтерфейсних елементів?",
    "choices": [
      "BMP — величезні файли",
      "SVG — векторна графіка: безкінечне масштабування без втрати якості",
      "GIF — 256 кольорів, без масштабування",
      "JPEG — фотоформат із втратами"
    ],
    "correct": [
      1
    ],
    "explain": "SVG описується кодом (шляхи та фігури), тому важить мало і чіткий на будь-якому екрані."
  },
  {
    "lesson": "Урок 7",
    "type": "single",
    "points": 1,
    "title": "Які формати растра найкращі для фотографій на сучасному сайті?",
    "choices": [
      "BMP і TIFF",
      "Тільки PNG-8",
      "WebP / AVIF — значно легші за JPEG за тієї самої якості",
      "GIF"
    ],
    "correct": [
      2
    ],
    "explain": "За матеріалами уроку: AVIF/WebP дають ≈ −65% ваги порівняно з JPEG."
  },
  {
    "lesson": "Урок 7",
    "type": "multiple",
    "points": 2,
    "title": "Що правильно про PNG? Оберіть УСІ правильні варіанти:",
    "choices": [
      "Добре підходить для UI-елементів із чіткими краями",
      "Ідеальний для великих фотографій (завжди менший за JPEG)",
      "Підтримує прозорість (альфа-канал)",
      "Стиснення без втрат (lossless)"
    ],
    "correct": [
      0,
      2,
      3
    ],
    "explain": "PNG чудовий для прозорості та чітких країв, але фото в ньому важчі, ніж у WebP/AVIF."
  },
  {
    "lesson": "Урок 7",
    "type": "single",
    "points": 1,
    "title": "Навіщо обов’язковий атрибут alt у тегу <img>?",
    "choices": [
      "Щоб картинка завантажувалась швидше",
      "Щоб заборонити копіювання картинки",
      "Його озвучують скрін-рідери, зчитують пошукові роботи, а при невдалому завантаженні користувач бачить опис",
      "Це необов’язковий атрибут"
    ],
    "correct": [
      2
    ],
    "explain": "alt — це доступність (a11y) і SEO: без нього незрячі користувачі не дізнаються зміст зображення."
  },
  {
    "lesson": "Урок 7",
    "type": "multiple",
    "points": 2,
    "title": "Як легально використовувати чужі зображення у своєму сайті? Оберіть УСІ правильні варіанти:",
    "choices": [
      "Перевірити ліцензію (напр., Creative Commons) і дотриматись її умов",
      "Вказати автора, якщо вимагає ліцензія",
      "Скопіювати будь-яку картинку з Google без перевірки ліцензії",
      "Взяти зображення з безкоштовних легальних джерел, що дозволяють використання"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explain": "«Знайшов в інтернеті» не означає «можна використовувати». CC та легальні стоки вказують умови."
  }
];

function createTestForm() {
  var form = FormApp.create('Тест: Вебтехнології (уроки 4–7)');
  form.setDescription(
    'Контрольний тест за навчальним сайтом «Вебтехнології», уроки 4–7: ' +
    'блочна модель, адаптивна верстка, кросбраузерність та оптимізація, графіка для вебу. ' +
    'Усього 20 питань, 26 балів. Успіхів!');
  try { form.setQuizSettings({ isQuiz: true, revealCorrect: true, revealPoints: true }); } catch (e) {}

  // Поля для учня на початку форми
  form.addTextItem().setTitle('Прізвище та ім’я').setRequired(true);
  form.addTextItem().setTitle('Клас').setRequired(true);

  var currentLesson = '';
  QUESTIONS.forEach(function (q, idx) {
    if (q.lesson !== currentLesson) {
      currentLesson = q.lesson;
      form.addPageBreakItem().setTitle('— ' + q.lesson + ' —');
    }
    var item = form.addMultipleChoiceItem();
    item.setTitle((idx + 1) + '. ' + q.title);
    item.setRequired(true);
    item.setHelpText('Балів: ' + q.points + '. Пояснення після відповіді: ' + q.explain);

    var choices = q.choices.map(function (text, i) {
      try { return item.createChoice(text, q.correct.indexOf(i) >= 0); }
      catch (e) { return text; }
    });
    try { item.setChoices(choices); } catch (e) { item.setChoices(q.choices); }

    try { item.setPoints(q.points); } catch (e) {}
    try {
      item.setFeedback(Feedback.createFeedback(q.explain,
        'Правильно! ' + q.explain, 'Неправильно. ' + q.explain));
    } catch (e) {}
  });

  Logger.log('ФОРМА ГОТОВА: ' + form.getPublishedUrl());
  Logger.log('Редактор форми: ' + form.getEditUrl());
  return form.getPublishedUrl();
}
