import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHero } from './hero.js';
import { FLAGSHIP, WORK, CATS, SOCIALS, EMAIL, DAY, STACK, CERTS } from './data.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const arrow = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';

// ------------------------------------------------------------ content
$('#marquee').innerHTML = [...STACK, ...STACK].map((s) => `<span>${esc(s)}</span>`).join('');

const COLORS = { ovrix: '#5EEAD4', kaapo: '#8B9CFF', godview: '#7CC4FF', ruby: '#F472B6', saathi: '#34d399' };
$('#flagships').innerHTML = FLAGSHIP.map((f, i) => `
  <article class="flag reveal" style="--c:${COLORS[f.id]}" data-art="${f.art}" id="p-${f.id}">
    <div class="flag-copy">
      <div class="flag-top mono"><span>${String(i + 1).padStart(2, '0')} / ${String(FLAGSHIP.length).padStart(2, '0')}</span><span class="kind">${esc(f.kind)}</span></div>
      <div>
        <h3>${esc(f.name)}</h3>
        <p class="line1">${esc(f.line)}</p>
      </div>
      <div style="display:grid;gap:22px">
        <p class="body">${esc(f.body)}</p>
        <ul class="chips">${f.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        ${f.url ? `<div><a class="btn primary magnetic" href="${esc(f.url)}" target="_blank" rel="noopener" data-cursor="Open">${esc(f.cta)} ${arrow}</a></div>` : '<div><span class="mono" style="color:var(--dim)">Pilot with family · public launch soon</span></div>'}
      </div>
    </div>
    <div class="flag-art">${art(f)}</div>
  </article>`).join('');

function art(f) {
  if (f.art === 'agents') {
    const specs = ['Design', 'Web', 'Video', 'Brand', 'Social', 'Copy', 'SEO', 'Ads'];
    const W = 520, H = 420, cx = W / 2;
    const nodes = specs.map((s, i) => {
      const a = (-160 + (i * 140) / 7) * Math.PI / 180;
      return { s, x: cx + Math.cos(a) * 190, y: 250 + Math.sin(a) * 150 };
    });
    const desk = [['Support', 90, 380], ['Billing', 260, 380], ['Watchdog', 430, 380]];
    return `<div class="art-agents"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagram: a Manager agent connected to 8 specialist agents and a front desk of Support, Billing and Watchdog">
      ${nodes.map((n) => `<line class="ln" x1="${cx}" y1="250" x2="${n.x}" y2="${n.y}"/>`).join('')}
      ${desk.map(([, x, y]) => `<line class="ln" x1="${cx}" y1="250" x2="${x}" y2="${y}"/>`).join('')}
      ${nodes.map((n, i) => `<circle class="pkt" r="3"><animateMotion dur="${2.2 + (i % 3) * 0.5}s" begin="${i * 0.3}s" repeatCount="indefinite" path="M${cx},250 L${n.x},${n.y}"/></circle>`).join('')}
      <g class="ag mgr"><rect x="${cx - 62}" y="232" width="124" height="36" rx="18"/><text x="${cx}" y="255" text-anchor="middle">MANAGER</text></g>
      ${nodes.map((n, i) => `<g class="ag" data-i="${i}"><rect x="${n.x - 40}" y="${n.y - 14}" width="80" height="28" rx="14"/><text x="${n.x}" y="${n.y + 4}" text-anchor="middle">${n.s.toUpperCase()}</text></g>`).join('')}
      ${desk.map(([s, x, y]) => `<g class="ag on"><rect x="${x - 48}" y="${y - 14}" width="96" height="28" rx="14"/><text x="${x}" y="${y + 4}" text-anchor="middle">${s.toUpperCase()}</text></g>`).join('')}
    </svg></div>`;
  }
  if (f.art === 'timeline') {
    return `<div class="art-tl" aria-hidden="true">
      <div class="tl-screen"><div class="face"></div><div class="cap" id="tlCap">I built an AI that <b>edits my reels</b></div></div>
      <div class="tl-chat"><span id="tlType"></span><span class="caret"></span></div>
      <div class="tl-track">${[3, 1, 4, 1, 2, 1, 3].map((w, i) => `<i style="--w:${w}" class="${i % 2 ? 'gap' : ''}"></i>`).join('')}</div>
    </div>`;
  }
  if (f.art === 'live') {
    return `<div class="art-live" id="liveArt"><div class="poster"></div>
      <div class="live-cover" role="button" tabindex="0" aria-label="Load God View live here"><span><b>● LIVE · TAP TO PLAY HERE</b></span></div></div>`;
  }
  if (f.art === 'orb') {
    return `<div class="art-orb" id="orbArt" data-s="idle" aria-hidden="true">
      <div class="orb-langs"><span>English</span><span>हिन्दी</span><span>ગુજરાતી</span></div>
      <div class="orb"></div><p class="orb-state mono">Ruby is <b id="orbState">idle</b></p></div>`;
  }
  return `<div class="art-chat" id="chatArt" aria-hidden="true">
    <div class="bub in"><small>Dadi</small>Mare 2 litre doodh ane BP ni dawa joie che</div>
    <div class="bub out"><small>Saathi</small>Done! Milk 2 L + your BP tablets, ₹312. Sent to Krishil to approve.</div>
    <div class="bub in"><small>Krishil · Guardian</small>Approved ✓</div>
    <div class="bub ok">Order placed · arriving in 25 min</div></div>`;
}

// index
const counts = WORK.reduce((m, w) => ((m[w.cat] = (m[w.cat] || 0) + 1), m), {});
$('#filters').innerHTML = Object.entries(CATS).map(([k, v], i) =>
  `<button role="tab" aria-selected="${i === 0}" data-f="${k}">${v}<sup>${k === 'all' ? WORK.length : counts[k] || 0}</sup></button>`).join('');
$('#rows').innerHTML = WORK.map((w, i) => `
  <li data-cat="${w.cat}"><button type="button" data-i="${i}" ${w.img ? `data-img="${w.img}"` : ''} data-cursor="View">
    <span class="r-t">${esc(w.t)}</span>
    <span class="r-d">${esc(w.d)}</span>
    <span class="r-c mono">${esc(CATS[w.cat])}${arrow}</span>
  </button></li>`).join('');
$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  $$('#filters button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  const f = b.dataset.f;
  $$('#rows li').forEach((li) => li.classList.toggle('out', f !== 'all' && li.dataset.cat !== f));
  ScrollTrigger.refresh();
});

// drawer
const drawer = $('#drawer'), dBody = $('#drawerBody');
let lastFocus = null;
function openDrawer(w) {
  lastFocus = document.activeElement;
  const media = w.video
    ? `<video src="${esc(w.video)}" ${w.img ? `poster="${esc(w.img)}"` : ''} controls playsinline preload="metadata"></video>`
    : w.img ? `<img class="dimg" src="${esc(w.img)}" alt="${esc(w.t)}">` : '';
  dBody.innerHTML = `<span class="mono kind">${esc(CATS[w.cat])}</span><h3 id="drawerTitle">${esc(w.t)}</h3>${media}<p>${esc(w.d)}</p>
    <ul class="chips" style="margin-bottom:22px">${w.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${w.url ? `<a class="btn primary" href="${esc(w.url)}" target="_blank" rel="noopener">Open it ${arrow}</a>` : ''}`;
  drawer.hidden = false;
  lenis?.stop();
  $('.drawer-x').focus();
}
function closeDrawer() {
  drawer.hidden = true;
  dBody.innerHTML = '';
  lenis?.start();
  lastFocus?.focus();
}
$('#rows').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) openDrawer(WORK[+b.dataset.i]); });
drawer.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeDrawer(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });

// day
$('#dayList').innerHTML = DAY.map(([t, who, what], i) =>
  `<li class="reveal ${i === DAY.length - 1 ? 'last' : ''}"><span class="t">${esc(t)}</span><span class="who mono">${esc(who)}</span><span class="what">${esc(what)}</span></li>`).join('');

// tools
$('#stack').innerHTML = STACK.map((s) => `<li>${esc(s)}</li>`).join('');
$('#certs').innerHTML = CERTS.map(([t, by, y]) => `<li><b>${esc(t)}</b><span>${esc(by)} · ${esc(y)}</span></li>`).join('');

// contact
$('#mail').href = `mailto:${EMAIL}`;
$('#mail').textContent = EMAIL;
$('#copy').onclick = async () => {
  try { await navigator.clipboard.writeText(EMAIL); $('#copy').textContent = 'Copied ✓'; } catch { $('#copy').textContent = EMAIL; }
  setTimeout(() => { $('#copy').textContent = 'Copy email'; }, 2000);
};
$('#socials').innerHTML = SOCIALS.map((s) => s.url
  ? `<li><a href="${esc(s.url)}" target="_blank" rel="noopener" data-cursor="Open"><b>${esc(s.name)}</b><i>${esc(s.handle)} ↗</i></a></li>`
  : `<li><span class="soon"><b>${esc(s.name)}</b><i>${esc(s.handle)} · soon</i></span></li>`).join('');

// ------------------------------------------------------------ clock: is Krishil asleep?
function istNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const h = +parts.find((p) => p.type === 'hour').value % 24, m = parts.find((p) => p.type === 'minute').value;
  return { h, text: `${String(h).padStart(2, '0')}:${m}` };
}
function tickClock() {
  const { h, text } = istNow();
  const asleep = h >= 0 && h < 7;
  $('#navClock').textContent = text;
  $('#dayClock').textContent = text;
  $('#heroState').textContent = asleep ? 'Krishil is asleep · agents are working' : 'Krishil is building · agents are working';
  $('#dayState').textContent = asleep ? "I'm asleep, and my agents are still working" : "I'm probably building something, and my agents are working alongside";
}
tickClock();
setInterval(tickClock, 20000);

// ------------------------------------------------------------ smooth scroll
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  }));
}

// nav hide on scroll down
let lastY = 0;
const nav = $('#nav');
addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('scrolled', y > 40);
  nav.classList.toggle('hide', y > 500 && y > lastY && drawer.hidden);
  lastY = y;
}, { passive: true });

// ------------------------------------------------------------ hero 3D
let hero = null;
try {
  hero = initHero($('#heroGL'), $('#heroLabels'), { reduced });
} catch (err) {
  // No WebGL: the page still works, the hero is just text.
  $('#heroGL').remove();
}
ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: (s) => hero?.setScroll(s.progress) });

// ------------------------------------------------------------ boot + reveals
function boot() {
  const n = { v: 0 };
  const bootEl = $('#boot');
  if (reduced) { bootEl.remove(); intro(); return; }
  gsap.to(n, {
    v: 100, duration: 1.4, ease: 'power2.inOut',
    onUpdate: () => { $('#bootN').textContent = String(Math.round(n.v)).padStart(3, '0'); $('#bootBar').style.width = n.v + '%'; },
    onComplete: () => { bootEl.classList.add('done'); setTimeout(() => bootEl.remove(), 1100); intro(); },
  });
}
function intro() {
  gsap.to('.hero .line > span', { y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.15 });
  gsap.from('.hero-meta, .kicker, .hero-foot', { opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.6 });
}
document.fonts?.ready.then(boot) ?? boot();

if (!reduced) {
  $$('.reveal').forEach((el) => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  gsap.to('.contact .line > span', { y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
  // portrait: unmask + slow zoom
  gsap.fromTo('.portrait', { clipPath: 'inset(18% 12% 18% 12% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top 90%', end: 'top 30%', scrub: true } });
  gsap.to('.portrait img', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: true } });
  // early builds strip: horizontal scroll on wide screens
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      const strip = $('#strip');
      const dist = () => strip.scrollWidth - innerWidth;
      gsap.to(strip, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: strip, start: 'center center', end: () => '+=' + dist(), scrub: 0.6, pin: true, invalidateOnRefresh: true } });
    },
  });
  // footer wordmark rises
  gsap.from('.wordmark', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
} else {
  $$('.reveal, .line > span').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
}

// ------------------------------------------------------------ flagship art behaviour
$$('.flag').forEach((card) => card.addEventListener('pointermove', (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

// Kaapo: type a command, cut the gaps, show the caption — on a loop while visible
(function kaapo() {
  const type = $('#tlType'), cap = $('#tlCap'), clips = $$('.tl-track i');
  if (!type) return;
  const cmds = ['cut the pauses', 'add Gujarati captions', 'write a hook'];
  let k = 0, live = false;
  new IntersectionObserver(([e]) => { live = e.isIntersecting; }).observe(type);
  async function run() {
    while (true) {
      if (!live) { await wait(500); continue; }
      const c = cmds[k++ % cmds.length];
      type.textContent = '';
      cap.classList.remove('show');
      clips.forEach((i) => i.classList.remove('cut'));
      for (const ch of c) { type.textContent += ch; await wait(55); }
      await wait(400);
      clips.forEach((i) => i.classList.contains('gap') && i.classList.add('cut'));
      await wait(500);
      cap.classList.add('show');
      await wait(2600);
    }
  }
  run();
})();

// Ruby: cycle idle → listening → speaking
(function ruby() {
  const el = $('#orbArt'), st = $('#orbState');
  if (!el) return;
  const states = [['idle', 'idle'], ['listening', 'listening'], ['speaking', 'speaking'], ['idle', 'remembering']];
  let i = 0;
  setInterval(() => { const [s, label] = states[i++ % states.length]; el.dataset.s = s; st.textContent = label; }, 2200);
})();

// Saathi: play the chat when it scrolls in
(function saathi() {
  const el = $('#chatArt');
  if (!el) return;
  const bubs = $$('.bub', el);
  let played = false;
  new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting || played) return;
    played = true;
    for (const b of bubs) { b.classList.add('show'); await wait(900); }
  }, { threshold: 0.4 }).observe(el);
})();

// God View: load the real site into the card only when asked (keeps the page fast)
(function live() {
  const el = $('#liveArt');
  if (!el) return;
  const go = () => {
    if (el.classList.contains('active')) return;
    el.classList.add('active');
    el.insertAdjacentHTML('beforeend', '<iframe src="https://god-view-bay.vercel.app" title="God View, live" loading="lazy" allow="fullscreen"></iframe>');
  };
  $('.live-cover', el).addEventListener('click', go);
  $('.live-cover', el).addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
})();

// ------------------------------------------------------------ cursor, magnetic buttons, index peek
if (fine && !reduced) {
  const cur = $('#cursor'), lab = $('#cursorLabel');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, tgt = { ...pos };
  addEventListener('pointermove', (e) => { tgt.x = e.clientX; tgt.y = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    pos.x += (tgt.x - pos.x) * 0.22; pos.y += (tgt.y - pos.y) * 0.22;
    cur.style.transform = `translate(${pos.x}px,${pos.y}px)`;
  });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('a,button,[data-cursor],[role=button]');
    cur.classList.toggle('hover', !!t);
    const l = t?.dataset.cursor;
    cur.classList.toggle('label', !!l);
    if (l) lab.textContent = l;
  });
  $$('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
  });
  const peek = $('#peek'), pimg = $('img', peek);
  const pp = { x: 0, y: 0 };
  $('#rows').addEventListener('pointermove', (e) => { pp.x = e.clientX; pp.y = e.clientY; });
  gsap.ticker.add(() => {
    // keep the preview on screen: flip to the left of the cursor near the right edge
    const x = pp.x + 324 > innerWidth ? pp.x - 324 : pp.x + 24;
    peek.style.left = x + 'px';
    peek.style.top = Math.max(12, Math.min(pp.y - 110, innerHeight - 240)) + 'px';
  });
  $('#rows').addEventListener('pointerover', (e) => {
    const b = e.target.closest('button[data-img]');
    if (b) { pimg.src = b.dataset.img; peek.classList.add('on'); } else if (!e.target.closest('button')) peek.classList.remove('on');
    if (e.target.closest('button') && !b) peek.classList.remove('on');
  });
  $('#rows').addEventListener('pointerleave', () => peek.classList.remove('on'));
}

// ------------------------------------------------------------ terminal
(function terminal() {
  const out = $('#termOut'), form = $('#termForm'), input = $('#termInput');
  const print = (t, cls = '') => { out.insertAdjacentHTML('beforeend', `<div class="${cls}">${t}</div>`); out.scrollTop = out.scrollHeight; };
  const live = FLAGSHIP.filter((f) => f.url);
  const cmds = {
    help: () => 'Commands: about · now · projects · agents · stack · contact · sleep · clear',
    about: () => "Krishil. AI engineer, founder of Ovrix. I build AI agents, products and robots, and I run my businesses with them.",
    now: () => FLAGSHIP.map((f) => `● ${f.name.padEnd(9)} ${f.line}`).join('\n'),
    projects: () => `${WORK.length + FLAGSHIP.length} builds so far.\n` + live.map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.name)} → ${esc(f.url.replace('https://', ''))}</a>`).join('\n'),
    agents: () => DAY.map(([t, w, d]) => `${t.padEnd(16)} ${w.padEnd(10)} ${d}`).join('\n'),
    stack: () => STACK.join(' · '),
    contact: () => `<a href="mailto:${EMAIL}">${EMAIL}</a>\n` + SOCIALS.filter((s) => s.url).map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join(' · '),
    sleep: () => { const { text } = istNow(); return `It's ${text} in India. Whatever the time, the agents keep working. That's the point.`; },
    sudo: () => 'Nice try.',
    clear: () => { out.innerHTML = ''; return null; },
  };
  const run = (raw) => {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    print(`$ ${esc(c)}`, 'u');
    const f = cmds[c];
    const r = f ? f() : `command not found: ${esc(c)}. Try "help".`;
    if (r !== null) print(r, f ? '' : 'e');
  };
  print("Welcome to my control room. Type 'help' to see what I can tell you.");
  form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
  $('#termChips').innerHTML = ['help', 'now', 'projects', 'agents', 'contact', 'sleep'].map((c) => `<button type="button">${c}</button>`).join('');
  $('#termChips').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) run(b.textContent); });
})();

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
addEventListener('load', () => ScrollTrigger.refresh());
