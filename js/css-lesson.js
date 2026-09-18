/* ==========================================================================
   УРОК 3: КАСКАДНІ ТАБЛИЦІ СТИЛІВ (CSS)
   Інтерактивні модулі, тренажери, типографічна лабораторія, пісочниця та тест
   Курс «Вебтехнології» (10–11 класи) • Стандарти W3C / WHATWG
   Оновлено згідно з принципами frontend-design (чиста типографіка, живий зворотний зв'язок)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Системні компоненти сайту
  initThemeToggle();
  initCourseDropdown();
  initMobileNavigation();
  initActiveNavHighlight();
  initScrollProgress();
  initAccordions();

  // 2. Інтерактивні навчальні блоки
  initHeroSwitchboard();
  initCssAnatomyModule();
  initCascadeDevToolsInspector();
  initSelectorPlayground();
  initTypographyStudio();

  // 3. Практична робота та пісочниця
  initCssSandbox();

  console.log('🚀 Урок 3 (Основи CSS) успішно ініціалізовано!');
});

/* --------------------------------------------------------------------------
   1. СИСТЕМНІ КОМПОНЕНТИ
   -------------------------------------------------------------------------- */
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

  navLinks.querySelectorAll('a').forEach(link => {
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
    const scrollPos = window.scrollY + 140;

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

/* --------------------------------------------------------------------------
   2. HERO INTERACTIVE: CSS SWITCHBOARD (ЖИВИЙ ПУЛЬТ КЕРУВАННЯ ШАРАМИ CSS)
   -------------------------------------------------------------------------- */
function initHeroSwitchboard() {
  const target = document.getElementById('heroSwitchboardTarget');
  const codeRibbon = document.getElementById('heroSwitchboardCode');
  const togglePills = document.querySelectorAll('.switch-pill');

  if (!target || !codeRibbon) return;

  const state = {
    font: true,
    color: true,
    spacing: true,
    border: true,
    shadow: true
  };

  function updateSwitchboard() {
    // Reset styles
    target.style.fontFamily = state.font ? "'Space Grotesk', system-ui, sans-serif" : "Times, 'Times New Roman', serif";
    target.style.letterSpacing = state.font ? "-0.01em" : "normal";
    
    target.style.backgroundColor = state.color ? "#ffffff" : "#f0f0f0";
    target.style.color = state.color ? "#0f172a" : "#000000";

    target.style.padding = state.spacing ? "1.5rem" : "0.5rem";
    
    target.style.border = state.border ? "3px solid #121212" : "1px solid #777777";
    target.style.borderRadius = state.border ? "4px" : "0px";

    target.style.boxShadow = state.shadow ? "6px 6px 0 #121212" : "none";

    const titleEl = target.querySelector('.switchboard-title');
    const badgeEl = target.querySelector('.switchboard-badge');
    const buttonEl = target.querySelector('.switchboard-cta');

    if (titleEl) {
      titleEl.style.fontFamily = state.font ? "'Space Grotesk', sans-serif" : "serif";
      titleEl.style.color = state.color ? "#1e3a8a" : "#000000";
    }
    if (badgeEl) {
      badgeEl.style.display = state.border || state.color ? "inline-block" : "none";
      badgeEl.style.backgroundColor = state.color ? "#facc15" : "#e0e0e0";
      badgeEl.style.padding = state.spacing ? "0.2rem 0.55rem" : "0.1rem 0.3rem";
    }
    if (buttonEl) {
      buttonEl.style.backgroundColor = state.color ? "#2563eb" : "#e0e0e0";
      buttonEl.style.color = state.color ? "#ffffff" : "#000000";
      buttonEl.style.border = state.border ? "2px solid #121212" : "1px solid #777";
      buttonEl.style.boxShadow = state.shadow ? "2px 2px 0 #121212" : "none";
    }

    // Build readable CSS snippet
    const lines = ['.interactive-card {'];
    if (state.font) lines.push("  font-family: 'Space Grotesk', sans-serif;");
    if (state.color) {
      lines.push("  background-color: #ffffff;");
      lines.push("  color: #0f172a;");
    }
    if (state.spacing) lines.push("  padding: 1.5rem;");
    if (state.border) {
      lines.push("  border: 3px solid #121212;");
      lines.push("  border-radius: 4px;");
    }
    if (state.shadow) lines.push("  box-shadow: 6px 6px 0 #121212;");
    lines.push('}');

    codeRibbon.textContent = lines.join('\n');
  }

  togglePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const prop = pill.getAttribute('data-toggle');
      state[prop] = !state[prop];
      pill.classList.toggle('active', state[prop]);
      updateSwitchboard();
    });
  });

  updateSwitchboard();
}

/* --------------------------------------------------------------------------
   3. ІНТЕРАКТИВ 1: АНАТОМІЯ CSS-ПРАВИЛА
   -------------------------------------------------------------------------- */
const anatomyData = {
  tag: {
    rule: `<span class="anatomy-token" data-token="selector"><span class="tok-selector">h1</span><span class="token-badge">Селектор тегу</span></span> <span class="anatomy-token" data-token="open-brace"><span class="tok-brace">{</span><span class="token-badge">Відкрита дужка</span></span> <span class="anatomy-token" data-token="property"><span class="tok-property">color</span><span class="token-badge">Властивість</span></span><span class="anatomy-token" data-token="colon"><span class="tok-colon">:</span><span class="token-badge">Двокрапка</span></span> <span class="anatomy-token" data-token="value"><span class="tok-value">#2563eb</span><span class="token-badge">Значення</span></span><span class="anatomy-token" data-token="semicolon"><span class="tok-semicolon">;</span><span class="token-badge">Крапка з комою</span></span> <span class="anatomy-token" data-token="property-2"><span class="tok-property">font-size</span><span class="token-badge">Властивість 2</span></span><span class="anatomy-token" data-token="colon-2"><span class="tok-colon">:</span><span class="token-badge">Двокрапка</span></span> <span class="anatomy-token" data-token="value-2"><span class="tok-value">2.5rem</span><span class="token-badge">Значення 2</span></span><span class="anatomy-token" data-token="semicolon-2"><span class="tok-semicolon">;</span><span class="token-badge">Крапка з комою</span></span> <span class="anatomy-token" data-token="close-brace"><span class="tok-brace">}</span><span class="token-badge">Закрита дужка</span></span>`,
    explanations: {
      'selector': {
        icon: '🎯',
        title: 'Селектор тегу (Type Selector)',
        desc: 'Обирає всі елементи зазначеного типу на всій сторінці без винятку. Селектор h1 змінить зовнішній вигляд усіх заголовків першого рівня.',
        rule: 'Правило: пишеться без лапок і без кутових дужок < >'
      },
      'open-brace': {
        icon: '{',
        title: 'Відкрита фігурна дужка {',
        desc: 'Починає блок оголошення стилів (Declaration Block). Усі властивості всередині належатимуть обраному селектору.',
        rule: 'Кожній відкритій дужці { обовʼязково відповідає закрита дужка }'
      },
      'property': {
        icon: '⚙️',
        title: 'Властивість CSS (Property)',
        desc: 'Параметр відображення елемента: color (колір тексту), font-size (розмір), line-height (інтервал).',
        rule: 'Назви властивостей пишуться латиницею, складові слова розділяються дефісом'
      },
      'colon': {
        icon: ':',
        title: 'Двокрапка (:)',
        desc: 'Слугує синтаксичним роздільником між назвою властивості та її значенням.',
        rule: 'Часта помилка початківців: ставити знак дорівнює "=" замість двокрапки ":"'
      },
      'value': {
        icon: '💎',
        title: 'Значення властивості (Value)',
        desc: 'Конкретне налаштування параметра: шістнадцятковий код кольору (#2563eb), назва або значення в rem/px.',
        rule: 'Одиниці виміру пишуться разом із числом без пробілу: 2.5rem, 16px'
      },
      'semicolon': {
        icon: ';',
        title: 'Крапка з комою (;)',
        desc: 'Завершує окреме оголошення стилю та відокремлює його від наступного.',
        rule: 'Критично: пропущена крапка з комою ламає обробку всіх наступних правил!'
      },
      'property-2': {
        icon: '📏',
        title: 'Друга властивість (font-size)',
        desc: 'У межах одного CSS-блоку можна вказувати стільки властивостей, скільки потрібно для оформлення.',
        rule: 'Рекомендовано записувати кожну властивість з нового рядка'
      },
      'colon-2': { icon: ':', title: 'Двокрапка другого правила', desc: 'Відокремлює font-size від його значення.', rule: 'Синтаксичний роздільник' },
      'value-2': {
        icon: '📐',
        title: 'Значення розміру (2.5rem)',
        desc: 'Відносна одиниця rem відштовхується від базового кегля кореня html (зазвичай 1rem = 16px, відповідно 2.5rem = 40px).',
        rule: 'Підтримує налаштування масштабування користувача в браузері'
      },
      'semicolon-2': { icon: ';', title: 'Крапка з комою', desc: 'Завершує друге стильове оголошення.', rule: 'Обовʼязковий роздільник' },
      'close-brace': { icon: '}', title: 'Закрита фігурна дужка }', desc: 'Позначає кінець блоку оголошення стилю.', rule: 'Стежте за парністю дужок' }
    }
  },
  class: {
    rule: `<span class="anatomy-token" data-token="selector"><span class="tok-selector">.card-badge</span><span class="token-badge">Селектор класу</span></span> <span class="anatomy-token" data-token="open-brace"><span class="tok-brace">{</span><span class="token-badge">Відкрита дужка</span></span> <span class="anatomy-token" data-token="property"><span class="tok-property">background-color</span><span class="token-badge">Властивість</span></span><span class="anatomy-token" data-token="colon"><span class="tok-colon">:</span><span class="token-badge">Двокрапка</span></span> <span class="anatomy-token" data-token="value"><span class="tok-value">#facc15</span><span class="token-badge">Значення</span></span><span class="anatomy-token" data-token="semicolon"><span class="tok-semicolon">;</span><span class="token-badge">Крапка з комою</span></span> <span class="anatomy-token" data-token="property-2"><span class="tok-property">font-weight</span><span class="token-badge">Властивість 2</span></span><span class="anatomy-token" data-token="colon-2"><span class="tok-colon">:</span><span class="token-badge">Двокрапка</span></span> <span class="anatomy-token" data-token="value-2"><span class="tok-value">700</span><span class="token-badge">Значення 2</span></span><span class="anatomy-token" data-token="semicolon-2"><span class="tok-semicolon">;</span><span class="token-badge">Крапка з комою</span></span> <span class="anatomy-token" data-token="close-brace"><span class="tok-brace">}</span><span class="token-badge">Закрита дужка</span></span>`,
    explanations: {
      'selector': {
        icon: '🏷️',
        title: 'Селектор класу (.card-badge)',
        desc: 'Починається з крапки. Стилізує будь-які елементи з відповідним атрибутом class="card-badge". Призначений для багаторазового використання.',
        rule: 'Увага: у CSS пишемо крапку (.card-badge), а в HTML — class="card-badge" (без крапки)'
      },
      'open-brace': { icon: '{', title: 'Відкрита дужка', desc: 'Початок стильового блоку класу.', rule: 'Обовʼязковий символ' },
      'property': { icon: '🎨', title: 'Властивість background-color', desc: 'Задає колір заднього тла для плашки чи контейнера.', rule: 'Стилізує підкладку' },
      'colon': { icon: ':', title: 'Двокрапка', desc: 'Розділяє властивість та колір.', rule: 'Синтаксичний знак' },
      'value': { icon: '🟡', title: 'Колір #facc15', desc: 'Теплий жовтий колір у шістнадцятковому форматі HEX (#RRGGBB).', rule: 'HEX-код починається з символу #' },
      'semicolon': { icon: ';', title: 'Крапка з комою', desc: 'Завершує налаштування тла.', rule: 'Роздільник команд' },
      'property-2': { icon: '💪', title: 'Властивість font-weight', desc: 'Керує товщиною літер шрифту.', rule: 'Діапазон від 100 до 900' },
      'colon-2': { icon: ':', title: 'Двокрапка', desc: 'Відокремлює font-weight від значення.', rule: 'Синтаксичний знак' },
      'value-2': { icon: '700', title: 'Значення 700 (Bold)', desc: 'Числове позначення жирного накреслення (стандарт bold = 700).', rule: 'Пишеться числом без лапок і без одиниць' },
      'semicolon-2': { icon: ';', title: 'Крапка з комою', desc: 'Завершує друге оголошення.', rule: 'Роздільник команд' },
      'close-brace': { icon: '}', title: 'Закрита дужка', desc: 'Завершення блоку класу.', rule: 'Баланс дужок' }
    }
  },
  id: {
    rule: `<span class="anatomy-token" data-token="selector"><span class="tok-selector">#main-header</span><span class="token-badge">Селектор ID</span></span> <span class="anatomy-token" data-token="open-brace"><span class="tok-brace">{</span><span class="token-badge">Відкрита дужка</span></span> <span class="anatomy-token" data-token="property"><span class="tok-property">text-align</span><span class="token-badge">Властивість</span></span><span class="anatomy-token" data-token="colon"><span class="tok-colon">:</span><span class="token-badge">Двокрапка</span></span> <span class="anatomy-token" data-token="value"><span class="tok-value">center</span><span class="token-badge">Значення</span></span><span class="anatomy-token" data-token="semicolon"><span class="tok-semicolon">;</span><span class="token-badge">Крапка з комою</span></span> <span class="anatomy-token" data-token="property-2"><span class="tok-property">letter-spacing</span><span class="token-badge">Властивість 2</span></span><span class="anatomy-token" data-token="colon-2"><span class="tok-colon">:</span><span class="token-badge">Двокрапка</span></span> <span class="anatomy-token" data-token="value-2"><span class="tok-value">2px</span><span class="token-badge">Значення 2</span></span><span class="anatomy-token" data-token="semicolon-2"><span class="tok-semicolon">;</span><span class="token-badge">Крапка з комою</span></span> <span class="anatomy-token" data-token="close-brace"><span class="tok-brace">}</span><span class="token-badge">Закрита дужка</span></span>`,
    explanations: {
      'selector': {
        icon: '🆔',
        title: 'Селектор ідентифікатора (#main-header)',
        desc: 'Починається з символу решітки "#". Стилізує унікальний елемент із атрибутом id="main-header". За стандартом W3C однаковий ID може траплятися на сторінці лише один раз.',
        rule: 'У CSS пишемо "#", у HTML — id="main-header" (без решітки)'
      },
      'open-brace': { icon: '{', title: 'Відкрита дужка', desc: 'Початок стилів елемента #main-header.', rule: 'Синтаксис CSS' },
      'property': { icon: '↔️', title: 'Властивість text-align', desc: 'Вирівнювання тексту по горизонталі (left, center, right, justify).', rule: 'Керує горизонтальною віссю' },
      'colon': { icon: ':', title: 'Двокрапка', desc: 'Відокремлює властивість від значення.', rule: 'Синтаксичний знак' },
      'value': { icon: '🎯', title: 'Значення center', desc: 'Вирівнює текстовий рядок точно по центру контейнера.', rule: 'Ключове слово' },
      'semicolon': { icon: ';', title: 'Крапка з комою', desc: 'Завершує правило вирівнювання.', rule: 'Обовʼязковий знак' },
      'property-2': { icon: '🔠', title: 'Властивість letter-spacing', desc: 'Керує додатковим міжлітерним інтервалом (трекінгом).', rule: 'Покращує читання великих заголовків' },
      'colon-2': { icon: ':', title: 'Двокрапка', desc: 'Роздільник другого правила.', rule: 'Синтаксичний знак' },
      'value-2': { icon: '2px', title: 'Значення 2px', desc: 'Додає по 2 пікселі простору між кожним символом.', rule: 'Пишеться разом з одиницею' },
      'semicolon-2': { icon: ';', title: 'Крапка з комою', desc: 'Завершує друге оголошення.', rule: 'Обовʼязковий знак' },
      'close-brace': { icon: '}', title: 'Закрита дужка', desc: 'Кінець блоку стилів ID.', rule: 'Баланс дужок' }
    }
  }
};

function initCssAnatomyModule() {
  const displayBox = document.getElementById('anatomyDisplayBox');
  const iconEl = document.getElementById('anatomyIcon');
  const titleEl = document.getElementById('anatomyTitle');
  const descEl = document.getElementById('anatomyDesc');
  const ruleEl = document.getElementById('anatomyRule');
  const modeBtns = document.querySelectorAll('.anatomy-mode-btn');

  if (!displayBox || !iconEl || !titleEl || !descEl || !ruleEl) return;

  let currentMode = 'tag';

  function renderMode(mode) {
    currentMode = mode;
    displayBox.innerHTML = anatomyData[mode].rule;

    const firstToken = displayBox.querySelector('.anatomy-token');
    if (firstToken) {
      firstToken.classList.add('active');
      showExplanation(firstToken.getAttribute('data-token'));
    }

    displayBox.querySelectorAll('.anatomy-token').forEach(tok => {
      tok.addEventListener('click', () => {
        displayBox.querySelectorAll('.anatomy-token').forEach(t => t.classList.remove('active'));
        tok.classList.add('active');
        showExplanation(tok.getAttribute('data-token'));
      });
    });
  }

  function showExplanation(tokenId) {
    const data = anatomyData[currentMode].explanations[tokenId] || anatomyData[currentMode].explanations['selector'];
    iconEl.textContent = data.icon;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    ruleEl.textContent = data.rule;
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMode(btn.getAttribute('data-mode'));
    });
  });

  renderMode('tag');
}

/* --------------------------------------------------------------------------
   4. ІНТЕРАКТИВ 2: ДЕМОНСТРАТОР КАСКАДУ ТА СПЕЦИФІЧНОСТІ (DEVTOOLS ІНСПЕКТОР)
   -------------------------------------------------------------------------- */
const cascadeScenarios = {
  'tag_vs_class': {
    title: '1. Тег проти Класу',
    htmlCode: `&lt;p class="status-badge"&gt;Обробка запиту сервера&lt;/p&gt;`,
    cssCode: `/* Правило 1 (селектор тегу): */
p {
  color: #64748b; /* Сірий */
  font-size: 1.15rem;
}

/* Правило 2 (селектор класу): */
.status-badge {
  color: #2563eb; /* Синій */
  font-weight: 700;
}`,
    previewText: 'Обробка запиту сервера',
    previewStyles: {
      color: '#2563eb',
      fontWeight: '700',
      fontSize: '1.15rem',
      backgroundColor: '#eff6ff',
      borderColor: '#2563eb'
    },
    winnerName: '.status-badge (Селектор класу)',
    winnerColor: '#2563eb',
    winnerReason: 'Селектор класу має специфічність (0, 0, 1, 0), що перемагає селектор тегу (0, 0, 0, 1). Властивість color перекривається синім кольором.',
    rules: [
      {
        selector: '.status-badge',
        fileOrigin: 'style.css:8',
        weight: '(0, 0, 1, 0)',
        styles: 'color: #2563eb; font-weight: 700;',
        active: true,
        reason: 'Застосовано: клас має вищу специфічність за тег'
      },
      {
        selector: 'p',
        fileOrigin: 'style.css:1',
        weight: '(0, 0, 0, 1)',
        styles: 'color: #64748b; font-size: 1.15rem;',
        active: false,
        reason: 'color: #64748b перевизначено правилом .status-badge'
      }
    ]
  },
  'class_vs_id': {
    title: '2. Клас проти ID',
    htmlCode: `&lt;p class="status-badge" id="system-alert"&gt;Критичне сповіщення безпеки&lt;/p&gt;`,
    cssCode: `/* Правило 1 (селектор класу): */
.status-badge {
  color: #2563eb; /* Синій */
  font-weight: 700;
}

/* Правило 2 (селектор ID): */
#system-alert {
  color: #059669; /* Смарагдово-зелений */
  text-transform: uppercase;
}`,
    previewText: 'Критичне сповіщення безпеки',
    previewStyles: {
      color: '#059669',
      fontWeight: '700',
      fontSize: '1.15rem',
      textTransform: 'uppercase',
      backgroundColor: '#ecfdf5',
      borderColor: '#059669'
    },
    winnerName: '#system-alert (Селектор ID)',
    winnerColor: '#059669',
    winnerReason: 'Ідентифікатор ID має вагу (0, 1, 0, 0), що значно сильніше за клас (0, 0, 1, 0). Один ID перебиває будь-яку кількість селекторів класів.',
    rules: [
      {
        selector: '#system-alert',
        fileOrigin: 'style.css:14',
        weight: '(0, 1, 0, 0)',
        styles: 'color: #059669; text-transform: uppercase;',
        active: true,
        reason: 'Застосовано: ідентифікатор ID перемагає селектор класу'
      },
      {
        selector: '.status-badge',
        fileOrigin: 'style.css:8',
        weight: '(0, 0, 1, 0)',
        styles: 'color: #2563eb;',
        active: false,
        reason: 'color: #2563eb перевизначено правилом #system-alert'
      }
    ]
  },
  'id_vs_inline': {
    title: '3. ID проти Інлайн-стилю',
    htmlCode: `&lt;p id="system-alert" style="color: #ff4732;"&gt;Помилка конфігурації мережі&lt;/p&gt;`,
    cssCode: `/* У зовнішньому файлі style.css: */
#system-alert {
  color: #059669; /* Зелений */
  font-weight: 700;
}

/* Вбудований атрибут безпосередньо в тегу: */
&lt;p style="color: #ff4732;"&gt; /* Червоний */`,
    previewText: 'Помилка конфігурації мережі',
    previewStyles: {
      color: '#ff4732',
      fontWeight: '700',
      fontSize: '1.15rem',
      textTransform: 'none',
      backgroundColor: '#fff1f2',
      borderColor: '#ff4732'
    },
    winnerName: 'style="..." (Вбудований inline)',
    winnerColor: '#ff4732',
    winnerReason: 'Вбудовані інлайн-стилі мають найвищу специфічність (1, 0, 0, 0) і перекривають навіть селектори ідентифікаторів з CSS-файлів.',
    rules: [
      {
        selector: 'element.style (атрибут style)',
        fileOrigin: 'index.html:42',
        weight: '(1, 0, 0, 0)',
        styles: 'color: #ff4732;',
        active: true,
        reason: 'Застосовано: інлайн-стиль має вищий пріоритет за будь-які селектори з файлу'
      },
      {
        selector: '#system-alert',
        fileOrigin: 'style.css:14',
        weight: '(0, 1, 0, 0)',
        styles: 'color: #059669;',
        active: false,
        reason: 'color: #059669 перевизначено вбудованим атрибутом style'
      }
    ]
  },
  'source_order': {
    title: '4. Порядок оголошення (Source Order)',
    htmlCode: `&lt;button class="btn-action"&gt;Зберегти конфігурацію&lt;/button&gt;`,
    cssCode: `/* Рядок 10 у файлі: */
.btn-action {
  color: #2563eb; /* Синій */
}

/* Рядок 25 у файлі (оголошено пізніше): */
.btn-action {
  color: #8b5cf6; /* Фіолетовий */
}`,
    previewText: 'Зберегти конфігурацію',
    previewStyles: {
      color: '#8b5cf6',
      fontWeight: '700',
      fontSize: '1.15rem',
      textTransform: 'none',
      backgroundColor: '#f5f3ff',
      borderColor: '#8b5cf6'
    },
    winnerName: '.btn-action (рядок 25 — останнє правило)',
    winnerColor: '#8b5cf6',
    winnerReason: 'Обидва селектори мають абсолютно однакову вагу (0, 0, 1, 0). Згідно з правилом каскаду, перемагає правило, записане нижче по коду документа.',
    rules: [
      {
        selector: '.btn-action',
        fileOrigin: 'style.css:25',
        weight: '(0, 0, 1, 0)',
        styles: 'color: #8b5cf6;',
        active: true,
        reason: 'Застосовано: однаковий селектор, але оголошено пізніше в коді'
      },
      {
        selector: '.btn-action',
        fileOrigin: 'style.css:10',
        weight: '(0, 0, 1, 0)',
        styles: 'color: #2563eb;',
        active: false,
        reason: 'color: #2563eb перезаписано наступним правилом у файлі'
      }
    ]
  },
  'important_override': {
    title: '5. Директива !important',
    htmlCode: `&lt;p id="alert" style="color: #ff4732;"&gt;Пріоритетне системне ядро&lt;/p&gt;`,
    cssCode: `/* У зовнішньому файлі style.css: */
p {
  color: #2563eb !important; /* Синій з !important */
}

/* Вбудований інлайн-атрибут: */
style="color: #ff4732;" /* Червоний */`,
    previewText: 'Пріоритетне системне ядро',
    previewStyles: {
      color: '#2563eb',
      fontWeight: '700',
      fontSize: '1.15rem',
      textTransform: 'none',
      backgroundColor: '#eff6ff',
      borderColor: '#2563eb'
    },
    winnerName: 'p { color: ... !important; }',
    winnerColor: '#2563eb',
    winnerReason: 'Директива !important ігнорує звичайні правила специфічності та каскаду, примусово перебиваючи навіть інлайн-стилі. У професійній розробці її уникають, щоб не ламати архітектуру стилів.',
    rules: [
      {
        selector: 'p',
        fileOrigin: 'style.css:4',
        weight: '!important (Винятковий пріоритет)',
        styles: 'color: #2563eb !important;',
        active: true,
        reason: 'Застосовано: директива !important блокує всі звичайні стилі'
      },
      {
        selector: 'element.style (атрибут style)',
        fileOrigin: 'index.html:15',
        weight: '(1, 0, 0, 0)',
        styles: 'color: #ff4732;',
        active: false,
        reason: 'color: #ff4732 заблоковано директивою !important'
      }
    ]
  }
};

function initCascadeDevToolsInspector() {
  const scenarioBtns = document.querySelectorAll('.devtools-scenario-btn');
  const codeHtmlEl = document.getElementById('devtoolsHtmlSnippet');
  const codeCssEl = document.getElementById('devtoolsCssSnippet');
  const targetEl = document.getElementById('cascadeTargetElement');
  const winnerBadge = document.getElementById('cascadeWinnerBadge');
  const winnerReason = document.getElementById('cascadeWinnerReason');
  const rulesList = document.getElementById('devtoolsRulesList');

  if (!scenarioBtns.length || !targetEl || !rulesList) return;

  function loadScenario(scenarioKey) {
    const data = cascadeScenarios[scenarioKey] || cascadeScenarios['tag_vs_class'];

    scenarioBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scenario') === scenarioKey);
    });

    if (codeHtmlEl) codeHtmlEl.innerHTML = data.htmlCode;
    if (codeCssEl) codeCssEl.textContent = data.cssCode;

    targetEl.textContent = data.previewText;
    targetEl.style.color = data.previewStyles.color;
    targetEl.style.backgroundColor = data.previewStyles.backgroundColor;
    targetEl.style.borderColor = data.previewStyles.borderColor;
    targetEl.style.fontWeight = data.previewStyles.fontWeight;
    targetEl.style.textTransform = data.previewStyles.textTransform || 'none';

    if (winnerBadge) {
      winnerBadge.textContent = data.winnerName;
      winnerBadge.style.color = data.winnerColor;
    }
    if (winnerReason) {
      winnerReason.textContent = data.winnerReason;
    }

    rulesList.innerHTML = '';
    data.rules.forEach(r => {
      const item = document.createElement('div');
      item.className = `rule-hierarchy-item ${r.active ? 'winner' : 'overridden'}`;
      item.innerHTML = `
        <div class="rule-item-top">
          <span class="rule-item-selector">${r.selector}</span>
          <span class="rule-item-weight">${r.weight} · ${r.fileOrigin}</span>
        </div>
        <div class="rule-item-decl">${r.styles}</div>
        <div class="rule-item-status ${r.active ? 'status-active' : 'status-overridden'}">
          ${r.active ? '✓ ' + r.reason : '✕ ' + r.reason}
        </div>
      `;
      rulesList.appendChild(item);
    });
  }

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      loadScenario(btn.getAttribute('data-scenario'));
    });
  });

  loadScenario('tag_vs_class');
}

/* --------------------------------------------------------------------------
   5. ІНТЕРАКТИВ 3: ТРЕНАЖЕР СЕЛЕКТОРІВ
   -------------------------------------------------------------------------- */
function initSelectorPlayground() {
  const inputEl = document.getElementById('playgroundSelectorInput');
  const countBadge = document.getElementById('matchedCountBadge');
  const selTypeBadge = document.getElementById('selectorTypeBadge');
  const selDescText = document.getElementById('selectorDescriptionText');
  const quickBtns = document.querySelectorAll('.sel-btn');
  const domContainer = document.getElementById('mockDomWindow');
  const treeContainer = document.getElementById('mockDomTree');

  if (!inputEl || !domContainer) return;

  function applySelector(selectorStr) {
    const cleanSel = selectorStr.trim();
    inputEl.value = cleanSel;

    quickBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-sel') === cleanSel);
    });

    const allDomItems = domContainer.querySelectorAll('.dom-item');
    allDomItems.forEach(el => el.classList.remove('matched-node'));

    if (treeContainer) {
      treeContainer.querySelectorAll('.tree-code-line').forEach(line => line.classList.remove('matched-tree-line'));
    }

    if (!cleanSel) {
      if (countBadge) countBadge.textContent = '0 елементів';
      if (selTypeBadge) selTypeBadge.textContent = 'Не вказано';
      if (selDescText) selDescText.textContent = 'Введіть селектор або оберіть зі списку швидких кнопок.';
      return;
    }

    try {
      const matches = domContainer.querySelectorAll(cleanSel);
      const count = matches.length;

      matches.forEach(el => {
        el.classList.add('matched-node');
        const nodeIndex = el.getAttribute('data-node-id');
        if (treeContainer && nodeIndex) {
          const correspondingLine = treeContainer.querySelector(`[data-tree-id="${nodeIndex}"]`);
          if (correspondingLine) correspondingLine.classList.add('matched-tree-line');
        }
      });

      if (countBadge) countBadge.textContent = `${count} елемент(ів)`;

      let typeText = 'Селектор';
      let desc = '';

      if (cleanSel === '*') {
        typeText = 'Універсальний селектор (*) [0, 0, 0, 0]';
        desc = 'Обирає всі елементи документа. Використовується для скидання базових відступів і box-sizing.';
      } else if (cleanSel.startsWith('#')) {
        typeText = `Селектор ID (${cleanSel}) [0, 1, 0, 0]`;
        desc = `Вибирає строго один унікальний елемент із відповідним ідентифікатором: id="${cleanSel.slice(1)}".`;
      } else if (cleanSel.startsWith('.')) {
        typeText = `Селектор класу (${cleanSel}) [0, 0, 1, 0]`;
        desc = `Вибирає всі елементи, які містять клас class="${cleanSel.slice(1)}". Може застосовуватися до багатьох елементів.`;
      } else if (cleanSel.includes(',')) {
        typeText = `Групування (${cleanSel})`;
        desc = `Застосовує однаковий набір властивостей до кожного зазначеного селектора через кому.`;
      } else if (cleanSel.includes(' ')) {
        typeText = `Селектор нащадків (${cleanSel})`;
        desc = `Знаходить цільові елементи тільки тоді, коли вони вкладені всередину зазначеного предка.`;
      } else {
        typeText = `Селектор тегу <${cleanSel}> [0, 0, 0, 1]`;
        desc = `Вибирає всі елементи з HTML-тегом <${cleanSel}> на всій сторінці.`;
      }

      if (selTypeBadge) selTypeBadge.textContent = typeText;
      if (selDescText) selDescText.textContent = desc;

    } catch (err) {
      if (countBadge) countBadge.textContent = '0 (помилка)';
      if (selTypeBadge) selTypeBadge.textContent = 'Невалідний селектор';
      if (selDescText) selDescText.textContent = 'Перевірте синтаксис: крапка для класів (.name) або решітка для ідентифікаторів (#name).';
    }
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applySelector(btn.getAttribute('data-sel'));
    });
  });

  inputEl.addEventListener('input', (e) => {
    applySelector(e.target.value);
  });

  applySelector('.card');
}

/* --------------------------------------------------------------------------
   6. ІНТЕРАКТИВ 4: СТУДІЯ ТИПОГРАФІКИ (CSS TYPOGRAPHY STUDIO)
   -------------------------------------------------------------------------- */
function initTypographyStudio() {
  const selFont = document.getElementById('typoFontFamily');
  const rngSize = document.getElementById('typoFontSize');
  const valSize = document.getElementById('valFontSize');
  const selWeight = document.getElementById('typoFontWeight');
  const btnItalic = document.getElementById('btnToggleItalic');
  const inputColor = document.getElementById('typoColor');
  const selAlign = document.getElementById('typoTextAlign');
  const selDecor = document.getElementById('typoTextDecor');
  const rngLineH = document.getElementById('typoLineHeight');
  const valLineH = document.getElementById('valLineHeight');
  const rngSpacing = document.getElementById('typoLetterSpacing');
  const valSpacing = document.getElementById('valLetterSpacing');
  const selTransform = document.getElementById('typoTextTransform');
  const selShadow = document.getElementById('typoTextShadow');

  const previewBox = document.getElementById('typoPreviewBox');
  const targetH2 = document.getElementById('typoTargetH2');
  const targetP = document.getElementById('typoTargetP');
  const codeOutput = document.getElementById('typoGeneratedCode');
  const copyBtn = document.getElementById('btnCopyTypoCode');
  const contrastRatioText = document.getElementById('contrastRatioText');

  const presetBtns = document.querySelectorAll('.preset-btn');

  if (!previewBox || !targetH2 || !targetP || !codeOutput) return;

  let isItalic = false;

  // Relative luminance calculation for WCAG contrast ratio
  function getLuminance(hex) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function updateContrastScore(textColorHex) {
    if (!contrastRatioText) return;
    try {
      const lumText = getLuminance(textColorHex);
      const lumBg = 1.0; // White background preview
      const ratio = (Math.max(lumText, lumBg) + 0.05) / (Math.min(lumText, lumBg) + 0.05);
      const rounded = ratio.toFixed(1);

      if (ratio >= 7) {
        contrastRatioText.innerHTML = `<span class="contrast-score-pass">Контраст ${rounded}:1 · WCAG AAA (Відмінно)</span>`;
      } else if (ratio >= 4.5) {
        contrastRatioText.innerHTML = `<span style="color: var(--accent-blue); font-weight: 700;">Контраст ${rounded}:1 · WCAG AA (Добре)</span>`;
      } else {
        contrastRatioText.innerHTML = `<span style="color: var(--accent-vermilion); font-weight: 700;">Контраст ${rounded}:1 · Низький (Складно читати)</span>`;
      }
    } catch {
      contrastRatioText.textContent = 'Контраст: стандартний';
    }
  }

  function updateTypography() {
    const fontFamily = selFont ? selFont.value : "'Work Sans', sans-serif";
    const fontSize = rngSize ? `${rngSize.value}px` : '18px';
    const fontSizeRem = rngSize ? `${(rngSize.value / 16).toFixed(2)}rem` : '1.12rem';
    const fontWeight = selWeight ? selWeight.value : '400';
    const fontStyle = isItalic ? 'italic' : 'normal';
    const color = inputColor ? inputColor.value : '#0f172a';
    const textAlign = selAlign ? selAlign.value : 'left';
    const textDecor = selDecor ? selDecor.value : 'none';
    const lineHeight = rngLineH ? rngLineH.value : '1.6';
    const letterSpacing = rngSpacing ? `${rngSpacing.value}px` : '0px';
    const textTransform = selTransform ? selTransform.value : 'none';
    const shadowVal = selShadow ? selShadow.value : 'none';

    if (valSize && rngSize) valSize.textContent = `${rngSize.value}px (${fontSizeRem})`;
    if (valLineH && rngLineH) valLineH.textContent = rngLineH.value;
    if (valSpacing && rngSpacing) valSpacing.textContent = `${rngSpacing.value}px`;

    targetH2.style.fontFamily = fontFamily;
    targetH2.style.color = color;
    targetH2.style.textAlign = textAlign;
    targetH2.style.textTransform = textTransform;
    targetH2.style.letterSpacing = letterSpacing;
    targetH2.style.textShadow = shadowVal;

    targetP.style.fontFamily = fontFamily;
    targetP.style.fontSize = fontSize;
    targetP.style.fontWeight = fontWeight;
    targetP.style.fontStyle = fontStyle;
    targetP.style.color = color;
    targetP.style.textAlign = textAlign;
    targetP.style.textDecoration = textDecor;
    targetP.style.lineHeight = lineHeight;
    targetP.style.letterSpacing = letterSpacing;
    targetP.style.textTransform = textTransform;
    targetP.style.textShadow = shadowVal;

    updateContrastScore(color);

    const generatedCSS = `.article-card {
  font-family: ${fontFamily};
  color: ${color};
  text-align: ${textAlign};
  letter-spacing: ${letterSpacing};
  text-transform: ${textTransform};
}

.article-card h2 {
  font-weight: 700;
  text-shadow: ${shadowVal};
}

.article-card p {
  font-size: ${fontSizeRem}; /* ${fontSize} */
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  line-height: ${lineHeight};
  text-decoration: ${textDecor};
}`;

    codeOutput.textContent = generatedCSS;
  }

  // Presets
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-preset');
      if (p === 'startup') {
        if (selFont) selFont.value = "'Space Grotesk', sans-serif";
        if (rngSize) rngSize.value = 17;
        if (rngLineH) rngLineH.value = 1.6;
        if (rngSpacing) rngSpacing.value = 0;
        if (selWeight) selWeight.value = 400;
        if (inputColor) inputColor.value = '#0f172a';
        if (selAlign) selAlign.value = 'left';
        if (selShadow) selShadow.value = 'none';
      } else if (p === 'editorial') {
        if (selFont) selFont.value = "Georgia, serif";
        if (rngSize) rngSize.value = 19;
        if (rngLineH) rngLineH.value = 1.8;
        if (rngSpacing) rngSpacing.value = 0.5;
        if (selWeight) selWeight.value = 400;
        if (inputColor) inputColor.value = '#292524';
        if (selAlign) selAlign.value = 'left';
        if (selShadow) selShadow.value = 'none';
      } else if (p === 'technical') {
        if (selFont) selFont.value = "'IBM Plex Mono', monospace";
        if (rngSize) rngSize.value = 16;
        if (rngLineH) rngLineH.value = 1.5;
        if (rngSpacing) rngSpacing.value = 0.5;
        if (selWeight) selWeight.value = 400;
        if (inputColor) inputColor.value = '#1e293b';
        if (selAlign) selAlign.value = 'left';
        if (selShadow) selShadow.value = 'none';
      }
      isItalic = false;
      if (btnItalic) btnItalic.classList.remove('active');
      updateTypography();
    });
  });

  [rngSize, selFont, selWeight, inputColor, selAlign, selDecor, rngLineH, rngSpacing, selTransform, selShadow].forEach(input => {
    if (input) {
      input.addEventListener('input', updateTypography);
      input.addEventListener('change', updateTypography);
    }
  });

  if (btnItalic) {
    btnItalic.addEventListener('click', () => {
      isItalic = !isItalic;
      btnItalic.classList.toggle('active', isItalic);
      btnItalic.textContent = isItalic ? 'italic (Курсив: увімкнено)' : 'italic (Курсив: вимкнено)';
      updateTypography();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeOutput.textContent).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'Скопійовано! ✓';
        copyBtn.style.backgroundColor = 'var(--accent-green)';
        copyBtn.style.color = '#000';
        setTimeout(() => {
          copyBtn.textContent = orig;
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }

  updateTypography();
}

/* --------------------------------------------------------------------------
   7. LIVE CODE SANDBOX (З АВТОМАТИЧНИМ ОНОВЛЕННЯМ І ШАБЛОНАМИ)
   -------------------------------------------------------------------------- */
function initCssSandbox() {
  const codeArea = document.getElementById('sandboxCodeArea');
  const iframe = document.getElementById('sandboxIframe');
  const runBtn = document.getElementById('sandboxRunBtn');
  const resetBtn = document.getElementById('sandboxResetBtn');
  const tabHtmlBtn = document.getElementById('tabHtmlBtn');
  const tabCssBtn = document.getElementById('tabCssBtn');

  if (!codeArea || !iframe) return;

  const defaultHTML = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Візитка учня</title>

  <!-- =================================================================
       ПІДКЛЮЧЕННЯ КАСКАДНИХ ТАБЛИЦЬ СТИЛІВ CSS:
       Тег <link> розміщується всередині службового блоку <head>.
       • rel="stylesheet" — вказує браузеру, що це файл таблиці стилів;
       • href="style.css" — шлях до файлу (відкрийте вкладку style.css праворуч).
       ================================================================= -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Структура картки-візитки (HTML-каркас) -->
  <div class="user-card">
    <div class="card-badge">Учень 10-го класу</div>
    <h1 class="card-title">Олексій Коваленко</h1>
    <p class="card-role">Початківець у фронтенд-розробці</p>
    <p class="card-bio">
      Вивчаю семантичну розмітку <strong>HTML5</strong> та каскадні таблиці стилів <strong>CSS3</strong>.
      Прагну створювати гармонійні, читабельні та швидкі вебсайти для шкільних проєктів!
    </p>
    <div class="card-skills">
      <span class="skill-tag">HTML5</span>
      <span class="skill-tag">CSS3</span>
      <span class="skill-tag">Typography</span>
    </div>
    <a href="#contact" class="card-btn">Написати повідомлення</a>
  </div>

</body>
</html>`;

  const defaultCSS = `/* Стилі сторінки (CSS) */
body {
  margin: 0;
  padding: 24px;
  background-color: #f8fafc;
  font-family: system-ui, -apple-system, sans-serif;
  color: #1e293b;
  display: flex;
  justify-content: center;
}

.user-card {
  max-width: 460px;
  background-color: #ffffff;
  border: 3px solid #0f172a;
  border-radius: 4px;
  padding: 28px;
  box-shadow: 5px 5px 0px #0f172a;
}

.card-badge {
  display: inline-block;
  background-color: #facc15;
  color: #0f172a;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 3px 8px;
  border: 1.5px solid #0f172a;
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.75rem;
  margin: 0 0 4px 0;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.card-role {
  font-size: 0.95rem;
  color: #2563eb;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.card-bio {
  font-size: 0.95rem;
  line-height: 1.65;
  color: #475569;
  margin: 0 0 20px 0;
}

.card-skills {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.skill-tag {
  background-color: #e2e8f0;
  color: #0f172a;
  padding: 3px 8px;
  font-size: 0.8rem;
  font-family: monospace;
  font-weight: 600;
  border-radius: 3px;
}

.card-btn {
  display: inline-block;
  background-color: #2563eb;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 10px 18px;
  border: 2px solid #0f172a;
  box-shadow: 2px 2px 0px #0f172a;
  transition: transform 0.1s;
}

.card-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px #0f172a;
}`;

  let currentTab = 'html';
  let storedHTML = defaultHTML;
  let storedCSS = defaultCSS;
  let debounceTimer = null;

  function renderIframe() {
    let html = storedHTML;

    // Якщо у HTML є підключення style.css, підставляємо актуальний CSS з сусідньої вкладки
    if (/<link[^>]*href=["']style\.css["'][^>]*>/i.test(html)) {
      html = html.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, `<style>\n${storedCSS}\n</style>`);
    } else if (html.includes('</head>')) {
      // Якщо тег <link> видалено, але є </head>, застосовуємо стиль
      html = html.replace('</head>', `<style>\n${storedCSS}\n</style>\n</head>`);
    } else if (!html.includes('<html')) {
      // Якщо введено лише фрагмент
      html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <style>
${storedCSS}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
    }

    iframe.srcdoc = html;
  }

  function switchTab(tab) {
    if (currentTab === 'html') storedHTML = codeArea.value;
    else storedCSS = codeArea.value;

    currentTab = tab;
    if (tab === 'html') {
      codeArea.value = storedHTML;
      if (tabHtmlBtn) tabHtmlBtn.classList.add('active');
      if (tabCssBtn) tabCssBtn.classList.remove('active');
    } else {
      codeArea.value = storedCSS;
      if (tabCssBtn) tabCssBtn.classList.add('active');
      if (tabHtmlBtn) tabHtmlBtn.classList.remove('active');
    }
  }

  if (tabHtmlBtn) tabHtmlBtn.addEventListener('click', () => switchTab('html'));
  if (tabCssBtn) tabCssBtn.addEventListener('click', () => switchTab('css'));

  // Live auto-run as the user types
  codeArea.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (currentTab === 'html') storedHTML = codeArea.value;
      else storedCSS = codeArea.value;
      renderIframe();
    }, 400);
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (currentTab === 'html') storedHTML = codeArea.value;
      else storedCSS = codeArea.value;
      renderIframe();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      storedHTML = defaultHTML;
      storedCSS = defaultCSS;
      codeArea.value = currentTab === 'html' ? defaultHTML : defaultCSS;
      renderIframe();
    });
  }

  codeArea.value = defaultHTML;
  renderIframe();

  // Логіка повноекранного режиму (Full-page IDE)
  const container = document.getElementById('sandboxContainer');
  const fullscreenBtn = document.getElementById('sandboxFullscreenBtn');
  const launchTopBtn = document.getElementById('launchFullscreenTopBtn');
  const tasksBtn = document.getElementById('sandboxTasksBtn');
  const tasksDrawer = document.getElementById('sandboxTasksDrawer');
  const tasksCloseBtn = document.getElementById('sandboxTasksCloseBtn');

  function toggleFullscreen(forceState) {
    if (!container) return;
    const isFs = typeof forceState === 'boolean' ? forceState : !container.classList.contains('is-fullscreen');
    if (isFs) {
      container.classList.add('is-fullscreen');
      document.body.classList.add('sandbox-fullscreen-active');
      if (fullscreenBtn) {
        fullscreenBtn.innerHTML = '<span class="fs-icon">🗗</span> <span class="fs-label">Згорнути</span>';
        fullscreenBtn.title = 'Згорнути у звичайний вигляд (Esc)';
      }
      codeArea.focus();
    } else {
      container.classList.remove('is-fullscreen');
      document.body.classList.remove('sandbox-fullscreen-active');
      if (fullscreenBtn) {
        fullscreenBtn.innerHTML = '<span class="fs-icon">⛶</span> <span class="fs-label">На всю сторінку</span>';
        fullscreenBtn.title = 'Відкрити практикум на всю сторінку (Esc для виходу)';
      }
      if (tasksDrawer) {
        tasksDrawer.classList.remove('is-open');
        if (tasksBtn) tasksBtn.classList.remove('active');
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => toggleFullscreen());
  }

  if (launchTopBtn) {
    launchTopBtn.addEventListener('click', () => {
      toggleFullscreen(true);
    });
  }

  function toggleTasksDrawer() {
    if (!tasksDrawer) return;
    const isOpen = tasksDrawer.classList.toggle('is-open');
    if (tasksBtn) tasksBtn.classList.toggle('active', isOpen);
  }

  if (tasksBtn) {
    tasksBtn.addEventListener('click', toggleTasksDrawer);
  }

  if (tasksCloseBtn) {
    tasksCloseBtn.addEventListener('click', () => {
      if (tasksDrawer) tasksDrawer.classList.remove('is-open');
      if (tasksBtn) tasksBtn.classList.remove('active');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container && container.classList.contains('is-fullscreen')) {
      toggleFullscreen(false);
    }
  });

  if (window.location.search.includes('fullscreen=1') || window.location.hash === '#practical-work-fullscreen') {
    toggleFullscreen(true);
  }
}

