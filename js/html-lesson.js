/* ==========================================================================
   УРОК 2: МОВА ГІПЕРТЕКСТОВОЇ РОЗМІРКИ HTML
   Інтерактивні модулі, симулятори, жива лабораторія та пісочниця коду
   Курс «Вебтехнології» (10–11 класи) • Стандарти W3C та HTML5
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Загальні системні модулі
  initThemeToggle();
  initCourseDropdown();
  initMobileNavigation();
  initActiveNavHighlight();
  initScrollProgress();
  initAccordions();

  // Навчальні інтерактивні модулі уроку HTML
  initAnatomyModule();
  initXrayModule();
  initTextPlayground();
  initListBuilder();
  initLinkSimulator();

  // Практична робота: пісочниця коду
  initPracticalSandbox();

  console.log('🚀 Урок 2 (Основи HTML) успішно ініціалізовано!');
});

/** -------------------------------------------------------------------------
 * 1. БАЗОВІ СИСТЕМНІ ФУНКЦІЇ
 * ------------------------------------------------------------------------ */
function initCourseDropdown() {
  const dropdown = document.getElementById('courseDropdown');
  const dropdownBtn = document.getElementById('courseDropdownBtn');
  if (!dropdown || !dropdownBtn) return;

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });
}

function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('site_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeBtn.textContent = currentTheme === 'dark' ? 'ДЕНЬ ☀️' : 'НІЧ 🌙';

  themeBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const newTheme = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('site_theme', newTheme);
    themeBtn.textContent = newTheme === 'dark' ? 'ДЕНЬ ☀️' : 'НІЧ 🌙';
  });
}

function initMobileNavigation() {
  const burgerBtn = document.getElementById('burgerMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!burgerBtn || !navLinks) return;

  burgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
    burgerBtn.textContent = navLinks.classList.contains('mobile-active') ? 'ЗАКРИТИ ✕' : 'МЕНЮ ☰';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-active');
      burgerBtn.textContent = 'МЕНЮ ☰';
    });
  });
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 130;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      if (!item) return;
      item.classList.toggle('active');
      const icon = btn.querySelector('.accordion-icon');
      if (icon) {
        icon.textContent = item.classList.contains('active') ? '−' : '+';
      }
    });
  });
}

/** -------------------------------------------------------------------------
 * 2. ІНТЕРАКТИВ 1: АНАТОМІЯ ТЕГА ТА АТРИБУТІВ
 * ------------------------------------------------------------------------ */
function initAnatomyModule() {
  const displayBox = document.getElementById('anatomyDisplayBox');
  const infoTitle = document.getElementById('anatomyInfoTitle');
  const infoDesc = document.getElementById('anatomyInfoDesc');
  const infoRule = document.getElementById('anatomyInfoRule');
  const infoIcon = document.getElementById('anatomyInfoIcon');
  const modeBtns = document.querySelectorAll('.anatomy-mode-btn');

  if (!displayBox || !infoTitle) return;

  const modesData = {
    paired: {
      html: `
        <span class="anatomy-token token-bracket" data-role="open-bracket">&lt;<span class="token-badge">відкриття</span></span>
        <span class="anatomy-token token-tagname" data-role="tagname">a<span class="token-badge">тег</span></span>
        <span class="anatomy-token token-attr-name" data-role="attr-name">&nbsp;href<span class="token-badge">атрибут</span></span>
        <span class="anatomy-token token-operator" data-role="operator">=<span class="token-badge">знак</span></span>
        <span class="anatomy-token token-attr-val" data-role="attr-val">"https://google.com"<span class="token-badge">значення (куди перейти)</span></span>
        <span class="anatomy-token token-bracket" data-role="close-bracket">&gt;<span class="token-badge">дужка</span></span>
        <span class="anatomy-token token-content" data-role="content">Перейти на Google<span class="token-badge">видимий текст (анкор)</span></span>
        <span class="anatomy-token token-closing" data-role="closing-tag">&lt;/a&gt;<span class="token-badge">закриття</span></span>
      `,
      defaultRole: 'tagname'
    },
    single: {
      html: `
        <span class="anatomy-token token-bracket" data-role="open-bracket">&lt;<span class="token-badge">відкриття</span></span>
        <span class="anatomy-token token-tagname" data-role="img-tagname">img<span class="token-badge">одинарний тег</span></span>
        <span class="anatomy-token token-attr-name" data-role="img-src">&nbsp;src<span class="token-badge">атрибут джерела</span></span>
        <span class="anatomy-token token-operator" data-role="operator">=<span class="token-badge">знак</span></span>
        <span class="anatomy-token token-attr-val" data-role="img-src-val">"url_зображення.jpg"<span class="token-badge">адреса файлу</span></span>
        <span class="anatomy-token token-attr-name" data-role="img-alt">&nbsp;alt<span class="token-badge">атрибут опису</span></span>
        <span class="anatomy-token token-operator" data-role="operator">=<span class="token-badge">знак</span></span>
        <span class="anatomy-token token-attr-val" data-role="img-alt-val">"Опис зображення"<span class="token-badge">текст для читалок/пошуку</span></span>
        <span class="anatomy-token token-bracket" data-role="close-bracket">&gt;<span class="token-badge">закриття дужки</span></span>
      `,
      defaultRole: 'img-tagname'
    },
    break: {
      html: `
        <span class="anatomy-token token-bracket" data-role="open-bracket">&lt;<span class="token-badge">відкриття</span></span>
        <span class="anatomy-token token-tagname" data-role="meta-tagname">meta<span class="token-badge">службовий тег</span></span>
        <span class="anatomy-token token-attr-name" data-role="meta-charset">&nbsp;charset<span class="token-badge">атрибут кодування</span></span>
        <span class="anatomy-token token-operator" data-role="operator">=<span class="token-badge">знак</span></span>
        <span class="anatomy-token token-attr-val" data-role="meta-charset-val">"UTF-8"<span class="token-badge">стандарт символів</span></span>
        <span class="anatomy-token token-bracket" data-role="close-bracket">&gt;<span class="token-badge">закриття дужки</span></span>
      `,
      defaultRole: 'meta-charset'
    }
  };

  const explanations = {
    'open-bracket': {
      title: 'Кутова дужка «<» (Початок тега)',
      desc: 'Повідомляє веб-браузеру: «Увага! Зараз почнеться команда HTML, а не звичайний друкований текст на екрані».',
      rule: 'Спецсимвол: якщо треба вивести знак «<» у тексті статті, пишуть код &lt;',
      icon: '📐'
    },
    'tagname': {
      title: 'Назва тега: «a» (від англ. Anchor — «якір»)',
      desc: 'Створює клікабельне гіперпосилання. Це найголовніший тег інтернету, який з’єднує мільярди сторінок між собою.',
      rule: 'Згідно зі стандартом HTML5 усі назви тегів записуються малими літерами.',
      icon: '🔗'
    },
    'attr-name': {
      title: 'Атрибут: «href» (Hypertext Reference)',
      desc: 'Вказує браузеру цільову веб-адресу, куди користувач перейде після натискання на посилання.',
      rule: 'Атрибути завжди пишуться всередині відкривального тега через пробіл після його імені.',
      icon: '⚙️'
    },
    'operator': {
      title: 'Знак рівності «=» (Оператор присвоєння)',
      desc: 'Пов’язує ім’я атрибута з його значенням. Пробіли навколо знака «=» ставити не прийнято.',
      rule: 'Формат завжди єдиний: атрибут="значення"',
      icon: '🟰'
    },
    'attr-val': {
      title: 'Значення атрибута: "https://google.com"',
      desc: 'Конкретна URL-адреса сайту в глобальній мережі Інтернет. Обов’язково береться в подвійні лапки.',
      rule: 'Для зовнішніх сайтів обов’язково вказувати протокол https:// або http://',
      icon: '🎯'
    },
    'close-bracket': {
      title: 'Кутова дужка «>» (Кінець відкривального тега)',
      desc: 'Завершує налаштування параметрів тега. Усе, що написано після неї, браузер сприймає як контент сторінки.',
      rule: 'Спецсимвол: для відображення знака «>» у тексті статті пишуть &gt;',
      icon: '📐'
    },
    'content': {
      title: 'Контент елемента (Анкор): «Перейти на Google»',
      desc: 'Текст або картинка між відкривальним і закривальним тегами. Саме це бачить користувач і саме на це натискає мишкою.',
      rule: 'Текст посилання має бути зрозумілим і чітко пояснювати, куди веде перехід.',
      icon: '✍️'
    },
    'closing-tag': {
      title: 'Закривальний тег: «</a>»',
      desc: 'Повідомляє браузеру, що посилання закінчилося. Відрізняється від відкривального наявністю прямого слеша «/».',
      rule: 'Парні теги (<a>, <p>, <h1>, <div>) обов’язково мають закриватися, інакше посиланням стане весь наступний сайт!',
      icon: '🏁'
    },
    'img-tagname': {
      title: 'Одинарний тег: «img» (від Image — «зображення»)',
      desc: 'Вставляє на сторінку картинку або фото. Цей тег є одинарним (непарним) — йому не потрібен закривальний тег </img>, бо всередину не вкладається текст.',
      rule: 'В HTML5 одинарні теги закриваються просто дужкою > (слеш /> необов’язковий).',
      icon: '🖼️'
    },
    'img-src': {
      title: 'Атрибут «src» (від Source — «джерело»)',
      desc: 'Найважливіший атрибут картинки. Без нього браузер не знатиме, який файл завантажувати і показувати.',
      rule: 'Обов’язковий атрибут для тега <img>.',
      icon: '📁'
    },
    'img-src-val': {
      title: 'Шлях до файлу: "url_зображення.jpg"',
      desc: 'Адреса зображення в інтернеті (наприклад, https://site.ua/pic.jpg) або шлях до файлу на комп’ютері (наприклад, images/photo.jpg).',
      rule: 'Підтримуються формати: JPG/JPEG (для фото), PNG (з прозорістю), SVG (вектор), WebP (сучасний легкий формат).',
      icon: '🔍'
    },
    'img-alt': {
      title: 'Атрибут «alt» (Alternative Text — «альтернативний текст»)',
      desc: 'Текстовий опис картинки. Браузер показує його, якщо фото не завантажилося через повільний інтернет, а диктори читають його для незрячих людей.',
      rule: 'Обов’язковий для доступності (Accessibility) та пошукового просування (SEO)!',
      icon: '♿'
    },
    'img-alt-val': {
      title: 'Значення alt: "Опис зображення"',
      desc: 'Короткий змістовний текст, який пояснює, що зображено на ілюстрації.',
      rule: 'Якщо картинка суто декоративна (лінія чи фоновий візерунок), можна залишати alt="".',
      icon: '💬'
    },
    'meta-tagname': {
      title: 'Службовий тег: «meta» (Метадані)',
      desc: 'Розміщується всередині секції <head> і передає браузеру технічні інструкції щодо сторінки. На самому екрані не відображається.',
      rule: 'Одинарний (непарний) тег — закривального тега </meta> не існує.',
      icon: 'ℹ️'
    },
    'meta-charset': {
      title: 'Атрибут «charset» (Character Set — набір символів)',
      desc: 'Вказує таблицю кодування символів для правильного відображення літер тексту всіма мовами.',
      rule: 'Рекомендується писати найпершим тегом усередині <head>.',
      icon: '🌐'
    },
    'meta-charset-val': {
      title: 'Кодування: "UTF-8"',
      desc: 'Універсальний стандарт Юнікоду. Включає українські літери (і, ї, є, ґ), усі мови світу та навіть смайлики-емодзі 🚀.',
      rule: 'Без кодування UTF-8 замість українського тексту з’являться незрозумілі символи («кракозябри»).',
      icon: '🔤'
    }
  };

  function updateExplanation(role) {
    const data = explanations[role];
    if (!data) return;

    infoTitle.textContent = data.title;
    infoDesc.textContent = data.desc;
    infoRule.textContent = data.rule;
    infoIcon.textContent = data.icon;

    displayBox.querySelectorAll('.anatomy-token').forEach(tok => {
      tok.classList.toggle('active', tok.dataset.role === role);
    });
  }

  function bindTokens() {
    displayBox.querySelectorAll('.anatomy-token').forEach(token => {
      token.addEventListener('click', () => {
        const role = token.dataset.role;
        updateExplanation(role);
      });
      token.addEventListener('mouseenter', () => {
        const role = token.dataset.role;
        updateExplanation(role);
      });
    });
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      const conf = modesData[mode];
      if (conf) {
        displayBox.innerHTML = conf.html;
        bindTokens();
        updateExplanation(conf.defaultRole);
      }
    });
  });

  displayBox.innerHTML = modesData.paired.html;
  bindTokens();
  updateExplanation('tagname');
}

/** -------------------------------------------------------------------------
 * 3. ІНТЕРАКТИВ 2: РЕНТГЕН DOM-СТРУКТУРИ
 * ------------------------------------------------------------------------ */
function initXrayModule() {
  const nodes = document.querySelectorAll('.xray-node');
  const mockBlocks = document.querySelectorAll('.mock-block');
  const browserTab = document.getElementById('xrayBrowserTab');
  const titleEl = document.getElementById('xrayDescTitle');
  const textEl = document.getElementById('xrayDescText');
  const roleEl = document.getElementById('xrayDescRole');

  if (!nodes.length || !titleEl) return;

  const nodeDescriptions = {
    doctype: {
      title: '<!DOCTYPE html> — Інструкція версії стандарту',
      role: 'Службова декларація (не тег)',
      text: 'Вказує браузеру, за яким стандартом інтерпретувати розмітку. Значення «html» активує сучасний режим стандартів HTML5 та захищає від багів застарілого режиму сумісності.',
      highlightTarget: null
    },
    html: {
      title: '<html lang="uk"> — Кореневий елемент сторінки',
      role: 'Головний контейнер документа',
      text: 'Кореневий тег, що огортає весь код веб-сторінки. Атрибут lang="uk" повідомляє пошуковикам і браузерам мову контенту для правильного автоперекладу та дикторського читання.',
      highlightTarget: 'all'
    },
    head: {
      title: '<head> — Службова секція (Голова документа)',
      role: 'Метадані та підключення ресурсів',
      text: 'Містить інформацію, НЕВИДИМУ у вікні сторінки (крім назви вкладки): кодування UTF-8, метатеги для пошукових систем, підключення стилів CSS, шрифтів і фавіконок.',
      highlightTarget: 'tab'
    },
    meta: {
      title: '<meta charset="UTF-8"> — Кодування символів',
      role: 'Службовий одинарний тег',
      text: 'Встановлює міжнародне кодування UTF-8. Забезпечує бездоганне відображення літер «і», «ї», «є», «ґ» без появи пошкоджених символів.',
      highlightTarget: null
    },
    title: {
      title: '<title> — Назва сторінки у вкладці браузера',
      role: 'Заголовок вкладки та пошуку',
      text: 'Задає назву сторінки, яка відображається на ярлику вкладки браузера, в історії відвідувань, закладках та головному рядку пошукової видачі Google.',
      highlightTarget: 'tab'
    },
    body: {
      title: '<body> — Тіло документа (Видимий контент)',
      role: 'Головний візуальний контейнер',
      text: 'Усе, що відвідувач бачить і з чим взаємодіє у браузері (текст, медіа, форми, кнопки, таблиці), розташовується виключно між відкривальним <body> і закривальним </body>.',
      highlightTarget: 'all'
    },
    header: {
      title: '<header> — Шапка сторінки або секції',
      role: 'Семантичний блок верхівки',
      text: 'Традиційно містить фірмовий логотип, назву сайту, слоган та блок головного меню навігації.',
      highlightTarget: 'mock-header'
    },
    nav: {
      title: '<nav> — Секція навігації сайту',
      role: 'Семантичний контейнер меню',
      text: 'Огортає перелік посилань головного меню. Допомагає пошуковим роботам швидко будувати карту сайту та полегшує доступність.',
      highlightTarget: 'mock-nav'
    },
    main: {
      title: '<main> — Головний унікальний контент сторінки',
      role: 'Центральний інформаційний блок',
      text: 'Містить ключовий зміст конкретної веб-сторінки (статтю, каталог товарів, портфоліо чи інтерактивний урок). На сторінці використовується лише один тег <main>.',
      highlightTarget: 'mock-main'
    },
    footer: {
      title: '<footer> — Підвал сайту (Footer)',
      role: 'Нижня службова частина',
      text: 'Містить авторські права (©), контактні дані, посилання на політику приватності, соціальні мережі або дублюючу навігацію.',
      highlightTarget: 'mock-footer'
    }
  };

  function selectNode(key) {
    const conf = nodeDescriptions[key];
    if (!conf) return;

    nodes.forEach(n => n.classList.toggle('active', n.dataset.target === key));

    titleEl.textContent = conf.title;
    roleEl.textContent = conf.role;
    textEl.textContent = conf.text;

    mockBlocks.forEach(b => b.classList.remove('active'));
    if (browserTab) browserTab.classList.remove('highlight');

    if (conf.highlightTarget === 'tab' && browserTab) {
      browserTab.classList.add('highlight');
    } else if (conf.highlightTarget === 'all') {
      mockBlocks.forEach(b => b.classList.add('active'));
    } else if (conf.highlightTarget) {
      const targetBlock = document.getElementById(conf.highlightTarget);
      if (targetBlock) targetBlock.classList.add('active');
    }
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      selectNode(node.dataset.target);
    });
  });

  selectNode('header');
}

/** -------------------------------------------------------------------------
 * 4. ІНТЕРАКТИВ 3: ТЕКСТОВА ЛАБОРАТОРІЯ (TEXT PLAYGROUND)
 * ------------------------------------------------------------------------ */
function initTextPlayground() {
  const textarea = document.getElementById('labTextarea');
  const preview = document.getElementById('labPreviewBody');
  const toolBtns = document.querySelectorAll('.lab-tool-btn');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (!textarea || !preview) return;

  function renderPreview() {
    preview.innerHTML = textarea.value;
  }

  textarea.addEventListener('input', renderPreview);

  const presets = {
    headings: `<h1>Головний заголовок першого рівня</h1>
<h2 align="right">Підзаголовок 2 рівня (праворуч)</h2>
<h3 align="center">Розділ 3 рівня (по центру)</h3>
<p>Атрибут <code>align</code> задає вирівнювання: left, center, right, justify. У сучасному вебі для оформлення частіше застосовують CSS <code>text-align</code>.</p>`,

    quote: `<h2>Сучасні стандарти веб-розробки</h2>
<p>Один із ключових принципів веб-архітектури формулюється так:</p>
<blockquote style="border-left: 4px solid var(--accent-vermilion); padding-left: 1rem; font-style: italic; margin: 1rem 0; background: rgba(255, 71, 50, 0.05); padding-top: 0.5rem; padding-bottom: 0.5rem;">
  «Семантична розмітка відокремлює зміст документа від його візуального оформлення, роблячи сайти швидкими та доступними для кожного».
</blockquote>
<p>Важливий акцент: <mark>структура HTML визначає зміст</mark>, а стилі CSS — зовнішній вигляд.</p>`,

    science: `<h3>Наукові формули та фрагменти коду</h3>
<p>Хімічна формула води: H<sub>2</sub>O, глюкози: C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>.</p>
<p>Формула енергії Ейнштейна: E = mc<sup>2</sup>.</p>
<p>Виклик функції мовою JavaScript: <code>console.log('Hello, World!');</code></p>
<hr>
<p>Горизонтальна лінія вище створена одинарним тегом <code>&lt;hr&gt;</code>.</p>`
  };

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.preset;
      if (presets[key]) {
        textarea.value = presets[key];
        renderPreview();
      }
    });
  });

  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);

      let replacement = '';
      if (tag === 'hr') {
        replacement = '\n<hr>\n';
      } else if (tag === 'br') {
        replacement = '<br>\n';
      } else if (tag === 'align-center') {
        replacement = `<p align="center">${selected || 'Текст по центру'}</p>`;
      } else {
        replacement = `<${tag}>${selected || `Текст ${tag}`}</${tag}>`;
      }

      textarea.setRangeText(replacement, start, end, 'end');
      textarea.focus();
      renderPreview();
    });
  });

  renderPreview();
}

/** -------------------------------------------------------------------------
 * 5. ІНТЕРАКТИВ 4: КОНСТРУКТОР СПИСКІВ ТА МЕНЮ
 * ------------------------------------------------------------------------ */
function initListBuilder() {
  const typeSelect = document.getElementById('listTypeSelect');
  const styleSelect = document.getElementById('listStyleSelect');
  const countInput = document.getElementById('listCountInput');
  const isNavToggle = document.getElementById('listNavToggle');
  const codeBox = document.getElementById('listCodeBox');
  const renderBox = document.getElementById('listRenderBox');

  if (!typeSelect || !codeBox || !renderBox) return;

  const itemsNames = [
    'Головна сторінка',
    'Про проект та історія',
    'Навчальні курси',
    'Інструменти розробника',
    'Контакти та зворотний зв\'язок'
  ];

  function updateList() {
    const listType = typeSelect.value;
    const styleType = styleSelect.value;
    const count = Math.min(Math.max(parseInt(countInput.value) || 3, 1), 5);
    const asNav = isNavToggle ? isNavToggle.checked : false;

    let itemsCode = '';
    let itemsRender = '';

    for (let i = 0; i < count; i++) {
      const name = itemsNames[i] || `Пункт ${i + 1}`;
      if (asNav) {
        itemsCode += `  <li><a href="#link${i+1}">${name}</a></li>\n`;
        itemsRender += `<li><a href="javascript:void(0)">${name}</a></li>`;
      } else {
        itemsCode += `  <li>${name}</li>\n`;
        itemsRender += `<li>${name}</li>`;
      }
    }

    const typeAttr = styleType ? ` type="${styleType}"` : '';
    const fullCode = `<${listType}${typeAttr}>\n${itemsCode}</${listType}>`;
    codeBox.textContent = fullCode;

    if (asNav) {
      renderBox.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-blue);">
          🌟 ТРАНСФОРМАЦІЯ СПИСКУ В ГОРИЗОНТАЛЬНЕ МЕНЮ НАВІГАЦІЇ:
        </div>
        <div class="nav-menu-demo">
          <ul style="list-style: none;">
            ${itemsRender}
          </ul>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.75rem;">
          У веб-розробці переважна більшість навігаційних барів створюються на основі списку <code>&lt;ul&gt;</code> зі знятими маркерами та горизонтальним вирівнюванням!
        </div>
      `;
    } else {
      const styleAttr = styleType ? `type="${styleType}"` : '';
      renderBox.innerHTML = `
        <${listType} ${styleAttr} style="font-size: 1.05rem; padding-left: 2rem; line-height: 1.8;">
          ${itemsRender}
        </${listType}>
      `;
    }
  }

  typeSelect.addEventListener('change', () => {
    styleSelect.innerHTML = '';
    if (typeSelect.value === 'ul') {
      styleSelect.innerHTML = `
        <option value="">За замовчуванням (disc)</option>
        <option value="circle">circle (порожнє коло)</option>
        <option value="square">square (квадрат)</option>
        <option value="none">none (без маркерів)</option>
      `;
    } else {
      styleSelect.innerHTML = `
        <option value="1">1, 2, 3... (Арабські цифри)</option>
        <option value="a">a, b, c... (Малі латинські)</option>
        <option value="A">A, B, C... (Великі латинські)</option>
        <option value="i">i, ii, iii... (Малі римські)</option>
        <option value="I">I, II, III... (Великі римські)</option>
      `;
    }
    updateList();
  });

  styleSelect.addEventListener('change', updateList);
  countInput.addEventListener('input', updateList);
  if (isNavToggle) isNavToggle.addEventListener('change', updateList);

  updateList();
}

/** -------------------------------------------------------------------------
 * 6. ІНТЕРАКТИВ 5: СИМУЛЯТОР ГІПЕРПОСИЛАНЬ ТА URL-ІНСПЕКТОР
 * ------------------------------------------------------------------------ */
function initLinkSimulator() {
  const pills = document.querySelectorAll('.link-type-pill');
  const demoLink = document.getElementById('liveDemoLink');
  const codeDisplay = document.getElementById('linkCodeDisplay');
  const protoDisplay = document.getElementById('linkProtocolDisplay');
  const kindDisplay = document.getElementById('linkKindDisplay');
  const targetDisplay = document.getElementById('linkTargetDisplay');
  const actionMsg = document.getElementById('linkActionMsg');

  if (!pills.length || !demoLink) return;

  const linksData = {
    absolute: {
      code: '<a href="https://uk.wikipedia.org" target="_blank" rel="noopener noreferrer" title="Відкрити Вікіпедію">Вікіпедія: Вільна енциклопедія</a>',
      text: 'Вікіпедія: Вільна енциклопедія',
      href: 'https://uk.wikipedia.org',
      proto: 'HTTPS (Захищений веб-протокол)',
      kind: 'Абсолютне зовнішнє посилання (повна URL-адреса сайту)',
      target: '_blank (Відкриється в новій вкладці переглядача)',
      msg: '🟢 При кліку браузер надсилає DNS-запит та відкриває зовнішній веб-ресурс у новій вкладці.'
    },
    relative: {
      code: '<a href="about.html" title="Дізнатися більше про веб-курс">Про наш навчальний веб-курс</a>',
      text: 'Про наш навчальний веб-курс',
      href: '#',
      proto: 'HTTP / FILE (Локальний шлях)',
      kind: 'Відносне внутрішнє посилання (документ у директорії сайту)',
      target: '_self (У поточній вкладці за замовчуванням)',
      msg: '🟡 Браузер запитує файл "about.html" у тій самій папці поточного веб-сервера.'
    },
    anchor: {
      code: '<a href="#practical-work">Перейти до Практичного модуля ↓</a>',
      text: 'Перейти до Практичного модуля ↓',
      href: '#practical-work',
      proto: 'HASH (#) Внутрішня навігація',
      kind: 'Якірне посилання (Anchor Link) на блок із зазначеним id=""',
      target: 'Плавний скрол без перезавантаження сторінки',
      msg: '🔵 Браузер миттєво плавно прокручує екран до контейнера з ідентифікатором id="practical-work".'
    },
    mailto: {
      code: '<a href="mailto:info@webdev.edu.ua?subject=Питання%20щодо%20курсу">Надіслати листа куратору курсу</a>',
      text: 'Надіслати листа куратору курсу',
      href: 'mailto:info@webdev.edu.ua?subject=Питання%20щодо%20курсу',
      proto: 'MAILTO (Поштовий протокол)',
      kind: 'Службове посилання на e-mail',
      target: 'Системний поштовий клієнт (Outlook, Thunderbird, Mail)',
      msg: '🟣 Операційна система відкриває поштову програму з уже вказаною адресою отримувача й темою.'
    },
    tel: {
      code: '<a href="tel:+380441234567">Телефон підтримки: +38 (044) 123-45-67</a>',
      text: 'Телефон підтримки: +38 (044) 123-45-67',
      href: 'tel:+380441234567',
      proto: 'TEL (Телефонний виклик)',
      kind: 'Службове посилання для прямого дзвінка',
      target: 'Додаток викликів смартфона або комп\'ютера',
      msg: '📞 На мобільних пристроях переглядач автоматично підставляє номер у панель набору.'
    }
  };

  function setLink(key) {
    const data = linksData[key];
    if (!data) return;

    pills.forEach(p => p.classList.toggle('active', p.dataset.linkType === key));

    demoLink.textContent = data.text;
    demoLink.setAttribute('href', data.href);
    if (data.href.startsWith('http')) {
      demoLink.setAttribute('target', '_blank');
      demoLink.setAttribute('rel', 'noopener noreferrer');
    } else {
      demoLink.removeAttribute('target');
      demoLink.removeAttribute('rel');
    }

    if (codeDisplay) codeDisplay.textContent = data.code;
    if (protoDisplay) protoDisplay.textContent = data.proto;
    if (kindDisplay) kindDisplay.textContent = data.kind;
    if (targetDisplay) targetDisplay.textContent = data.target;
    if (actionMsg) actionMsg.textContent = data.msg;
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      setLink(pill.dataset.linkType);
    });
  });

  setLink('absolute');
}

/** -------------------------------------------------------------------------
 * 7. ПРАКТИЧНА РОБОТА: ПІСОЧНИЦЯ КОДУ
 * ------------------------------------------------------------------------ */
function initPracticalSandbox() {
  const codeArea = document.getElementById('sandboxCodeArea');
  const iframe = document.getElementById('sandboxIframe');
  const runBtn = document.getElementById('sandboxRunBtn');
  const resetBtn = document.getElementById('sandboxResetBtn');

  if (!codeArea || !iframe) return;

  const standardCode = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Моя перша сторінка - Практикум HTML</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; line-height: 1.6; color: #1e293b; background: #ffffff; }
    header { border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px; }
    h1 { color: #1e3a8a; margin: 0 0 5px 0; font-size: 1.75rem; }
    h2 { color: #475569; font-size: 1.15rem; font-weight: 500; margin: 0; }
    nav ul { list-style: none; padding: 0; margin: 15px 0 0 0; display: flex; gap: 12px; flex-wrap: wrap; background: #eff6ff; padding: 10px 14px; border-radius: 6px; }
    nav a { text-decoration: none; color: #2563eb; font-weight: 600; }
    nav a:hover { text-decoration: underline; }
    main { margin-bottom: 30px; }
    ol { padding-left: 20px; }
    li { margin-bottom: 4px; }
    footer { border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 0.85rem; color: #64748b; text-align: center; }
  </style>
</head>
<body>

  <!-- Шапка сайту з заголовками та меню навігації -->
  <header>
    <h1 align="center">Головна сторінка веб-проєкту</h1>
    <h2 align="center">Основи мови розмітки HTML5 та семантична структура</h2>
    
    <nav>
      <ul>
        <li><a href="#about">Про розділ</a></li>
        <li><a href="#structure">Структура коду</a></li>
        <li><a href="#contacts">Контакти</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h2 id="about" style="color: #0f172a; margin-top: 1.5rem; font-size: 1.25rem;">1. Про семантичну верстку</h2>
    <p align="justify">
      Мова розмітки <strong>HTML5</strong> дозволяє будувати чітку, доступну інформаційну структуру документа за допомогою спеціальних тегів. 
      Браузер інтерпретує команди та формує об'єктну модель сторінки.
    </p>

    <h2 id="structure" style="color: #0f172a; margin-top: 1.5rem; font-size: 1.25rem;">2. Базові компоненти сторінки</h2>
    <p>До обов'язкового каркаса входять:</p>
    <ol>
      <li>Декларація версії: <code>&lt;!DOCTYPE html&gt;</code></li>
      <li>Кореневий контейнер: <code>&lt;html lang="uk"&gt;</code></li>
      <li>Службовий блок: <code>&lt;head&gt;</code> з кодуванням <code>UTF-8</code></li>
      <li>Тіло сторінки: <code>&lt;body&gt;</code></li>
    </ol>
  </main>

  <footer>
    <p id="contacts">&copy; 2026 Лабораторний практикум. Усі права захищено.</p>
  </footer>

</body>
</html>`;

  function executeCode() {
    const htmlContent = codeArea.value;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    iframe.src = URL.createObjectURL(blob);
  }

  codeArea.value = standardCode;
  executeCode();

  if (runBtn) runBtn.addEventListener('click', executeCode);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      codeArea.value = standardCode;
      executeCode();
    });
  }

  let timeout;
  codeArea.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(executeCode, 600);
  });
}
