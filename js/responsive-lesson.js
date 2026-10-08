/* ==========================================================================
   УРОК 5: АДАПТИВНА ВЕРСТКА
   Пісочниця та повноекранний режим через спільний модуль js/sandbox.js.
   Системні компоненти сторінки — у js/core.js.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initResponsiveSandbox();
  console.log('🚀 Урок 5 (Адаптивна верстка) успішно ініціалізовано!');
});

/** -------------------------------------------------------------------------
 * ПРАКТИКУМ: редактор CSS + живий перегляд блоку
 * ------------------------------------------------------------------------ */
function initResponsiveSandbox() {
  const codeArea = document.getElementById('sandboxCss');
  const iframe = document.getElementById('sandboxPreview');
  const runBtn = document.getElementById('sandboxRunBtn');

  if (!codeArea || !iframe) return;

  // HTML фіксований — користувач редагує лише CSS
  const STATIC_HTML = '<div class="card"><h2>Я адаптивна картка</h2><p>Зміни ширину вікна результату, щоб побачити магію!</p></div>';

  const PREVIEW_BASE_CSS =
    'body { margin: 0; padding: 20px; font-family: sans-serif; background: #e0e7ff; min-height: 100vh; display: flex; justify-content: center; align-items: center; box-sizing: border-box; } * { box-sizing: border-box; }';

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
