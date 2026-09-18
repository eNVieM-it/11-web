/* ==========================================================================
   ВЕБТЕХНОЛОГІЇ (10–11 КЛАСИ) • ІНТЕРАКТИВНИЙ УРОК
   Теми:
   1. Основні тренди у веб-дизайні
   2. Види сайтів та цільова аудиторія
   3. Інформаційна структура сайту
   4. Інструменти веб-розробника
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Загальні компоненти
  initThemeToggle();
  initCourseDropdown();
  initMobileNavigation();
  initActiveNavHighlight();
  initGlobalStatsCounter();
  initScrollProgress();
  initAccordions();

  // Тема 1: Основні тренди у веб-дизайні
  initSpeedBenchmark();
  initDeviceSimulator();
  initCinemagraphToggles();
  initVariableFontTester();

  // Тема 2: Види сайтів та цільова аудиторія
  initSiteCatalogFilter();

  // Тема 3: Інформаційна структура сайту
  initThreeClickQuest();

  // Тема 4: Інструменти веб-розробника
  initCodeEditorSimulator();

  // Підсумковий тест уроку
  initLessonQuiz();

  console.log('🚀 Урок за 4 темами успішно ініціалізовано!');
});

/** -------------------------------------------------------------------------
 * БАЗОВІ СИСТЕМНІ ФУНКЦІЇ
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

function initGlobalStatsCounter() {
  const counterEl = document.getElementById('liveWebsitesTicker');
  if (!counterEl) return;
  let count = 1691207347; // Підручник, рис. 1.11, с. 12
  setInterval(() => {
    count += 2; // +2 сайти щосекунди
    counterEl.textContent = count.toLocaleString('uk-UA');
  }, 1000);
}

function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const progress = (window.scrollY / docHeight) * 100;
    progressBar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
}

function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(h => {
    h.addEventListener('click', () => {
      const parent = h.closest('.accordion-item');
      if (parent) {
        parent.classList.toggle('active');
        const arrow = h.querySelector('span:last-child');
        if (arrow) arrow.textContent = parent.classList.contains('active') ? '▲' : '▼';
      }
    });
  });
}

/** -------------------------------------------------------------------------
 * ТЕМА 1: ОСНОВНІ ТРЕНДИ У ВЕБ-ДИЗАЙНІ
 * ------------------------------------------------------------------------ */
function initSpeedBenchmark() {
  const clockEl = document.getElementById('benchmarkClock');
  const fillEl = document.getElementById('benchmarkFill');
  const statusEl = document.getElementById('verdictStatus');
  const hintEl = document.getElementById('verdictHint');
  const retentionEl = document.getElementById('retentionRate');
  const runBtn = document.getElementById('runBenchmarkBtn');
  const modeRadios = document.querySelectorAll('input[name="benchmarkMode"]');

  if (!clockEl || !runBtn) return;

  let animationFrame = null;
  let isRunning = false;

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    runSimulation();
  });

  modeRadios.forEach(r => r.addEventListener('change', () => {
    if (!isRunning) runSimulation();
  }));

  function runSimulation() {
    isRunning = true;
    runBtn.disabled = true;
    runBtn.textContent = 'ТЕСТУВАННЯ ТРАФІКУ... ⏳';

    const isOptimized = document.querySelector('input[name="benchmarkMode"]:checked').value === 'optimized';
    const targetDuration = isOptimized ? 1.15 : 4.85;
    const maxGaugeDuration = 5.0;
    const startTime = performance.now();

    function updateFrame(now) {
      const elapsed = (now - startTime) / 1000;
      const current = Math.min(elapsed, targetDuration);

      clockEl.textContent = current.toFixed(2) + 's';
      fillEl.style.width = Math.min((current / maxGaugeDuration) * 100, 100) + '%';

      if (current <= 3.0) {
        const retained = Math.round(100 - (current * 4));
        retentionEl.textContent = retained + '%';
        retentionEl.style.color = 'var(--accent-green)';
        statusEl.className = 'verdict-status success';
        statusEl.textContent = 'ЗЕЛЕНА ЗОНА (<3 сек)';
        hintEl.textContent = 'Відвідувач задоволений та починає читати контент сайту.';
      } else {
        const dropRatio = Math.round(53 + (current - 3) * 18);
        const retained = Math.max(100 - dropRatio, 12);
        retentionEl.textContent = retained + '%';
        retentionEl.style.color = 'var(--accent-vermilion)';
        statusEl.className = 'verdict-status danger';
        statusEl.textContent = 'КРИТИЧНИЙ ВІДТІК (>3 сек)';
        hintEl.textContent = 'Катастрофа: понад 53% користувачів вже закрили сайт!';
      }

      if (elapsed < targetDuration) {
        animationFrame = requestAnimationFrame(updateFrame);
      } else {
        isRunning = false;
        runBtn.disabled = false;
        runBtn.textContent = 'ПОВТОРИТИ ТЕСТ ЗАВАНТАЖЕННЯ ↺';
      }
    }

    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(updateFrame);
  }
}

function initDeviceSimulator() {
  const viewport = document.getElementById('simViewport');
  const desktopBtn = document.getElementById('btnModeDesktop');
  const mobileBtn = document.getElementById('btnModeMobile');
  const thumbZoneCheck = document.getElementById('thumbZoneToggle');
  const simHamburger = document.getElementById('simHamburger');
  const simDrawer = document.getElementById('simDrawer');

  if (!viewport || !desktopBtn || !mobileBtn) return;

  desktopBtn.addEventListener('click', () => {
    viewport.classList.remove('mode-mobile');
    viewport.classList.add('mode-desktop');
    desktopBtn.classList.add('active');
    mobileBtn.classList.remove('active');
    if (simDrawer) simDrawer.style.display = 'none';
  });

  mobileBtn.addEventListener('click', () => {
    viewport.classList.remove('mode-desktop');
    viewport.classList.add('mode-mobile');
    mobileBtn.classList.add('active');
    desktopBtn.classList.remove('active');
  });

  if (thumbZoneCheck) {
    thumbZoneCheck.addEventListener('change', (e) => {
      if (e.target.checked) viewport.classList.add('show-thumb-zone');
      else viewport.classList.remove('show-thumb-zone');
    });
  }

  if (simHamburger && simDrawer) {
    simHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      simDrawer.style.display = simDrawer.style.display === 'none' ? 'block' : 'none';
    });
  }
}

function initCinemagraphToggles() {
  const toggleButtons = document.querySelectorAll('.btn-cinema-toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cinema-card');
      if (!card) return;
      const isActive = card.classList.contains('cinema-active');
      if (isActive) {
        card.classList.remove('cinema-active');
        btn.textContent = 'УВІМКНУТИ АНІМАЦІЮ ▶';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
      } else {
        card.classList.add('cinema-active');
        btn.textContent = 'ЗУПИНИТИ АНІМАЦІЮ ⏸';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
      }
    });
  });
}

function initVariableFontTester() {
  const weightSlider = document.getElementById('fontSliderWeight');
  const spacingSlider = document.getElementById('fontSliderSpacing');
  const weightVal = document.getElementById('fontWeightVal');
  const spacingVal = document.getElementById('fontSpacingVal');
  const demoText = document.getElementById('variableFontDemoText');
  const fontRadios = document.querySelectorAll('input[name="fontStyleFamily"]');

  if (!weightSlider || !demoText) return;

  function updateFont() {
    const w = weightSlider.value;
    const s = spacingSlider.value;
    if (weightVal) weightVal.textContent = w;
    if (spacingVal) spacingVal.textContent = s + 'px';

    demoText.style.fontWeight = w;
    demoText.style.letterSpacing = s + 'px';
  }

  weightSlider.addEventListener('input', updateFont);
  if (spacingSlider) spacingSlider.addEventListener('input', updateFont);

  fontRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'serif') {
        demoText.style.fontFamily = "Georgia, 'Times New Roman', serif";
      } else {
        demoText.style.fontFamily = "var(--font-heading), sans-serif";
      }
    });
  });

  updateFont();
}

/** -------------------------------------------------------------------------
 * ТЕМА 2: ВИДИ САЙТІВ ТА ЦІЛЬОВА АУДИТОРІЯ
 * ------------------------------------------------------------------------ */
function initSiteCatalogFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.site-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/** -------------------------------------------------------------------------
 * ТЕМА 3: ІНФОРМАЦІЙНА СТРУКТУРА САЙТУ
 * ------------------------------------------------------------------------ */
function initThreeClickQuest() {
  const breadcrumbEl = document.getElementById('questBreadcrumb');
  const counterBadge = document.getElementById('questClickCounter');
  const actionContainer = document.getElementById('questActionButtons');
  const statusMsgEl = document.getElementById('questStatusMessage');
  const resetBtn = document.getElementById('questResetBtn');

  if (!breadcrumbEl || !counterBadge || !actionContainer) return;

  let clickCount = 0;
  let currentPath = ['Головна'];
  let currentLevel = 'home';

  // Простий та інтуїтивно зрозумілий граф інтернет-магазину
  const siteGraph = {
    home: [
      { label: '🛒 Каталог товарів', next: 'catalog' },
      { label: '🚚 Доставка та оплата', next: 'delivery' },
      { label: '🏢 Про магазин', next: 'about' },
      { label: '💬 Відгуки покупців', next: 'reviews' }
    ],
    catalog: [
      { label: '🎧 Навушники та аудіо', next: 'audio' },
      { label: '💻 Ноутбуки та комп\'ютери', next: 'laptops' },
      { label: '📱 Смартфони та чохли', next: 'phones' }
    ],
    audio: [
      { label: '⭐ Товар: «Бездротові навушники HyperX Cloud»', next: 'win', target: true },
      { label: '🔊 Товар: Портативна колонка JBL', next: 'other_item' },
      { label: '🎙️ Товар: Студійний мікрофон', next: 'other_item' }
    ],
    delivery: [
      { label: 'Тарифи «Нової Пошти»', next: 'dead_end' },
      { label: 'Кур\'єрська доставка по місту', next: 'dead_end' }
    ],
    about: [
      { label: 'Історія компанії', next: 'dead_end' },
      { label: 'Контакти та карта', next: 'dead_end' }
    ],
    reviews: [
      { label: 'Відгуки про швидкість сервісу', next: 'dead_end' }
    ],
    laptops: [
      { label: 'Ігрові ноутбуки ASUS', next: 'dead_end' },
      { label: 'Офісні ноутбуки Lenovo', next: 'dead_end' }
    ],
    phones: [
      { label: 'Флагмани Samsung та Apple', next: 'dead_end' }
    ],
    other_item: [
      { label: 'Повернутися назад в «Аудіо»', next: 'audio' }
    ],
    dead_end: [
      { label: 'Повернутися на Головну', next: 'home' }
    ]
  };

  function updateQuestUI() {
    breadcrumbEl.textContent = currentPath.join(' ➔ ');
    counterBadge.textContent = `${clickCount} / 3 КЛІКИ`;
    counterBadge.className = 'click-counter-badge';

    if (clickCount === 3) counterBadge.classList.add('warn');
    if (clickCount > 3) counterBadge.classList.add('fail');

    actionContainer.innerHTML = '';

    if (currentLevel === 'win') {
      statusMsgEl.innerHTML = clickCount <= 3
        ? `<div class="quest-alert success">🎉 ЧУДОВО! Ви знайшли «Навушники HyperX Cloud» рівно за ${clickCount} кліки! «Правило 3 кліків» виконано бездоганно.</div>`
        : `<div class="quest-alert fail">⚠️ ПЕРЕВИЩЕННЯ: Ви витратили ${clickCount} кліків. У реальному інтернет-магазині покупець уже залишив би сайт через довгий пошук.</div>`;
      return;
    }

    const choices = siteGraph[currentLevel] || [];
    if (!choices.length) {
      statusMsgEl.innerHTML = `<div class="quest-alert warn">Глухий кут. Натисніть «ПОЧАТИ СПОЧАТКУ», щоб обрати правильну рубрику.</div>`;
      return;
    }

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'nav-target-btn';
      btn.textContent = ch.label;
      btn.addEventListener('click', () => {
        clickCount++;
        const cleanName = ch.label.replace('🛒 ', '').replace('🎧 ', '').replace('⭐ ', '').replace('Товар: ', '');
        currentPath.push(cleanName);
        currentLevel = ch.next;
        updateQuestUI();
      });
      actionContainer.appendChild(btn);
    });
  }

  resetBtn.addEventListener('click', () => {
    clickCount = 0;
    currentPath = ['Головна'];
    currentLevel = 'home';
    statusMsgEl.innerHTML = '';
    updateQuestUI();
  });

  updateQuestUI();
}

/** -------------------------------------------------------------------------
 * ТЕМА 4: ІНСТРУМЕНТИ ВЕБ-РОЗРОБНИКА
 * ------------------------------------------------------------------------ */
function initCodeEditorSimulator() {
  const tabs = document.querySelectorAll('.editor-tab-btn');
  const fTabs = document.querySelectorAll('.file-tab');
  const codeArea = document.getElementById('codeEditorTextarea');
  const previewFrame = document.getElementById('codeLivePreview');
  const statVal = document.getElementById('editorSpotlightStat');
  const statText = document.getElementById('editorSpotlightText');
  const runBtn = document.getElementById('runCodeBtn');

  if (!codeArea || !previewFrame) return;

  const files = {
    html: `<!-- Код сторінки для уроку -->
<div class="card-demo">
  <h2>Привіт, Юний Розробнику! 💻</h2>
  <p>Редагуй HTML або CSS ліворуч і спостерігай за змінами наживо.</p>
  <button id="alertBtn" class="lesson-btn">НАТИСНИ МЕНЕ (JS ТЕСТ)</button>
  <div id="output" style="margin-top:10px; font-weight:bold;"></div>
</div>`,
    css: `body {
  font-family: 'Space Grotesk', sans-serif;
  padding: 1.5rem;
  background: #fbf9f4;
}
.card-demo {
  background: #ffffff;
  border: 3px solid #121212;
  box-shadow: 5px 5px 0px #121212;
  padding: 1.5rem;
}
.lesson-btn {
  background: #ff4732;
  color: #fff;
  border: 2px solid #121212;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 3px 3px 0 #121212;
}
.lesson-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #121212;
}`,
    js: `document.getElementById('alertBtn').addEventListener('click', () => {
  document.getElementById('output').innerHTML = '✅ JAVASCRIPT ПРАЦЮЄ В LIVE PREVIEW! ⏱️ ' + new Date().toLocaleTimeString();
});`
  };

  let activeFile = 'html';

  function renderIframe() {
    previewFrame.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
        <style>${files.css}</style>
      </head>
      <body>
        ${files.html}
        <script>try { ${files.js} } catch(e){ console.error(e) }<\/script>
      </body>
      </html>
    `;
  }

  fTabs.forEach(t => {
    t.addEventListener('click', () => {
      files[activeFile] = codeArea.value;
      fTabs.forEach(tab => tab.classList.remove('active'));
      t.classList.add('active');
      activeFile = t.dataset.file;
      codeArea.value = files[activeFile];
    });
  });

  codeArea.addEventListener('input', () => {
    files[activeFile] = codeArea.value;
    renderIframe();
  });

  if (runBtn) runBtn.addEventListener('click', renderIframe);

  const editorInfo = {
    vscode: { stat: "55.6%", text: "Найпопулярніший кросплатформний редактор світу за опитуванням Stack Overflow (§1.4, с. 29)." },
    sublime: { stat: "24.0%", text: "Швидкий мультикурсорний редактор (Ctrl+D), підтримка темної теми." },
    notepadpp: { stat: "30.4%", text: "Тільки для Windows. Дуже легкий, швидкий та з підтримкою макросів." },
    vim: { stat: "25.9%", text: "Модальний термінальний редактор для Unix/Linux (створений у 1991 р. Брамом Мооленааром)." }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const data = editorInfo[tab.dataset.editor];
      if (data) {
        statVal.textContent = data.stat;
        statText.textContent = data.text;
      }
    });
  });

  codeArea.value = files.html;
  renderIframe();
}

/** -------------------------------------------------------------------------
 * ПІДСУМКОВИЙ ТЕСТ ЗНАНЬ (12 БАЛІВ)
 * ------------------------------------------------------------------------ */
function initLessonQuiz() {
  const form = document.getElementById('lessonQuizForm');
  const resultDisplay = document.getElementById('quizResultDisplay');

  if (!form || !resultDisplay) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;

    for (let i = 1; i <= 12; i++) {
      const selected = form.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.value === '1') {
        score++;
      }
    }

    resultDisplay.style.display = 'block';
    let gradeMsg = '';

    if (score >= 10) {
      gradeMsg = `🏆 ВІДМІННО! Ви блискуче засвоїли всі 4 теми уроку за державною навчальною програмою!`;
    } else if (score >= 7) {
      gradeMsg = `👍 ДОБРЕ! Достатній рівень знань. Спробуйте попрактикуватися у симуляторах для закріплення.`;
    } else {
      gradeMsg = `📖 ПОТРІБНО ПОВТОРИТИ! Перечитайте теоретичні блоки на початку кожної теми та пройдіть тест знову.`;
    }

    resultDisplay.innerHTML = `
      <div>ВАША ОЦІНКА ЗА УРОК: <strong>${score} / 12 БАЛІВ</strong></div>
      <div style="font-size: 1.1rem; font-family: var(--font-sans); margin-top: 0.5rem; font-weight: 500;">${gradeMsg}</div>
    `;

    resultDisplay.scrollIntoView({ behavior: 'smooth' });
  });
}
