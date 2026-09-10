'use strict';
// Shared presentation controls for the algorithm series. Content stays readable without JS.
const slides = [...document.querySelectorAll('.slide')];
const mode = document.getElementById('mode');
let current = Math.max(0, slides.findIndex(s => '#' + s.id === location.hash));
let presenting = false;
function showSlide(index, updateHash = true) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  document.getElementById('page-label').textContent = `${current + 1} / ${slides.length} · ${slides[current].dataset.title}`;
  document.getElementById('progress').style.width = `${(current + 1) / slides.length * 100}%`;
  document.getElementById('previous').disabled = current === 0;
  document.getElementById('next').disabled = current === slides.length - 1;
  if (updateHash) history.replaceState(null, '', '#' + slides[current].id);
  if (presenting) window.scrollTo(0, 0);
}
function setMode(on) {
  if (on && !presenting) {
    const visible = slides.findIndex(s => s.getBoundingClientRect().bottom > 180);
    if (visible >= 0) current = visible;
  }
  presenting = on;
  document.body.classList.toggle('presenting', on);
  mode.textContent = on ? '返回完整讲义' : '进入讲解模式';
  mode.setAttribute('aria-pressed', String(on));
  showSlide(current);
  if (!on) slides[current].scrollIntoView({block: 'start'});
}
mode.addEventListener('click', () => setMode(!presenting));
document.getElementById('previous').addEventListener('click', () => showSlide(current - 1));
document.getElementById('next').addEventListener('click', () => showSlide(current + 1));
document.addEventListener('keydown', event => {
  if (!presenting || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'Escape') { setMode(false); return; }
  if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); showSlide(current + 1); }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); showSlide(current - 1); }
});
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.getElementById(link.hash.slice(1));
  const section = target?.closest('.slide');
  if (presenting && section) {
    event.preventDefault(); showSlide(slides.indexOf(section), false);
    history.replaceState(null, '', link.hash); target.scrollIntoView({block: 'start'});
  }
});
window.addEventListener('hashchange', () => {
  const target = document.getElementById(location.hash.slice(1));
  const section = target?.closest('.slide');
  if (section) { showSlide(slides.indexOf(section), false); if (presenting) target.scrollIntoView({block: 'start'}); }
});
const fullscreen = document.getElementById('fullscreen');
if (!document.fullscreenEnabled) fullscreen.hidden = true;
fullscreen.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch (_) { fullscreen.textContent = '请使用浏览器全屏'; }
});
document.addEventListener('fullscreenchange', () => { fullscreen.textContent = document.fullscreenElement ? '退出全屏' : '全屏'; });
showSlide(current, false);

// Both methods count one arithmetic reduction as one step; swaps are free here.
function gcdTrace(a, b, method) {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a < 1 || b < 1 || a > 9999 || b > 9999) throw new RangeError('请输入 1 到 9999 之间的整数。');
  if (a < b) [a, b] = [b, a];
  const states = [{a, b, text: `(${a}, ${b})`}];
  while (b !== 0) {
    const oldA = a, oldB = b;
    let text;
    if (method === 'mod') {
      [a, b] = [b, a % b];
      text = `${oldA} = ${Math.floor(oldA / oldB)} × ${oldB} + ${b} → (${a}, ${b})`;
    } else {
      const difference = a - b;
      [a, b] = [Math.max(b, difference), Math.min(b, difference)];
      text = `${oldA} − ${oldB} = ${difference} → (${a}, ${b})`;
    }
    states.push({a, b, text});
  }
  return states;
}
const demoForm = document.getElementById('gcd-form');
if (demoForm) {
  let modStates = [], subStates = [], step = 0;
  const error = document.getElementById('demo-error');
  function drawTrace(id, states) {
    const shown = Math.min(step, states.length - 1);
    const list = document.getElementById(id + '-trace');
    list.replaceChildren();
    const start = Math.max(0, shown - 11);
    list.start = start + 1;
    for (let i = start; i <= shown; i++) {
      const li = document.createElement('li'); li.textContent = states[i].text; list.append(li);
    }
    const done = shown === states.length - 1;
    document.getElementById(id + '-count').textContent = `${shown} 次${id === 'mod' ? '取余' : '减法'}${done ? ` · 完成，gcd = ${states[shown].a}` : ''}`;
    document.getElementById(id + '-bar').style.width = `${Math.max(0, shown) / Math.max(modStates.length - 1, subStates.length - 1) * 100}%`;
    document.getElementById(id + '-omitted').textContent = start ? `省略前 ${start} 个状态，显示最近 12 个。` : '';
    list.parentElement.scrollTop = list.parentElement.scrollHeight;
  }
  function draw() {
    drawTrace('mod', modStates); drawTrace('sub', subStates);
    const done = step >= Math.max(modStates.length, subStates.length) - 1;
    document.getElementById('step').disabled = done;
    document.getElementById('finish').disabled = done;
    document.getElementById('demo-result').textContent = done
      ? `结果都是 ${modStates.at(-1).a}。取余 ${modStates.length - 1} 次，减法 ${subStates.length - 1} 次。这里比较的是操作次数，不是运行时间。`
      : '每次“下一步”，两种方法各做一次运算；先完成的一侧会停下。';
  }
  function reset() {
    try {
      const a = Number(document.getElementById('input-a').value), b = Number(document.getElementById('input-b').value);
      const nextMod = gcdTrace(a, b, 'mod'), nextSub = gcdTrace(a, b, 'sub');
      modStates = nextMod; subStates = nextSub; step = 0; error.textContent = ''; draw();
      return true;
    } catch (failure) { error.textContent = failure.message; return false; }
  }
  demoForm.addEventListener('submit', event => { event.preventDefault(); reset(); });
  document.querySelectorAll('[data-pair]').forEach(button => button.addEventListener('click', () => {
    const [a, b] = button.dataset.pair.split(',');
    document.getElementById('input-a').value = a; document.getElementById('input-b').value = b; reset();
  }));
  document.getElementById('step').addEventListener('click', () => { step++; draw(); });
  document.getElementById('finish').addEventListener('click', () => { step = Math.max(modStates.length, subStates.length) - 1; draw(); });
  demoForm.addEventListener('input', () => {
    document.getElementById('step').disabled = true; document.getElementById('finish').disabled = true;
    document.getElementById('demo-result').textContent = '输入已修改。点击“重新开始”应用新数字。';
  });
  reset();
}
