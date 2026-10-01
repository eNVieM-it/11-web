/* Утиліти smoke-тесту: завантаження сторінок у jsdom і підрахунок перевірок. */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const state = { passed: 0, failed: 0, failures: [] };

function check(name, condition, detail) {
  if (condition) {
    state.passed++;
    console.log('  ✓ ' + name);
  } else {
    state.failed++;
    state.failures.push(name + (detail ? ' → ' + detail : ''));
    console.log('  ✗ ' + name + (detail ? ' → ' + detail : ''));
  }
}

function section(title) {
  console.log('\n=== ' + title + ' ===');
}

/** Створює jsdom зі сторінкою та повертає список зовнішніх скриптів у порядку підключення. */
function loadPage(file) {
  const html = read(file);
  const dom = new JSDOM(html, {
    url: 'file:///' + path.join(ROOT, file).replace(/\\/g, '/'),
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });

  const scripts = [...dom.window.document.querySelectorAll('script[src]')]
    .map(s => s.getAttribute('src'));

  return { dom, window: dom.window, scripts };
}

/** Виконує зовнішні скрипти вручну (jsdom не завантажує локальні файли). */
function runScripts(window, scripts) {
  for (const src of scripts) {
    const file = src.split('?')[0];
    try {
      window.eval(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    } catch (e) {
      return { file, error: e };
    }
  }
  return null;
}

/** Завантажує сторінку, виконує скрипти й ініціалізує модулі на DOMContentLoaded. */
function boot(file) {
  const { dom, window, scripts } = loadPage(file);
  const error = runScripts(window, scripts);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return { dom, window, error };
}

function report() {
  console.log('\n================================');
  console.log('Пройдено: ' + state.passed + ' | Провалено: ' + state.failed);
  if (state.failures.length) {
    console.log('\nПровалені перевірки:');
    state.failures.forEach(f => console.log('  • ' + f));
  }
  console.log('================================\n');
  return state.failed ? 1 : 0;
}

module.exports = { ROOT, read, check, section, loadPage, runScripts, boot, report };
