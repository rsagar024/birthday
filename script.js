/* =========================================================
   CONFIG: edit these to personalise the whole page
   ========================================================= */
const CONFIG = {
  name: 'My Sunshine',
  birthYear: 2003,
  birthdayMonth: 11,
  birthdayDay: 24
};
// The age she turns on this year's birthday (24 Nov 2026 → 23)
CONFIG.age = new Date().getFullYear() - CONFIG.birthYear;

/* Short letter (typewriter). {name} is replaced automatically. */
const LETTER_SHORT =
`My dearest {name},

Before you were my girlfriend, you were my best friend, the person I ran to with every good news and every bad day. Somewhere between the midnight calls and the inside jokes, I fell for you completely, and I’ve been falling a little more every day since.

Thank you for being my safe place, my loudest cheerleader and my favourite hello. Today is all about you, and I hope every little surprise on this page makes you smile the way you make me smile.

Happy birthday, my love.`;

/* Wishes wall (placeholder friends: edit freely) */
const WISHES = [
  {name:'Rakhi', style:'yellow', short:'Happy birthday to the girl who makes every room warmer! 🌻', full:'Happy birthday to the girl who makes every room warmer! I’m so lucky to have watched you grow into this kind, brilliant, hilarious woman. Have the most magical year. You deserve every good thing coming your way.'},
  {name:'Uday', style:'polaroid', emoji:'🎸', short:'Another year of you being the coolest person I know.', full:'Another year of you being the coolest person I know. Thanks for every road trip, every terrible karaoke night and every time you talked sense into me. Happy birthday, legend!'},
  {name:'Mom', style:'pink', short:'My sunshine, my pride, my sweet girl. ♥', full:'My sunshine, my pride, my sweet girl. Every year you surprise me with how strong and loving you are. I hope today feels like the hug I’d give you if I were right there. Happy birthday, my darling.'},
  {name:'Rumjhum', style:'mint', short:'To my partner in all things chaotic. Love you!', full:'To my partner in all things chaotic: happy birthday! Here’s to more 2 a.m. snack runs, more dramatic voice notes and more laughing until our stomachs hurt. Love you endlessly.'},
  {name:'Swadhin', style:'lavender', short:'Happy birthday! Keep being ridiculously awesome.', full:'Happy birthday! Keep being ridiculously awesome, keep stealing the aux cord, and keep reminding all of us how to have fun. Have the best day ever.'},
  {name:'Darshan', style:'yellow', short:'You make the world softer just by being in it. ✨', full:'You make the world softer just by being in it. Thank you for always listening, always showing up and always bringing snacks. May this year be as gentle and bright as you are.'},
  {name:'Raj', style:'polaroid', emoji:'📸', short:'Still the best photographer of our group. Happy bday!', full:'Still the best photographer of our group, and the only one who remembers everyone’s birthday (so we’d better get yours right!). Wishing you the happiest year yet.'},
  {name:'Yor', style:'pink', short:'Cheers to the queen of good vibes! 🥂', full:'Cheers to the queen of good vibes! Thank you for being the friend who hypes everyone up. Today it’s your turn: go be celebrated, go be spoiled, go be happy.'},
  {name:'Loid', style:'mint', short:'Happy birthday from your favourite troublemaker.', full:'Happy birthday from your favourite troublemaker! Thanks for covering for me more times than I can count. I owe you about a hundred coffees. Let’s start today.'},
  {name:'Soumya', style:'lavender', short:'Wishing you love, laughter and lots of cake. 🍰', full:'Wishing you love, laughter and lots and lots of cake. You are one of the kindest souls I know, and I’m so grateful our paths crossed. Happy, happy birthday!'},
  {name:'Your little sister', style:'yellow', short:'Best big sister in the whole universe. Fact.', full:'Best big sister in the whole universe. That is a scientific fact. Thank you for lending me your clothes (and for pretending not to notice when I don’t give them back). I love you so much. Happy birthday!'}
];

/* Gift box coupons */
const COUPONS = [
  {icon:'🤗', title:'One Big Hug', text:'Redeem anytime, anywhere, for as long as you need. No expiry date, unlimited refills, and extra squeezes included.', serial:'H-0001'},
  {icon:'🌹', title:'A Date of Your Choice', text:'You pick the place, the plan and the dessert. I bring the flowers, the playlist and my undivided attention.', serial:'D-1120'},
  {icon:'💫', title:'Forever Best Friend Card', text:'Grants lifetime access to my secrets, my snacks and my shoulder. Non-transferable. Non-negotiable. Never expires.', serial:'BFF-∞'}
];

/* =========================================================
   PHASE 1 — CORE UTILITIES & ENGINES
   ========================================================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const rand  = (a, b) => Math.random() * (b - a) + a;
const pick  = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad2  = n => String(n).padStart(2, '0');
const RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const safePlay = v => { try { const p = v.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} };

/* ---------- Local assets with placeholder fallback ----------
   Images point at assets/images/…; if a file isn't there yet, swap to its data-fallback placeholder.
   Videos/music use two <source>s, so the browser falls back on its own. */
(() => {
  const useFallback = img => {
    const fb = img.dataset.fallback;
    if (!fb || img.dataset.fellBack) return;
    img.dataset.fellBack = '1';
    img.src = fb;
  };
  document.addEventListener('error', e => {
    const t = e.target;
    if (t && t.tagName === 'IMG') useFallback(t);
  }, true);
  /* Images that already failed before this script ran: reload them so the error is caught */
  $$('img[data-fallback]').forEach(img => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) img.src = img.getAttribute('src');
  });
  /* Video posters */
  $$('video[data-poster-fallback]').forEach(v => {
    const probe = new Image();
    probe.onerror = () => { v.poster = v.dataset.posterFallback; };
    probe.src = v.getAttribute('poster');
  });
})();

/* Shared requestAnimationFrame loop: pauses automatically when the tab is hidden */
const Loop = (() => {
  const fns = new Set(); let id = null, last = 0;
  function tick(t) {
    const dt = Math.min(t - last, 50) || 16.7; last = t;
    fns.forEach(f => f(dt, t));
    id = (fns.size && !document.hidden) ? requestAnimationFrame(tick) : null;
  }
  function start() { if (id || document.hidden || !fns.size) return; last = performance.now(); id = requestAnimationFrame(tick); }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (id) cancelAnimationFrame(id); id = null; } else start();
  });
  return { add(f) { fns.add(f); start(); }, remove(f) { fns.delete(f); } };
})();

/* ---------- Confetti (canvas physics) ---------- */
const Confetti = (() => {
  const c = $('#confetti-canvas'), ctx = c.getContext('2d');
  const colors = ['#f7d6e0', '#b76e79', '#8b2252', '#f3d9a4', '#d4a574', '#ffffff', '#e8a0b4', '#c9a0dc', '#ff8fab'];
  let W = 0, H = 0, parts = [], running = false;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  /* Scale by screen area, but keep it generous on phones */
  const scaled = n => Math.round(n * clamp((W * H) / (1440 * 900), .6, 1) * (RM ? .4 : 1));
  function make(x, y, angle, speed) {
    const r = Math.random();
    return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rot: rand(0, 6.28), vr: rand(-.25, .25),
      tilt: rand(0, 6.28), vt: rand(.05, .16), size: rand(6, 11), color: pick(colors),
      shape: r < .18 ? 'heart' : r < .58 ? 'rect' : 'circle', life: 1, decay: rand(.0045, .009) };
  }
  function add(p) { if (parts.length < 700) parts.push(p); }
  function burst({ x = W / 2, y = H / 2, count = 120, spread = Math.PI * 2, angle = -Math.PI / 2, power = 1 } = {}) {
    if (!W) resize();
    const k = Math.sqrt(H / 800);
    for (let i = 0, n = scaled(count); i < n; i++) add(make(x, y, angle + rand(-spread / 2, spread / 2), rand(4, 12) * power * k));
    start();
  }
  function cannons() {
    burst({ x: 0, y: H, angle: -Math.PI / 3.2, spread: .6, count: 150, power: 1.75 });
    burst({ x: W, y: H, angle: -Math.PI + Math.PI / 3.2, spread: .6, count: 150, power: 1.75 });
  }
  function rain(ms = 2500) {
    const end = performance.now() + ms;
    (function drop() {
      for (let i = 0, n = Math.max(2, scaled(7)); i < n; i++) { const p = make(rand(0, W), -20, Math.PI / 2, rand(1, 3)); p.decay *= .6; add(p); }
      start(); if (performance.now() < end) setTimeout(drop, 60);
    })();
  }
  function heart(s) {
    ctx.beginPath(); ctx.moveTo(0, s * .3);
    ctx.bezierCurveTo(0, 0, -s * .5, 0, -s * .5, s * .3);
    ctx.bezierCurveTo(-s * .5, s * .6, 0, s * .75, 0, s);
    ctx.bezierCurveTo(0, s * .75, s * .5, s * .6, s * .5, s * .3);
    ctx.bezierCurveTo(s * .5, 0, 0, 0, 0, s * .3); ctx.fill();
  }
  function step(dt) {
    const f = dt / 16.7;
    ctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy = Math.min(p.vy + .24 * f, 6.5);
      p.vx *= Math.pow(.985, f);
      p.x += (p.vx + Math.sin(p.tilt) * .7) * f; p.y += p.vy * f;
      p.rot += p.vr * f; p.tilt += p.vt * f; p.life -= p.decay * f;
      if (p.life <= 0 || p.y > H + 40) { parts.splice(i, 1); continue; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life * 2.2); ctx.fillStyle = p.color;
      const flip = Math.abs(Math.cos(p.tilt)) * .8 + .2;
      if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size * .3 * flip, p.size, p.size * .6 * flip);
      else if (p.shape === 'circle') { ctx.beginPath(); ctx.ellipse(0, 0, p.size * .4, p.size * .4 * flip, 0, 0, 6.283); ctx.fill(); }
      else { ctx.scale(1, flip); heart(p.size * 1.1); }
      ctx.restore();
    }
    if (!parts.length) { running = false; Loop.remove(step); ctx.clearRect(0, 0, W, H); }
  }
  function start() { if (!running) { running = true; Loop.add(step); } }
  resize(); window.addEventListener('resize', resize);
  return { burst, cannons, rain, resize };
})();

/* ---------- Balloons (SVG, whole page, always) ---------- */
const Balloons = (() => {
  const layer = $('#balloon-layer');
  const palettes = [['#f7d6e0', '#e3a3b8'], ['#b76e79', '#8f4f59'], ['#8b2252', '#5e1537'], ['#f3d9a4', '#d4a574'],
                    ['#fff5f7', '#efc9d4'], ['#d9b8e8', '#a988c2'], ['#f4a7b9', '#d9748f']];
  let uid = 0;
  const svg = ([a, b], id) =>
    `<svg viewBox="0 0 60 124" aria-hidden="true"><defs><radialGradient id="bl${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".22" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs>` +
    `<path d="M30 2C48 2 58 18 58 34C58 54 42 70 30 72C18 70 2 54 2 34C2 18 12 2 30 2Z" fill="url(#bl${id})"/>` +
    `<path d="M26.5 71.5L33.5 71.5L31.5 77L28.5 77Z" fill="${b}"/>` +
    `<ellipse cx="19" cy="20" rx="5" ry="10" fill="#fff" opacity=".45" transform="rotate(-22 19 20)"/>` +
    `<path d="M30 77C25 88 35 96 29 106C26 113 32 118 30 124" stroke="rgba(120,80,90,.55)" stroke-width="1" fill="none"/></svg>`;
  function spawn({ fast = false, mid = false } = {}) {
    const el = document.createElement('div');
    const w = rand(38, fast ? 95 : 110) * (innerWidth < 600 ? .8 : 1);
    const dur = fast ? rand(7, 12) : rand(14, 26);
    el.className = 'balloon';
    el.style.cssText = `left:${rand(-4, 94)}%;--w:${w.toFixed(0)}px;--dur:${dur.toFixed(1)}s;--delay:${mid ? -rand(0, dur * .8).toFixed(1) : rand(0, fast ? 1.2 : 0).toFixed(2)}s;--sway:${rand(2.5, 4.5).toFixed(1)}s;--sx:${rand(6, 18).toFixed(0)}px;`;
    el.innerHTML = `<div class="balloon__sway">${svg(pick(palettes), ++uid)}</div>`;
    el.addEventListener('animationend', e => { if (e.animationName === 'rise') el.remove(); });
    layer.appendChild(el);
  }
  const target = () => (innerWidth < 600 ? 8 : innerWidth < 1100 ? 10 : 13) * (RM ? .5 : 1);
  function ambient() {
    for (let i = 0; i < target(); i++) spawn({ mid: true });
    setInterval(() => { if (!document.hidden && layer.childElementCount < target()) spawn(); }, 1800);
  }
  function release(n = 12) { for (let i = 0; i < n * (RM ? .5 : 1); i++) setTimeout(() => spawn({ fast: true }), i * 90); }
  return { ambient, release };
})();

/* ---------- Light particles (canvas) ---------- */
const Particles = (() => {
  const c = $('#particles-canvas'), ctx = c.getContext('2d');
  let W, H, ps = [];
  const tints = ['255,255,255', '243,217,164', '247,214,224', '255,230,236'];
  const mk = any => ({ x: rand(0, W), y: any ? rand(0, H) : H + 20, r: rand(1.5, 4.5), vy: rand(.15, .5), vx: rand(-.12, .12), a: rand(.35, .8), tw: rand(0, 6.28), t: pick(tints) });
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(clamp((W * H) / 38000, 16, 38) * (RM ? .5 : 1));
    ps = Array.from({ length: n }, () => mk(true));
  }
  function step(dt) {
    const f = dt / 16.7; ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.y -= p.vy * f; p.x += (p.vx + Math.sin(p.tw) * .15) * f; p.tw += .02 * f;
      if (p.y < -12) Object.assign(p, mk(false));
      const al = p.a * (.55 + .45 * Math.sin(p.tw * 2)), R = p.r * 4;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
      g.addColorStop(0, `rgba(${p.t},${al})`); g.addColorStop(1, `rgba(${p.t},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 6.283); ctx.fill();
    }
  }
  resize(); window.addEventListener('resize', resize); Loop.add(step);
})();

/* ---------- Floating hearts + sparkles (DOM) ---------- */
function spawnFloaters(container, n, colors = ['#8b2252', '#b76e79', '#e8a0b4', '#d4a574', '#ffffff']) {
  if (!container) return;
  const chars = ['♥', '♡', '✦', '✧', '❤', '✿'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n * (RM ? .5 : 1); i++) {
    const s = document.createElement('span');
    const dur = rand(9, 18);
    s.className = 'floater'; s.textContent = pick(chars);
    s.style.cssText = `left:${rand(0, 100).toFixed(1)}%;--size:${rand(.8, 2.1).toFixed(2)}rem;--dur:${dur.toFixed(1)}s;--delay:${(-rand(0, dur)).toFixed(1)}s;--drift:${rand(-40, 40).toFixed(0)}px;color:${pick(colors)};`;
    frag.appendChild(s);
  }
  container.appendChild(frag);
}

/* ---------- Popup manager ---------- */
const Popup = (() => {
  const root = $('#popup'), card = $('.popup__card', root), body = $('.popup__body', root);
  let isOpen = false, lastFocus = null, onClose = null, y = 0, clearT;
  function lock() {
    y = window.scrollY;
    document.documentElement.style.scrollBehavior = 'auto';
    Object.assign(document.body.style, { position: 'fixed', top: `-${y}px`, left: '0', right: '0', width: '100%' });
  }
  function unlock() {
    Object.assign(document.body.style, { position: '', top: '', left: '', right: '', width: '' });
    window.scrollTo(0, y);
    requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = ''; });
  }
  function show({ html = '', node = null, variant = '', label = 'Message', confetti = false, onOpen, onClose: oc } = {}) {
    clearTimeout(clearT);
    body.innerHTML = '';
    if (node) body.appendChild(node); else body.innerHTML = html;
    card.className = 'popup__card' + (variant ? ` popup__card--${variant}` : '');
    root.setAttribute('aria-label', label);
    onClose = oc || null;
    if (!isOpen) {
      lastFocus = document.activeElement; lock();
      root.hidden = false; void root.offsetWidth;
      root.classList.add('is-open'); root.setAttribute('aria-hidden', 'false'); isOpen = true;
    }
    body.scrollTop = 0;
    setTimeout(() => card.focus({ preventScroll: true }), 60);
    if (confetti) Confetti.burst({ y: innerHeight * .3, count: 90 });
    if (onOpen) onOpen(body);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false; root.classList.remove('is-open'); root.setAttribute('aria-hidden', 'true');
    unlock();
    const cb = onClose; onClose = null; if (cb) cb();
    clearT = setTimeout(() => { root.hidden = true; body.innerHTML = ''; }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  root.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', e => {
    if (!isOpen) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      const f = $$('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])', card).filter(el => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  return { show, close, get isOpen() { return isOpen; }, body };
})();

/* Fill name/age everywhere, and clone a template with the name filled in */
function fillPersonal(scope = document) {
  $$('[data-name]', scope).forEach(el => { el.textContent = CONFIG.name; });
  $$('[data-age]', scope).forEach(el => { el.textContent = CONFIG.age; });
}
function tpl(id) { const n = document.getElementById(id).content.cloneNode(true); fillPersonal(n); return n; }

/* ---------- Scroll reveal ---------- */
const Reveal = (() => {
  $$('[data-stagger]').forEach(p => Array.from(p.children).forEach((c, i) => c.style.setProperty('--i', i % 8)));
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  function observe(el) { if (io) io.observe(el); else el.classList.add('is-visible'); }
  return { init() { $$('[data-reveal]').forEach(observe); }, observe };
})();

/* ---------- Tilt (mouse hover + touch press) ---------- */
const Tilt = {
  bind(el) {
    const set = (e, amt, s) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--rx', `${(-py * amt).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(px * amt * 1.2).toFixed(2)}deg`);
      el.style.setProperty('--s', s);
    };
    const reset = () => ['--rx', '--ry', '--s'].forEach(p => el.style.removeProperty(p));
    el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') set(e, 12, 1.05); });
    el.addEventListener('pointerleave', reset);
    el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') set(e, 9, .97); });
    el.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') setTimeout(reset, 200); });
    el.addEventListener('pointercancel', reset);
  }
};

/* ---------- Parallax (scroll-driven, so it works on touch too) ---------- */
const Parallax = (() => {
  const els = $$('[data-parallax]');
  const hero = $('.hero__media');
  function update() {
    const vh = innerHeight;
    if (hero) hero.style.setProperty('--py', `${(Math.min(window.scrollY, vh * 1.2) * .35).toFixed(1)}px`);
    els.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const off = (vh / 2 - (r.top + r.height / 2)) * parseFloat(el.dataset.parallax);
      el.style.setProperty('--py', `${off.toFixed(1)}px`);
    });
  }
  return { update };
})();

/* =========================================================
   PHASE 2 — WELCOME + HERO
   ========================================================= */
function splitChars(el, startIndex = 0) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  let i = startIndex;
  text.split(/\s+/).forEach((w, wi, arr) => {
    const ws = document.createElement('span'); ws.className = 'word'; ws.setAttribute('aria-hidden', 'true');
    for (const ch of w) { const s = document.createElement('span'); s.className = 'char'; s.textContent = ch; s.style.setProperty('--i', i++); ws.appendChild(s); }
    el.appendChild(ws);
    if (wi < arr.length - 1) { el.appendChild(document.createTextNode(' ')); i++; }
  });
  return i;
}

/* ---------- Music ---------- */
const Music = (() => {
  const a = $('#bg-music');
  const toggles = $$('[data-music="toggle"]'), mutes = $$('[data-music="mute"]');
  let fadeT;
  function ui() {
    const on = !a.paused;
    document.body.classList.toggle('music-on', on);
    toggles.forEach(b => {
      b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Pause our song' : 'Play our song');
      const l = $('.label', b); if (l) l.textContent = on ? 'Pause our song' : 'Play our song';
      const ic = $('[data-music-icon]', b); if (ic) ic.textContent = on ? '❚❚' : '▶';
    });
    mutes.forEach(b => {
      b.setAttribute('aria-pressed', a.muted); b.setAttribute('aria-label', a.muted ? 'Unmute' : 'Mute');
      const l = $('.label', b); if (l) l.textContent = a.muted ? 'Unmute' : 'Mute';
      const ic = $('[data-mute-icon]', b); if (ic) ic.textContent = a.muted ? '🔇' : '🔊';
    });
  }
  function fadeTo(t, ms = 2000) {
    clearInterval(fadeT); const s = a.volume, st = performance.now();
    fadeT = setInterval(() => { const k = Math.min(1, (performance.now() - st) / ms); try { a.volume = s + (t - s) * k; } catch (e) {} if (k >= 1) clearInterval(fadeT); }, 50);
  }
  function play() {
    try { a.volume = 0; } catch (e) {}
    const p = a.play();
    if (p && p.then) p.then(() => fadeTo(.35)).catch(() => ui()); else fadeTo(.35);
  }
  function toggle() { if (a.paused) play(); else a.pause(); }
  a.addEventListener('play', ui); a.addEventListener('pause', ui); a.addEventListener('volumechange', ui);
  toggles.forEach(b => b.addEventListener('click', toggle));
  mutes.forEach(b => b.addEventListener('click', () => { a.muted = !a.muted; }));
  ui();
  return { unlock() { if (a.paused) play(); } };
})();

/* ---------- Countdown ---------- */
const Countdown = (() => {
  const wrap = $('#countdown'), label = $('#countdown-label');
  const nums = { d: $('[data-unit="d"]'), h: $('[data-unit="h"]'), m: $('[data-unit="m"]'), s: $('[data-unit="s"]') };
  let timer = null, isToday = false;
  const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  function set(k, v) {
    const el = nums[k], s = pad2(v);
    if (el.textContent !== s) { el.textContent = s; el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
  }
  function tick() {
    const now = new Date(), y = now.getFullYear(), M = CONFIG.birthdayMonth - 1, D = CONFIG.birthdayDay;
    const start = new Date(y, M, D), end = new Date(y, M, D + 1);
    if (now >= start && now < end) {
      isToday = true; clearInterval(timer);
      label.textContent = `Today is ${fmt(start)}, the best day of the year`;
      wrap.innerHTML = '<p class="countdown__today">It’s your day! 🎉</p>';
      return;
    }
    const target = now < start ? start : new Date(y + 1, M, D);
    label.textContent = `Counting down to ${fmt(target)}`;
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5);  diff -= h * 36e5;
    const m = Math.floor(diff / 6e4);   diff -= m * 6e4;
    set('d', d); set('h', h); set('m', m); set('s', Math.floor(diff / 1000));
  }
  return { start() { tick(); if (!isToday) timer = setInterval(tick, 1000); }, get isToday() { return isToday; } };
})();

/* ---------- Welcome sequence ---------- */
const Welcome = (() => {
  const overlay = $('#welcome'), gift = $('#welcome-gift'), btn = $('#welcome-open'), main = $('#main');
  let opened = false;
  function lockPage() {
    document.documentElement.classList.add('is-locked');
    main.inert = true; main.setAttribute('aria-hidden', 'true');
    $('.site-footer').inert = true;
  }
  function open() {
    if (opened) return; opened = true;
    gift.classList.add('is-open');
    const r = gift.getBoundingClientRect();
    Confetti.burst({ x: r.left + r.width / 2, y: r.top + r.height * .35, count: 220, power: 1.25 });
    Music.unlock();
    setTimeout(() => {
      overlay.classList.add('is-leaving');
      document.documentElement.classList.remove('is-locked');
      main.inert = false; main.removeAttribute('aria-hidden'); $('.site-footer').inert = false;
      Balloons.release(14);
      Confetti.cannons();
      $('#hero').classList.add('is-revealed');
      safePlay($('.hero__video'));
      if (Countdown.isToday) setTimeout(() => Confetti.rain(3000), 1600);
    }, 700);
    setTimeout(() => overlay.remove(), 1900);
  }
  lockPage();
  spawnFloaters($('#welcome-floaters'), 16);
  gift.addEventListener('click', open); btn.addEventListener('click', open);
  setTimeout(() => btn.focus({ preventScroll: true }), 400);
})();

/* =========================================================
   PHASE 3 — LOVE LETTER (typewriter)
   ========================================================= */
const Letter = (() => {
  const card = $('#letter-card'), typed = $('#letter-typed'), ghost = $('#letter-ghost');
  const text = LETTER_SHORT.replace('{name}', CONFIG.name);
  ghost.textContent = text; $('#letter-sr').textContent = text;
  let started = false;
  function type() {
    if (started) return; started = true;
    if (RM) { typed.textContent = text; card.classList.add('is-signed'); return; }
    let i = 0; typed.classList.add('is-typing');
    (function step() {
      i++; typed.textContent = text.slice(0, i);
      const ch = text[i - 1];
      let d = 22 + rand(-8, 12);
      if ('.!?'.includes(ch)) d = 380; else if (',;'.includes(ch)) d = 170; else if (ch === '\n') d = 220;
      if (i < text.length) setTimeout(step, d);
      else { typed.classList.remove('is-typing'); card.classList.add('is-signed'); }
    })();
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { type(); io.disconnect(); } }, { threshold: .35 });
    io.observe(card);
  } else type();
  $('#letter-more').addEventListener('click', () =>
    Popup.show({ node: tpl('tpl-letter'), variant: 'paper', label: 'My full letter', confetti: true }));
})();

/* =========================================================
   PHASE 4 — PHOTOS: carousel, drag slider, lightbox
   ========================================================= */
const PHOTOS = $$('#carousel .carousel__slide').map(s => {
  const img = $('img', s);
  return { src: img.getAttribute('src'), fallback: img.dataset.fallback || '', caption: s.dataset.caption };
});

const Lightbox = (() => {
  let idx = 0, active = false;
  const html = () => {
    const it = PHOTOS[idx];
    return `<figure class="lightbox"><div class="lightbox__frame"><img class="lightbox__img" src="${it.src}" data-fallback="${it.fallback}" alt="${it.caption}" draggable="false"></div>
      <figcaption class="lightbox__cap"><span class="lightbox__count">${pad2(idx + 1)} / ${pad2(PHOTOS.length)}</span><span class="lightbox__text">${it.caption}</span></figcaption>
      <div class="lightbox__nav"><button class="btn-icon" type="button" data-lb="-1" aria-label="Previous photo">‹</button><button class="btn-icon" type="button" data-lb="1" aria-label="Next photo">›</button></div></figure>`;
  };
  function go(d) {
    if (!active) return;
    idx = (idx + d + PHOTOS.length) % PHOTOS.length;
    const b = Popup.body, img = $('.lightbox__img', b);
    if (!img) return;
    img.classList.add('is-swapping');
    setTimeout(() => {
      img.dataset.fallback = PHOTOS[idx].fallback; delete img.dataset.fellBack;
      img.src = PHOTOS[idx].src; img.alt = PHOTOS[idx].caption;
      $('.lightbox__text', b).textContent = PHOTOS[idx].caption;
      $('.lightbox__count', b).textContent = `${pad2(idx + 1)} / ${pad2(PHOTOS.length)}`;
      img.classList.remove('is-swapping');
    }, 200);
  }
  function bind(b) {
    $$('[data-lb]', b).forEach(btn => btn.addEventListener('click', () => go(+btn.dataset.lb)));
    const frame = $('.lightbox__frame', b); let sx = 0, sy = 0, down = false;
    frame.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sy = e.clientY; });
    frame.addEventListener('pointerup', e => {
      if (!down) return; down = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    });
    frame.addEventListener('pointercancel', () => { down = false; });
  }
  function open(i) {
    idx = i; active = true;
    Popup.show({ html: html(), variant: 'lightbox', label: `Photo: ${PHOTOS[idx].caption}`, onOpen: bind, onClose: () => { active = false; } });
  }
  document.addEventListener('keydown', e => { if (active && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) go(e.key === 'ArrowRight' ? 1 : -1); });
  return { open };
})();

const Carousel = (() => {
  const root = $('#carousel'), vp = $('.carousel__viewport', root), slides = $$('.carousel__slide', root);
  const dotsWrap = $('.carousel__dots', root), count = $('.carousel__count', root);
  let i = 0, visible = false, hold = false, holdT;
  slides.forEach((s, k) => {
    const d = document.createElement('button'); d.type = 'button'; d.className = 'carousel__dot';
    d.setAttribute('aria-label', `Show photo ${k + 1}: ${s.dataset.caption}`);
    d.addEventListener('click', () => { go(k); interact(); }); dotsWrap.appendChild(d);
  });
  const dots = $$('.carousel__dot', root);
  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
    count.textContent = `${pad2(i + 1)} / ${pad2(slides.length)}`;
    const nx = $('img', slides[(i + 1) % slides.length]); if (nx) nx.loading = 'eager';
  }
  function interact() { hold = true; clearTimeout(holdT); holdT = setTimeout(() => { hold = false; }, 6000); }
  setInterval(() => { if (visible && !hold && !document.hidden && !Popup.isOpen) go(i + 1); }, 4500);
  $('.carousel__arrow--prev', root).addEventListener('click', () => { go(i - 1); interact(); });
  $('.carousel__arrow--next', root).addEventListener('click', () => { go(i + 1); interact(); });
  vp.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { go(i + 1); interact(); }
    else if (e.key === 'ArrowLeft') { go(i - 1); interact(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Lightbox.open(i); }
  });
  /* Swipe + tap (pointer events: mouse and touch alike) */
  let sx = 0, sy = 0, st = 0, dx = 0, down = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; sx = e.clientX; sy = e.clientY; st = performance.now(); dx = 0;
    vp.classList.add('is-dragging');
    try { vp.setPointerCapture(e.pointerId); } catch (_) {}
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    dx = e.clientX - sx;
    if (Math.abs(dx) > Math.abs(e.clientY - sy)) slides[i].style.transform = `translateX(${(dx * .35).toFixed(1)}px)`;
  });
  function end(e) {
    if (!down) return; down = false;
    vp.classList.remove('is-dragging'); slides[i].style.transform = '';
    const v = Math.abs(dx) / Math.max(1, performance.now() - st);
    if (Math.abs(dx) > 40 || (v > .5 && Math.abs(dx) > 15)) { go(dx < 0 ? i + 1 : i - 1); interact(); }
    else if (e.type === 'pointerup' && Math.abs(dx) < 8 && Math.abs(e.clientY - sy) < 8) Lightbox.open(i);
  }
  vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: .3 }).observe(root);
  else visible = true;
  go(0);
})();

const DragSlider = (() => {
  const vp = $('#drag-slider'), track = $('.drag-slider__track', vp);
  PHOTOS.forEach((p, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'polaroid polaroid--slide'; b.dataset.index = k;
    b.style.setProperty('--rot', `${rand(-4.5, 4.5).toFixed(1)}deg`);
    b.setAttribute('aria-label', `Open photo: ${p.caption}`);
    const img = document.createElement('img'); if (p.fallback) img.dataset.fallback = p.fallback; img.src = p.src; img.alt = p.caption; img.loading = 'lazy'; img.decoding = 'async'; img.draggable = false;
    const cap = document.createElement('span'); cap.className = 'polaroid__cap'; cap.textContent = p.caption;
    b.append(img, cap);
    b.addEventListener('click', e => { if (e.detail === 0) Lightbox.open(k); }); // keyboard activation only
    track.appendChild(b);
  });
  let x = 0, v = 0, min = 0, down = false, sx = 0, sx0 = 0, lx = 0, lt = 0, moved = 0, target = null, raf = 0;
  const set = () => { track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`; };
  const bounds = () => { min = Math.min(0, vp.clientWidth - track.scrollWidth); };
  function glide() {
    cancelAnimationFrame(raf);
    const tick = () => {
      if (x > 0 || x < min) {
        const b = x > 0 ? 0 : min; x += (b - x) * .18; v *= .5;
        if (Math.abs(b - x) < .5) { x = b; set(); return; }
      } else {
        x += v; v *= .94;
        if (Math.abs(v) < .15) { set(); return; }
      }
      set(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    bounds(); down = true; moved = 0; sx = lx = e.clientX; sx0 = x; lt = performance.now(); v = 0;
    target = e.target.closest('.polaroid'); cancelAnimationFrame(raf);
    vp.classList.add('is-grabbing');
    try { vp.setPointerCapture(e.pointerId); } catch (_) {}
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
    let nx = sx0 + dx;
    if (nx > 0) nx *= .35; else if (nx < min) nx = min + (nx - min) * .35;
    x = nx;
    const now = performance.now(); v = (e.clientX - lx) / Math.max(1, now - lt) * 16; lx = e.clientX; lt = now;
    set();
  });
  function release(e) {
    if (!down) return; down = false; vp.classList.remove('is-grabbing');
    if (e.type === 'pointerup' && moved < 6 && target) Lightbox.open(+target.dataset.index);
    else glide();
  }
  vp.addEventListener('pointerup', release); vp.addEventListener('pointercancel', release);
  vp.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); bounds(); v = 0; x = clamp(x + (e.key === 'ArrowRight' ? -260 : 260), min, 0);
    track.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)'; set();
    setTimeout(() => { track.style.transition = ''; }, 520);
  });
  window.addEventListener('resize', () => { bounds(); x = clamp(x, min, 0); set(); });
})();

/* =========================================================
   PHASE 5 — VIDEO MEMORIES (+ hero video visibility)
   ========================================================= */
const Videos = (() => {
  $$('.video-card').forEach(card => {
    const v = $('video', card), btn = $('.video-card__toggle', card);
    let hovering = false;
    const sync = () => { card.classList.toggle('is-paused', v.paused); btn.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video'); $('.video-card__state', card).textContent = v.paused ? '▶' : '❚❚'; };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    btn.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovering = true; v.pause(); } });
    btn.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hovering = false; if (v.dataset.userPaused !== '1') safePlay(v); } });
    btn.addEventListener('click', () => {
      if (hovering) { const up = v.dataset.userPaused === '1'; v.dataset.userPaused = up ? '0' : '1'; if (up) safePlay(v); }
      else if (v.paused) { v.dataset.userPaused = '0'; safePlay(v); }
      else { v.dataset.userPaused = '1'; v.pause(); }
    });
  });
  /* Pause off-screen videos, resume visible ones (unless the user paused them) */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      const v = en.target;
      if (en.isIntersecting) { if (v.dataset.userPaused !== '1' && !document.documentElement.classList.contains('is-locked')) safePlay(v); }
      else v.pause();
    }), { threshold: .15 });
    $$('video').forEach(v => io.observe(v));
  }
})();

/* =========================================================
   PHASE 6 — TIMELINE (line draws in on scroll)
   ========================================================= */
const Timeline = (() => {
  const list = $('#timeline-list'), line = $('.timeline__line', list);
  return {
    update() {
      const r = list.getBoundingClientRect();
      const p = clamp((innerHeight * .65 - r.top) / r.height, 0, 1);
      line.style.setProperty('--p', p.toFixed(3));
    }
  };
})();

/* =========================================================
   PHASE 7 — WISHES WALL (+ localStorage)
   ========================================================= */
const Wishes = (() => {
  const board = $('#wish-board'), form = $('#wish-form'), nameIn = $('#wish-name'), msgIn = $('#wish-msg');
  const counter = $('#wish-count'), status = $('#wish-status');
  const KEY = 'bday-wishes-v1';
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter(w => w && typeof w.name === 'string' && typeof w.full === 'string').slice(0, 60) : [];
    } catch (e) { return []; }
  }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }
  let saved = load();

  function openWish(w) {
    const wrap = document.createElement('div');
    const eb = document.createElement('p'); eb.className = 'eyebrow'; eb.textContent = w.user ? 'a wish pinned just now' : 'a birthday wish';
    const h = document.createElement('h3'); h.textContent = `From ${w.name} ♥`;
    const p = document.createElement('p'); p.textContent = w.full;
    wrap.append(eb, h, p);
    Popup.show({ node: wrap, variant: 'note', label: `Wish from ${w.name}` });
    Confetti.burst({ y: innerHeight * .35, count: 45, power: .8 });
  }
  function noteEl(w, i) {
    const b = document.createElement('button');
    b.type = 'button';
    const style = ['yellow', 'pink', 'mint', 'lavender', 'polaroid'].includes(w.style) ? w.style : 'yellow';
    b.className = `note note--${style}` + (i % 3 === 1 ? ' note--tape' : '');
    b.style.setProperty('--rot', `${(typeof w.rot === 'number' ? w.rot : rand(-5, 5)).toFixed(1)}deg`);
    b.setAttribute('aria-label', `Read the wish from ${w.name}`);
    if (style === 'polaroid') { const ph = document.createElement('span'); ph.className = 'note__photo'; ph.setAttribute('aria-hidden', 'true'); ph.textContent = w.emoji || '📷'; b.appendChild(ph); }
    const t = document.createElement('span'); t.className = 'note__text'; t.textContent = w.short || w.full;
    const f = document.createElement('span'); f.className = 'note__from'; f.textContent = `— ${w.name}`;
    b.append(t, f);
    b.addEventListener('click', () => openWish(w));
    Tilt.bind(b);
    return b;
  }
  saved.forEach((w, i) => board.appendChild(noteEl(w, i)));
  WISHES.forEach((w, i) => board.appendChild(noteEl(w, i + saved.length)));

  msgIn.addEventListener('input', () => { counter.textContent = `${msgIn.value.length} / 240`; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameIn.value.trim().slice(0, 40), msg = msgIn.value.trim().slice(0, 240);
    if (!name || !msg) { status.textContent = 'Write a name and a little wish first ♥'; (name ? msgIn : nameIn).focus(); return; }
    const w = { name, full: msg, short: msg.length > 90 ? msg.slice(0, 87) + '…' : msg,
                style: pick(['yellow', 'pink', 'mint', 'lavender']), rot: +rand(-5, 5).toFixed(1), user: true, t: Date.now() };
    saved.unshift(w);
    const ok = save(saved);
    const el = noteEl(w, 0); el.classList.add('is-new'); board.prepend(el);
    form.reset(); counter.textContent = '0 / 240';
    status.textContent = ok ? 'Pinned! Your wish is on the wall ✨' : 'Pinned for now ✨ (this browser can’t save it permanently)';
    el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => { const r = el.getBoundingClientRect(); Confetti.burst({ x: r.left + r.width / 2, y: r.top + 20, count: 80 }); }, 500);
  });
})();

/* =========================================================
   PHASE 8 — CAKE
   ========================================================= */
const Cake = (() => {
  const cake = $('#cake-el'), btn = $('#wish-btn');
  let out = false;
  btn.addEventListener('click', () => {
    if (!out) {
      out = true; cake.classList.add('is-out'); btn.disabled = true;
      cake.setAttribute('aria-label', 'A birthday cake. The candles have been blown out.');
      setTimeout(() => {
        const r = cake.getBoundingClientRect();
        Confetti.burst({ x: r.left + r.width / 2, y: r.top + r.height * .25, count: 220, power: 1.2 });
        Balloons.release(7);
        Popup.show({ node: tpl('tpl-cake'), variant: 'paper', label: 'Your wish is on its way' });
        btn.disabled = false; btn.innerHTML = 'Light the candles again <span aria-hidden="true">🕯️</span>';
      }, 1100);
    } else {
      out = false; cake.classList.remove('is-out');
      cake.setAttribute('aria-label', 'A birthday cake with five lit candles');
      btn.innerHTML = 'Make a Wish <span aria-hidden="true">✨</span>';
    }
  });
})();

/* =========================================================
   PHASE 9 — SCRATCH CARD + GIFT BOXES
   ========================================================= */
const Scratch = (() => {
  const wrap = $('#scratch'), cv = $('.scratch__canvas', wrap);
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  let w = 0, h = 0, drawing = false, last = null, revealed = false, moves = 0, lastW = 0;
  function paint() {
    const r = wrap.getBoundingClientRect(); if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height; lastW = w;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#e8b4b8'); g.addColorStop(.3, '#b76e79'); g.addColorStop(.5, '#f3d9a4'); g.addColorStop(.7, '#b76e79'); g.addColorStop(1, '#8b2252');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,255,${rand(.15, .55).toFixed(2)})`; ctx.beginPath(); ctx.arc(rand(0, w), rand(0, h), rand(.6, 2), 0, 6.283); ctx.fill(); }
    ctx.fillStyle = '#fff5f7'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `italic 700 ${Math.round(clamp(w / 15, 17, 30))}px "Playfair Display", Georgia, serif`;
    ctx.fillText('Scratch to reveal', w / 2, h / 2 - 12);
    ctx.font = `500 ${Math.round(clamp(w / 34, 10, 13))}px "DM Mono", monospace`;
    ctx.fillText('♥  YOUR SURPRISE  ♥', w / 2, h / 2 + 20);
    revealed = false; moves = 0; cv.classList.remove('is-gone'); wrap.classList.remove('is-revealed');
  }
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function scratch(p) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = clamp(w * .11, 30, 52);
    ctx.beginPath(); ctx.moveTo((last || p).x, (last || p).y); ctx.lineTo(p.x + .01, p.y + .01); ctx.stroke();
    last = p;
    if (++moves % 6 === 0) check();
  }
  function check() {
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 4 * 23) { total++; if (d[i] < 128) clear++; }
    if (total && clear / total > .55) reveal();
  }
  function reveal() {
    if (revealed) return; revealed = true; drawing = false;
    cv.classList.add('is-gone'); wrap.classList.add('is-revealed');
    const r = wrap.getBoundingClientRect();
    Confetti.burst({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 150 });
  }
  cv.addEventListener('pointerdown', e => { if (revealed) return; drawing = true; last = null; try { cv.setPointerCapture(e.pointerId); } catch (_) {} scratch(pos(e)); });
  cv.addEventListener('pointermove', e => { if (drawing) scratch(pos(e)); });
  const stop = () => { if (drawing) { drawing = false; last = null; if (!revealed) check(); } };
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
  $('#scratch-reveal').addEventListener('click', reveal);
  $('#scratch-reset').addEventListener('click', paint);
  window.addEventListener('resize', () => { const r = wrap.getBoundingClientRect(); if (!revealed && Math.abs(r.width - lastW) > 2) paint(); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(paint);
  paint();
})();

const Gifts = (() => {
  $$('[data-coupon]').forEach(g => {
    g.addEventListener('click', () => {
      const c = COUPONS[+g.dataset.coupon];
      const wasOpen = g.classList.contains('is-open');
      g.classList.remove('is-open'); void g.offsetWidth; g.classList.add('is-open');
      const r = g.getBoundingClientRect();
      Confetti.burst({ x: r.left + r.width / 2, y: r.top + r.height * .4, count: 90, power: .9 });
      setTimeout(() => Popup.show({
        html: `<div class="coupon"><p class="eyebrow">Coupon № ${c.serial}</p><span class="coupon__icon" aria-hidden="true">${c.icon}</span><h3>${c.title}</h3><p>${c.text}</p><div class="coupon__foot"><span>Valid: forever</span><span>For: <span data-name></span></span></div></div>`,
        variant: 'coupon', label: `Coupon: ${c.title}`, onOpen: fillPersonal
      }), wasOpen ? 150 : 650);
    });
  });
})();

/* =========================================================
   PHASE 10 — REASONS: marquee + flip cards
   ========================================================= */
(() => {
  const mq = $('#marquee');
  mq.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') mq.classList.add('is-paused'); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => mq.addEventListener(t, () => mq.classList.remove('is-paused')));
  $$('.flip').forEach((f, i) => {
    f.style.setProperty('--i', i);
    f.addEventListener('click', () => {
      const on = f.classList.toggle('is-flipped');
      f.setAttribute('aria-pressed', String(on));
      if (on) { const r = f.getBoundingClientRect(); Confetti.burst({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 24, power: .55 }); }
    });
  });
})();

/* =========================================================
   PHASE 11 — FINALE, FOOTER & FLOATING UI
   ========================================================= */
const Finale = (() => {
  const sec = $('#finale');
  fillPersonal(sec);
  let n = 0; $$('[data-split]', sec).forEach(el => { n = splitChars(el, n); });
  spawnFloaters($('#finale-floaters'), 22, ['#f3d9a4', '#f7d6e0', '#ffffff', '#ff8fab']);
  let fired = false;
  function fire() {
    if (fired) return; fired = true;
    sec.classList.add('is-live');
    Confetti.cannons(); Balloons.release(16);
    setTimeout(() => Confetti.cannons(), 900);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { fire(); io.disconnect(); } }, { threshold: .45 });
    io.observe(sec);
  } else sec.classList.add('is-live');
  $('#finale-btn').addEventListener('click', () => {
    Popup.show({ node: tpl('tpl-finale'), variant: 'finale', label: 'One last thing' });
    Confetti.rain(3200);
  });
})();

(() => {
  const fab = $('#fab-confetti'), top = $('#to-top');
  fab.addEventListener('click', () => {
    const r = fab.getBoundingClientRect();
    Confetti.burst({ x: r.left + r.width / 2, y: r.top, count: 150, angle: -Math.PI / 2.4, spread: 1.4, power: 1.35 });
    Confetti.burst({ x: innerWidth / 2, y: innerHeight * .4, count: 70 });
  });
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));

  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (Popup.isOpen) return;
      Parallax.update(); Timeline.update();
      top.classList.toggle('is-visible', window.scrollY > innerHeight * .8);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();

/* =========================================================
   INIT
   ========================================================= */
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  document.title = `Happy Birthday, ${CONFIG.name} ♥`;
  fillPersonal();
  splitChars($('#hero-name'));
  spawnFloaters($('#hero-floaters'), 18);
  Balloons.ambient();
  Countdown.start();
  Reveal.init();
})();
