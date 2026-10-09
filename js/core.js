/* ==========================================================================
   ВЕБТЕХНОЛОГІЇ (10–11 КЛАСИ) • СПІЛЬНЕ ЯДРО ІНТЕРФЕЙСУ
   Єдине джерело системних компонентів для всіх сторінок курсу:
     - initThemeToggle()        перемикач світла/темної теми (localStorage)
     - initCourseDropdown()     випадаюче меню «Уроки курсу»
     - initMobileNavigation()   бургер-меню на смартфонах/планшетах
     - initActiveNavHighlight() підсвітка активного пункту змісту при скролі
     - initScrollProgress()     смуга прогресу читання
     - initAccordions()         розгортання/згортання теоретичних блоків
   Файл підключається ПЕРЕД стороновим скриптом сторінки.
   ========================================================================== */

/* Узгоджені налаштування спільних модулів */
var CORE_CONFIG = {
  // Зсув точки активації пункту меню відносно верхнього краю вікна (px).
  navHighlightOffset: 130,
  // Ключ у localStorage для збереження теми.
  themeStorageKey: 'site_theme',
  // Тема за замовчуванням, якщо користувач ще ніколи не обирав.
  defaultTheme: 'light'
};

/* --------------------------------------------------------------------------
   1. ПЕРЕМИКАЧ ТЕМИ ДЕНЬ/НІЧ
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  /**
   * Початкова тема: збережена в localStorage, інакше системна настройка
   * браузера (prefers-color-scheme), інакше — світла.
   */
  function resolveInitialTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(CORE_CONFIG.themeStorageKey);
    } catch (e) {
      /* localStorage може бути недоступним — ігноруємо */
    }

    if (saved === 'light' || saved === 'dark') return saved;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return CORE_CONFIG.defaultTheme;
  }

  function renderButton(theme) {
    themeBtn.textContent = theme === 'dark' ? 'ДЕНЬ ☀️' : 'НІЧ 🌙';
    themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  let activeTheme = resolveInitialTheme();
  document.documentElement.setAttribute('data-theme', activeTheme);
  renderButton(activeTheme);

  themeBtn.addEventListener('click', () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', activeTheme);
    try {
      localStorage.setItem(CORE_CONFIG.themeStorageKey, activeTheme);
    } catch (e) {
      /* збереження недоступне — тема працює до перезавантаження сторінки */
    }
    renderButton(activeTheme);
  });
}


/* --------------------------------------------------------------------------
   2. ВИПАДАЮЧЕ МЕНЮ «УРОКИ КУРСУ»
   -------------------------------------------------------------------------- */
function initCourseDropdown() {
  const dropdown = document.getElementById('courseDropdown');
  const dropdownBtn = document.getElementById('courseDropdownBtn');
  if (!dropdown || !dropdownBtn) return;

  const closeBtn = document.getElementById('courseDropdownCloseBtn');
  const previewVisual = document.getElementById('previewLessonVisual');
  const previewBadge = document.getElementById('previewLessonBadge');
  const previewNum = document.getElementById('previewLessonNum');
  const previewTitle = document.getElementById('previewLessonTitle');
  const previewTopics = document.getElementById('previewLessonTopics');
  const previewBtn = document.getElementById('previewLessonBtn');

  function updatePreview(item) {
    if (!item) return;
    const num = item.dataset.num || '';
    const title = item.dataset.title || (item.querySelector('.item-title') ? item.querySelector('.item-title').textContent : '');
    const topics = item.dataset.topics || '';
    const icon = item.dataset.icon || '📚';
    const isUpcoming = item.classList.contains('upcoming');
    const badge = item.dataset.badge || (isUpcoming ? 'Скоро' : 'Доступно');
    const href = item.getAttribute('href') || '#';

    const imgPath = item.dataset.img || '';
    if (previewVisual) {
      if (imgPath) {
        previewVisual.innerHTML = `<img src="${imgPath}" alt="${title}" class="preview-card-img" />`;
      } else {
        previewVisual.innerHTML = `<div class="preview-card-placeholder"><span class="placeholder-icon">${icon}</span><span class="placeholder-text">Тема в розробці ⏳</span></div>`;
      }
    }
    if (previewNum) previewNum.textContent = num ? 'УРОК #' + num : '';
    if (previewTitle) previewTitle.textContent = title;
    if (previewTopics) previewTopics.textContent = topics;
    if (previewBadge) {
      previewBadge.textContent = badge;
      previewBadge.className = 'lesson-tag ' + (isUpcoming ? 'upcoming' : 'current');
    }
    if (previewBtn) {
      if (isUpcoming) {
        previewBtn.textContent = 'Тема готується ⏳';
        previewBtn.setAttribute('href', '#');
        previewBtn.style.opacity = '0.6';
        previewBtn.style.pointerEvents = 'none';
      } else {
        previewBtn.textContent = 'Перейти до уроку →';
        previewBtn.setAttribute('href', href);
        previewBtn.style.opacity = '1';
        previewBtn.style.pointerEvents = 'auto';
      }
    }
  }

  function setOpen(isOpen) {
    dropdown.classList.toggle('open', isOpen);
    dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      const activeItem = dropdown.querySelector('.course-dropdown-item.active') ||
                         dropdown.querySelector('.course-dropdown-item');
      if (activeItem) updatePreview(activeItem);
    }
  }

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!dropdown.classList.contains('open'));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(false);
      dropdownBtn.focus();
    });
  }

  // Клік поза меню закриває його
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) setOpen(false);
  });

  // Escape закриває меню
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('open')) {
      setOpen(false);
      dropdownBtn.focus();
    }
  });

  // Обробники для пунктів меню (hover, focus, click)
  dropdown.querySelectorAll('.course-dropdown-item').forEach(item => {
    item.addEventListener('mouseenter', () => updatePreview(item));
    item.addEventListener('focus', () => updatePreview(item));

    item.addEventListener('click', (e) => {
      if (item.classList.contains('upcoming')) {
        e.preventDefault();
        return;
      }
      setOpen(false);
    });
  });

  // Початкова ініціалізація картки прев'ю
  const initialItem = dropdown.querySelector('.course-dropdown-item.active') ||
                      dropdown.querySelector('.course-dropdown-item');
  if (initialItem) {
    updatePreview(initialItem);
  }

  // Обробники для кнопок пагінатора внизу сторінки (Всі уроки / Наступний урок незабаром)
  document.querySelectorAll('#pagerAllLessonsBtn, #upcomingLessonCard').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. МОБІЛЬНА НАВІГАЦІЯ (БУРГЕР)
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const burgerBtn = document.getElementById('burgerMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!burgerBtn || !navLinks) return;

  function setMenuOpen(isOpen) {
    navLinks.classList.toggle('mobile-active', isOpen);
    burgerBtn.textContent = isOpen ? 'ЗАКРИТИ ✕' : 'МЕНЮ ☰';
    burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenuOpen(!navLinks.classList.contains('mobile-active'));
  });

  // Клік на будь-яке посилання всередині меню закриває його
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenuOpen(false);
  });

  // Клік поза меню закриває його
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('mobile-active') && !navLinks.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  // Escape закриває меню
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-active')) {
      setMenuOpen(false);
      burgerBtn.focus();
    }
  });

  setMenuOpen(false);
}


/* --------------------------------------------------------------------------
   4. ПІДСВІТКА АКТИВНОГО ПУНКТУ ЗМІСТУ
   Розрахунок буферизується через requestAnimationFrame, щоб не виконувати
   його на кожній події скролу (інакше ламається плавність на слабких ПК).
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  let scheduled = false;

  function update() {
    scheduled = false;
    const scrollPos = window.scrollY + CORE_CONFIG.navHighlightOffset;
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      if (scrollPos >= top && scrollPos < top + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   5. СМУГА ПРОГРЕСУ ЧИТАННЯ
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  function update() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const progress = (window.scrollY / docHeight) * 100;
    progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}


/* --------------------------------------------------------------------------
   6. АКОРДЕОНИ (ТЕОРИЧНІ БЛОКИ)
   Підтримує обидва варіанти розмітки, що є в курсі:
     • index.html               — <div class="accordion-header"> + <span>▲/▼</span>
     • html-basics/css-basics   — <button class="accordion-header"> + <span class="accordion-icon">−/+</span>
   -------------------------------------------------------------------------- */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    const item = header.closest('.accordion-item');
    if (!item) return;

    const icon = header.querySelector('.accordion-icon') || header.querySelector('span:last-child');
    const usesPlusIcon = !!(icon && icon.classList.contains('accordion-icon'));

    function renderIcon(isActive) {
      if (!icon) return;
      if (usesPlusIcon) icon.textContent = isActive ? '−' : '+';
      else icon.textContent = isActive ? '▲' : '▼';
    }

    // Стартовий стан беремо з .accordion-item, щоб уникнути «мигання» іконки
    const initialActive = item.classList.contains('active');
    renderIcon(initialActive);
    header.setAttribute('aria-expanded', initialActive ? 'true' : 'false');

    header.addEventListener('click', () => {
      const nowActive = item.classList.toggle('active');
      renderIcon(nowActive);
      header.setAttribute('aria-expanded', nowActive ? 'true' : 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   7. ТОЧКА ВХОДУ — спільне ядро ініціалізується на всіх сторінках
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCourseDropdown();
  initMobileNavigation();
  initActiveNavHighlight();
  initScrollProgress();
  initAccordions();
});

