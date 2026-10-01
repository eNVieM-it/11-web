/* ==========================================================================
   УРОК 4: БЛОЧНА МОДЕЛЬ ВЕРСТКИ
   Пісочниця «налаштування блоків» (padding / margin / border) і
   повноекранний режим через спільний модуль js/sandbox.js.
   Системні компоненти сторінки — у js/core.js.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBoxModelSandbox();
  console.log('🚀 Урок 4 (Блочна модель) успішно ініціалізовано!');
});

/** -------------------------------------------------------------------------
 * ПРАКТИКУМ: редактор CSS + живий перегляд блоку
 * ------------------------------------------------------------------------ */
function initBoxModelSandbox() {
  const codeArea = document.getElementById('sandboxCss');
  const iframe = document.getElementById('sandboxPreview');
  const runBtn = document.getElementById('sandboxRunBtn');

  if (!codeArea || !iframe) return;

  // HTML фіксований — користувач редагує лише CSS
  const STATIC_HTML = '<div class="box">Я блочний елемент!</div>';

  const PREVIEW_BASE_CSS =
    'body { margin: 0; padding: 20px; display: flex; justify-content: center; ' +
    'align-items: center; min-height: 90vh; background: #f5f5f5; }';

  function render() {
    SandboxUI.renderPreview(
      iframe,
      SandboxUI.wrapFragment(STATIC_HTML, PREVIEW_BASE_CSS + '\n' + codeArea.value)
    );
  }

  if (runBtn) runBtn.addEventListener('click', render);

  // Живе оновлення під час набору (debounce 400 мс)
  let timer = null;
  codeArea.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(render, 400);
  });

  render();

  // Повноекранний режим практикуму
  SandboxUI.initFullscreen({
    closeIcon: '✖',
    closeLabel: 'Закрити',
    hasTasksDrawer: false
  });
}
