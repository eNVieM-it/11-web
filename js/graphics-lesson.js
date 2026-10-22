/* ==========================================================================
   УРОК 7: ГРАФІКА ДЛЯ ВЕБ-СЕРЕДОВИЩА • ЛОГІКА ІНТЕРАКТИВНОЇ ЛАБОРАТОРІЇ
   Web Graphics Lab: Симулятор, Кейс-тренажер, Конструктор HTML & Quiz
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLabTabs();
  initLabFullscreen();
  initZoomAndCompressionSimulator();
  initCaseArchitect();
  initHtmlCodeGenerator();
  initFormatMatrixFilter();
  initCreativeCommonsInteractivity();
});

/* --------------------------------------------------------------------------
   1. ТАБИ ЛАБОРАТОРІЇ (Web Graphics Lab Navigation)
   -------------------------------------------------------------------------- */
function initLabTabs() {
  const tabs = document.querySelectorAll('.lab-tab-btn');
  const panels = document.querySelectorAll('.lab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. МОДУЛЬ 1: СИМУЛЯТОР «РАСТР VS ВЕКТОР ТА СТИСНЕННЯ»
   -------------------------------------------------------------------------- */
function initZoomAndCompressionSimulator() {
  const zoomSlider = document.getElementById('zoomRange');
  const zoomValDisplay = document.getElementById('zoomVal');
  const rasterView = document.getElementById('rasterZoomView');
  const vectorView = document.getElementById('vectorZoomView');

  const qualitySlider = document.getElementById('qualityRange');
  const qualityValDisplay = document.getElementById('qualityVal');
  const formatBtns = document.querySelectorAll('.sim-fmt-btn');

  const metricSize = document.getElementById('metricFileSize');
  const metricSavings = document.getElementById('metricSavings');
  const metricTime3G = document.getElementById('metricTime3G');
  const metricTime4G = document.getElementById('metricTime4G');
  const metricRating = document.getElementById('metricQualityRating');
  const compressionPreviewBox = document.getElementById('simVisualPreview');

  let activeFormat = 'webp';
  let quality = 80;
  let zoom = 100;

  // Базовий розмір нестисненого фото (Full HD 1920x1080 24-bit raw bitmap = 2400 KB)
  const BASE_RAW_KB = 2400;

  function updateZoom() {
    zoom = parseInt(zoomSlider.value, 10);
    if (zoomValDisplay) zoomValDisplay.textContent = zoom + '%';

    const scale = zoom / 100;
    if (vectorView) {
      vectorView.style.transform = `scale(${scale})`;
    }
    if (rasterView) {
      rasterView.style.transform = `scale(${scale})`;
      // При збільшенні растра імітуємо втрату різкості та піксельну сітку
      if (zoom > 200) {
        rasterView.style.imageRendering = 'pixelated';
        rasterView.classList.add('pixel-grid-active');
      } else {
        rasterView.style.imageRendering = 'auto';
        rasterView.classList.remove('pixel-grid-active');
      }
    }
  }

  function calculateCompression() {
    quality = parseInt(qualitySlider.value, 10);
    if (qualityValDisplay) qualityValDisplay.textContent = quality + '%';

    let estimatedKB = 0;
    let rating = 'Відмінна';
    let ratingColor = '#34d399';

    if (activeFormat === 'png') {
      // PNG - без втрат для фотографій дуже важкий (незалежно від повзунка)
      estimatedKB = Math.round(750 + (100 - quality) * 1.5);
      rating = 'Важкий для фото';
      ratingColor = '#fbbf24';
    } else if (activeFormat === 'jpeg') {
      // JPEG lossy
      estimatedKB = Math.round(35 + Math.pow(quality / 100, 2.2) * 260);
      if (quality < 30) {
        rating = 'Помітні артефакти';
        ratingColor = '#f87171';
      } else if (quality < 70) {
        rating = 'Прийнятна';
        ratingColor = '#38bdf8';
      } else {
        rating = 'Відмінна якість';
        ratingColor = '#34d399';
      }
    } else if (activeFormat === 'webp') {
      // WebP на 30-35% компактніший за JPEG
      estimatedKB = Math.round(22 + Math.pow(quality / 100, 2.0) * 165);
      if (quality < 25) {
        rating = 'Легке згладження';
        ratingColor = '#fbbf24';
      } else {
        rating = 'Супер-баланс ⚡';
        ratingColor = '#34d399';
      }
    } else if (activeFormat === 'avif') {
      // AVIF найсучасніший, на 50% легший за JPEG
      estimatedKB = Math.round(14 + Math.pow(quality / 100, 1.9) * 110);
      rating = 'Ультра-стиснення 🚀';
      ratingColor = '#34d399';
    }

    const savingsPercent = Math.max(0, Math.round(((BASE_RAW_KB - estimatedKB) / BASE_RAW_KB) * 100));

    // Час завантаження: 3G (~1.6 Mbps = 200 KB/s), 4G (~25 Mbps = 3125 KB/s)
    const time3G = (estimatedKB / 200).toFixed(2);
    const time4G = (estimatedKB / 3125).toFixed(3);

    if (metricSize) metricSize.innerHTML = `${estimatedKB} <span class="metric-unit">КБ</span>`;
    if (metricSavings) metricSavings.innerHTML = `-${savingsPercent}% <span class="metric-unit">від Raw</span>`;
    if (metricTime3G) metricTime3G.innerHTML = `${time3G} <span class="metric-unit">сек</span>`;
    if (metricTime4G) metricTime4G.innerHTML = `${time4G} <span class="metric-unit">сек</span>`;
    if (metricRating) {
      metricRating.textContent = rating;
      metricRating.style.color = ratingColor;
    }

    // Візуальна зміна прев'ю залежно від якості
    if (compressionPreviewBox) {
      if (activeFormat === 'jpeg' && quality < 30) {
        compressionPreviewBox.style.filter = 'contrast(1.15) saturate(0.85) blur(0.6px)';
      } else if (activeFormat === 'png') {
        compressionPreviewBox.style.filter = 'contrast(1.05) saturate(1.05)';
      } else if (quality < 20) {
        compressionPreviewBox.style.filter = 'blur(1px) contrast(0.95)';
      } else {
        compressionPreviewBox.style.filter = 'none';
      }
    }
  }

  if (zoomSlider) {
    zoomSlider.addEventListener('input', updateZoom);
    updateZoom();
  }

  if (qualitySlider) {
    qualitySlider.addEventListener('input', calculateCompression);
  }

  formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      formatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFormat = btn.dataset.format;
      calculateCompression();
    });
  });

  calculateCompression();
}

/* --------------------------------------------------------------------------
   3. МОДУЛЬ 2: КЕЙС-ТРЕНАЖЕР «АРХІТЕКТОР ФОРМАТІВ» (5 Ситуацій)
   -------------------------------------------------------------------------- */
function initCaseArchitect() {
  const scenarios = [
    {
      id: 1,
      badge: "КЕЙС 1 · ШАПКА САЙТУ",
      title: "Потрібно вставити логотип ліцею у шапку сайту. Він має бути ідеально різким на 4K Retina-екранах, важити до 15 КБ і динамічно змінювати колір при наведенні курсора миші через CSS.",
      options: [
        { label: "JPEG", val: "jpeg" },
        { label: "PNG-24", val: "png" },
        { label: "SVG (Вектор)", val: "svg" },
        { label: "GIF", val: "gif" },
        { label: "BMP", val: "bmp" }
      ],
      correct: "svg",
      explanation: "<strong>Бездоганний вибір! 🎯</strong> SVG — це масштабована векторна графіка у вигляді відкритого XML-коду. Логотип у форматі SVG важить лише лічені кілобайти, ніколи не розмивається на Retina-дисплеях з будь-якою роздільністю і дозволяє змінювати кольори окремих ліній або фону через CSS-властивість <code>fill</code> чи <code>stroke</code>."
    },
    {
      id: 2,
      badge: "КЕЙС 2 · ФОТОГАЛЕРЕЯ",
      title: "Потрібно розмістити галерею з 18 барвистих фотографій зі шкільного випускного. Важливо, щоб сторінка не зависала на мобільних телефонах зі слабким зв'язком, але кольори та обличчя залишилися природними.",
      options: [
        { label: "PNG без втрат", val: "png" },
        { label: "WebP / AVIF (з fallback на JPEG)", val: "modern" },
        { label: "Анімований GIF", val: "gif" },
        { label: "SVG у коді", val: "svg" }
      ],
      correct: "modern",
      explanation: "<strong>Точно в ціль! 🚀</strong> Фотографії містять сотні тисяч кольорів і плавні тонові переходи. Формати WebP та AVIF розроблені спеціально для фотографій у сучасному вебі: вони дають стиснення на 30–50% краще за класичний JPEG, а контейнер <code>&lt;picture&gt;</code> забезпечує безпечний fallback для старіших браузерів."
    },
    {
      id: 3,
      badge: "КЕЙС 3 · СКРІНШОТ З ТЕКСТОМ",
      title: "Потрібно вставити прозорий скріншот інтерфейсу програми із дрібним текстом кнопок та кодом. Потрібно, щоб навколо букв не було брудних плям і шумів, а фон за вікном залишався повністю прозорим.",
      options: [
        { label: "JPEG (стиснення 80%)", val: "jpeg" },
        { label: "PNG-24 (Alpha Transparency)", val: "png" },
        { label: "GIF (256 кольорів)", val: "gif" },
        { label: "BMP", val: "bmp" }
      ],
      correct: "png",
      explanation: "<strong>Абсолютно правильно! 💎</strong> JPEG не підтримує прозорість взагалі, а його блочне стиснення створює брудні артефакти («дзвін») навколо контрастного тексту. GIF підтримує лише грубу однобітну прозорість із драбинками. PNG-24 ідеально зберігає різкі лінії та текст завдяки стисненню без втрат (lossless) і підтримує повноцінний альфа-канал на 256 рівнів напівпрозорості."
    },
    {
      id: 4,
      badge: "КЕЙС 4 · МІКРОІНДИКАТОР",
      title: "Потрібно створити легку циклічну анімацію індикатора завантаження сторінки (спінер або галочка успіху). Вага має бути мінімальною (до 5 КБ), а краї — плавними без білих зубців.",
      options: [
        { label: "Старий GIF файл", val: "gif" },
        { label: "SVG з CSS @keyframes", val: "svg" },
        { label: "Серія з 20 JPEG картинок", val: "jpeg" },
        { label: "Відео MP4", val: "mp4" }
      ],
      correct: "svg",
      explanation: "<strong>Блискуче рішення! ⚡</strong> Старий GIF обмежений 256 кольорами, важить десятки кілобайт і залишає потворні зубці на прозорому фоні. Векторний SVG у поєднанні з простою CSS-анімацією <code>@keyframes</code> важить менше 2 КБ, ідеально плавно крутиться з частотою 60–120 FPS і не споживає зайвих ресурсів процесора."
    },
    {
      id: 5,
      badge: "КЕЙС 5 · ГОЛОВНИЙ БАНЕР HERO",
      title: "Ви верстаєте банер на першому екрані (Hero Image). Швидкість його завантаження безпосередньо впливає на головну метрику Google — LCP (Largest Contentful Paint). Як правильно його підключити?",
      options: [
        { label: "<img src='hero.png' loading='lazy'>", val: "bad_lazy" },
        { label: "<picture> з AVIF/WebP та fetchpriority='high'", val: "picture_lcp" },
        { label: "<img src='hero.gif'>", val: "gif_bad" },
        { label: "Фоновий BMP файл", val: "bmp_bad" }
      ],
      correct: "picture_lcp",
      explanation: "<strong>Рівень Senior Frontend Developer! 🏆</strong> Перший екран формує оцінку швидкості сайту. Обов'язково використовуємо сучасний тег <code>&lt;picture&gt;</code> із надлегкими форматами AVIF та WebP. Ключове правило: <strong>ніколи не ставте <code>loading='lazy'</code> на першому екрані</strong>, оскільки це відкладає завантаження! Навпаки, атрибут <code>fetchpriority='high'</code> вказує браузеру завантажити цей головний банер першочергово."
    }
  ];

  let currentIdx = 0;
  let score = 0;

  const cardBadge = document.getElementById('scBadge');
  const cardProgress = document.getElementById('scProgress');
  const cardQuestion = document.getElementById('scQuestion');
  const optionsGrid = document.getElementById('scOptionsGrid');
  const feedbackBox = document.getElementById('scFeedback');
  const feedbackTitle = document.getElementById('scFeedbackTitle');
  const feedbackText = document.getElementById('scFeedbackText');
  const nextBtn = document.getElementById('scNextBtn');

  function renderScenario() {
    const item = scenarios[currentIdx];
    if (!item) return;

    if (cardBadge) cardBadge.textContent = item.badge;
    if (cardProgress) cardProgress.textContent = `Кейс ${currentIdx + 1} з ${scenarios.length} · Рахунок: ${score}`;
    if (cardQuestion) cardQuestion.innerHTML = item.title;

    if (feedbackBox) {
      feedbackBox.className = 'scenario-feedback';
      feedbackBox.style.display = 'none';
    }

    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'scenario-opt-btn';
        btn.textContent = opt.label;
        btn.dataset.val = opt.val;
        btn.addEventListener('click', () => handleOptionClick(btn, opt.val, item));
        optionsGrid.appendChild(btn);
      });
    }

    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = currentIdx === scenarios.length - 1 ? '🏁 Завершити тренажер' : 'Наступний кейс →';
    }
  }

  function handleOptionClick(btn, val, item) {
    const buttons = optionsGrid.querySelectorAll('.scenario-opt-btn');
    buttons.forEach(b => {
      b.disabled = true;
      b.classList.remove('selected');
    });
    btn.classList.add('selected');

    const isCorrect = (val === item.correct);
    if (isCorrect) {
      score++;
      if (feedbackBox) {
        feedbackBox.className = 'scenario-feedback show correct';
        if (feedbackTitle) feedbackTitle.innerHTML = '✔ ВІРНЕ РІШЕННЯ! ВІДМІННА ІНЖЕНЕРНА ІНТУЇЦІЯ';
      }
    } else {
      if (feedbackBox) {
        feedbackBox.className = 'scenario-feedback show wrong';
        if (feedbackTitle) feedbackTitle.innerHTML = '✖ НЕ НАЙКРАЩИЙ ВИБІР ДЛЯ ЦІЄЇ ЗАДАЧІ';
      }
    }

    if (feedbackText) feedbackText.innerHTML = item.explanation;
    if (feedbackBox) feedbackBox.style.display = 'block';
    if (nextBtn) nextBtn.style.display = 'inline-block';
    if (cardProgress) cardProgress.textContent = `Кейс ${currentIdx + 1} з ${scenarios.length} · Рахунок: ${score}`;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIdx < scenarios.length - 1) {
        currentIdx++;
        renderScenario();
      } else {
        // Завершення
        if (optionsGrid) optionsGrid.innerHTML = '';
        if (cardQuestion) {
          cardQuestion.innerHTML = `🎉 <strong>Вітаємо! Ви пройшли практикум «Архітектор форматів».</strong><br>Ваш підсумковий результат: <strong>${score} з ${scenarios.length}</strong> правильних рішень!`;
        }
        if (feedbackBox) {
          feedbackBox.className = 'scenario-feedback show correct';
          if (feedbackTitle) feedbackTitle.textContent = 'Звання: Сертифікований архітектор веб-графіки 🎓';
          if (feedbackText) feedbackText.innerHTML = 'Ви володієте сучасними знаннями про SVG, WebP, AVIF, оптимізацію LCP та прозорість PNG. Тепер закріпіть навички у генераторі безпечного коду!';
        }
        nextBtn.textContent = '↺ Почати тренажер спочатку';
        nextBtn.onclick = () => {
          currentIdx = 0;
          score = 0;
          renderScenario();
        };
      }
    });
  }

  renderScenario();
}

/* --------------------------------------------------------------------------
   4. МОДУЛЬ 3: КОНСТРУКТОР БЕЗПЕЧНОГО HTML-КОДУ ТА ПЕРЕВІРКА ЛІЦЕНЗІЙ
   -------------------------------------------------------------------------- */
function initHtmlCodeGenerator() {
  const inputUrl = document.getElementById('genImgUrl');
  const inputAlt = document.getElementById('genImgAlt');
  const inputWidth = document.getElementById('genImgWidth');
  const inputHeight = document.getElementById('genImgHeight');
  const checkPicture = document.getElementById('genCheckPicture');
  const checkRetina = document.getElementById('genCheckRetina');
  const checkLazy = document.getElementById('genCheckLazy');
  const checkAsync = document.getElementById('genCheckAsync');
  const selectLicense = document.getElementById('genSelectLicense');
  const inputAuthor = document.getElementById('genInputAuthor');
  const inputSourceUrl = document.getElementById('genInputSourceUrl');

  const codeDisplay = document.getElementById('genCodeDisplay');
  const copyBtn = document.getElementById('genCopyBtn');
  const liveImg = document.getElementById('genLiveImg');
  const liveAuthor = document.getElementById('genLiveAuthor');
  const liveLicenseBadge = document.getElementById('genLiveLicenseBadge');
  const altWarning = document.getElementById('genAltWarning');

  function updateGenerator() {
    const url = inputUrl ? inputUrl.value.trim() || 'img/photo-sample.jpg' : 'img/photo-sample.jpg';
    const alt = inputAlt ? inputAlt.value.trim() : '';
    const width = inputWidth ? inputWidth.value.trim() || '800' : '800';
    const height = inputHeight ? inputHeight.value.trim() || '500' : '500';
    const usePicture = checkPicture ? checkPicture.checked : true;
    const useRetina = checkRetina ? checkRetina.checked : true;
    const isLazy = checkLazy ? checkLazy.checked : true;
    const isAsync = checkAsync ? checkAsync.checked : true;
    const license = selectLicense ? selectLicense.value : 'CC-BY-4.0';
    const author = inputAuthor ? inputAuthor.value.trim() || 'Фотограф' : 'Фотограф';
    const sourceLink = inputSourceUrl ? inputSourceUrl.value.trim() || 'https://unsplash.com' : 'https://unsplash.com';

    // Валідація alt тексту для a11y
    if (altWarning) {
      if (!alt) {
        altWarning.innerHTML = '<span style="color:#ef4444;">⚠️ Увага: Атрибут alt порожній! Скрін-рідери не зможуть озвучити зображення для незрячих.</span>';
      } else if (alt.toLowerCase().includes('картинка') || alt.toLowerCase().includes('фото') || alt.toLowerCase().includes('image')) {
        altWarning.innerHTML = '<span style="color:#f59e0b;">💡 Порада: Уникайте слів «фото», «картинка» в alt. Скрін-рідер і так повідомляє «Зображення: ...». Опишіть суть сюжету!</span>';
      } else {
        altWarning.innerHTML = '<span style="color:#10b981;">✔ Чудово! Змістовний alt забезпечує повну доступність (WCAG 2.1 AA) та SEO.</span>';
      }
    }

    // Базове ім'я файлу без розширення
    const baseName = url.replace(/\.[^/.]+$/, '');

    // Генерація коду
    let code = `&lt;<span class="tag">figure</span>&gt;\n`;

    if (usePicture) {
      code += `  &lt;<span class="tag">picture</span>&gt;\n`;
      // AVIF
      if (useRetina) {
        code += `    &lt;<span class="tag">source</span> <span class="attr">type</span>=<span class="val">"image/avif"</span>\n`;
        code += `            <span class="attr">srcset</span>=<span class="val">"${baseName}.avif 1x, ${baseName}@2x.avif 2x"</span>&gt;\n`;
        code += `    &lt;<span class="tag">source</span> <span class="attr">type</span>=<span class="val">"image/webp"</span>\n`;
        code += `            <span class="attr">srcset</span>=<span class="val">"${baseName}.webp 1x, ${baseName}@2x.webp 2x"</span>&gt;\n`;
      } else {
        code += `    &lt;<span class="tag">source</span> <span class="attr">type</span>=<span class="val">"image/avif"</span> <span class="attr">srcset</span>=<span class="val">"${baseName}.avif"</span>&gt;\n`;
        code += `    &lt;<span class="tag">source</span> <span class="attr">type</span>=<span class="val">"image/webp"</span> <span class="attr">srcset</span>=<span class="val">"${baseName}.webp"</span>&gt;\n`;
      }
      code += `    &lt;<span class="tag">img</span> <span class="attr">src</span>=<span class="val">"${url}"</span>\n`;
      code += `         <span class="attr">alt</span>=<span class="val">"${escapeHtml(alt)}"</span>\n`;
      code += `         <span class="attr">width</span>=<span class="val">"${width}"</span> <span class="attr">height</span>=<span class="val">"${height}"</span>`;
      if (isLazy) code += `\n         <span class="attr">loading</span>=<span class="val">"lazy"</span>`;
      if (isAsync) code += `\n         <span class="attr">decoding</span>=<span class="val">"async"</span>`;
      code += `&gt;\n`;
      code += `  &lt;/<span class="tag">picture</span>&gt;\n`;
    } else {
      code += `  &lt;<span class="tag">img</span> <span class="attr">src</span>=<span class="val">"${url}"</span>\n`;
      code += `       <span class="attr">alt</span>=<span class="val">"${escapeHtml(alt)}"</span>\n`;
      code += `       <span class="attr">width</span>=<span class="val">"${width}"</span> <span class="attr">height</span>=<span class="val">"${height}"</span>`;
      if (isLazy) code += `\n       <span class="attr">loading</span>=<span class="val">"lazy"</span>`;
      if (isAsync) code += `\n       <span class="attr">decoding</span>=<span class="val">"async"</span>`;
      code += `&gt;\n`;
    }

    // Підпис ліцензії figcaption
    code += `  &lt;<span class="tag">figcaption</span>&gt;\n`;
    code += `    Фото: &lt;<span class="tag">a</span> <span class="attr">href</span>=<span class="val">"${sourceLink}"</span> <span class="attr">target</span>=<span class="val">"_blank"</span> <span class="attr">rel</span>=<span class="val">"noopener noreferrer"</span>&gt;${escapeHtml(author)}&lt;/<span class="tag">a</span>&gt; ·\n`;
    code += `    Ліцензія: &lt;<span class="tag">span</span> <span class="attr">class</span>=<span class="val">"license-badge"</span>&gt;${license}&lt;/<span class="tag">span</span>&gt;\n`;
    code += `  &lt;/<span class="tag">figcaption</span>&gt;\n`;
    code += `&lt;/<span class="tag">figure</span>&gt;`;

    if (codeDisplay) codeDisplay.innerHTML = code;

    // Оновлення живого прев'ю
    if (liveImg) {
      liveImg.alt = alt || 'Зразок фотографії';
    }
    if (liveAuthor) {
      liveAuthor.innerHTML = `Фото: <a href="${sourceLink}" target="_blank" rel="noopener">${author}</a>`;
    }
    if (liveLicenseBadge) {
      liveLicenseBadge.textContent = license;
    }
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
  }

  const inputs = [inputUrl, inputAlt, inputWidth, inputHeight, checkPicture, checkRetina, checkLazy, checkAsync, selectLicense, inputAuthor, inputSourceUrl];
  inputs.forEach(el => {
    if (el) {
      el.addEventListener('input', updateGenerator);
      el.addEventListener('change', updateGenerator);
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      // Витягуємо чистий текст без HTML-тегів підсвітки
      const tempEl = document.createElement('div');
      tempEl.innerHTML = codeDisplay.innerHTML;
      const rawText = tempEl.textContent || tempEl.innerText || '';

      navigator.clipboard.writeText(rawText).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✔ Скопійовано!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#ffffff';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Не вдалося скопіювати код:', err);
      });
    });
  }

  updateGenerator();
}

/* --------------------------------------------------------------------------
   5. ФІЛЬТРАЦІЯ МАТРИЦІ ФОРМАТІВ
   -------------------------------------------------------------------------- */
function initFormatMatrixFilter() {
  const filterBtns = document.querySelectorAll('.matrix-filter-btn');
  const rows = document.querySelectorAll('.matrix-table tbody tr');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter; // 'all', 'raster', 'vector', 'modern'

      rows.forEach(row => {
        const type = row.dataset.type;
        if (filter === 'all' || type === filter || (filter === 'modern' && row.dataset.modern === 'true')) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. ІНТЕРАКТИВНІСТЬ КАРТОК CREATIVE COMMONS
   -------------------------------------------------------------------------- */
function initCreativeCommonsInteractivity() {
  const cards = document.querySelectorAll('.cc-card');
  const detailModal = document.getElementById('ccDetailDisplay');
  const detailTitle = document.getElementById('ccDetailTitle');
  const detailBody = document.getElementById('ccDetailBody');

  const ccDetails = {
    'cc0': {
      title: "CC0 (Public Domain / Суспільне надбання)",
      text: "<strong>Максимальна свобода!</strong> Автор добровільно відмовився від усіх авторських прав у всьому світі. Ви можете вільно копіювати, змінювати, поширювати та використовувати картинку в будь-яких цілях (навіть у комерційних) без жодних дозволів і без обов'язкового зазначення авторства (хоча сказати «дякую» автору — гарний тон)."
    },
    'cc-by': {
      title: "CC BY (Attribution / Зазначення авторства)",
      text: "<strong>Золотий стандарт відкритих знань!</strong> Ви можете робити з файлом що завгодно (змінювати, використовувати у комерційних проєктах, поєднувати з іншими роботами). <strong>Єдина вимога:</strong> ви зобов'язані вказати ім'я автора, назву твору, дати посилання на джерело та саму ліцензію CC BY."
    },
    'cc-by-sa': {
      title: "CC BY-SA (ShareAlike / Поширення на тих же умовах)",
      text: "<strong>Правило Вікіпедії!</strong> Ви повинні зазначити автора твору. Крім того, якщо ви видозмінюєте зображення, обрізаєте його або робите на його основі новий колаж — ваш новий твір повинен обов'язково розповсюджуватися під цією ж вільною ліцензією (ShareAlike)."
    },
    'cc-by-nc': {
      title: "CC BY-NC (NonCommercial / Некомерційне використання)",
      text: "<strong>Лише для навчання та некомерційних цілей!</strong> Зображення можна вільно використовувати в учнівських сайтах, шкільних презентаціях чи некомерційних блогах із зазначенням автора. <strong>Заборонено:</strong> використовувати це зображення для отримання прямого або непрямого прибутку (продаж товарів, реклама)."
    },
    'cc-by-nd': {
      title: "CC BY-ND (NoDerivatives / Без похідних творів)",
      text: "<strong>Лише в оригінальному вигляді!</strong> Ви можете вільно ділитися цим зображенням і розміщувати його на сайті із зазначенням авторства, але <strong>суворо заборонено будь-які зміни</strong>: не можна кадрувати, міняти кольори, накладати фільтри чи використовувати як частину колажу."
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const key = card.dataset.cc;
      const data = ccDetails[key];

      if (detailModal && data) {
        if (detailTitle) detailTitle.innerHTML = data.title;
        if (detailBody) detailBody.innerHTML = data.text;
        detailModal.classList.add('show');
        if (typeof detailModal.scrollIntoView === 'function') {
          detailModal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. РЕЖИМ «НА ВЕСЬ ЕКРАН» ДЛЯ ЛАБОРАТОРІЇ (FULLSCREEN LAB)
   -------------------------------------------------------------------------- */
function initLabFullscreen() {
  const labBox = document.getElementById('graphicsLabBox');
  const fsBtn = document.getElementById('labFullscreenBtn');
  if (!labBox || !fsBtn) return;

  function toggleFullscreen(forceState) {
    const isFs = typeof forceState === 'boolean'
      ? forceState
      : !labBox.classList.contains('is-fullscreen');

    labBox.classList.toggle('is-fullscreen', isFs);
    document.body.classList.toggle('sandbox-fullscreen-active', isFs);

    const iconEl = fsBtn.querySelector('.fs-icon');
    const labelEl = fsBtn.querySelector('.fs-label');

    if (isFs) {
      if (iconEl) iconEl.textContent = '✕';
      if (labelEl) labelEl.textContent = 'Згорнути';
      fsBtn.title = 'Згорнути у звичайний вигляд (Esc)';
    } else {
      if (iconEl) iconEl.textContent = '⛶';
      if (labelEl) labelEl.textContent = 'На весь екран';
      fsBtn.title = 'Розгорнути лабораторію на весь екран (Esc для виходу)';
    }
  }

  fsBtn.addEventListener('click', () => toggleFullscreen());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && labBox.classList.contains('is-fullscreen')) {
      toggleFullscreen(false);
    }
  });

  return { toggle: toggleFullscreen };
}