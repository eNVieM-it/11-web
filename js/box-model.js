/* ==========================================================================
   УРОК 4: БЛОЧНА МОДЕЛЬ ВЕРСТКИ
   Демонстратор box-model (content / padding / border / margin),
   пісочниця «налаштування блоків» і повноекранний режим через js/sandbox.js.
   Системні компоненти сторінки — у js/core.js.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBoxModelDemo();
  initBoxModelSandbox();
  console.log('🚀 Урок 4 (Блочна модель) успішно ініціалізовано!');
});

/** -------------------------------------------------------------------------
 * ДЕМОНСТРАЦІЯ БЛОЧНОЇ МОДЕЛІ: інтерактивні повзунки (розділ 2)
 * ------------------------------------------------------------------------ */
function initBoxModelDemo() {
  const dBox1 = document.getElementById('demo-box1');
  const dBox2 = document.getElementById('demo-box2');
  const inWidth = document.getElementById('input-width');
  const inPadding = document.getElementById('input-padding');
  const inBorder = document.getElementById('input-border');
  const inMargin = document.getElementById('input-margin');
  const vWidth = document.getElementById('val-width');
  const vPadding = document.getElementById('val-padding');
  const vBorder = document.getElementById('val-border');
  const vMargin = document.getElementById('val-margin');

  if (!inWidth || !dBox1 || !dBox2) return;

  function updateDemo() {
    if (vWidth) vWidth.textContent = inWidth.value;
    if (vPadding) vPadding.textContent = inPadding.value;
    if (vBorder) vBorder.textContent = inBorder.value;
    if (vMargin) vMargin.textContent = inMargin.value;

    const boxes = [dBox1, dBox2];
    boxes.forEach(b => {
      b.style.width = inWidth.value + 'px';
      b.style.padding = inPadding.value + 'px';
      b.style.borderWidth = inBorder.value + 'px';
    });
    dBox1.style.marginBottom = inMargin.value + 'px';
  }

  [inWidth, inPadding, inBorder, inMargin].forEach(input => {
    if (input) input.addEventListener('input', updateDemo);
  });

  updateDemo();
}

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
