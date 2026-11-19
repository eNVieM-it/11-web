/**
 * ==========================================================================
 * УРОК 9: АНІМАЦІЙНІ ЕФЕКТИ ТА ПЕРЕХОДИ (css-animations.html)
 * Інтерактивні модулі:
 * 1. Hero-демонстратор живих CSS-ефектів без JavaScript
 * 2. Клік-активація карток 4 функцій transform (для сенсорних екранів)
 * 3. Забіг функцій часу (Timing Functions Race: linear, ease, ease-in, ease-out, ease-in-out)
 * 4. Інтерактивний довідник 8 властивостей animation-* (за підручником с. 91–94)
 * 5. CSS Animation Studio (3 вкладки + режим «На весь екран»):
 *    - Вкладка 1: Конструктор transform + transition із пресетами
 *    - Вкладка 2: Студія @keyframes та animation (Play/Pause, напрямок, повтори)
 *    - Вкладка 3: Жива галерея hover-ефектів (Практична №8)
 * 6. Практикум (Жива пісочниця HTML + CSS із автоперевіркою 5 критеріїв)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimationDemo();
  initTransformCardsTap();
  initEasingRace();
  initAnimPropsExplorer();
  initAnimStudioTabs();
  initTransitionStudio();
  initKeyframesStudio();
  initHoverGalleryStudio();
  initAnimStudioFullscreen();
  initAnimationPracticumSandbox();
});

/* --------------------------------------------------------------------------
   1. HERO-ДЕМОНСТРАТОР: 3 ЖИВІ РЕЖИМИ БЕЗ JAVASCRIPT
   -------------------------------------------------------------------------- */
const HERO_DEMO_MODES = {
  hover: {
    cls: 'demo-hover',
    label: 'НАВЕДИ / КЛІК',
    hint: 'Наведіть курсор на блок або клікніть по ньому, щоб побачити плавний transition:',
    code: '.card {\n  transition: transform 0.35s ease, border-radius 0.35s ease;\n}\n.card:hover {\n  transform: translateY(-10px) scale(1.14) rotate(8deg);\n  border-radius: 26px;\n}'
  },
  pulse: {
    cls: 'demo-pulse',
    label: 'PULSE',
    hint: 'Плавне мерехтіння через @keyframes та opacity (приклад із підручника, с. 91):',
    code: '.badge {\n  animation: pulse 2s ease-in-out infinite;\n}\n@keyframes pulse {\n  0%, 100% { transform: scale(0.92); opacity: 0.45; }\n  50% { transform: scale(1.12); opacity: 1; }\n}'
  },
  spin: {
    cls: 'demo-spin',
    label: 'SPIN 360°',
    hint: 'Циклічне обертання туди й назад (alternate) — ідея з Практичної роботи №8:',
    code: '.square {\n  animation: spin 3s linear infinite alternate;\n}\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  50% { border-radius: 50%; }\n  100% { transform: rotate(360deg); }\n}'
  }
};

function initHeroAnimationDemo() {
  const btns = document.querySelectorAll('.hero-demo-btn');
  const target = document.getElementById('heroDemoTarget');
  const hintEl = document.getElementById('heroDemoHint');
  const codeEl = document.getElementById('heroDemoCode');
  if (!btns.length || !target) return;

  function applyMode(key) {
    const mode = HERO_DEMO_MODES[key] || HERO_DEMO_MODES.hover;
    target.className = 'hero-demo-target ' + mode.cls;
    target.textContent = mode.label;
    if (hintEl) hintEl.textContent = mode.hint;
    if (codeEl) codeEl.textContent = mode.code;

    btns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-demo') === key));
  }

  btns.forEach((btn) => {
    btn.addEventListener('click', () => applyMode(btn.getAttribute('data-demo')));
  });

  target.addEventListener('click', () => {
    if (target.classList.contains('demo-hover')) {
      target.classList.toggle('is-demo-active');
    }
  });

  applyMode('hover');
}

/* --------------------------------------------------------------------------
   2. КЛІК-ПЕРЕМИКАННЯ 4 КАРТОК TRANSFORM (ДЛЯ МОБІЛЬНИХ ТА САМОПЕРЕВІРКИ)
   -------------------------------------------------------------------------- */
function initTransformCardsTap() {
  const cards = document.querySelectorAll('.transform-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-active');
    });
  });
}

/* --------------------------------------------------------------------------
   3. ЗАБІГ ФУНКЦІЙ ЧАСУ (TIMING FUNCTIONS RACE)
   -------------------------------------------------------------------------- */
function initEasingRace() {
  const startBtn = document.getElementById('easingRaceStartBtn');
  const tracks = document.getElementById('easingRaceTracks');
  const statusEl = document.getElementById('easingRaceStatus');
  if (!startBtn || !tracks) return;

  let finished = false;

  startBtn.addEventListener('click', () => {
    finished = !finished;
    tracks.classList.toggle('is-racing', finished);
    startBtn.textContent = finished ? '↺ ПОВЕРНУТИ НА СТАРТ' : '🏁 СТАРТ ЗАБІГУ (2 СЕК)';
    if (statusEl) {
      statusEl.textContent = finished
        ? 'Усі 5 кульок рухаються рівно 2 секунди — порівняйте старт і гальмування на фініші!'
        : 'Готові до старту! Натисніть кнопку, щоб порівняти 5 кривих швидкості.';
    }
  });
}

/* --------------------------------------------------------------------------
   4. ІНТЕРАКТИВНИЙ ДОВІДНИК 8 ВЛАСТИВОСТЕЙ ANIMATION-* (ПІДРУЧНИК С. 91–94)
   -------------------------------------------------------------------------- */
const ANIM_PROPS_CATALOG = {
  'animation-name': {
    title: 'animation-name — Ім’я сценарію @keyframes',
    badge: 'Обов’язкова властивість №1',
    desc: 'Пов’язує HTML-елемент із конкретним правилом @keyframes. Назва має точно збігатися (регістр літер важливий, без пробілів — наприклад, spin або fadeIn).',
    code: 'animation-name: spin;\n/* Має відповідати @keyframes spin { ... } */'
  },
  'animation-duration': {
    title: 'animation-duration — Тривалість одного циклу',
    badge: 'Обов’язкова властивість №2 (інакше 0s!)',
    desc: 'Визначає, скільки секунд (s) або мілісекунд (ms) триває одне повне проходження від 0% до 100%. Від’ємних значень не буває. За замовчуванням 0s — тому без цієї властивості анімація не запуститься!',
    code: 'animation-duration: 4s;\n/* або 400ms для коротких мікроанімацій */'
  },
  'animation-timing-function': {
    title: 'animation-timing-function — Динаміка (прискорення)',
    badge: 'linear | ease | ease-in | ease-out | ease-in-out',
    desc: 'Задає характер швидкості руху між ключовими кадрами: linear — рівномірно; ease — плавний розгін і м’яке гальмування; ease-in — повільний старт; ease-out — швидкий старт і м’яка зупинка.',
    code: 'animation-timing-function: ease-out;'
  },
  'animation-delay': {
    title: 'animation-delay — Пауза перед стартом',
    badge: 'Затримка в секундах або мс',
    desc: 'Задає паузу між моментом появи елемента і початком анімації. Зручно для почергової появи карток (наприклад, 0.1s, 0.2s, 0.3s).',
    code: 'animation-delay: 0.5s;'
  },
  'animation-iteration-count': {
    title: 'animation-iteration-count — Кількість повторень',
    badge: 'Ціле число або infinite',
    desc: 'Скільки разів повторити анімацію. Можна задати конкретне число (1, 2, 3) або ключове слово infinite — нескінченне повторення (як для індикаторів завантаження).',
    code: 'animation-iteration-count: infinite;\n/* або animation-iteration-count: 3; */'
  },
  'animation-direction': {
    title: 'animation-direction — Напрямок відтворення',
    badge: 'normal | reverse | alternate | alternate-reverse',
    desc: 'Керує напрямком проходження кадрів: normal (0%→100%), reverse (100%→0%), alternate (туди й назад, без різкого стрибка на старт!), alternate-reverse (назад, потім вперед).',
    code: 'animation-direction: alternate;'
  },
  'animation-fill-mode': {
    title: 'animation-fill-mode — Стан до старту і після фінішу',
    badge: 'none | forwards | backwards | both',
    desc: 'Визначає, що станеться з елементом після завершення анімації: none — повернеться у початковий стан; forwards — залишиться у фінальному кадрі (100%); both — застосовує і стартовий, і фінальний кадри.',
    code: 'animation-fill-mode: forwards;'
  },
  'animation-play-state': {
    title: 'animation-play-state — Пауза та відтворення',
    badge: 'running | paused',
    desc: 'Дозволяє зупиняти та відновлювати анімацію в будь-якій точці без скидання на початок. Часто ставлять paused при наведенні (:hover) на біжучий рядок чи карусель.',
    code: '.marquee:hover {\n  animation-play-state: paused;\n}'
  }
};

function initAnimPropsExplorer() {
  const chips = document.querySelectorAll('.anim-prop-chip');
  const titleEl = document.getElementById('animPropTitle');
  const badgeEl = document.getElementById('animPropBadge');
  const descEl = document.getElementById('animPropDesc');
  const codeEl = document.getElementById('animPropCode');
  if (!chips.length || !titleEl || !descEl || !codeEl) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const key = chip.getAttribute('data-prop') || 'animation-name';
      const info = ANIM_PROPS_CATALOG[key] || ANIM_PROPS_CATALOG['animation-name'];
      titleEl.textContent = info.title;
      if (badgeEl) badgeEl.textContent = info.badge;
      descEl.textContent = info.desc;
      codeEl.textContent = info.code;
    });
  });
}

/* --------------------------------------------------------------------------
   5. ПЕРЕМИКАННЯ ВКЛАДОК CSS ANIMATION STUDIO
   -------------------------------------------------------------------------- */
function initAnimStudioTabs() {
  const tabBtns = document.querySelectorAll('.astudio-tab-btn');
  const panels = document.querySelectorAll('.astudio-panel');
  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach((p) => p.classList.toggle('active', p.id === targetId));
    });
  });
}

/* --------------------------------------------------------------------------
   6. ВКЛАДКА 1: КОНСТРУКТОР TRANSFORM + TRANSITION
   -------------------------------------------------------------------------- */
const TRANSITION_PRESETS = {
  textbook: { tx: 0, ty: 0, scale: 1.0, rotate: 90, radius: 50, dur: 1.0, timing: 'ease', bg: '#2563eb' },
  lift: { tx: 0, ty: -18, scale: 1.08, rotate: 0, radius: 14, dur: 0.35, timing: 'ease-out', bg: '#10b981' },
  zoom: { tx: 0, ty: 0, scale: 1.25, rotate: -6, radius: 18, dur: 0.4, timing: 'ease-in-out', bg: '#7c3aed' }
};

function initTransitionStudio() {
  const box = document.getElementById('studioTransformBox');
  const hoverChk = document.getElementById('studioSimulateHover');
  const slTx = document.getElementById('trTranslateX');
  const slTy = document.getElementById('trTranslateY');
  const slScale = document.getElementById('trScale');
  const slRotate = document.getElementById('trRotate');
  const slRadius = document.getElementById('trRadius');
  const slDur = document.getElementById('trDuration');
  const selTiming = document.getElementById('trTiming');
  const codeOut = document.getElementById('transitionLiveCss');
  const copyBtn = document.getElementById('copyTransitionCssBtn');
  const presetBtns = document.querySelectorAll('.tr-preset-btn');

  if (!box || !slRotate || !codeOut) return;

  let activeColor = '#2563eb';
  let isHovered = false;

  function renderTransition() {
    const tx = parseInt(slTx.value, 10) || 0;
    const ty = parseInt(slTy.value, 10) || 0;
    const scale = parseFloat(slScale.value) || 1;
    const rotate = parseInt(slRotate.value, 10) || 0;
    const radius = parseInt(slRadius.value, 10) || 0;
    const dur = parseFloat(slDur.value) || 0.5;
    const timing = selTiming ? selTiming.value : 'ease';
    const showHover = isHovered || (hoverChk && hoverChk.checked);

    const valMap = {
      trTranslateXVal: tx + 'px',
      trTranslateYVal: ty + 'px',
      trScaleVal: scale.toFixed(2),
      trRotateVal: rotate + 'deg',
      trRadiusVal: radius + '%',
      trDurationVal: dur.toFixed(2) + 's'
    };
    Object.keys(valMap).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = valMap[id];
    });

    const parts = [];
    if (tx !== 0 || ty !== 0) parts.push(`translate(${tx}px, ${ty}px)`);
    if (scale !== 1) parts.push(`scale(${scale.toFixed(2)})`);
    if (rotate !== 0) parts.push(`rotate(${rotate}deg)`);
    const transformStr = parts.length ? parts.join(' ') : 'none';

    box.style.transition = `transform ${dur}s ${timing}, border-radius ${dur}s ${timing}, background-color ${dur}s ${timing}`;
    if (showHover) {
      box.style.transform = transformStr;
      box.style.borderRadius = radius + '%';
      box.style.backgroundColor = activeColor;
      box.innerHTML = '<span>:hover</span><small style="font-size:0.7rem; opacity:0.9;">АКТИВНО</small>';
    } else {
      box.style.transform = 'none';
      box.style.borderRadius = '10px';
      box.style.backgroundColor = '#820202';
      box.innerHTML = '<span>.one</span><small style="font-size:0.7rem; opacity:0.85;">НАВЕДИ</small>';
    }

    codeOut.textContent =
`.one {
  width: 120px;
  height: 120px;
  background-color: #820202;
  border-radius: 10px;
  transition: transform ${dur}s ${timing}, border-radius ${dur}s ${timing}, background-color ${dur}s ${timing};
}

.one:hover {
  transform: ${transformStr};
  border-radius: ${radius}%;
  background-color: ${activeColor};
}`;
  }

  [hoverChk, slTx, slTy, slScale, slRotate, slRadius, slDur, selTiming].forEach((ctrl) => {
    if (ctrl) {
      ctrl.addEventListener('input', renderTransition);
      ctrl.addEventListener('change', renderTransition);
    }
  });

  box.addEventListener('mouseenter', () => { isHovered = true; renderTransition(); });
  box.addEventListener('mouseleave', () => { isHovered = false; renderTransition(); });
  box.addEventListener('click', () => {
    if (hoverChk) {
      hoverChk.checked = !hoverChk.checked;
      renderTransition();
    }
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preset');
      const p = TRANSITION_PRESETS[key];
      if (!p) return;
      slTx.value = p.tx;
      slTy.value = p.ty;
      slScale.value = p.scale;
      slRotate.value = p.rotate;
      slRadius.value = p.radius;
      slDur.value = p.dur;
      if (selTiming) selTiming.value = p.timing;
      activeColor = p.bg;
      if (hoverChk) hoverChk.checked = true;
      presetBtns.forEach((b) => b.classList.toggle('active', b === btn));
      renderTransition();
    });
  });

  if (copyBtn && typeof SandboxUI !== 'undefined') {
    SandboxUI.initCopyButton(copyBtn, codeOut);
  }

  renderTransition();
}

/* --------------------------------------------------------------------------
   7. ВКЛАДКА 2: СТУДІЯ @KEYFRAMES ТА ANIMATION
   -------------------------------------------------------------------------- */
const KEYFRAMES_SCENARIOS = {
  spin: {
    animName: 'kfSpinTextbook',
    displayName: 'spin',
    label: '.square',
    keyframesCode:
`@keyframes spin {
  0%   { transform: rotate(0deg); background-color: #123456; }
  25%  { background-color: #facc15; }
  100% { transform: rotate(360deg); background-color: #2563eb; }
}`
  },
  pulse: {
    animName: 'kfPulseOpacity',
    displayName: 'simpleAnimation',
    label: 'OPACITY',
    keyframesCode:
`@keyframes simpleAnimation {
  0%   { opacity: 0.15; transform: scale(0.9); }
  50%  { opacity: 1; transform: scale(1.12); }
  100% { opacity: 0.15; transform: scale(0.9); }
}`
  },
  bounce: {
    animName: 'kfBounceBall',
    displayName: 'bounceBall',
    label: 'BOUNCE',
    keyframesCode:
`@keyframes bounceBall {
  0%, 100% { transform: translateY(34px) scaleY(0.88); border-radius: 50%; }
  50%      { transform: translateY(-48px) scaleY(1.06); border-radius: 50%; }
}`
  },
  float: {
    animName: 'kfFloatCard',
    displayName: 'floatCard',
    label: 'FLOAT',
    keyframesCode:
`@keyframes floatCard {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%      { transform: translateY(-24px) rotate(2deg); }
}`
  }
};

function initKeyframesStudio() {
  const actor = document.getElementById('kfStudioActor');
  const selPreset = document.getElementById('kfPresetSelect');
  const slDur = document.getElementById('kfDurationRange');
  const selTiming = document.getElementById('kfTimingSelect');
  const selIter = document.getElementById('kfIterationSelect');
  const selDir = document.getElementById('kfDirectionSelect');
  const slDelay = document.getElementById('kfDelayRange');
  const togglePlayBtn = document.getElementById('kfPlayPauseBtn');
  const restartBtn = document.getElementById('kfRestartBtn');
  const codeOut = document.getElementById('kfLiveCssCode');
  const copyBtn = document.getElementById('copyKfCssBtn');

  if (!actor || !selPreset || !codeOut) return;

  let isPaused = false;

  function applyKeyframes() {
    const scenario = KEYFRAMES_SCENARIOS[selPreset.value] || KEYFRAMES_SCENARIOS.spin;
    const dur = parseFloat(slDur.value) || 4;
    const timing = selTiming ? selTiming.value : 'linear';
    const iter = selIter ? selIter.value : 'infinite';
    const dir = selDir ? selDir.value : 'alternate';
    const delay = slDelay ? (parseFloat(slDelay.value) || 0) : 0;

    const durLabel = document.getElementById('kfDurationVal');
    const delayLabel = document.getElementById('kfDelayVal');
    if (durLabel) durLabel.textContent = dur.toFixed(1) + 's';
    if (delayLabel) delayLabel.textContent = delay.toFixed(1) + 's';

    actor.textContent = scenario.label;
    actor.style.animationName = scenario.animName;
    actor.style.animationDuration = dur + 's';
    actor.style.animationTimingFunction = timing;
    actor.style.animationDelay = delay + 's';
    actor.style.animationIterationCount = iter;
    actor.style.animationDirection = dir;
    actor.style.animationFillMode = 'both';
    actor.style.animationPlayState = isPaused ? 'paused' : 'running';

    if (togglePlayBtn) {
      togglePlayBtn.textContent = isPaused ? '▶ Продовжити' : '⏸ Пауза';
    }

    codeOut.textContent =
`.element {
  animation: ${scenario.displayName} ${dur}s ${timing} ${delay}s ${iter} ${dir};
  animation-play-state: ${isPaused ? 'paused' : 'running'};
}

${scenario.keyframesCode}`;
  }

  [selPreset, slDur, selTiming, selIter, selDir, slDelay].forEach((ctrl) => {
    if (ctrl) {
      ctrl.addEventListener('input', applyKeyframes);
      ctrl.addEventListener('change', applyKeyframes);
    }
  });

  if (togglePlayBtn) {
    togglePlayBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      applyKeyframes();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      isPaused = false;
      actor.style.animationName = 'none';
      void actor.offsetWidth; // примусовий перезапуск анімації
      applyKeyframes();
    });
  }

  if (copyBtn && typeof SandboxUI !== 'undefined') {
    SandboxUI.initCopyButton(copyBtn, codeOut);
  }

  applyKeyframes();
}

/* --------------------------------------------------------------------------
   8. ВКЛАДКА 3: ЖИВА ГАЛЕРЕЯ HOVER-ЕФЕКТІВ (ПРАКТИЧНА №8)
   -------------------------------------------------------------------------- */
function initHoverGalleryStudio() {
  const durRange = document.getElementById('galleryHoverDur');
  const durVal = document.getElementById('galleryHoverDurVal');
  const clipChk = document.getElementById('galleryOverflowClip');
  const grid = document.getElementById('hoverGalleryGrid');
  const frames = document.querySelectorAll('.hover-gallery-frame');

  if (!grid || !durRange) return;

  function updateGallery() {
    const dur = parseFloat(durRange.value) || 0.35;
    if (durVal) durVal.textContent = dur.toFixed(2) + 's';
    grid.style.setProperty('--gallery-dur', dur + 's');

    const clip = clipChk ? clipChk.checked : true;
    frames.forEach((f) => f.classList.toggle('no-clip', !clip));
  }

  durRange.addEventListener('input', updateGallery);
  if (clipChk) clipChk.addEventListener('change', updateGallery);
  updateGallery();
}

/* --------------------------------------------------------------------------
   9. РЕЖИМ «НА ВЕСЬ ЕКРАН» ДЛЯ CSS ANIMATION STUDIO
   -------------------------------------------------------------------------- */
function initAnimStudioFullscreen() {
  const box = document.getElementById('animStudioBox');
  const btn = document.getElementById('studioFullscreenBtn');
  const label = document.getElementById('studioFullscreenLabel');
  if (!box || !btn) return;

  function setState(active) {
    box.classList.toggle('is-fullscreen', active);
    document.body.classList.toggle('sandbox-fullscreen-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (label) label.textContent = active ? 'Згорнути' : 'На весь екран';
  }

  btn.addEventListener('click', () => setState(!box.classList.contains('is-fullscreen')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && box.classList.contains('is-fullscreen')) {
      setState(false);
    }
  });
}

/* --------------------------------------------------------------------------
   10. ПРАКТИКУМ: ЖИВА ПІСОЧНИЦЯ HTML + CSS ІЗ АВТОЧЕК-ЛІСТОМ (ПРАКТИЧНА №8)
   -------------------------------------------------------------------------- */
const PRAC_DEFAULT_HTML = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Практична робота №8</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h2>Наведіть на квадрат .one або спостерігайте за .square:</h2>
  <div class="stage">
    <div class="one">Наведи (.one)</div>
    <div class="square">.square</div>
  </div>
  <div class="gallery-item">
    <div class="photo-card">📸 Фото галереї (hover)</div>
  </div>
</body>
</html>`;

const PRAC_DEFAULT_CSS = `body {
  font-family: system-ui, sans-serif;
  background: #fbf9f4;
  color: #111318;
  padding: 20px;
  text-align: center;
}
.stage {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 36px;
  margin: 24px 0;
  flex-wrap: wrap;
}

/* Завдання 1: Тренувальна вправа .one (с. 95 підручника) */
.one {
  width: 130px;
  height: 130px;
  background: #820202;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition-duration: 0.5s;
  transform: rotate(0deg);
}
.one:hover {
  transform: rotate(90deg);
  transition-duration: 1s;
  background: #2563eb;
  border-radius: 50%;
}

/* Завдання 2: Обертання .square через @keyframes (с. 96) */
.square {
  width: 90px;
  height: 90px;
  background-color: #123456;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  animation-name: spin;
  animation-duration: 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes spin {
  0%   { transform: rotate(0deg); }
  25%  { background-color: #facc15; color: #111; }
  100% { transform: rotate(360deg); }
}

/* Завдання 3: Збільшення фото у галереї при наведенні */
.photo-card {
  display: inline-block;
  padding: 18px 28px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: #fff;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  transform: scale(0.95);
  transition: transform 0.3s ease;
}
.photo-card:hover {
  transform: scale(1.08);
}`;

const PRAC_HINT_SNIPPETS = {
  task1: `/* Підказка до Завдання 1 (.one:hover) */
body { font-family: system-ui, sans-serif; padding: 24px; text-align: center; background: #fbf9f4; }
.stage { display: flex; justify-content: center; margin-top: 24px; }
.square, .gallery-item { display: none; }

.one {
  width: 150px;
  height: 150px;
  background: #820202;
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-duration: 0.5s;
  transform: rotate(0deg);
  cursor: pointer;
}
.one:hover {
  transform: rotate(90deg);
  transition-duration: 1s;
  background: #2563eb;
  border-radius: 50%;
}`,
  task2: `/* Підказка до Завдання 2 (@keyframes spin для .square) */
body { font-family: system-ui, sans-serif; padding: 24px; text-align: center; background: #fbf9f4; }
.stage { display: flex; justify-content: center; margin-top: 36px; }
.one, .gallery-item { display: none; }

.square {
  width: 100px;
  height: 100px;
  background-color: #123456;
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 4s linear infinite alternate;
}
@keyframes spin {
  0%   { transform: rotate(0deg); }
  25%  { background-color: #facc15; color: #111; }
  100% { transform: rotate(360deg); }
}`,
  task3: `/* Підказка до Завдання 3 (Масштабування фото у галереї) */
body { font-family: system-ui, sans-serif; padding: 24px; text-align: center; background: #fbf9f4; }
.stage { display: none; }

.photo-card {
  display: inline-block;
  margin-top: 24px;
  padding: 28px 42px;
  background: linear-gradient(135deg, #10b981, #2563eb);
  color: #ffffff;
  font-weight: 800;
  border-radius: 14px;
  border: 3px solid #111318;
  cursor: pointer;
  transform: scale(0.95);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.photo-card:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}`
};

function initAnimationPracticumSandbox() {
  const codeArea = document.getElementById('animSandboxCodeArea');
  const iframe = document.getElementById('animSandboxIframe');
  const tabCssBtn = document.getElementById('animTabCssBtn');
  const tabHtmlBtn = document.getElementById('animTabHtmlBtn');
  const runBtn = document.getElementById('animSandboxRunBtn');
  const resetBtn = document.getElementById('animSandboxResetBtn');
  const copyBtn = document.getElementById('animSandboxCopyBtn');
  const scoreBadge = document.getElementById('pracValidatorBadge');
  const hintBtns = document.querySelectorAll('.prac-hint-btn');

  if (!codeArea || !iframe) return;

  let currentTab = 'css';
  let storedHtml = PRAC_DEFAULT_HTML;
  let storedCss = PRAC_DEFAULT_CSS;
  let debounceTimer = null;

  function validateCss(css) {
    const checks = [
      { id: 'chkTransition', ok: /transition(-duration)?\s*:/i.test(css) },
      { id: 'chkHoverTransform', ok: /:hover[\s\S]*?transform\s*:/i.test(css) },
      { id: 'chkKeyframes', ok: /@keyframes\s+[a-zA-Z0-9_-]+/i.test(css) },
      { id: 'chkAnimationProp', ok: /animation(-name)?\s*:/i.test(css) && /(animation\s*:|animation-duration\s*:)/i.test(css) },
      { id: 'chkLoopOrDir', ok: /\b(infinite|alternate|alternate-reverse)\b/i.test(css) }
    ];

    let passed = 0;
    checks.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) {
        el.classList.toggle('passed', c.ok);
        const icon = el.querySelector('.chk-icon');
        if (icon) icon.textContent = c.ok ? '✅' : '⬜';
      }
      if (c.ok) passed++;
    });

    if (scoreBadge) {
      scoreBadge.textContent = `Перевірка коду: ${passed}/5`;
      scoreBadge.className = passed === 5 ? 'badge badge-green' : 'badge badge-yellow';
    }
  }

  function renderSandbox() {
    let html = storedHtml;
    if (/<link[^>]*href=["']style\.css["'][^>]*>/i.test(html)) {
      html = html.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, `<style>\n${storedCss}\n</style>`);
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>\n${storedCss}\n</style>\n</head>`);
    } else {
      html = `<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8"><style>${storedCss}</style></head><body>${html}</body></html>`;
    }

    if (typeof SandboxUI !== 'undefined' && SandboxUI.renderPreview) {
      SandboxUI.renderPreview(iframe, html);
    } else {
      iframe.srcdoc = html;
    }
    validateCss(storedCss);
  }

  function syncFromEditor() {
    if (currentTab === 'css') storedCss = codeArea.value;
    else storedHtml = codeArea.value;
  }

  function switchTab(tab) {
    syncFromEditor();
    currentTab = tab;
    codeArea.value = tab === 'css' ? storedCss : storedHtml;
    if (tabCssBtn) tabCssBtn.classList.toggle('active', tab === 'css');
    if (tabHtmlBtn) tabHtmlBtn.classList.toggle('active', tab === 'html');
  }

  if (tabCssBtn) tabCssBtn.addEventListener('click', () => switchTab('css'));
  if (tabHtmlBtn) tabHtmlBtn.addEventListener('click', () => switchTab('html'));

  codeArea.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      syncFromEditor();
      renderSandbox();
    }, 300);
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      syncFromEditor();
      renderSandbox();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      storedHtml = PRAC_DEFAULT_HTML;
      storedCss = PRAC_DEFAULT_CSS;
      codeArea.value = currentTab === 'css' ? storedCss : storedHtml;
      renderSandbox();
    });
  }

  if (copyBtn && typeof SandboxUI !== 'undefined') {
    SandboxUI.initCopyButton(copyBtn, () => {
      syncFromEditor();
      return currentTab === 'css' ? storedCss : storedHtml;
    });
  }

  hintBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-hint');
      if (!PRAC_HINT_SNIPPETS[key]) return;
      storedHtml = PRAC_DEFAULT_HTML;
      storedCss = PRAC_HINT_SNIPPETS[key];
      currentTab = 'css';
      codeArea.value = storedCss;
      if (tabCssBtn) tabCssBtn.classList.add('active');
      if (tabHtmlBtn) tabHtmlBtn.classList.remove('active');
      renderSandbox();
    });
  });

  if (typeof SandboxUI !== 'undefined' && SandboxUI.initFullscreen) {
    SandboxUI.initFullscreen({
      containerId: 'animSandboxContainer',
      buttonId: 'animSandboxFullscreenBtn',
      extraLaunchIds: [],
      hasTasksDrawer: false
    });
  }

  codeArea.value = storedCss;
  renderSandbox();
}
