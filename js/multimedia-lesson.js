/**
 * ==========================================================================
 * УРОК 8: МУЛЬТИМЕДІА НА ВЕБ-СТОРІНКАХ (web-multimedia.html)
 * Інтерактивні модулі:
 * 1. Фільтрація матриці MIME-типів та кодеків
 * 2. Довідник атрибутів <video> та <audio>
 * 3. Web Multimedia Studio (3 вкладки + режим «На весь екран»):
 *    - Вкладка 1: Симулятор HTML5 Плеєра та Autoplay Policy
 *    - Вкладка 2: Тренажер відеогалереї (Практична робота №9 з підручника)
 *    - Вкладка 3: Конструктор семантичного медіа-коду з чек-лістом
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMimeMatrixFilter();
  initAttributeExplorer();
  initLiveAudioDemo();
  initMultimediaLabTabs();
  initPlayerSimulator();
  initGalleryTrainer();
  initMediaCodeBuilder();
  initSelfCheckProgress();
  initLabFullscreen();
});

/* --------------------------------------------------------------------------
   1. ФІЛЬТРАЦІЯ МАТРИЦІ MIME-ТИПІВ ТА КОДЕКІВ
   -------------------------------------------------------------------------- */
function initMimeMatrixFilter() {
  const buttons = document.querySelectorAll('.mime-filter-btn');
  const rows = document.querySelectorAll('.mime-row');
  if (!buttons.length || !rows.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      rows.forEach((row) => {
        const categories = (row.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          row.classList.remove('hidden-row');
        } else {
          row.classList.add('hidden-row');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. ІНТЕРАКТИВНИЙ ДОВІДНИК АТРИБУТІВ <video> ТА <audio>
   -------------------------------------------------------------------------- */
const ATTR_CATALOG = {
  controls: {
    title: 'controls — Панель керування плеєром',
    badge: 'Булевий атрибут · Обов’язковий для UX',
    desc: 'Додає стандартну панель керування браузера: кнопки пуску/паузи, смугу прокрутки часу, регулятор гучності та перемикач повноекранного режиму. Без нього користувач не зможе запустити чи зупинити медіафайл.',
    code: '<video src="video/lesson.mp4" controls width="640" height="360"></video>'
  },
  src: {
    title: 'src — Шлях або URL-адреса медіафайлу',
    badge: 'Базовий атрибут або тег <source>',
    desc: 'Вказує шлях до аудіо- чи відеофайлу. На практиці замість одиночного атрибута src у тезі <video> рекомендується використовувати вкладені теги <source> для каскаду форматів (WebM + MP4).',
    code: '<audio controls>\n  <source src="audio/podcast.ogg" type="audio/ogg">\n  <source src="audio/podcast.mp3" type="audio/mpeg">\n</audio>'
  },
  autoplay: {
    title: 'autoplay — Автоматичне відтворення',
    badge: 'Потребує muted у сучасних браузерах!',
    desc: 'Наказує браузеру почати відтворення одразу після завантаження сторінки. УВАГА: Chrome, Safari, Edge та Firefox блокують автозапуск зі звуком! Щоб autoplay спрацював для фонового відео, обов’язково додайте muted та playsinline.',
    code: '<video autoplay muted loop playsinline poster="img/hero.jpg">\n  <source src="video/bg-loop.webm" type="video/webm">\n</video>'
  },
  muted: {
    title: 'muted — Вимкнення звуку за замовчуванням',
    badge: 'Булевий атрибут · Ключ до Autoplay',
    desc: 'Запускає відео з вимкненим звуком. Користувач може увімкнути звук вручну на панелі controls. Дозволяє безпечно запускати фонові відеоролики без блокування політикою браузера.',
    code: '<video src="video/promo.mp4" autoplay muted controls></video>'
  },
  loop: {
    title: 'loop — Циклічне повторення',
    badge: 'Булевий атрибут · Для сінемаграфів і фонів',
    desc: 'Після досягнення кінця запису автоматично запускає відтворення спочатку. Ідеально замінює важкі анімовані GIF-файли: коротке відео MP4/WebM із атрибутами autoplay muted loop важить у 5–10 разів менше за GIF.',
    code: '<video src="video/cinemagraph.webm" autoplay muted loop playsinline></video>'
  },
  poster: {
    title: 'poster — Обкладинка (кадр-заставка) відео',
    badge: 'Тільки для <video> · Покращує LCP',
    desc: 'URL зображення, яке відображається у вікні плеєра до того, як користувач натисне кнопку Play. Без poster браузер може показати чорний прямокутник або випадковий перший кадр.',
    code: '<video controls poster="img/cover-16x9.webp" preload="metadata" width="800" height="450">\n  <source src="video/lecture.mp4" type="video/mp4">\n</video>'
  },
  preload: {
    title: 'preload — Стратегія попереднього завантаження',
    badge: 'Значення: none | metadata | auto',
    desc: 'Керує економією мобільного трафіку: "none" — не завантажувати нічого до кліку Play; "metadata" (рекомендовано) — завантажити лише тривалість і розміри кадру; "auto" — завантажувати весь відеофайл одразу.',
    code: '<video controls preload="metadata" poster="img/preview.webp">\n  <source src="video/physics-exp.webm" type="video/webm">\n</video>'
  },
  track: {
    title: '<track> — Субтитри та доступність (WebVTT)',
    badge: 'Вкладений тег · Стандарт WCAG A11y',
    desc: 'Підключає текстові доріжки у форматі .vtt (Web Video Text Tracks): субтитри (kind="subtitles"), підписи для людей із порушеннями слуху (kind="captions") або навігаційні розділи (kind="chapters").',
    code: '<video controls preload="metadata">\n  <source src="video/lesson.webm" type="video/webm">\n  <track kind="subtitles" src="subs/lesson-uk.vtt" srclang="uk" label="Українська" default>\n</video>'
  }
};

function initAttributeExplorer() {
  const chipBtns = document.querySelectorAll('.attr-chip-btn');
  const titleEl = document.getElementById('attrDetailTitle');
  const badgeEl = document.getElementById('attrDetailBadge');
  const descEl = document.getElementById('attrDetailDesc');
  const codeEl = document.getElementById('attrDetailCode');

  if (!chipBtns.length || !titleEl || !descEl || !codeEl) return;

  chipBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      chipBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const key = btn.getAttribute('data-attr') || 'controls';
      const info = ATTR_CATALOG[key] || ATTR_CATALOG.controls;

      titleEl.textContent = info.title;
      if (badgeEl) badgeEl.textContent = info.badge;
      descEl.textContent = info.desc;
      codeEl.textContent = info.code;
    });
  });
}

/* --------------------------------------------------------------------------
   3. ПЕРЕМИКАННЯ ВКЛАДОК WEB MULTIMEDIA STUDIO
   -------------------------------------------------------------------------- */
function initMultimediaLabTabs() {
  const tabBtns = document.querySelectorAll('.mlab-tab-btn');
  const panels = document.querySelectorAll('.mlab-panel');
  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. ВКЛАДКА 1: СИМУЛЯТОР HTML5 ПЛЕЄРА ТА AUTOPLAY POLICY
   -------------------------------------------------------------------------- */
function initPlayerSimulator() {
  const chkControls = document.getElementById('simToggleControls');
  const chkAutoplay = document.getElementById('simToggleAutoplay');
  const chkMuted = document.getElementById('simToggleMuted');
  const chkLoop = document.getElementById('simToggleLoop');
  const chkPoster = document.getElementById('simTogglePoster');
  const chkSubtitles = document.getElementById('simToggleSubtitles');
  const selPreload = document.getElementById('simSelectPreload');

  const videoScreen = document.getElementById('simVideoScreen');
  const posterOverlay = document.getElementById('simPosterOverlay');
  const controlsBar = document.getElementById('simControlsBar');
  const subtitlesCaption = document.getElementById('simSubtitlesCaption');
  const playToggleBtn = document.getElementById('simPlayToggleBtn');
  const posterPlayBtn = document.getElementById('simPosterPlayBtn');
  const verdictBox = document.getElementById('simAutoplayVerdict');
  const trafficVal = document.getElementById('simTrafficEstimate');
  const stateLabel = document.getElementById('simPlaybackStateLabel');
  const liveTagCode = document.getElementById('simLiveTagPreview');

  if (!chkControls || !videoScreen) return;

  let isPlaying = false;

  function evaluateSimulatorState(triggeredByToggle) {
    const hasControls = chkControls.checked;
    const hasAutoplay = chkAutoplay.checked;
    const hasMuted = chkMuted.checked;
    const hasLoop = chkLoop.checked;
    const hasPoster = chkPoster.checked;
    const hasSubs = chkSubtitles.checked;
    const preloadVal = selPreload ? selPreload.value : 'metadata';

    // Autoplay Policy check: autoplay works automatically only if muted is true
    const autoplayBlocked = hasAutoplay && !hasMuted;

    if (triggeredByToggle) {
      if (hasAutoplay && hasMuted) {
        isPlaying = true;
      } else if (autoplayBlocked) {
        isPlaying = false;
      }
    }

    // Update screen & overlays
    videoScreen.classList.toggle('is-playing', isPlaying);
    if (posterOverlay) {
      const showPoster = !isPlaying && hasPoster;
      posterOverlay.classList.toggle('is-hidden', !showPoster);
    }
    if (controlsBar) {
      controlsBar.classList.toggle('is-hidden', !hasControls);
    }
    if (subtitlesCaption) {
      subtitlesCaption.classList.toggle('is-hidden', !hasSubs);
    }
    if (playToggleBtn) {
      playToggleBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
    }
    if (stateLabel) {
      if (isPlaying) {
        stateLabel.textContent = hasMuted
          ? 'Відтворюється (Без звуку · 60 FPS)'
          : 'Відтворюється зі звуком (Стерео 48 kHz)';
      } else if (autoplayBlocked) {
        stateLabel.textContent = 'ЗАБЛОКОВАНО БРАУЗЕРОМ (Autoplay Policy)';
      } else {
        stateLabel.textContent = 'Очікування дії користувача (Paused)';
      }
    }

    // Update Autoplay Verdict Banner
    if (verdictBox) {
      if (autoplayBlocked) {
        verdictBox.className = 'autoplay-verdict-box status-blocked';
        verdictBox.innerHTML =
          '<strong>🚫 Autoplay заблоковано!</strong> Сучасні браузери (Chrome, Safari, Firefox) забороняють автозапуск відео зі звуком без кліку користувача. Увімкніть атрибут <code>muted</code>!';
      } else if (hasAutoplay && hasMuted) {
        verdictBox.className = 'autoplay-verdict-box status-ok';
        verdictBox.innerHTML =
          '<strong>✅ Autoplay дозволено!</strong> Комбінація <code>autoplay muted playsinline</code> відповідає політиці браузерів — відео стартує миттєво.';
      } else if (!hasControls && !hasAutoplay) {
        verdictBox.className = 'autoplay-verdict-box status-blocked';
        verdictBox.innerHTML =
          '<strong>⚠️ Пастка UX:</strong> Вимкнено і <code>controls</code>, і <code>autoplay</code>. Користувач бачить статичний кадр і не має жодної кнопки для запуску!';
      } else {
        verdictBox.className = 'autoplay-verdict-box status-ok';
        verdictBox.innerHTML =
          '<strong>✅ Стандартний режим:</strong> Плеєр очікує свідомого кліку користувача на панель <code>controls</code>, заощаджуючи трафік.';
      }
    }

    // Calculate Initial Page Load Traffic Estimate
    if (trafficVal) {
      let kb = 0;
      if (hasPoster) kb += 42; // WebP poster
      if (hasAutoplay && hasMuted) {
        kb += 14800; // Full stream starts immediately
      } else if (preloadVal === 'auto') {
        kb += 14800;
      } else if (preloadVal === 'metadata') {
        kb += 64;
      } else {
        kb += 0;
      }
      trafficVal.textContent = kb >= 1000 ? (kb / 1024).toFixed(1) + ' МБ' : kb + ' КБ';
    }

    // Build live HTML snippet
    if (liveTagCode) {
      const attrs = [];
      if (hasControls) attrs.push('controls');
      if (hasAutoplay) attrs.push('autoplay');
      if (hasMuted) attrs.push('muted');
      if (hasLoop) attrs.push('loop');
      if (hasAutoplay && hasMuted) attrs.push('playsinline');
      attrs.push(`preload="${preloadVal}"`);
      if (hasPoster) attrs.push('poster="img/poster-16x9.webp"');
      attrs.push('width="1280" height="720"');

      let snippet = `<video ${attrs.join(' ')}>\n`;
      snippet += `  <source src="video/cosmos.webm" type="video/webm">\n`;
      snippet += `  <source src="video/cosmos.mp4" type="video/mp4">\n`;
      if (hasSubs) {
        snippet += `  <track kind="subtitles" src="subs/cosmos-uk.vtt" srclang="uk" label="Українська" default>\n`;
      }
      snippet += `  Ваш браузер не підтримує HTML5 відео.\n</video>`;
      liveTagCode.textContent = snippet;
    }
  }

  [chkControls, chkAutoplay, chkMuted, chkLoop, chkPoster, chkSubtitles, selPreload].forEach((el) => {
    if (el) {
      el.addEventListener('change', () => evaluateSimulatorState(true));
    }
  });

  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      evaluateSimulatorState(false);
    });
  }

  if (posterPlayBtn) {
    posterPlayBtn.addEventListener('click', () => {
      isPlaying = true;
      evaluateSimulatorState(false);
    });
  }

  evaluateSimulatorState(true);
}

/* --------------------------------------------------------------------------
   5. ВКЛАДКА 2: ТРЕНАЖЕР ВІДЕОГАЛЕРЕЇ (ПРАКТИЧНА РОБОТА №9 З ПІДРУЧНИКА)
   -------------------------------------------------------------------------- */
const GALLERY_VIDEOS = [
  { title: '1. Орбітальний телескоп Webb', duration: '02:15', codec: 'WebM · VP9', gradient: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' },
  { title: '2. Квантові обчислення у дії', duration: '03:40', codec: 'MP4 · H.264', gradient: 'linear-gradient(135deg, #047857, #0ea5e9)' },
  { title: '3. Робототехніка та ШІ 2026', duration: '01:55', codec: 'WebM · AV1', gradient: 'linear-gradient(135deg, #b91c1c, #f59e0b)' },
  { title: '4. Екологічна енергетика', duration: '04:12', codec: 'MP4 · HEVC', gradient: 'linear-gradient(135deg, #6d28d9, #ec4899)' }
];

function initGalleryTrainer() {
  const countSelect = document.getElementById('galleryCountSelect');
  const modeSelect = document.getElementById('galleryModeSelect');
  const aspectSelect = document.getElementById('galleryAspectSelect');
  const gapRange = document.getElementById('galleryGapRange');
  const gapValueLabel = document.getElementById('galleryGapValue');
  const previewRow = document.getElementById('multimediaPreviewRow');
  const cssCodeEl = document.getElementById('galleryLiveCssCode');

  if (!countSelect || !previewRow || !cssCodeEl) return;

  function renderGallery() {
    const count = parseInt(countSelect.value, 10) || 3;
    const mode = modeSelect ? modeSelect.value : 'grid';
    const aspect = aspectSelect ? aspectSelect.value : '16 / 9';
    const gap = gapRange ? parseInt(gapRange.value, 10) : 12;

    if (gapValueLabel) {
      gapValueLabel.textContent = gap + 'px';
    }

    // Apply layout styles to preview row
    previewRow.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
    previewRow.style.gap = `${gap}px`;

    // Render cards
    previewRow.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const item = GALLERY_VIDEOS[i % GALLERY_VIDEOS.length];
      const card = document.createElement('div');
      card.className = 'multimedia-video-card';
      card.innerHTML = `
        <div class="mv-thumb" style="aspect-ratio: ${aspect}; background: ${item.gradient};">
          <div class="mv-play-circle">▶</div>
          <strong style="font-size: 0.85rem;">${item.title}</strong>
        </div>
        <div class="mv-meta">
          <span>${item.codec}</span>
          <span>${item.duration}</span>
        </div>
      `;
      previewRow.appendChild(card);
    }

    // Generate CSS code comparison (Textbook Float vs Modern CSS Grid)
    const widthPct = (100 / count).toFixed(2).replace('.00', '');
    if (mode === 'float') {
      cssCodeEl.textContent =
`/* Класичний спосіб із підручника (Практична робота №9): */
.multimedia {
  width: 100%;
  overflow: hidden; /* Очищення потоку для float */
}
.multimedia-video {
  display: inline-block;
  float: left;
  width: ${widthPct}%; /* 100% / ${count} відео в рядку */
  padding: 0 ${Math.round(gap / 2)}px;
  box-sizing: border-box;
}
.multimedia-video video {
  width: 100%;
  aspect-ratio: ${aspect};
}`;
    } else {
      cssCodeEl.textContent =
`/* Сучасний адаптивний спосіб (CSS Grid + aspect-ratio): */
.multimedia {
  display: grid;
  grid-template-columns: repeat(${count}, 1fr);
  gap: ${gap}px;
  box-sizing: border-box;
}
.multimedia-video video {
  width: 100%;
  height: auto;
  aspect-ratio: ${aspect};
  object-fit: cover;
  display: block;
}`;
    }
  }

  [countSelect, modeSelect, aspectSelect, gapRange].forEach((ctrl) => {
    if (ctrl) {
      ctrl.addEventListener('input', renderGallery);
      ctrl.addEventListener('change', renderGallery);
    }
  });

  renderGallery();
}

/* --------------------------------------------------------------------------
   6. ВКЛАДКА 3: КОНСТРУКТОР СЕМАНТИЧНОГО МЕДІА-КОДУ З ВАЛІДАТОРОМ
   -------------------------------------------------------------------------- */
function initMediaCodeBuilder() {
  const typeSelect = document.getElementById('builderMediaType');
  const slugInput = document.getElementById('builderSlugInput');
  const chkWebm = document.getElementById('builderFormatWebm');
  const chkMp4 = document.getElementById('builderFormatMp4');
  const chkControls = document.getElementById('builderControlsChk');
  const chkSubtitles = document.getElementById('builderSubtitlesChk');
  const chkPreload = document.getElementById('builderLazyPreloadChk');
  const chkDims = document.getElementById('builderDimensionsChk');

  const codeOut = document.getElementById('mediaCodeOutput');
  const checklistEl = document.getElementById('mediaValidationChecklist');
  const scoreBadge = document.getElementById('mediaScoreBadge');
  const copyBtn = document.getElementById('copyMediaCodeBtn');

  if (!typeSelect || !codeOut || !checklistEl) return;

  function updateBuilder() {
    const mediaType = typeSelect.value || 'video';
    const rawSlug = (slugInput && slugInput.value.trim()) ? slugInput.value.trim() : 'school-science-lab';
    const slug = rawSlug.replace(/[^a-zA-Z0-9_-]/g, '-');

    const useWebm = chkWebm ? chkWebm.checked : true;
    const useMp4 = chkMp4 ? chkMp4.checked : true;
    const useControls = chkControls ? chkControls.checked : true;
    const useSubs = chkSubtitles ? chkSubtitles.checked : true;
    const usePreload = chkPreload ? chkPreload.checked : true;
    const useDims = chkDims ? chkDims.checked : true;

    let code = '';
    if (mediaType === 'video') {
      const attrs = [];
      if (useControls) attrs.push('controls');
      if (usePreload) {
        attrs.push('preload="metadata"');
        attrs.push(`poster="img/${slug}-poster.webp"`);
      }
      if (useDims) {
        attrs.push('width="1280" height="720"');
      }

      code += `<figure class="media-figure">\n`;
      code += `  <video${attrs.length ? ' ' + attrs.join(' ') : ''}>\n`;
      if (useWebm) {
        code += `    <source src="video/${slug}.webm" type="video/webm">\n`;
      }
      if (useMp4) {
        code += `    <source src="video/${slug}.mp4" type="video/mp4">\n`;
      }
      if (useSubs) {
        code += `    <track kind="subtitles" src="subs/${slug}-uk.vtt" srclang="uk" label="Українська" default>\n`;
      }
      code += `    Ваш браузер не підтримує відтворення HTML5 відео. <a href="video/${slug}.mp4">Завантажити MP4</a>.\n`;
      code += `  </video>\n`;
      code += `  <figcaption>Відеоматеріал: ${slug}</figcaption>\n`;
      code += `</figure>`;
    } else {
      const attrs = [];
      if (useControls) attrs.push('controls');
      if (usePreload) attrs.push('preload="metadata"');

      code += `<figure class="audio-figure">\n`;
      code += `  <figcaption>Аудіоподкаст: ${slug}</figcaption>\n`;
      code += `  <audio${attrs.length ? ' ' + attrs.join(' ') : ''}>\n`;
      if (useWebm) {
        code += `    <source src="audio/${slug}.ogg" type="audio/ogg">\n`;
      }
      if (useMp4) {
        code += `    <source src="audio/${slug}.mp3" type="audio/mpeg">\n`;
      }
      code += `    Ваш браузер не підтримує відтворення HTML5 аудіо. <a href="audio/${slug}.mp3">Завантажити MP3</a>.\n`;
      code += `  </audio>\n`;
      code += `</figure>`;
    }

    codeOut.textContent = code;

    // Evaluate 5 engineering checklist rules
    const checks = [
      {
        ok: useWebm && useMp4,
        text: 'Каскад із щонайменше 2 джерел <source> із явно вказаним MIME-атрибутом type="..."'
      },
      {
        ok: useControls,
        text: 'Наявність атрибута controls для доступного керування відтворенням з клавіатури та миші'
      },
      {
        ok: usePreload,
        text: 'Оптимізація трафіку через preload="metadata" (та poster для відео)'
      },
      {
        ok: mediaType === 'audio' || useDims,
        text: 'Захист від стрибків верстки (CLS): явні атрибути width та height для відеоплеєра'
      },
      {
        ok: mediaType === 'audio' || useSubs,
        text: 'Інклюзивність (WCAG): підключені субтитри <track kind="subtitles" srclang="uk">'
      }
    ];

    const passedCount = checks.filter((c) => c.ok).length;
    if (scoreBadge) {
      scoreBadge.textContent = `Оцінка коду: ${passedCount}/5`;
      scoreBadge.className = passedCount === 5 ? 'badge badge-green' : 'badge badge-yellow';
    }

    checklistEl.innerHTML = checks
      .map(
        (c) => `
        <li class="builder-check-item ${c.ok ? 'pass' : 'warn'}">
          <span>${c.ok ? '✅' : '⚠️'}</span>
          <span>${c.text}</span>
        </li>
      `
      )
      .join('');
  }

  [typeSelect, slugInput, chkWebm, chkMp4, chkControls, chkSubtitles, chkPreload, chkDims].forEach((el) => {
    if (el) {
      el.addEventListener('input', updateBuilder);
      el.addEventListener('change', updateBuilder);
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && codeOut.textContent) {
        navigator.clipboard.writeText(codeOut.textContent);
      }
      const prev = copyBtn.textContent;
      copyBtn.textContent = '✅ Скопійовано!';
      setTimeout(() => {
        copyBtn.textContent = prev;
      }, 1500);
    });
  }

  updateBuilder();
}

/* --------------------------------------------------------------------------
   7. РЕЖИМ «НА ВЕСЬ ЕКРАН» ДЛЯ ЛАБОРАТОРІЇ
   -------------------------------------------------------------------------- */
function initLabFullscreen() {
  const labBox = document.getElementById('multimediaLabBox');
  const fsBtn = document.getElementById('labFullscreenBtn');
  const fsLabel = document.getElementById('labFullscreenLabel');

  if (!labBox || !fsBtn) return;

  function setFullscreenState(active) {
    labBox.classList.toggle('is-fullscreen', active);
    document.body.classList.toggle('sandbox-fullscreen-active', active);
    fsBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (fsLabel) {
      fsLabel.textContent = active ? 'Згорнути' : 'На весь екран';
    }
  }

  fsBtn.addEventListener('click', () => {
    const isNowActive = !labBox.classList.contains('is-fullscreen');
    setFullscreenState(isNowActive);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && labBox.classList.contains('is-fullscreen')) {
      setFullscreenState(false);
    }
  });
}

/* --------------------------------------------------------------------------
   8. ЖИВИЙ ПРИКЛАД НАТИВНОГО <audio controls> (СИНТЕЗОВАНА МЕЛОДІЯ WAV)
   Використовує data:audio/wav;base64 для автономної роботи офлайн
   -------------------------------------------------------------------------- */
function buildDemoWavDataUri() {
  const sampleRate = 8000;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const noteSec = 0.28;
  const samplesPerNote = Math.floor(sampleRate * noteSec);
  const numSamples = samplesPerNote * notes.length;
  const dataSize = numSamples;
  const totalSize = 44 + dataSize;
  const bytes = new Uint8Array(totalSize);

  function writeAscii(offset, str) {
    for (let i = 0; i < str.length; i++) {
      bytes[offset + i] = str.charCodeAt(i);
    }
  }
  function writeU32(offset, val) {
    bytes[offset] = val & 0xff;
    bytes[offset + 1] = (val >> 8) & 0xff;
    bytes[offset + 2] = (val >> 16) & 0xff;
    bytes[offset + 3] = (val >> 24) & 0xff;
  }
  function writeU16(offset, val) {
    bytes[offset] = val & 0xff;
    bytes[offset + 1] = (val >> 8) & 0xff;
  }

  writeAscii(0, 'RIFF');
  writeU32(4, totalSize - 8);
  writeAscii(8, 'WAVE');
  writeAscii(12, 'fmt ');
  writeU32(16, 16);
  writeU16(20, 1); // PCM
  writeU16(22, 1); // Mono
  writeU32(24, sampleRate);
  writeU32(28, sampleRate);
  writeU16(32, 1);
  writeU16(34, 8); // 8-bit unsigned
  writeAscii(36, 'data');
  writeU32(40, dataSize);

  let idx = 44;
  for (let n = 0; n < notes.length; n++) {
    const freq = notes[n];
    for (let s = 0; s < samplesPerNote; s++) {
      const t = s / sampleRate;
      const env = Math.min(1, s / 200) * Math.min(1, (samplesPerNote - s) / 400);
      const val = Math.sin(2 * Math.PI * freq * t) * 0.45 * env;
      bytes[idx++] = Math.max(0, Math.min(255, Math.round(128 + val * 110)));
    }
  }

  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof window.btoa === 'function' ? window.btoa(binary) : '';
  return base64 ? 'data:audio/wav;base64,' + base64 : '';
}

function initLiveAudioDemo() {
  const player = document.getElementById('liveAudioDemoPlayer');
  if (!player) return;
  const uri = buildDemoWavDataUri();
  if (uri) {
    player.setAttribute('src', uri);
  }
}

/* --------------------------------------------------------------------------
   9. ЧЕК-ЛІСТ САМОПЕРЕВІРКИ ДЛЯ САМОСТІЙНОГО ПРАКТИКУМУ (РОЗДІЛ 5)
   -------------------------------------------------------------------------- */
function initSelfCheckProgress() {
  const checkboxes = document.querySelectorAll('.self-check-checkbox');
  const badge = document.getElementById('selfCheckProgressBadge');
  if (!checkboxes.length || !badge) return;

  function updateProgress() {
    let done = 0;
    checkboxes.forEach((chk) => {
      const row = chk.closest('.self-check-item');
      if (row) row.classList.toggle('is-done', chk.checked);
      if (chk.checked) done++;
    });
    const total = checkboxes.length;
    badge.textContent = `Виконано: ${done} / ${total}`;
    badge.className = done === total ? 'badge badge-green' : 'badge badge-yellow';
  }

  checkboxes.forEach((chk) => chk.addEventListener('change', updateProgress));
  updateProgress();
}
