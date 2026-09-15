/* ==========================================================================
   УРОК 3: КАСКАДНІ ТАБЛИЦІ СТИЛІВ (CSS)
   Інтерактивні модулі, тренажери, типографічна лабораторія, пісочниця та тест
   Курс «Вебтехнології» (10–11 класи) • Підручник Н. В. Речич • Стандарти W3C
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Системні компоненти сайту
  initThemeToggle();
  initMobileNavigation();
  initActiveNavHighlight();
  initScrollProgress();
  initAccordions();

  // 2. Інтерактивні навчальні блоки
  initHeroComparison();
  initCssAnatomyModule();
  initCascadeBattleSimulator();
  initSelectorPlayground();
  initTypographyStudio();

  // 3. Практична робота & Пісочниця & Тест
  initCssSandbox();
  initQuiz();

  console.log('🚀 Урок 3 (Каскадні таблиці стилів CSS) успішно ініціалізовано!');
});

/* --------------------------------------------------------------------------
   1. СИСТЕМНІ КОМПОНЕНТИ
   -------------------------------------------------------------------------- */
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
   2. HERO ЕКСПЕРИМЕНТ: БЕЗ CSS ПРОТИ З CSS
   -------------------------------------------------------------------------- */
function initHeroComparison() {
  const btnRaw = document.getElementById('heroToggleRawBtn');
  const btnStyled = document.getElementById('heroToggleStyledBtn');
  const previewBox = document.getElementById('heroPreviewBox');

  if (!btnRaw || !btnStyled || !previewBox) return;

  const rawHTML = `
    <div style="font-family: 'Times New Roman', serif; color: #000000; background: #ffffff; padding: 1rem; border: 1px solid #999;">
      <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem; text-decoration: none;">Профіль веброзробника</h3>
      <p style="margin-bottom: 0.5rem;">Привіт! Я створюю сучасні сайти. Без стилів CSS веб виглядає як текстовий документ 1990-х років.</p>
      <ul style="margin-bottom: 0.5rem; padding-left: 1.25rem;">
        <li>HTML — це кістяк сторінки</li>
        <li>CSS — це візуальний стиль та краса</li>
      </ul>
      <a href="#" style="color: blue; text-decoration: underline;" onclick="return false;">Читати портфоліо</a>
    </div>
  `;

  const styledHTML = `
    <div style="font-family: var(--font-heading); background: #ffffff; color: #0f172a; border: 3px solid #121212; padding: 1.5rem; box-shadow: 6px 6px 0 #121212; border-radius: 2px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="background: #facc15; color: #121212; font-family: var(--font-mono); font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border: 1.5px solid #121212;">★ СТИЛІЗОВАНО З CSS3</span>
        <span style="font-size: 0.8rem; color: #64748b; font-family: var(--font-mono);">status: online</span>
      </div>
      <h3 style="font-size: 1.35rem; color: #1e3a8a; margin-bottom: 0.5rem; letter-spacing: -0.02em;">ПРОФІЛЬ ВЕБРОЗРОБНИКА</h3>
      <p style="font-family: var(--font-sans); color: #334155; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1rem;">
        Привіт! За допомогою CSS ми оживляємо сухі теги: задаємо кольори, шрифти, тіні, гармонійні відступи та адаптивний вигляд!
      </p>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button style="background: #2563eb; color: #ffffff; border: 2px solid #121212; padding: 0.45rem 1rem; font-family: var(--font-heading); font-weight: 700; font-size: 0.85rem; box-shadow: 2px 2px 0 #121212; cursor: pointer;">ПОРТФОЛІО →</button>
        <button style="background: #f1f5f9; color: #121212; border: 2px solid #121212; padding: 0.45rem 0.85rem; font-family: var(--font-heading); font-weight: 700; font-size: 0.85rem; cursor: pointer;">ЗВ'ЯЗОК ✉</button>
      </div>
    </div>
  `;

  btnRaw.addEventListener('click', () => {
    previewBox.innerHTML = rawHTML;
    btnRaw.classList.remove('btn-secondary');
    btnRaw.classList.add('btn-primary');
    btnStyled.classList.remove('btn-primary');
    btnStyled.classList.add('btn-secondary');
  });

  btnStyled.addEventListener('click', () => {
    previewBox.innerHTML = styledHTML;
    btnStyled.classList.remove('btn-secondary');
    btnStyled.classList.add('btn-primary');
    btnRaw.classList.remove('btn-primary');
    btnRaw.classList.add('btn-secondary');
  });
}

/* --------------------------------------------------------------------------
   3. ІНТЕРАКТИВ 1: АНАТОМІЯ CSS-ПРАВИЛА
   -------------------------------------------------------------------------- */
const anatomyData = {
  tag: {
    rule: `<span class="anatomy-token" data-token="selector"><span class="tok-selector">h1</span><span class="token-badge">СЕЛЕКТОР ТЕГУ</span></span> <span class="anatomy-token" data-token="open-brace"><span class="tok-brace">{</span><span class="token-badge">ВІДКРИТА ДУЖКА</span></span> <span class="anatomy-token" data-token="property"><span class="tok-property">color</span><span class="token-badge">ВЛАСТИВІСТЬ</span></span><span class="anatomy-token" data-token="colon"><span class="tok-colon">:</span><span class="token-badge">ДВОКРАПКА</span></span> <span class="anatomy-token" data-token="value"><span class="tok-value">#2563eb</span><span class="token-badge">ЗНАЧЕННЯ</span></span><span class="anatomy-token" data-token="semicolon"><span class="tok-semicolon">;</span><span class="token-badge">КРАПКА З КОМОЮ</span></span> <span class="anatomy-token" data-token="property-2"><span class="tok-property">font-size</span><span class="token-badge">ВЛАСТИВІСТЬ 2</span></span><span class="anatomy-token" data-token="colon-2"><span class="tok-colon">:</span><span class="token-badge">ДВОКРАПКА</span></span> <span class="anatomy-token" data-token="value-2"><span class="tok-value">2.5rem</span><span class="token-badge">ЗНАЧЕННЯ 2</span></span><span class="anatomy-token" data-token="semicolon-2"><span class="tok-semicolon">;</span><span class="token-badge">КРАПКА З КОМОЮ</span></span> <span class="anatomy-token" data-token="close-brace"><span class="tok-brace">}</span><span class="token-badge">ЗАКРИТА ДУЖКА</span></span>`,
    explanations: {
      'selector': {
        icon: '🎯',
        title: 'Селектор тегу (Type Selector)',
        desc: 'Вказує браузеру, до яких саме елементів на веб-сторінці застосувати стилі. Селектор "h1" обере всі заголовки першого рівня без винятку.',
        rule: 'Правило: пишеться без дужок і лапок — точно так, як назва HTML-тегу'
      },
      'open-brace': {
        icon: '{',
        title: 'Фігурна дужка відкриття {',
        desc: 'Починає блок оголошення стилів (Declaration Block). Усі властивості всередині цих дужок будуть застосовані до обраного селектора.',
        rule: 'Правило: кожна відкрита дужка { обовʼязково має мати пару — закриту дужку }'
      },
      'property': {
        icon: '⚙️',
        title: 'Властивість CSS (Property)',
        desc: 'Параметр зовнішнього вигляду, який ми хочемо змінити. Наприклад: color (колір тексту), font-size (розмір шрифту), background (тло).',
        rule: 'Правило: назви властивостей пишуться латиницею, слова розділяються дефісом (наприклад, text-align, line-height)'
      },
      'colon': {
        icon: ':',
        title: 'Двокрапка (:)',
        desc: 'Слугує обовʼязковим роздільником між назвою властивості та її значенням у CSS.',
        rule: 'Часта помилка новачків: ставити знак дорівнює "=" замість двокрапки ":"!'
      },
      'value': {
        icon: '💎',
        title: 'Значення властивості (Value)',
        desc: 'Конкретне налаштування для властивості. Для кольору — це назва (red), шістнадцятковий код (#2563eb), або rgb(37, 99, 235).',
        rule: 'Правило: одиниці виміру (px, rem, %) пишуться разом із числом без пробілу (2.5rem, 16px)'
      },
      'semicolon': {
        icon: ';',
        title: 'Крапка з комою (;)',
        desc: 'Завершує окреме оголошення стилю. Сигналізує браузеру про кінець поточної команди.',
        rule: 'Критично: якщо пропустити крапку з комою, браузер не зрозуміє наступну властивість і вона зламається!'
      },
      'property-2': {
        icon: '📏',
        title: 'Друга властивість (font-size)',
        desc: 'В одному блоці стилів можна вказувати необмежену кількість властивостей одну за одною, розділяючи їх крапкою з комою.',
        rule: 'Властивість font-size керує розміром кегля тексту'
      },
      'colon-2': {
        icon: ':',
        title: 'Двокрапка другого правила',
        desc: 'Відокремлює font-size від його розмірного значення.',
        rule: 'Синтаксис: Властивість : Значення ;'
      },
      'value-2': {
        icon: '📐',
        title: 'Значення розміру (2.5rem)',
        desc: 'Відносна одиниця вимірювання rem (Root EM). 2.5rem означає у 2.5 рази більше за базовий шрифт документа (зазвичай 2.5 × 16px = 40px).',
        rule: 'Одиниці rem адаптивні й підтримують налаштування масштабування браузера користувача'
      },
      'semicolon-2': {
        icon: ';',
        title: 'Крапка з комою другого правила',
        desc: 'Завершує друге оголошення. Навіть перед закриваючою фігурною дужкою крапка з комою є хорошим професійним тоном.',
        rule: 'Завжди ставте ";" у кінці кожного рядка стилю'
      },
      'close-brace': {
        icon: '}',
        title: 'Фігурна дужка закриття }',
        desc: 'Завершує повний блок CSS-правила. Усе, що написано після неї, браузер сприйматиме як наступне нове правило.',
        rule: 'Перевіряйте баланс дужок у коді вашого файлу стилів'
      }
    }
  },
  class: {
    rule: `<span class="anatomy-token" data-token="selector"><span class="tok-selector">.card-badge</span><span class="token-badge">СЕЛЕКТОР КЛАСУ</span></span> <span class="anatomy-token" data-token="open-brace"><span class="tok-brace">{</span><span class="token-badge">ВІДКРИТА ДУЖКА</span></span> <span class="anatomy-token" data-token="property"><span class="tok-property">background-color</span><span class="token-badge">ВЛАСТИВІСТЬ</span></span><span class="anatomy-token" data-token="colon"><span class="tok-colon">:</span><span class="token-badge">ДВОКРАПКА</span></span> <span class="anatomy-token" data-token="value"><span class="tok-value">#facc15</span><span class="token-badge">ЗНАЧЕННЯ</span></span><span class="anatomy-token" data-token="semicolon"><span class="tok-semicolon">;</span><span class="token-badge">КРАПКА З КОМОЮ</span></span> <span class="anatomy-token" data-token="property-2"><span class="tok-property">font-weight</span><span class="token-badge">ВЛАСТИВІСТЬ 2</span></span><span class="anatomy-token" data-token="colon-2"><span class="tok-colon">:</span><span class="token-badge">ДВОКРАПКА</span></span> <span class="anatomy-token" data-token="value-2"><span class="tok-value">700</span><span class="token-badge">ЗНАЧЕННЯ 2</span></span><span class="anatomy-token" data-token="semicolon-2"><span class="tok-semicolon">;</span><span class="token-badge">КРАПКА З КОМОЮ</span></span> <span class="anatomy-token" data-token="close-brace"><span class="tok-brace">}</span><span class="token-badge">ЗАКРИТА ДУЖКА</span></span>`,
    explanations: {
      'selector': {
        icon: '🏷️',
        title: 'Селектор класу (.card-badge)',
        desc: 'Починається з крапки "."! Стилізує будь-які HTML-елементи, які мають атрибут class="card-badge". Може повторюватись на сторінці скільки завгодно разів.',
        rule: 'УВАГА: У CSS пишемо крапку попереду (.card-badge), а в HTML пишемо class="card-badge" (БЕЗ КРАПКИ)!'
      },
      'open-brace': { icon: '{', title: 'Блок оголошень {', desc: 'Початок стилів класу .card-badge.', rule: 'Обовʼязкова фігурна дужка' },
      'property': { icon: '🎨', title: 'Властивість (background-color)', desc: 'Задає колір заднього тла для плашки чи контейнера.', rule: 'Можна також скорочено писати background' },
      'colon': { icon: ':', title: 'Двокрапка', desc: 'Розділяє властивість та колір.', rule: 'Синтаксичний роздільник' },
      'value': { icon: '🟡', title: 'Шістнадцятковий колір (#facc15)', desc: 'Яскраво-жовтий акцентний колір у форматі HEX (#RRGGBB).', rule: 'HEX-код починається з символу #' },
      'semicolon': { icon: ';', title: 'Крапка з комою', desc: 'Завершує налаштування кольору тла.', rule: 'Обовʼязковий роздільник' },
      'property-2': { icon: '💪', title: 'Властивість (font-weight)', desc: 'Керує насиченістю (товщиною) накреслення літер.', rule: 'Значення 700 відповідає напівжирному шрифту (bold)' },
      'colon-2': { icon: ':', title: 'Двокрапка', desc: 'Відокремлює font-weight від числового значення.', rule: 'Синтаксичний роздільник' },
      'value-2': { icon: '700', title: 'Значення насиченості (700)', desc: 'Числове значення насиченості: 400 — звичайний (normal), 700 — жирний (bold).', rule: 'Пишеться числом без лапок і без одиниць виміру' },
      'semicolon-2': { icon: ';', title: 'Крапка з комою', desc: 'Завершує друге оголошення.', rule: 'Обовʼязковий роздільник' },
      'close-brace': { icon: '}', title: 'Кінець правила }', desc: 'Закриття стильового блоку класу.', rule: 'Баланс фігурних дужок' }
    }
  },
  id: {
    rule: `<span class="anatomy-token" data-token="selector"><span class="tok-selector">#main-header</span><span class="token-badge">СЕЛЕКТОР ID</span></span> <span class="anatomy-token" data-token="open-brace"><span class="tok-brace">{</span><span class="token-badge">ВІДКРИТА ДУЖКА</span></span> <span class="anatomy-token" data-token="property"><span class="tok-property">text-align</span><span class="token-badge">ВЛАСТИВІСТЬ</span></span><span class="anatomy-token" data-token="colon"><span class="tok-colon">:</span><span class="token-badge">ДВОКРАПКА</span></span> <span class="anatomy-token" data-token="value"><span class="tok-value">center</span><span class="token-badge">ЗНАЧЕННЯ</span></span><span class="anatomy-token" data-token="semicolon"><span class="tok-semicolon">;</span><span class="token-badge">КРАПКА З КОМОЮ</span></span> <span class="anatomy-token" data-token="property-2"><span class="tok-property">letter-spacing</span><span class="token-badge">ВЛАСТИВІСТЬ 2</span></span><span class="anatomy-token" data-token="colon-2"><span class="tok-colon">:</span><span class="token-badge">ДВОКРАПКА</span></span> <span class="anatomy-token" data-token="value-2"><span class="tok-value">2px</span><span class="token-badge">ЗНАЧЕННЯ 2</span></span><span class="anatomy-token" data-token="semicolon-2"><span class="tok-semicolon">;</span><span class="token-badge">КРАПКА З КОМОЮ</span></span> <span class="anatomy-token" data-token="close-brace"><span class="tok-brace">}</span><span class="token-badge">ЗАКРИТА ДУЖКА</span></span>`,
    explanations: {
      'selector': {
        icon: '🆔',
        title: 'Селектор ідентифікатора (#main-header)',
        desc: 'Починається з решітки "#"! Стилізує конкретний унікальний елемент із відповідним id="main-header". За стандартом W3C ідентифікатор повинен бути єдиним на всій вебсторінці.',
        rule: 'Увага: у CSS ставимо "#", а в HTML пишемо id="main-header" (БЕЗ РЕШІТКИ)!'
      },
      'open-brace': { icon: '{', title: 'Блок оголошень {', desc: 'Початок стилів унікального елемента #main-header.', rule: 'Фігурна дужка' },
      'property': { icon: '↔️', title: 'Властивість (text-align)', desc: 'Задає горизонтальне вирівнювання тексту всередині блоку.', rule: 'Можливі значення: left, center, right, justify' },
      'colon': { icon: ':', title: 'Двокрапка', desc: 'Розділяє властивість і значення.', rule: 'Синтаксичний роздільник' },
      'value': { icon: '🎯', title: 'Значення (center)', desc: 'Вирівнює заголовок точно по центру горизонтальної осі контейнера.', rule: 'Ключове слово center' },
      'semicolon': { icon: ';', title: 'Крапка з комою', desc: 'Завершує правило вирівнювання.', rule: 'Обовʼязковий роздільник' },
      'property-2': { icon: '🔠', title: 'Властивість (letter-spacing)', desc: 'Керує додатковою мікро-відстанню (трекінгом) між символами в словах.', rule: 'Робить великі заголовки більш читабельними' },
      'colon-2': { icon: ':', title: 'Двокрапка', desc: 'Розділяє властивість та величину.', rule: 'Синтаксичний роздільник' },
      'value-2': { icon: '2px', title: 'Значення відступу (2px)', desc: 'Додає по 2 пікселі простору між кожною літерою тексту.', rule: 'Пікселі пишуться суцільно: 2px' },
      'semicolon-2': { icon: ';', title: 'Крапка з комою', desc: 'Завершує правило міжлітерного відступу.', rule: 'Обовʼязковий роздільник' },
      'close-brace': { icon: '}', title: 'Кінець правила }', desc: 'Закриває блок стилів id-селектора.', rule: 'Баланс дужок' }
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
   4. ІНТЕРАКТИВ 2: СИМУЛЯТОР КАСКАДУ ТА СПОСОБІВ ПІДКЛЮЧЕННЯ
   -------------------------------------------------------------------------- */
function initCascadeBattleSimulator() {
  const chkExternal = document.getElementById('chkExternal');
  const chkInternal = document.getElementById('chkInternal');
  const chkInline = document.getElementById('chkInline');
  const chkImportant = document.getElementById('chkImportant');

  const cardExternal = document.getElementById('cardExternal');
  const cardInternal = document.getElementById('cardInternal');
  const cardInline = document.getElementById('cardInline');

  const targetEl = document.getElementById('cascadeTargetElement');
  const winnerBadge = document.getElementById('cascadeWinnerBadge');
  const winnerReason = document.getElementById('cascadeWinnerReason');

  const ruleExternal = document.getElementById('ruleExternal');
  const ruleInternal = document.getElementById('ruleInternal');
  const ruleInline = document.getElementById('ruleInline');

  if (!chkExternal || !chkInternal || !chkInline || !targetEl) return;

  function updateCascade() {
    const hasExternal = chkExternal.checked;
    const hasInternal = chkInternal.checked;
    const hasInline = chkInline.checked;
    const hasImportant = chkImportant ? chkImportant.checked : false;

    // Reset styles
    targetEl.style.color = '#000000';
    targetEl.style.backgroundColor = 'transparent';
    targetEl.style.borderColor = '#94a3b8';

    // Cards highlighting
    cardExternal.classList.remove('active-winner');
    cardInternal.classList.remove('active-winner');
    cardInline.classList.remove('active-winner');

    ruleExternal.className = 'rule-hierarchy-item';
    ruleInternal.className = 'rule-hierarchy-item';
    ruleInline.className = 'rule-hierarchy-item';

    // Logic:
    // 1. If !important is active on External: it overrides even inline!
    // 2. Otherwise: Inline > Internal > External > Default
    let winner = 'default';
    let color = '#334155';
    let bg = '#f8fafc';
    let reasonText = '';

    if (hasExternal && hasImportant) {
      winner = 'external-important';
      color = '#2563eb';
      bg = '#dbeafe';
      cardExternal.classList.add('active-winner');
      ruleExternal.classList.add('winner');
      if (hasInline) ruleInline.classList.add('overridden');
      if (hasInternal) ruleInternal.classList.add('overridden');
      reasonText = 'ПЕРЕМАГАЄ: Зовнішній файл завдяки директиві !important! Вона перебиває навіть inline-стилі.';
    } else if (hasInline) {
      winner = 'inline';
      color = '#ff4732';
      bg = '#ffe4e6';
      cardInline.classList.add('active-winner');
      ruleInline.classList.add('winner');
      if (hasInternal) ruleInternal.classList.add('overridden');
      if (hasExternal) ruleExternal.classList.add('overridden');
      reasonText = 'ПЕРЕМАГАЄ: Вбудований (Inline) стиль style="..."! Має найвищу локальну вагу специфічності (1,0,0,0).';
    } else if (hasInternal) {
      winner = 'internal';
      color = '#10b981';
      bg = '#d1fae5';
      cardInternal.classList.add('active-winner');
      ruleInternal.classList.add('winner');
      if (hasExternal) ruleExternal.classList.add('overridden');
      reasonText = 'ПЕРЕМАГАЄ: Внутрішній стиль у тегу <style>! Оскільки inline відсутній, спрацьовує правило зі сторінки.';
    } else if (hasExternal) {
      winner = 'external';
      color = '#2563eb';
      bg = '#dbeafe';
      cardExternal.classList.add('active-winner');
      ruleExternal.classList.add('winner');
      reasonText = 'ПЕРЕМАГАЄ: Зовнішня таблиця стилів style.css! Рекомендований стандарт W3C для веброзробки.';
    } else {
      winner = 'default';
      color = '#000000';
      bg = '#ffffff';
      reasonText = 'Всі власні стилі вимкнено. Браузер застосовує стандартний вигляд за замовчуванням (User Agent Stylesheet).';
    }

    targetEl.style.color = color;
    targetEl.style.backgroundColor = bg;
    targetEl.style.borderColor = color;

    if (winnerBadge) {
      winnerBadge.textContent = winner.toUpperCase();
      winnerBadge.style.color = color;
    }
    if (winnerReason) {
      winnerReason.textContent = reasonText;
    }
  }

  [chkExternal, chkInternal, chkInline, chkImportant].forEach(chk => {
    if (chk) chk.addEventListener('change', updateCascade);
  });

  updateCascade();
}

/* --------------------------------------------------------------------------
   5. ІНТЕРАКТИВ 3: ТРЕНАЖЕР БАЗОВИХ СЕЛЕКТОРІВ
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

    // Reset buttons
    quickBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-sel') === cleanSel);
    });

    // Reset previous highlights in mock window
    const allDomItems = domContainer.querySelectorAll('.dom-item');
    allDomItems.forEach(el => el.classList.remove('matched-node'));

    // Reset lines in tree view
    if (treeContainer) {
      treeContainer.querySelectorAll('.tree-code-line').forEach(line => line.classList.remove('matched-tree-line'));
    }

    if (!cleanSel) {
      if (countBadge) countBadge.textContent = '0 елементів';
      if (selTypeBadge) selTypeBadge.textContent = 'НЕ ВКАЗАНО';
      if (selDescText) selDescText.textContent = 'Введіть селектор або натисніть одну з кнопок угорі.';
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

      // Determine selector type description
      let typeText = 'Селектор';
      let desc = '';

      if (cleanSel === '*') {
        typeText = 'Універсальний селектор (*)';
        desc = 'Обирає абсолютно ВСІ елементи на сторінці. Застосовується для скидання відступів (box-sizing, margin, padding).';
      } else if (cleanSel.startsWith('#')) {
        typeText = 'Селектор ідентифікатора ID (#)';
        desc = `Обирає строго один унікальний елемент із заданим ідентифікатором: ${cleanSel}.`;
      } else if (cleanSel.startsWith('.')) {
        typeText = 'Селектор класу (.)';
        desc = `Обирає всі елементи, які мають клас "${cleanSel.slice(1)}". Класи можна призначати багатьом елементам.`;
      } else if (cleanSel.includes(',')) {
        typeText = 'Групування селекторів (,)';
        desc = `Застосовує однакове оформлення до декількох селекторів через кому: "${cleanSel}".`;
      } else if (cleanSel.includes(' ')) {
        typeText = 'Селектор нащадків (пробіл)';
        desc = `Обирає елементи, які вкладені всередину зазначеного предка: "${cleanSel}".`;
      } else {
        typeText = `Селектор тегу <${cleanSel}>`;
        desc = `Обирає всі стандартні теги <${cleanSel}> у документі без привʼязки до класів.`;
      }

      if (selTypeBadge) selTypeBadge.textContent = typeText;
      if (selDescText) selDescText.textContent = desc;

    } catch (err) {
      if (countBadge) countBadge.textContent = '0 (помилка синтаксису)';
      if (selTypeBadge) selTypeBadge.textContent = 'НЕВАЛІДНИЙ СЕЛЕКТОР';
      if (selDescText) selDescText.textContent = 'Перевірте правильність написання CSS-селектора. Не забувайте про крапку для класів або решітку для ID.';
    }
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-sel');
      applySelector(sel);
    });
  });

  inputEl.addEventListener('input', (e) => {
    applySelector(e.target.value);
  });

  // Default test
  applySelector('.card');
}

/* --------------------------------------------------------------------------
   6. ІНТЕРАКТИВ 4: ЛАБОРАТОРІЯ ТИПОГРАФІКИ (CSS TYPOGRAPHY STUDIO)
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

  if (!previewBox || !targetH2 || !targetP || !codeOutput) return;

  let isItalic = false;

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

    // Update labels
    if (valSize && rngSize) valSize.textContent = `${rngSize.value}px (${fontSizeRem})`;
    if (valLineH && rngLineH) valLineH.textContent = rngLineH.value;
    if (valSpacing && rngSpacing) valSpacing.textContent = `${rngSpacing.value}px`;

    // Apply styles to target elements
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

    // Generate clean CSS output
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
  font-size: ${fontSizeRem}; /* або ${fontSize} */
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  line-height: ${lineHeight};
  text-decoration: ${textDecor};
}`;

    codeOutput.textContent = generatedCSS;
  }

  // Event listeners
  if (rngSize) rngSize.addEventListener('input', updateTypography);
  if (selFont) selFont.addEventListener('change', updateTypography);
  if (selWeight) selWeight.addEventListener('change', updateTypography);
  if (inputColor) inputColor.addEventListener('input', updateTypography);
  if (selAlign) selAlign.addEventListener('change', updateTypography);
  if (selDecor) selDecor.addEventListener('change', updateTypography);
  if (rngLineH) rngLineH.addEventListener('input', updateTypography);
  if (rngSpacing) rngSpacing.addEventListener('input', updateTypography);
  if (selTransform) selTransform.addEventListener('change', updateTypography);
  if (selShadow) selShadow.addEventListener('change', updateTypography);

  if (btnItalic) {
    btnItalic.addEventListener('click', () => {
      isItalic = !isItalic;
      btnItalic.classList.toggle('active', isItalic);
      updateTypography();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeOutput.textContent).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'СКОПІЙОВАНО! ✓';
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
   7. LIVE CODE SANDBOX (HTML + CSS)
   -------------------------------------------------------------------------- */
function initCssSandbox() {
  const codeArea = document.getElementById('sandboxCodeArea');
  const iframe = document.getElementById('sandboxIframe');
  const runBtn = document.getElementById('sandboxRunBtn');
  const resetBtn = document.getElementById('sandboxResetBtn');
  const tabHtmlBtn = document.getElementById('tabHtmlBtn');
  const tabCssBtn = document.getElementById('tabCssBtn');

  if (!codeArea || !iframe) return;

  const defaultHTML = `<!-- Структура сторінки (HTML) -->
<div class="user-card">
  <div class="card-badge">Учень 10-го класу</div>
  <h1 class="card-title">Олексій Коваленко</h1>
  <p class="card-role">Початківець у фронтенд-розробці</p>
  <p class="card-bio">
    Вивчаю мову розмітки <strong>HTML5</strong> та каскадні таблиці стилів <strong>CSS3</strong>. 
    Мрію створювати зручні, швидкі та стильні вебсайти для українських шкіл та проєктів!
  </p>
  <div class="card-skills">
    <span class="skill-tag">HTML5</span>
    <span class="skill-tag">CSS3</span>
    <span class="skill-tag">Typography</span>
  </div>
  <a href="#contact" class="card-btn">Написати повідомлення</a>
</div>`;

  const defaultCSS = `/* Стилі сторінки (CSS) */
body {
  margin: 0;
  padding: 24px;
  background-color: #f1f5f9;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  display: flex;
  justify-content: center;
}

.user-card {
  max-width: 480px;
  background-color: #ffffff;
  border: 3px solid #0f172a;
  border-radius: 4px;
  padding: 28px;
  box-shadow: 6px 6px 0px #0f172a;
}

.card-badge {
  display: inline-block;
  background-color: #facc15;
  color: #0f172a;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border: 2px solid #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.8rem;
  margin: 0 0 4px 0;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.card-role {
  font-size: 1rem;
  color: #2563eb;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.card-bio {
  font-size: 0.95rem;
  line-height: 1.6;
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
  font-size: 0.95rem;
  padding: 10px 20px;
  border: 2px solid #0f172a;
  box-shadow: 3px 3px 0px #0f172a;
  transition: transform 0.1s;
}

.card-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #0f172a;
}`;

  let currentTab = 'html';
  let storedHTML = defaultHTML;
  let storedCSS = defaultCSS;

  function renderIframe() {
    const combinedDoc = `
      <!DOCTYPE html>
      <html lang="uk">
      <head>
        <meta charset="UTF-8">
        <style>${storedCSS}</style>
      </head>
      <body>
        ${storedHTML}
      </body>
      </html>
    `;
    iframe.srcdoc = combinedDoc;
  }

  function switchTab(tab) {
    // Save current textarea content
    if (currentTab === 'html') {
      storedHTML = codeArea.value;
    } else {
      storedCSS = codeArea.value;
    }

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

  // Initial setup
  codeArea.value = defaultHTML;
  renderIframe();
}

/* --------------------------------------------------------------------------
   8. ПІДСУМКОВИЙ ТЕСТ (QUIZ)
   -------------------------------------------------------------------------- */
const quizQuestions = [
  {
    q: '1. Що означає абревіатура CSS у веброзробці?',
    opts: [
      'Creative Style System (Креативна система стилів)',
      'Cascading Style Sheets (Каскадні таблиці стилів)',
      'Computer Screen Standards (Стандарти компʼютерних екранів)',
      'Colorful Software Solutions (Барвисті програмні рішення)'
    ],
    correct: 1,
    expl: 'CSS розшифровується як Cascading Style Sheets — Каскадні таблиці стилів. Вони відповідають за візуальне оформлення та макет вебсторінки.'
  },
  {
    q: '2. Який тег і атрибут використовуються для підключення зовнішнього файлу стилів до HTML-документа?',
    opts: [
      '<style src="styles.css">',
      '<link rel="stylesheet" href="style.css"> всередині <head>',
      '<script href="style.css">',
      '<css link="styles.css">'
    ],
    correct: 1,
    expl: 'Зовнішні стилі підключаються одинарним тегом <link rel="stylesheet" href="style.css">, розташованим усередині секції <head>.'
  },
  {
    q: '3. Який синтаксис має селектор класу в CSS для стилізації елемента <p class="intro">?',
    opts: [
      '#intro { ... }',
      'intro { ... }',
      '.intro { ... }',
      '@intro { ... }'
    ],
    correct: 2,
    expl: 'Селектори класів у CSS завжди починаються з крапки: .intro. У HTML при цьому пишеться class="intro" (без крапки).'
  },
  {
    q: '4. Чим селектор ідентифікатора (#id) принципово відрізняється від селектора класу (.class)?',
    opts: [
      'Ідентифікатор можна застосовувати до сотень елементів одночасно',
      'Ідентифікатор повинен бути строго унікальним і зустрічатися лише один раз на сторінці',
      'Клас має вищу специфічність за ідентифікатор',
      'Ідентифікатори працюють лише для заголовків <h1>'
    ],
    correct: 1,
    expl: 'За стандартом W3C кожен id має бути унікальним у межах одного документа. Класи ж призначені для багаторазового повторного використання.'
  },
  {
    q: '5. Який спосіб підключення стилів за замовчуванням має найвищий пріоритет (специфічність)?',
    opts: [
      'Зовнішній файл <link rel="stylesheet">',
      'Внутрішній блок <style> у <head>',
      'Вбудований рядок в атрибуті style="..." безпосередньо в тегу (Inline)',
      'Стилі браузера за замовчуванням'
    ],
    correct: 2,
    expl: 'Вбудовані (inline) стилі мають найвищу вагу специфічності (1,0,0,0) і перебивають стилі з тегу <style> та зовнішніх файлів.'
  },
  {
    q: '6. Яка CSS-властивість відповідає за сімейство шрифтів та запасні варіанти (fallback)?',
    opts: [
      'font-weight',
      'font-family',
      'text-font',
      'font-style'
    ],
    correct: 1,
    expl: 'Властивість font-family визначає список шрифтів через кому: спочатку бажаний шрифт, потім резервні (наприклад: "Space Grotesk", Arial, sans-serif).'
  },
  {
    q: '7. Чому відносна одиниця rem вважається кращою для font-size, ніж фіксовані px?',
    opts: [
      'rem завжди дорівнює точно 100 пікселям',
      'rem масштабується відповідно до налаштувань розміру шрифту в браузері користувача, покращуючи доступність',
      'rem заборонено використовувати на мобільних телефонах',
      'rem швидше завантажує сторінку з сервера'
    ],
    correct: 1,
    expl: 'Одиниця rem відштовхується від базового кегля кореневого елемента html (1rem = 16px за замовчуванням). Якщо користувач зі слабким зором збільшить шрифт у браузері, всі розміри в rem пропорційно адаптуються.'
  },
  {
    q: '8. Як повністю зняти стандартне підкреслення з посилань <a> за допомогою CSS?',
    opts: [
      'text-style: none;',
      'text-align: plain;',
      'text-decoration: none;',
      'link-underline: off;'
    ],
    correct: 2,
    expl: 'Властивість text-decoration: none; прибирає декоративне підкреслення ліній у посиланнях та тексті.'
  },
  {
    q: '9. Яка властивість керує відстанню між рядками (інтерліньяжем) у тексті?',
    opts: [
      'letter-spacing',
      'word-spacing',
      'line-height',
      'text-indent'
    ],
    correct: 2,
    expl: 'Властивість line-height задає висоту рядка тексту (рекомендоване значення для читабельності довгих статей — 1.5 або 1.6).'
  },
  {
    q: '10. Як правильно записати груповий селектор, щоб надати однаковий синій колір усім <h1>, <h2> та <p>?',
    opts: [
      'h1 + h2 + p { color: blue; }',
      'h1, h2, p { color: blue; }',
      'h1 & h2 & p { color: blue; }',
      'h1 h2 p { color: blue; }'
    ],
    correct: 1,
    expl: 'Групування селекторів записується через кому: "h1, h2, p". Запис через пробіл "h1 h2 p" означав би селектор нащадків (p всередині h2 всередині h1).'
  }
];

function initQuiz() {
  const container = document.getElementById('quizQuestionsContainer');
  const resultsCard = document.getElementById('quizResultsCard');
  const scoreBadge = document.getElementById('quizScoreBadge');
  const gradeText = document.getElementById('quizGradeText');
  const progressFill = document.getElementById('quizProgressFill');

  if (!container) return;

  let answeredCount = 0;
  let correctScore = 0;

  container.innerHTML = '';

  quizQuestions.forEach((item, qIdx) => {
    const card = document.createElement('div');
    card.className = 'quiz-question-card';
    card.innerHTML = `
      <div class="quiz-question-number">ЗАПИТАННЯ ${qIdx + 1} З ${quizQuestions.length}</div>
      <div class="quiz-question-text">${item.q}</div>
      <div class="quiz-options-list">
        ${item.opts.map((opt, optIdx) => `
          <button class="quiz-option-btn" data-q="${qIdx}" data-opt="${optIdx}">
            ${opt}
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="feedback-${qIdx}"></div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qIdx = parseInt(btn.getAttribute('data-q'), 10);
      const optIdx = parseInt(btn.getAttribute('data-opt'), 10);
      const question = quizQuestions[qIdx];
      const feedbackEl = document.getElementById(`feedback-${qIdx}`);
      const parentCard = btn.closest('.quiz-question-card');
      const siblingBtns = parentCard.querySelectorAll('.quiz-option-btn');

      // Disable buttons for this question
      siblingBtns.forEach(b => b.disabled = true);

      answeredCount++;
      if (progressFill) {
        progressFill.style.width = `${(answeredCount / quizQuestions.length) * 100}%`;
      }

      if (optIdx === question.correct) {
        btn.classList.add('selected-correct');
        feedbackEl.className = 'quiz-feedback show-correct';
        feedbackEl.innerHTML = `<strong>ВІРНО! ✓</strong> ${question.expl}`;
        correctScore++;
      } else {
        btn.classList.add('selected-incorrect');
        siblingBtns[question.correct].classList.add('selected-correct');
        feedbackEl.className = 'quiz-feedback show-incorrect';
        feedbackEl.innerHTML = `<strong>НЕВІРНО! ✕</strong> ${question.expl}`;
      }

      // Check if finished
      if (answeredCount === quizQuestions.length && resultsCard) {
        resultsCard.style.display = 'block';
        const percent = Math.round((correctScore / quizQuestions.length) * 100);
        // School 12-point scale
        const grade12 = Math.max(1, Math.round((correctScore / quizQuestions.length) * 12));

        if (scoreBadge) scoreBadge.textContent = `${correctScore} / ${quizQuestions.length}`;
        if (gradeText) {
          gradeText.innerHTML = `Оцінка за 12-бальною шкалою: <span style="color: var(--accent-vermilion); font-weight: 800;">${grade12} балів</span> (${percent}% успішності)`;
        }
        resultsCard.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
