/* ==========================================================================
   ВЕБТЕХНОЛОГІЇ (10–11 КЛАСИ) • СПІЛЬНІ ПРАКТИКУМИ
   Уніфікована логіка кодових пісочниць та повноекранного режиму:
     - SandboxUI.renderPreview()    єдиний безпечний рендер через iframe.srcdoc
     - SandboxUI.initFullscreen()   повноекранний режим (кнопки, Esc, deep-link)
     - SandboxUI.initCodeSandbox()  пісочниця з вкладками HTML/CSS + debounce
   Використовується html-basics.html, css-basics.html та box-model.html.
   ========================================================================== */

var SandboxUI = (function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Єдиний спосіб показати користувацький код у iframe.
     Використовуємо srcdoc замість Blob/URL.createObjectURL — так не
     виникає витоку objectURL-ів і не руйнується контекст документа
     через contentDocument.write().
     --------------------------------------------------------------------- */
  function renderPreview(iframe, html) {
    if (!iframe) return;
    iframe.srcdoc = html;
  }

  /* ---------------------------------------------------------------------
     Обгортання фрагмента коду в повний HTML-документ (якщо користувач
     ввів лише фрагмент без <html>/<head>).
     --------------------------------------------------------------------- */
  function wrapFragment(fragment, css) {
    return '<!DOCTYPE html>\n' +
      '<html lang="uk">\n' +
      '<head>\n' +
      '  <meta charset="UTF-8">\n' +
      '  <style>\n' + (css || '') + '\n  </style>\n' +
      '</head>\n' +
      '<body>\n' + fragment + '\n</body>\n' +
      '</html>';
  }


  /* ---------------------------------------------------------------------
     Повноекранний режим практикуму.
     options:
       containerId    — id контейнера (за замовчуванням sandboxContainer)
       buttonId       — id кнопки перемикання
       extraLaunchIds — масив id додаткових кнопок запуску
       openIcon/closeIcon, openLabel/closeLabel — підписи кнопки
       hasTasksDrawer — чи керувати шухлядом завдань (закриття при виході)
     --------------------------------------------------------------------- */
  function initFullscreen(options) {
    const opts = options || {};
    const container = document.getElementById(opts.containerId || 'sandboxContainer');
    if (!container) return null;

    const fullscreenBtn = document.getElementById(opts.buttonId || 'sandboxFullscreenBtn');
    const launchIds = opts.extraLaunchIds || ['launchFullscreenTopBtn', 'launchFsHeaderBtn'];

    const OPEN_ICON = opts.openIcon || '⛶';
    const CLOSE_ICON = opts.closeIcon || '✖';
    const OPEN_LABEL = opts.openLabel || 'На всю сторінку';
    const CLOSE_LABEL = opts.closeLabel || 'Згорнути';
    const OPEN_TITLE = opts.openTitle || 'Відкрити практикум на всю сторінку (Esc для виходу)';
    const CLOSE_TITLE = opts.closeTitle || 'Згорнути у звичайний вигляд (Esc)';

    const tasksBtn = document.getElementById('sandboxTasksBtn');
    const tasksDrawer = document.getElementById('sandboxTasksDrawer');

    function setFullscreenBtn(isOpen) {
      if (!fullscreenBtn) return;
      const icon = isOpen ? CLOSE_ICON : OPEN_ICON;
      const label = isOpen ? CLOSE_LABEL : OPEN_LABEL;
      const iconEl = fullscreenBtn.querySelector('.fs-icon');
      const labelEl = fullscreenBtn.querySelector('.fs-label');

      if (iconEl && labelEl) {
        iconEl.textContent = icon;
        labelEl.textContent = label;
      } else {
        fullscreenBtn.innerHTML =
          '<span class="fs-icon">' + icon + '</span> <span class="fs-label">' + label + '</span>';
      }
      fullscreenBtn.title = isOpen ? CLOSE_TITLE : OPEN_TITLE;
    }

    function toggleFullscreen(forceState) {
      const isFs = typeof forceState === 'boolean'
        ? forceState
        : !container.classList.contains('is-fullscreen');

      container.classList.toggle('is-fullscreen', isFs);
      document.body.classList.toggle('sandbox-fullscreen-active', isFs);
      setFullscreenBtn(isFs);

      if (!isFs && opts.hasTasksDrawer !== false) {
        if (tasksDrawer) tasksDrawer.classList.remove('is-open');
        if (tasksBtn) tasksBtn.classList.remove('active');
      }

      const codeArea = container.querySelector('textarea:not([readonly])');
      if (isFs && codeArea) codeArea.focus();
    }

    if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => toggleFullscreen());
    launchIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => toggleFullscreen(true));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && container.classList.contains('is-fullscreen')) {
        toggleFullscreen(false);
      }
    });

    // Deep-link: ?fullscreen=1 або #practical-work-fullscreen
    if (window.location.search.indexOf('fullscreen=1') !== -1 ||
        window.location.hash === '#practical-work-fullscreen') {
      toggleFullscreen(true);
    }

    return { toggle: toggleFullscreen };
  }



  /* ---------------------------------------------------------------------
     Пісочниця коду з вкладками HTML / CSS.
     options:
       codeAreaId  — id <textarea> редактора
       iframeId    — id <iframe> попереднього перегляду
       runBtnId, resetBtnId, htmlTabId, cssTabId — id кнопок (необов'язкові)
       defaultHTML, defaultCSS — початковий вміст редактора
       injectCss   — true, якщо CSS вставляється у <head> підготовленого документа
       debounceMs  — затримка автозапуску при вводі
     --------------------------------------------------------------------- */
  function initCodeSandbox(options) {
    const opts = options || {};
    const codeArea = document.getElementById(opts.codeAreaId || 'sandboxCodeArea');
    const iframe = document.getElementById(opts.iframeId || 'sandboxIframe');
    if (!codeArea || !iframe) return;

    const runBtn = opts.runBtnId ? document.getElementById(opts.runBtnId) : null;
    const resetBtn = opts.resetBtnId ? document.getElementById(opts.resetBtnId) : null;
    const htmlTabBtn = opts.htmlTabId ? document.getElementById(opts.htmlTabId) : null;
    const cssTabBtn = opts.cssTabId ? document.getElementById(opts.cssTabId) : null;
    const debounceMs = typeof opts.debounceMs === 'number' ? opts.debounceMs : 400;

    const defaultHTML = opts.defaultHTML || '';
    const defaultCSS = opts.defaultCSS || '';

    let currentTab = opts.injectCss === false ? 'css' : 'html';
    let storedHTML = defaultHTML;
    let storedCSS = defaultCSS;
    let debounceTimer = null;

    function renderIframe() {
      let html = storedHTML;
      const css = storedCSS;

      if (opts.injectCss === false) {
        // Режим Уроку 4: користувач редагує лише CSS, HTML фіксований
        renderPreview(iframe, wrapFragment(opts.staticHTML || '', css));
        return;
      }

      // Якщо в HTML є <link href="style.css">, замінюємо його на інлайн-стилі
      if (/<link[^>]*href=["']style\.css["'][^>]*>/i.test(html)) {
        html = html.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i,
          '<style>\n' + css + '\n</style>');
      } else if (html.includes('</head>')) {
        html = html.replace('</head>', '<style>\n' + css + '\n</style>\n</head>');
      } else if (!html.includes('<html')) {
        html = wrapFragment(html, css);
      }

      renderPreview(iframe, html);
    }

    function storeCurrentTab() {
      if (currentTab === 'html') storedHTML = codeArea.value;
      else storedCSS = codeArea.value;
    }

    function switchTab(tab) {
      storeCurrentTab();
      currentTab = tab;

      codeArea.value = tab === 'html' ? storedHTML : storedCSS;
      if (htmlTabBtn) htmlTabBtn.classList.toggle('active', tab === 'html');
      if (cssTabBtn) cssTabBtn.classList.toggle('active', tab === 'css');
    }

    if (htmlTabBtn) htmlTabBtn.addEventListener('click', () => switchTab('html'));
    if (cssTabBtn) cssTabBtn.addEventListener('click', () => switchTab('css'));

    function run() {
      storeCurrentTab();
      renderIframe();
    }

    // Живий автозапуск під час набору коду
    codeArea.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(run, debounceMs);
    });

    if (runBtn) runBtn.addEventListener('click', run);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        storedHTML = defaultHTML;
        storedCSS = defaultCSS;
        codeArea.value = currentTab === 'html' ? storedHTML : storedCSS;
        renderIframe();
      });
    }

    codeArea.value = currentTab === 'html' ? storedHTML : storedCSS;
    if (htmlTabBtn) htmlTabBtn.classList.toggle('active', currentTab === 'html');
    if (cssTabBtn) cssTabBtn.classList.toggle('active', currentTab === 'css');
    renderIframe();
  }

  return {
    renderPreview: renderPreview,
    wrapFragment: wrapFragment,
    initFullscreen: initFullscreen,
    initCodeSandbox: initCodeSandbox
  };
})();

