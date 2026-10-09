/* Smoke-тест ініціалізації спільного ядра та пісочниць у jsdom.
   Запуск:  npm i -D jsdom  &&  node test/dom-smoke.test.js
   Тест не впливає на роботу сайту. */

const { read, check, section, boot, report } = require('./helpers');

const PAGES = ['index.html', 'html-basics.html', 'css-basics.html', 'box-model.html', 'responsive-design.html'];
const LESSON_JS = ['app.js', 'html-lesson.js', 'css-lesson.js', 'box-model.js', 'responsive-lesson.js'];
const SYS_FN = ['initThemeToggle', 'initCourseDropdown', 'initMobileNavigation',
  'initActiveNavHighlight', 'initScrollProgress', 'initAccordions'];

section('1. Файли проєкту');
PAGES.forEach(p => check(p + ' існує', !!read(p).length));
['core.js', 'sandbox.js', 'app.js', 'html-lesson.js', 'css-lesson.js', 'box-model.js', 'responsive-lesson.js']
  .forEach(f => check('js/' + f + ' існує', read('js/' + f).length > 0));

section('2. Підключення на сторінках');
PAGES.forEach(page => {
  const html = read(page);
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const coreIdx = srcs.findIndex(s => s.startsWith('js/core.js'));
  const ownIdx = srcs.findIndex(s => !/^js\/(core|sandbox)\.js/.test(s));

  check(page + ': підключено core.js', coreIdx !== -1);
  check(page + ': є власний уроковий скрипт', ownIdx !== -1);
  check(page + ': core.js раніше за уроковим', coreIdx !== -1 && ownIdx !== -1 && coreIdx < ownIdx);
  check(page + ': немає інлайн-скриптів', !/<script>\s/.test(html));
  check(page + ': підключено favicon', html.includes('favicon.svg'));
  check(page + ': є viewport', html.includes('name="viewport"'));
});

section('3. Дублювання системних функцій');
LESSON_JS.forEach(f => {
  const code = read('js/' + f);
  SYS_FN.forEach(fn => {
    check(f + ' не визначає ' + fn + '()',
      !new RegExp('function\\s+' + fn + '\\s*\\(').test(code));
  });
});
const core = read('js/core.js');
SYS_FN.forEach(fn => {
  check('core.js визначає ' + fn + '()',
    new RegExp('function\\s+' + fn + '\\s*\\(').test(core));
});

section('4. Єдина механіка рендерингу iframe');
LESSON_JS.forEach(f => {
  const code = read('js/' + f);
  check(f + ' не використовує Blob/createObjectURL',
    !code.includes('createObjectURL') && !code.includes('new Blob'));
  check(f + ' не використовує contentDocument', !code.includes('contentDocument'));
});
check('sandbox.js рендерить через srcdoc', read('js/sandbox.js').includes('.srcdoc ='));

section('5. Ініціалізація в jsdom');
PAGES.forEach(page => {
  const { dom, window, error } = boot(page);
  check(page + ': скрипти виконалися без помилок', !error,
    error ? error.file + ' → ' + error.error : '');

  const doc = window.document;
  const theme = doc.documentElement.getAttribute('data-theme');
  check(page + ': тема застосована', theme === 'light' || theme === 'dark', String(theme));
  check(page + ': меню уроків має рівно 15 пунктів',
    doc.querySelectorAll('.course-dropdown-item').length === 15,
    'знайдено ' + doc.querySelectorAll('.course-dropdown-item').length);

  const accs = doc.querySelectorAll('.accordion-header');
  accs.forEach((a, i) => check(page + ': акордеон #' + i + ' має aria-expanded', a.hasAttribute('aria-expanded')));

  const themeBtn = doc.getElementById('themeToggleBtn');
  if (themeBtn) {
    const before = doc.documentElement.getAttribute('data-theme');
    themeBtn.dispatchEvent(new window.Event('click'));
    check(page + ': тема перемикається', doc.documentElement.getAttribute('data-theme') !== before,
      before + ' → ' + doc.documentElement.getAttribute('data-theme'));
  }

  const ddBtn = doc.getElementById('courseDropdownBtn');
  const dd = doc.getElementById('courseDropdown');
  if (ddBtn && dd) {
    ddBtn.dispatchEvent(new window.Event('click'));
    check(page + ': меню відкривається',
      dd.classList.contains('open') && ddBtn.getAttribute('aria-expanded') === 'true');

    check(page + ': є кнопка закриття меню', !!doc.getElementById('courseDropdownCloseBtn'));
    check(page + ': є картка прев\'ю уроків', !!doc.getElementById('menuPreviewBox'));

    const closeBtn = doc.getElementById('courseDropdownCloseBtn');
    if (closeBtn) {
      closeBtn.dispatchEvent(new window.Event('click'));
      check(page + ': кнопка закриття закриває меню',
        !dd.classList.contains('open') && ddBtn.getAttribute('aria-expanded') === 'false');
    }
  }

  // Перевірка нижнього пагінатора уроків
  check(page + ': є нижній пагінатор уроків', !!doc.querySelector('.lesson-pager-section'));
  check(page + ': є попередня та наступна навігація',
    !!doc.querySelector('.lesson-pager-card.prev') && !!doc.querySelector('.lesson-pager-card.next'));

  const pagerBtn = doc.getElementById('pagerAllLessonsBtn');
  if (pagerBtn && dd && ddBtn) {
    pagerBtn.dispatchEvent(new window.Event('click'));
    check(page + ': кнопка пагінатора відкриває меню курсу',
      dd.classList.contains('open') && ddBtn.getAttribute('aria-expanded') === 'true');
    const closeBtn = doc.getElementById('courseDropdownCloseBtn');
    if (closeBtn) closeBtn.dispatchEvent(new window.Event('click'));
  }

  dom.window.close();
});

section('6. Пісочниця Уроку 4 (box-model.html)');
{
  const { dom, window } = boot('box-model.html');
  const doc = window.document;
  const area = doc.getElementById('sandboxCss');
  const frame = doc.getElementById('sandboxPreview');

  check('box-model: є редактор CSS', !!area);
  check("box-model: є iframe-прев'ю", !!frame);
  check('box-model: iframe наповнено', frame.srcdoc.length > 0);
  check("box-model: у прев'ю є блок .box", frame.srcdoc.includes('class="box"'));

  area.value = '.box { width: 200px; padding: 20px; }';
  doc.getElementById('sandboxRunBtn').dispatchEvent(new window.Event('click'));
  check("box-model: кнопка «Виконати» оновлює прев'ю", frame.srcdoc.includes('padding: 20px'));

  const container = doc.getElementById('sandboxContainer');
  const fsBtn = doc.getElementById('sandboxFullscreenBtn');
  fsBtn.dispatchEvent(new window.Event('click'));
  check('box-model: фулскрин вмикається', container.classList.contains('is-fullscreen'));
  check('box-model: клас на body виставлено', doc.body.classList.contains('sandbox-fullscreen-active'));
  check('box-model: підпис кнопки змінено', fsBtn.textContent.indexOf('Закрити') !== -1, fsBtn.textContent.trim());

  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  check('box-model: Escape вимикає фулскрин', !container.classList.contains('is-fullscreen'));
  check('box-model: клас на body знято', !doc.body.classList.contains('sandbox-fullscreen-active'));

  dom.window.close();
}

section('7. Пісочниця Уроку 3 (css-basics.html)');
{
  const { dom, window } = boot('css-basics.html');
  const doc = window.document;
  const area = doc.getElementById('sandboxCodeArea');
  const frame = doc.getElementById('sandboxIframe');

  check('css-basics: редактор заповнено HTML-зразком', area.value.indexOf('<!DOCTYPE html>') !== -1);
  check('css-basics: iframe має початковий рендер', frame.srcdoc.length > 0);

  doc.getElementById('tabCssBtn').dispatchEvent(new window.Event('click'));
  check('css-basics: вкладка CSS активна', doc.getElementById('tabCssBtn').classList.contains('active'));
  check('css-basics: у вкладці CSS є правила', area.value.indexOf('{') !== -1);

  doc.getElementById('sandboxResetBtn').dispatchEvent(new window.Event('click'));
  check('css-basics: скидання не ламає рендер', frame.srcdoc.length > 0);

  dom.window.close();
}

section('8. Пісочниця Уроку 2 (html-basics.html)');
{
  const { dom, window } = boot('html-basics.html');
  const doc = window.document;
  const area = doc.getElementById('sandboxCodeArea');
  const frame = doc.getElementById('sandboxIframe');

  check('html-basics: зразок коду завантажено', area.value.indexOf('<!DOCTYPE html>') !== -1);
  check('html-basics: iframe через srcdoc', frame.srcdoc.indexOf('<!DOCTYPE html>') !== -1);

  area.value = '<p>Тест</p>';
  doc.getElementById('sandboxRunBtn').dispatchEvent(new window.Event('click'));
  check("html-basics: зміна коду оновлює прев'ю", frame.srcdoc.indexOf('Тест') !== -1);

  doc.getElementById('sandboxResetBtn').dispatchEvent(new window.Event('click'));
  check('html-basics: скидання відновлює зразок', area.value.indexOf('<!DOCTYPE html>') !== -1);

  dom.window.close();
}

section('9. Hero-тізер Уроку 2');
{
  const { dom, window } = boot('html-basics.html');
  const doc = window.document;
  const box = doc.getElementById('heroPreviewBox');

  if (box) {
    doc.getElementById('heroToggleHtmlBtn').dispatchEvent(new window.Event('click'));
    check('hero: кнопка «HTML» показує розмітку', box.innerHTML.indexOf('<li>') !== -1);
    check('hero: активна кнопка підсвічена', doc.getElementById('heroToggleHtmlBtn').classList.contains('btn-primary'));

    doc.getElementById('heroToggleRawBtn').dispatchEvent(new window.Event('click'));
    check('hero: кнопка «сирий код» перемикає стан', box.textContent.indexOf('DOCTYPE') !== -1);
  } else {
    check('hero: блок присутній на сторінці', false, 'не знайдено #heroPreviewBox');
  }

  dom.window.close();
}

section('10. Симулятор flex-direction Уроку 5 (responsive-design.html)');
{
  const { dom, window } = boot('responsive-design.html');
  const doc = window.document;
  const container = doc.getElementById('flexDemoContainer');
  const codeEl = doc.getElementById('flexDemoActiveCode');
  const colBtn = doc.querySelector('.flex-dir-btn[data-direction="column"]');

  check('responsive: контейнер flex-direction присутній', !!container);
  check('responsive: активне правило присутнє', !!codeEl);
  check('responsive: кнопка column присутня', !!colBtn);

  if (colBtn && container && codeEl) {
    colBtn.dispatchEvent(new window.Event('click'));
    check('responsive: клік на column перемикає flexDirection', container.style.flexDirection === 'column');
    check('responsive: правило оновлюється під column', codeEl.textContent.indexOf('column') !== -1);
  }

  dom.window.close();
}

process.exit(report());
