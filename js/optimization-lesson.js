/* ==========================================================================
   УРОК 6: КРОСБРАУЗЕРНІСТЬ ТА ОПТИМІЗАЦІЯ • ІНТЕРАКТИВНІ МОДУЛІ
   Спільне ядро інтерфейсу — у js/core.js
   Спільні утиліти пісочниць — у js/sandbox.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Блок 1: Лабораторія браузерних рушіїв (Raw User Agent vs Normalize/Reset)
  initEngineComparisonLab();

  // Блок 2: Симулятор перевірки підтримки CSS (@supports та fallback)
  initCssSupportSimulator();

  // Блок 3: Калькулятор ваги сторінки та швидкодії (Lighthouse Score)
  initPerformanceCalculator();

  // Блок 4: Мініфікатор коду в реальному часі
  initCodeMinifier();

  // Блок 5: Практикум у пісочниці з живим чек-листом
  initOptimizationSandbox();

  console.log('🚀 Урок 6 (Кросбраузерність та оптимізація) успішно ініціалізовано!');
});

/** -------------------------------------------------------------------------
 * БЛОК 1: ЛАБОРАТОРІЯ БРАУЗЕРІВ (RAW USER-AGENT VS RESET/NORMALIZE)
 * ------------------------------------------------------------------------ */
function initEngineComparisonLab() {
  const btnRaw = document.getElementById('btnRawStyles');
  const btnReset = document.getElementById('btnResetStyles');
  const viewport = document.getElementById('browserLabViewport');
  const infoText = document.getElementById('browserLabInfoText');

  if (!btnRaw || !btnReset || !viewport) return;

  function setMode(mode) {
    if (mode === 'raw') {
      viewport.className = 'browser-lab-viewport mode-raw';
      btnRaw.classList.add('active');
      btnReset.classList.remove('active');
      btnRaw.setAttribute('aria-pressed', 'true');
      btnReset.setAttribute('aria-pressed', 'false');

      if (infoText) {
        infoText.innerHTML = '⚠️ <strong>Сирі стилі рушія (User Agent):</strong> відступ <code>body: 8px</code> створює щілини по краях, шрифт за замовчуванням — <code>Times New Roman</code>, кнопка має сіру рельєфну рамку 90-х років, списки мають відступи <code>40px</code>.';
      }
    } else {
      viewport.className = 'browser-lab-viewport mode-reset';
      btnReset.classList.add('active');
      btnRaw.classList.remove('active');
      btnReset.setAttribute('aria-pressed', 'true');
      btnRaw.setAttribute('aria-pressed', 'false');

      if (infoText) {
        infoText.innerHTML = '✅ <strong>З Normalize / CSS Reset:</strong> відступи <code>body: 0</code> скинуто, шрифт уніфіковано до читабельного <code>sans-serif</code>, кнопка оформлена за сучасним гайдлайном, рендеринг елементів на 100% однаковий у Chrome, Safari та Firefox.';
      }
    }
  }

  btnRaw.addEventListener('click', () => setMode('raw'));
  btnReset.addEventListener('click', () => setMode('reset'));
}

/** -------------------------------------------------------------------------
 * БЛОК 2: СИМУЛЯТОР @SUPPORTS ТА FALLBACK-СТИЛІВ
 * ------------------------------------------------------------------------ */
function initCssSupportSimulator() {
  const supportToggle = document.getElementById('supportToggle');
  const fallbackToggle = document.getElementById('fallbackToggle');
  const glassCard = document.getElementById('demoGlassCard');
  const codeBox = document.getElementById('supportsCodeBox');
  const explainBox = document.getElementById('supportsExplainBox');

  if (!supportToggle || !fallbackToggle || !glassCard) return;

  function updateSimulation() {
    const hasSupport = supportToggle.checked;
    const hasFallback = fallbackToggle.checked;

    glassCard.className = 'demo-glass-card';

    if (hasSupport) {
      glassCard.classList.add('has-support');
      if (explainBox) {
        explainBox.innerHTML = '🌟 <strong>Сучасний браузер:</strong> рушій підтримує <code>backdrop-filter: blur(14px)</code>. Картка має ефект матового скла (Glassmorphism), текст чудово читається завдяки розмиттю фону позаду.';
      }
    } else if (hasFallback) {
      glassCard.classList.add('no-support-fallback');
      if (explainBox) {
        explainBox.innerHTML = '🛡️ <strong>Застарілий браузер + Fallback:</strong> браузер не знає про <code>backdrop-filter</code>, але каскад застосував безпечний суцільний білий фон <code>background: #ffffff</code>. Текст залишається на 100% контрастним та читабельним!';
      }
    } else {
      glassCard.classList.add('no-support-broken');
      if (explainBox) {
        explainBox.innerHTML = '💥 <strong>КРИТИЧНА ПОМИЛКА:</strong> підтримки <code>backdrop-filter</code> немає, а fallback-фон верстальник забув написати! Картка стала повністю прозорою, текст наклався на строкатий фон і став абсолютно нечитабельним.';
      }
    }

    if (codeBox) {
      if (hasFallback) {
        codeBox.textContent = `.glass-card {
  /* 1. БЕЗПЕЧНИЙ ФОЛБЕК для старих браузерів: */
  background-color: #ffffff;
  color: #0f172a;

  /* 2. ПРОГРЕСИВНЕ ПОКРАЩЕННЯ через @supports: */
  @supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
}`;
      } else {
        codeBox.textContent = `/* ❌ НЕБЕЗПЕЧНИЙ КОД БЕЗ ФОЛБЕКУ: */
.glass-card {
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  /* Без фолбеку в старих браузерах фон буде прозорим! */
}`;
      }
    }
  }

  supportToggle.addEventListener('change', updateSimulation);
  fallbackToggle.addEventListener('change', updateSimulation);
  updateSimulation();
}

/** -------------------------------------------------------------------------
 * БЛОК 3: ІНТЕРАКТИВНИЙ КАЛЬКУЛЯТОР ВАГИ СТОРІНКИ ТА ШВИДКОДІЇ
 * ------------------------------------------------------------------------ */
function initPerformanceCalculator() {
  const selImg = document.getElementById('calcImgFormat');
  const selLazy = document.getElementById('calcLazy');
  const selScripts = document.getElementById('calcScripts');
  const selMinify = document.getElementById('calcMinify');

  const weightEl = document.getElementById('calcTotalWeight');
  const speed4GEl = document.getElementById('calcSpeed4G');
  const speed3GEl = document.getElementById('calcSpeed3G');
  const scoreEl = document.getElementById('calcScoreVal');
  const circleEl = document.getElementById('calcGaugeVal');

  if (!selImg || !selLazy || !selScripts || !selMinify) return;

  function recalculate() {
    // 1. Вага зображень (КБ)
    let imgWeight = 4200; // png
    if (selImg.value === 'jpeg') imgWeight = 1600;
    else if (selImg.value === 'webp') imgWeight = 220;
    else if (selImg.value === 'avif') imgWeight = 110;

    // Ліниве завантаження зменшує початкову вагу сторінки до 25% (лише перший екран)
    const isLazy = selLazy.value === 'on';
    const effectiveImgWeight = isLazy ? Math.round(imgWeight * 0.25) : imgWeight;

    // 2. Вага коду HTML+CSS+JS
    const isMinified = selMinify.value === 'on';
    const codeWeight = isMinified ? 45 : 320;

    const totalWeightKB = effectiveImgWeight + codeWeight;

    // 3. Час завантаження
    // 4G: ~25 Мбіт/с (3100 КБ/с) + RTT
    // 3G: ~1.5 Мбіт/с (180 КБ/с) + RTT
    let scriptDelay = 0;
    if (selScripts.value === 'head') scriptDelay = 1.4; // парсер блокується
    else if (selScripts.value === 'async') scriptDelay = 0.4;
    else if (selScripts.value === 'defer') scriptDelay = 0.05;

    const time4G = ((totalWeightKB / 3200) + scriptDelay).toFixed(2);
    const time3G = ((totalWeightKB / 190) + scriptDelay * 1.5).toFixed(2);

    // 4. Оцінка Lighthouse (0 - 100)
    let score = 100;
    // Штрафи за розмір
    if (totalWeightKB > 3500) score -= 45;
    else if (totalWeightKB > 1500) score -= 30;
    else if (totalWeightKB > 600) score -= 15;
    else if (totalWeightKB > 300) score -= 5;

    // Штрафи за блокування скриптами
    if (selScripts.value === 'head') score -= 25;
    else if (selScripts.value === 'async') score -= 10;

    // Штраф без lazy loading
    if (!isLazy && imgWeight > 500) score -= 15;

    // Штраф за немініфікований код
    if (!isMinified) score -= 10;

    score = Math.max(12, Math.min(score, 100));

    // Відображення результатів
    if (weightEl) {
      if (totalWeightKB >= 1024) {
        weightEl.textContent = (totalWeightKB / 1024).toFixed(2) + ' МБ';
      } else {
        weightEl.textContent = totalWeightKB + ' КБ';
      }
    }

    if (speed4GEl) speed4GEl.textContent = time4G + ' c';
    if (speed3GEl) speed3GEl.textContent = time3G + ' c';
    if (scoreEl) scoreEl.textContent = score;

    // Світлофор кольорів (Lighthouse: 90-100 зелений, 50-89 помаранчевий, 0-49 червоний)
    let scoreColor = '#22c55e'; // green
    if (score < 50) scoreColor = '#ef4444'; // red
    else if (score < 90) scoreColor = '#f59e0b'; // orange

    if (scoreEl) scoreEl.style.color = scoreColor;

    if (circleEl) {
      circleEl.style.stroke = scoreColor;
      // Довжина кола = 2 * PI * r = 2 * 3.14159 * 45 ≈ 283
      const circumference = 283;
      const offset = circumference - (score / 100) * circumference;
      circleEl.style.strokeDashoffset = offset;
    }
  }

  [selImg, selLazy, selScripts, selMinify].forEach(sel => {
    sel.addEventListener('change', recalculate);
  });

  recalculate();
}

/** -------------------------------------------------------------------------
 * БЛОК 4: РЕАЛ-ТАЙМ МІНІФІКАТОР КОДУ
 * ------------------------------------------------------------------------ */
function initCodeMinifier() {
  const inputEl = document.getElementById('minifierInput');
  const outputEl = document.getElementById('minifierOutput');
  const runBtn = document.getElementById('minifyRunBtn');
  const resetBtn = document.getElementById('minifyResetBtn');
  const copyBtn = document.getElementById('minifyCopyBtn');

  const origBytesEl = document.getElementById('origBytes');
  const minBytesEl = document.getElementById('minifiedBytes');
  const savingsEl = document.getElementById('savingsPercent');

  if (!inputEl || !outputEl) return;

  const DEFAULT_SAMPLE = `/* =======================================
   Стилі для картки товару та кнопки
   Автор: Учень 11 класу
   ======================================= */

.product-card {
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

/* Кнопка дії з плавним переходом */
.product-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #2563eb;
  color: #ffffff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.product-button:hover {
  background-color: #1d4ed8;
}`;

  function getByteSize(str) {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str).length;
    }
    return encodeURI(str).split(/%..|./).length - 1;
  }

  function minifyCode(code) {
    return code
      // Видаляємо коментарі /* ... */
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Видаляємо пробіли перед і після символів { } : ; ,
      .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
      // Видаляємо зайві пробіли та переноси рядків
      .replace(/\s+/g, ' ')
      // Забираємо останню непотрібну крапку з комою перед }
      .replace(/;\}/g, '}')
      .trim();
  }

  function updateMinification() {
    const raw = inputEl.value;
    const minified = minifyCode(raw);
    outputEl.value = minified;

    const rawSize = getByteSize(raw);
    const minSize = getByteSize(minified);
    const saved = rawSize > 0 ? Math.round(((rawSize - minSize) / rawSize) * 100) : 0;

    if (origBytesEl) origBytesEl.textContent = rawSize + ' Б';
    if (minBytesEl) minBytesEl.textContent = minSize + ' Б';
    if (savingsEl) savingsEl.textContent = '-' + saved + '%';
  }

  if (runBtn) runBtn.addEventListener('click', updateMinification);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      inputEl.value = DEFAULT_SAMPLE;
      updateMinification();
    });
  }

  if (copyBtn) {
    SandboxUI.initCopyButton(copyBtn, () => outputEl.value);
  }

  inputEl.addEventListener('input', () => {
    updateMinification();
  });

  inputEl.value = DEFAULT_SAMPLE;
  updateMinification();
}

/** -------------------------------------------------------------------------
 * БЛОК 5: ПРАКТИКУМ У ПІСОЧНИЦІ З АВТОВАЛІДАЦІЄЮ ЧЕК-ЛИСТА
 * ------------------------------------------------------------------------ */
function initOptimizationSandbox() {
  const codeArea = document.getElementById('sandboxCodeArea');
  const iframe = document.getElementById('sandboxIframe');
  const runBtn = document.getElementById('sandboxRunBtn');
  const resetBtn = document.getElementById('sandboxResetBtn');
  const copyBtn = document.getElementById('sandboxCopyBtn');

  const chkLazy = document.getElementById('chkItemLazy');
  const chkDimensions = document.getElementById('chkItemDimensions');
  const chkFallback = document.getElementById('chkItemFallback');
  const chkBoxSizing = document.getElementById('chkItemBoxSizing');

  if (!codeArea || !iframe) return;

  const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <style>
    /* ----------------------------------------------------
       ЗАВДАННЯ 1: Універсальний розмір блоків.
       Допишіть нижче між фігурними дужками: box-sizing: border-box;
       ---------------------------------------------------- */
    * {
      
    }

    body {
      font-family: sans-serif;
      padding: 20px;
      margin: 0;
      background-color: #f1f5f9;
    }

    .banner {
      /* --------------------------------------------------
         ЗАВДАННЯ 2: Запасний колір (Fallback) для старих пристроїв.
         Допишіть перед градієнтом рядок: background-color: #3b82f6;
         -------------------------------------------------- */
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .banner img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
  </style>
</head>
<body>

  <div class="banner">
    <h2>Оптимізована швидкісна картка</h2>
    <p>Виправте параметри картинки нижче та додайте запасний колір у CSS!</p>

    <!-- --------------------------------------------------
         ЗАВДАННЯ 3 і 4: Ліниве завантаження та фіксовані розміри.
         Додайте всередину тегу <img> три атрибути:
         loading="lazy" width="600" height="300"
         -------------------------------------------------- -->
    <img src="img/preview-lesson-1.png" alt="Веб-дизайн прев'ю">
  </div>

</body>
</html>`;

  function checkRequirements(code) {
    // 1. loading="lazy"
    const hasLazy = /loading=["']lazy["']/i.test(code);
    if (chkLazy) {
      chkLazy.classList.toggle('passed', hasLazy);
      const icon = chkLazy.querySelector('.opt-checklist-status');
      if (icon) icon.textContent = hasLazy ? '✓' : '1';
    }

    // 2. width="..." and height="..."
    const hasDimensions = /width=["']\d+["']/i.test(code) && /height=["']\d+["']/i.test(code);
    if (chkDimensions) {
      chkDimensions.classList.toggle('passed', hasDimensions);
      const icon = chkDimensions.querySelector('.opt-checklist-status');
      if (icon) icon.textContent = hasDimensions ? '✓' : '2';
    }

    // 3. Fallback background color before linear-gradient
    const hasFallback = /background-color:\s*#[0-9a-f]{3,6}|background-color:\s*[a-z]+/i.test(code);
    if (chkFallback) {
      chkFallback.classList.toggle('passed', hasFallback);
      const icon = chkFallback.querySelector('.opt-checklist-status');
      if (icon) icon.textContent = hasFallback ? '✓' : '3';
    }

    // 4. box-sizing: border-box
    const hasBoxSizing = /box-sizing\s*:\s*border-box/i.test(code);
    if (chkBoxSizing) {
      chkBoxSizing.classList.toggle('passed', hasBoxSizing);
      const icon = chkBoxSizing.querySelector('.opt-checklist-status');
      if (icon) icon.textContent = hasBoxSizing ? '✓' : '4';
    }

    // Якщо всі 4 завдання виконано — зараховуємо Урок 6 у прогрес курсу
    if (hasLazy && hasDimensions && hasFallback && hasBoxSizing) {
      try {
        const STORAGE_KEY = 'veb_course_completed_lessons';
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        if (!list.includes('06')) {
          list.push('06');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }
      } catch (err) {}
    }
  }

  function render() {
    const code = codeArea.value;
    SandboxUI.renderPreview(iframe, code);
    checkRequirements(code);
  }

  codeArea.value = DEFAULT_CODE;
  render();

  if (runBtn) runBtn.addEventListener('click', render);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      codeArea.value = DEFAULT_CODE;
      render();
    });
  }

  if (copyBtn) {
    SandboxUI.initCopyButton(copyBtn, () => codeArea.value);
  }

  let timer = null;
  codeArea.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(render, 400);
  });

  // Ініціалізація повноекранного режиму пісочниці
  SandboxUI.initFullscreen({
    closeIcon: '✖',
    closeLabel: 'Закрити',
    hasTasksDrawer: false
  });
}
