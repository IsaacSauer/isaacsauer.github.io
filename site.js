const menu = document.querySelector('.menu');
const navLinks = document.querySelector('.navlinks');

function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.add('has-code-cursor');
  const glitchLayer = document.createElement('div');
  glitchLayer.className = 'cursor-glitch';
  glitchLayer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glitchLayer);
  const fxLayer = document.createElement('div');
  fxLayer.className = 'post-fx-layer';
  fxLayer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(fxLayer);

  const interactiveSelector = 'a, button, [role="button"], [role="link"], select, summary, label[for], input[type="button"], input[type="submit"], input[type="file"]';
  const nativeCursorSelector = 'input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="password"], textarea, [contenteditable="true"], iframe';
  let interactive = false;
  let pointerX = 0;
  let pointerY = 0;
  let hoveredTarget = null;
  let glitchTimer;
  let activeRefraction = null;

  function glitch() {
    glitchLayer.style.left = `${pointerX}px`;
    glitchLayer.style.top = `${pointerY}px`;
    glitchLayer.classList.remove('is-active');
    void glitchLayer.offsetWidth;
    glitchLayer.classList.add('is-active');
    window.clearTimeout(glitchTimer);
    glitchTimer = window.setTimeout(() => glitchLayer.classList.remove('is-active'), 180);
  }

  function ripple(x, y, strength) {
    if (reduceMotion) return;
    refract(x, y, strength);
  }

  function applyPixelMask(stage, x, y, click) {
    const count = click ? 16 : 11;
    const spread = click ? 105 : 82;
    const centerX = x + (Math.random() * 2 - 1) * (click ? 18 : 12);
    const centerY = y + (Math.random() * 2 - 1) * (click ? 18 : 12);
    const images = [];
    const sizes = [];
    const positions = [];

    for (let index = 0; index < count; index++) {
      const size = click ? 12 + Math.random() * 30 : 9 + Math.random() * 24;
      const offsetX = (Math.random() * 2 - 1) * spread;
      const offsetY = (Math.random() * 2 - 1) * spread;
      images.push('linear-gradient(#000 0 0)');
      sizes.push(`${size}px ${size}px`);
      positions.push(`${centerX + offsetX - size / 2}px ${centerY + offsetY - size / 2}px`);
    }

    const imageList = images.join(',');
    const sizeList = sizes.join(',');
    const positionList = positions.join(',');
    stage.style.maskImage = imageList;
    stage.style.maskSize = sizeList;
    stage.style.maskPosition = positionList;
    stage.style.maskRepeat = 'no-repeat';
    stage.style.webkitMaskImage = imageList;
    stage.style.webkitMaskSize = sizeList;
    stage.style.webkitMaskPosition = positionList;
    stage.style.webkitMaskRepeat = 'no-repeat';
  }

  function refract(x, y, strength) {
    const click = strength === 'click';
    const duration = click ? 620 : 300;
    const displacement = click ? 18 : 6;
    const rgbShift = click ? 13 : 5;
    const hit = document.elementFromPoint(x, y);
    const surface = hit?.closest('.project, .category, .embed-card, .filters, .project-nav, .case-aside, .case-content, .about-grid, .education, .experience, .spotify, .music-copy, .contact-main, .contact-links, .page-hero, .hero, section, header, footer, .wrap, main');
    if (!surface) return;
    const bounds = surface.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    activeRefraction?.remove();
    const stage = document.createElement('div');
    stage.className = `refraction-stage is-${strength}`;
    applyPixelMask(stage, x, y, click);

    function makeCopy(className) {
      const copy = surface.cloneNode(true);
      copy.classList.remove('site-refracting');
      copy.classList.add('refraction-copy', className);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      copy.querySelectorAll('script').forEach(element => element.remove());
      copy.querySelectorAll('iframe').forEach(frame => frame.removeAttribute('src'));
      copy.style.setProperty('position', 'fixed', 'important');
      copy.style.setProperty('left', `${bounds.left}px`, 'important');
      copy.style.setProperty('top', `${bounds.top}px`, 'important');
      copy.style.setProperty('width', `${bounds.width}px`, 'important');
      copy.style.setProperty('height', `${bounds.height}px`, 'important');
      copy.style.setProperty('margin', '0', 'important');
      copy.style.setProperty('max-width', 'none', 'important');
      return copy;
    }

    const base = makeCopy('is-base');
    const red = makeCopy('is-red');
    const cyan = makeCopy('is-cyan');
    stage.append(base, red, cyan);
    fxLayer.appendChild(stage);
    activeRefraction = stage;

    stage.animate([
      { opacity: 0 },
      { opacity: 1, offset: .16 },
      { opacity: .95, offset: .7 },
      { opacity: 0 }
    ], { duration, easing: 'steps(6,end)', fill: 'forwards' });
    base.animate([
      { transform: 'translate3d(0,0,0) scale(1)' },
      { transform: `translate3d(${-displacement}px,${displacement * .35}px,0) scale(${click ? 1.018 : 1.008})`, offset: .32 },
      { transform: `translate3d(${displacement * .55}px,${-displacement * .2}px,0) scale(1.004)`, offset: .62 },
      { transform: 'translate3d(0,0,0) scale(1)' }
    ], { duration, easing: 'steps(5,end)' });
    red.animate([
      { transform: 'translate3d(0,0,0)', opacity: 0 },
      { transform: `translate3d(${rgbShift}px,-2px,0)`, opacity: .72, offset: .25 },
      { transform: `translate3d(${-rgbShift * .4}px,1px,0)`, opacity: .42, offset: .7 },
      { transform: 'translate3d(0,0,0)', opacity: 0 }
    ], { duration, easing: 'steps(4,end)' });
    cyan.animate([
      { transform: 'translate3d(0,0,0)', opacity: 0 },
      { transform: `translate3d(${-rgbShift}px,2px,0)`, opacity: .68, offset: .25 },
      { transform: `translate3d(${rgbShift * .4}px,-1px,0)`, opacity: .38, offset: .7 },
      { transform: 'translate3d(0,0,0)', opacity: 0 }
    ], { duration, easing: 'steps(4,end)' });

    window.setTimeout(() => {
      if (stage.isConnected) applyPixelMask(stage, x, y, click);
    }, duration * .46);

    window.setTimeout(() => {
      stage.remove();
      if (activeRefraction === stage) activeRefraction = null;
    }, duration + 60);
  }

  document.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { passive: true });

  document.addEventListener('pointerover', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    const suppressed = Boolean(event.target.closest(nativeCursorSelector));
    const nextTarget = suppressed ? null : event.target.closest(interactiveSelector);
    const nextInteractive = Boolean(nextTarget);
    if (nextTarget && nextTarget !== hoveredTarget) ripple(pointerX, pointerY, 'hover');
    hoveredTarget = nextTarget;
    if (nextInteractive !== interactive) {
      interactive = nextInteractive;
      glitchLayer.classList.toggle('is-interactive', interactive);
      glitch();
    }
  });

  document.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    glitch();
    ripple(pointerX, pointerY, 'click');
  });
}

initCustomCursor();

if (menu && navLinks) {
  menu.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
    menu.textContent = open ? '×' : '☰';
  });

  navLinks.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelectorAll('[data-year]').forEach(element => {
  element.textContent = new Date().getFullYear();
});

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function localPath(path = '') {
  if (!path || /^(?:https?:|data:|\/)/i.test(path)) return path;
  return `/${path.replace(/^\.\//, '')}`;
}

function projectCategory(id, project) {
  return project.category || 'game';
}

function renderProjectFilters(projects) {
  const container = document.querySelector('[data-project-filters]');
  if (!container) return;

  const labels = {
    game: 'Games',
    systems: 'Engines & Systems',
    tool: 'Tools'
  };
  const categories = [...new Set(Object.values(projects).map(project => project.category || 'game'))];
  const order = ['game', 'systems', 'tool'];
  categories.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  container.innerHTML = `
    <button class="filter active" data-filter="all">All projects</button>
    ${categories.map(category => `<button class="filter" data-filter="${escapeHtml(category)}">${escapeHtml(labels[category] || category)}</button>`).join('')}`;
}

function bindProjectFilters() {
  const buttons = document.querySelectorAll('.filter');
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project').forEach(project => {
      project.hidden = filter !== 'all' && !project.dataset.category.split(' ').includes(filter);
    });
  }));
}

function projectCard(id, project, index) {
  const title = project.name || project.title || id;
  const tags = [...new Set([project.lang?.label, ...(project.tags || [])].filter(Boolean))];
  const links = (project.cardLinks || []).slice(0, 2);
  const detailUrl = `/projects/project/?id=${encodeURIComponent(id)}`;
  const image = project.image
    ? `<a class="project-media" href="${detailUrl}" aria-label="Read more about ${escapeHtml(title)}"><img src="${escapeHtml(localPath(project.image))}" alt="${escapeHtml(title)}" loading="lazy"></a>`
    : '';

  return `<article class="project${index === 0 ? ' featured' : ''}" data-category="${escapeHtml(projectCategory(id, project))}" data-href="${detailUrl}" tabindex="0" role="link" aria-label="Read more about ${escapeHtml(title)}">
    ${image}
    <div class="project-body">
      <span class="project-no">${String(index + 1).padStart(2, '0')} / ${escapeHtml(project.meta?.text || 'PROJECT')}</span>
      <h2><a class="project-title-link" href="${detailUrl}">${escapeHtml(title)}</a></h2>
      <p>${project.desc || ''}</p>
      <div class="project-footer">
        <div class="project-links">${links.map(link => `<a href="${escapeHtml(localPath(link.url))}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} ↗</a>`).join('')}</div>
        <div class="project-cta">
          <a class="read-more" href="${detailUrl}">Read more →</a>
          <div class="chips">${tags.map(tag => `<span class="chip">${escapeHtml(tag).toUpperCase()}</span>`).join('')}</div>
        </div>
      </div>
    </div>
  </article>`;
}

function bindProjectCards() {
  document.querySelectorAll('.project[data-href]').forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      window.location.href = card.dataset.href;
    });
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('a, button')) return;
      event.preventDefault();
      window.location.href = card.dataset.href;
    });
  });
}

async function initProjectArchive() {
  const grid = document.querySelector('[data-project-grid]');
  if (!grid) {
    bindProjectFilters();
    return;
  }

  try {
    const response = await fetch('/data/projects.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const projects = await response.json();
    renderProjectFilters(projects);
    grid.innerHTML = Object.entries(projects)
      .map(([id, project], index) => projectCard(id, project, index))
      .join('');
    bindProjectFilters();
    bindProjectCards();
  } catch (error) {
    grid.innerHTML = '<p class="load-error">Projects could not be loaded. Please try again later.</p>';
    console.error('Failed to load data/projects.json', error);
  }
}

initProjectArchive();

// Custom scroll rail: page ruler everywhere, career timeline when the page has [data-role] entries
function initScrollRail() {
  const root = document.documentElement, header = document.querySelector('header'), mq = matchMedia('(pointer: fine) and (hover: hover) and (min-width: 760px)'), rm = matchMedia('(prefers-reduced-motion: reduce)');
  const roles = [...document.querySelectorAll('[data-role]')], tl = roles.length > 0, D = new Date(), NOW = D.getFullYear() * 12 + D.getMonth(), PAD = 12;
  const ym = v => v === 'now' ? NOW : (([y, m = 1]) => y * 12 + m - 1)(v.split('-').map(Number)), two = n => String(n).padStart(2, '0');
  const fmt = m => `${Math.floor(m / 12)}.${two(Math.floor(m) % 12 + 1)}`, fmtS = m => `${two(Math.floor(m / 12) % 100)}.${two(Math.floor(m) % 12 + 1)}`;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t, ease = t => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2, esc = v => String(v).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  const RD = roles.map(el => ({ el, name: el.dataset.role, s: ym(el.dataset.start), e: ym(el.dataset.end || 'now'), ms: (el.dataset.milestones || '').split('|').filter(Boolean).map(x => { const [d, ...n] = x.split(' '); return { m: ym(d), n: n.join(' ') }; }) }));
  const LO = tl ? Math.floor(Math.min(...RD.map(d => d.s)) / 12) * 12 : 0, fOf = m => (NOW - m) / (NOW - LO), MS = RD.flatMap(d => d.ms);
  const T = tl ? Array.from({ length: NOW - LO + 1 }, (_, i) => { const m = NOW - i; return { m, f: fOf(m), major: !i || m % 12 === 0, mid: m % 3 === 0, label: !i ? 'NOW' : m % 12 === 0 ? `’${two(m / 12 % 100)}` : '' }; })
    : Array.from({ length: 51 }, (_, i) => ({ m: i * 2, f: i / 50, major: i % 5 === 0, mid: false, label: i % 5 === 0 && i % 50 ? i * 2 : '' }));
  T.forEach(t => t.a = t.major ? .75 : t.mid ? .5 : .28);
  root.style.setProperty('--rail-w', `${tl ? 64 : 40}px`);
  const rail = document.createElement('div');
  rail.className = `rail${tl ? ' rail--timeline' : ''}`;
  Object.entries({ role: 'scrollbar', 'aria-controls': 'main', 'aria-orientation': 'vertical', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0, 'aria-label': tl ? 'Career timeline' : 'Page position' }).forEach(([k, v]) => rail.setAttribute(k, v));
  rail.innerHTML = `<div class="rail-clip" aria-hidden="true"><div class="rail-spine"><i></i></div>${T.map(t => `<div class="rail-tick${t.major ? ' major' : t.mid ? ' mid' : ''}"><i></i>${t.label !== '' ? `<b>${t.label}</b>` : ''}</div>`).join('')}${RD.map(d => `<div class="rail-role"><span>${esc(d.name)}</span></div>`).join('')}${MS.map(() => '<i class="rail-ms"></i>').join('')}<div class="rail-marks"></div><div class="rail-band"></div><div class="rail-ghost"></div><div class="rail-needle"><span class="rail-read"></span></div></div><div class="rail-tip" aria-hidden="true"></div>`;
  document.body.appendChild(rail);
  const q = s => rail.querySelector(s), rows = [...rail.querySelectorAll('.rail-tick')], lines = rows.map(r => r.firstChild), labs = rows.map(r => r.querySelector('b'));
  const roleEls = [...rail.querySelectorAll('.rail-role')], msEls = [...rail.querySelectorAll('.rail-ms')], marks = q('.rail-marks'), band = q('.rail-band'), ghost = q('.rail-ghost'), needle = q('.rail-needle'), read = q('.rail-read'), tip = q('.rail-tip'), fill = q('.rail-spine i');
  const st = { vel: 0, lastY: scrollY, L: 0, target: 0, hover: 0, timer: 0, ghost: null, drag: false, startY: 0, moved: 0, down: null, t0: performance.now(), last: performance.now(), key: '', txt: '', raf: 0, glitch: 0 };
  let pts = [], ext = [], dY = [], secs = [], secEls = [];
  const maxS = () => Math.max(1, root.scrollHeight - innerHeight), span = () => rail.clientHeight - 2 * PAD;
  // Reading line r sweeps page top to bottom while scrolling; each role's on-page extent maps to its months
  const docTop = el => { let y = 0; for (; el; el = el.offsetParent) y += el.offsetTop; return y; };
  function measure() {
    rail.style.top = `${header ? header.getBoundingClientRect().height : 0}px`;
    if (tl) { ext = RD.map((d, i) => { const t = docTop(d.el); return [t, t + d.el.offsetHeight, t]; }); pts = [[0, RD[0].e]]; RD.forEach((d, i) => pts.push([ext[i][0], d.e], [ext[i][1], d.s])); pts.push([root.scrollHeight, RD[RD.length - 1].s]); }
    else {
      const hs = [...document.querySelectorAll('main h2')].filter(h => h.offsetParent).slice(0, 24);
      secs = hs.map(h => ({ y: docTop(h), n: h.textContent.replace(/\s+/g, ' ').trim() }));
      if (secEls.length !== secs.length) { marks.innerHTML = secs.map(() => '<i class="rail-sec"></i>').join(''); secEls = [...marks.children]; }
    }
    dY = T.map(t => tl ? rOf(t.m) : t.m / 100 * root.scrollHeight); st.key = '';
  }
  function monthAt(r) { for (let i = 1; i < pts.length; i++) if (r <= pts[i][0]) { const [r0, m0] = pts[i - 1], [r1, m1] = pts[i]; return r1 > r0 ? lerp(m0, m1, (r - r0) / (r1 - r0)) : m1; } return pts[pts.length - 1][1]; }
  function rOf(m) { for (let i = 1; i < pts.length; i++) { const [r0, m0] = pts[i - 1], [r1, m1] = pts[i]; if (m <= m0 && m >= m1) return m0 === m1 ? r0 : lerp(r0, r1, (m0 - m) / (m0 - m1)); } return m > pts[0][1] ? 0 : root.scrollHeight; }
  const top0 = () => parseFloat(rail.style.top) || 0, sForR = r => Math.max(0, (r - (tl ? top0() : 0)) / (1 + (innerHeight - (tl ? top0() : 0)) / maxS())), target = f => tl ? sForR(rOf(lerp(NOW, LO, f))) : f * maxS();
  function roll(str) {
    if (str === st.txt) return; st.txt = str;
    const pat = str.replace(/\d/g, '0');
    if (read.dataset.pat !== pat) { read.dataset.pat = pat; read.innerHTML = [...str].map(c => /\d/.test(c) ? `<span class="rd"><span>${[...'0123456789'].map(n => `<span>${n}</span>`).join('')}</span></span>` : `<span>${c}</span>`).join(''); }
    const cols = read.querySelectorAll('.rd > span'); let k = 0;
    [...str].forEach(c => { if (/\d/.test(c)) cols[k++].style.transform = `translateY(-${c}em)`; });
  }
  function label(f, gy) {
    if (!tl) { const sec = secs.find((x, i) => Math.abs(secY[i] - gy) < 6); return `› ${sec ? sec.n.slice(0, 34) : `${Math.round(f * 100)}%`}`; }
    const m = lerp(NOW, LO, f), near = MS.find(x => Math.abs(x.m - m) < 1.5), role = RD.find(d => m <= d.e && m >= d.s);
    return `› ${f < .012 ? 'NOW' : fmt(m)}${near ? ` · ${near.n}` : role ? ` · ${role.name}` : ''}`;
  }
  let secY = [];
  function frame(now) {
    st.raf = requestAnimationFrame(frame);
    const dt = Math.min((now - st.last) / 1000, .1) || .016, s = scrollY, vh = innerHeight, dh = root.scrollHeight, p = clamp(s / maxS()), rT = tl ? top0() : 0, r = s + rT + (vh - rT) * p, sp = span(), reduce = rm.matches;
    st.last = now; st.vel += ((s - st.lastY) / dt - st.vel) * (1 - Math.exp(-6 * dt)); st.lastY = s;
    st.L = reduce ? st.target : Math.abs(st.target - st.L) < 5e-4 ? st.target : st.L + (st.target - st.L) * (1 - Math.exp(-9 * dt));
    const v = reduce ? 0 : clamp(Math.abs(st.vel) / 3000);
    if (!reduce && Math.abs(st.vel) > 2600 && now > st.glitch) { st.glitch = now + 420; needle.classList.remove('glitch'); void needle.offsetWidth; needle.classList.add('glitch'); }
    const key = [s, st.L, v > .002, st.ghost, st.hover, sp, dh, vh].join();
    if (key === st.key) return; st.key = key; rail.style.visibility = dh - vh < 40 ? 'hidden' : '';
    const L = ease(st.L), cm = tl ? monthAt(r) : p * 100, nY = tl ? clamp(lerp(r - s - rT, PAD + fOf(cm) * sp, L), PAD, PAD + sp) : PAD + p * sp, drift = nY - vh * p, Y = (dy, f) => lerp(dy - s - (tl ? rT : -drift), PAD + f * sp, L), gy = st.ghost;
    // Dock-style magnifier: ticks swell around the pointer on top of the scroll-speed stretch
    const mag = y => gy === null ? 0 : Math.max(0, 1 - Math.abs(y - gy) / 54) ** 2;
    T.forEach((t, i) => {
      const y = Y(dY[i], t.f), k = 1, d = Math.abs(dY[i] - r), w = d < 180 ? v * (1 - d / 180) ** 2 : 0, g = mag(y);
      rows[i].style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
      lines[i].style.transform = `scaleX(${(k * (1 + .6 * w + 1.3 * g)).toFixed(3)})`; lines[i].style.opacity = (k * Math.min(1, t.a + .6 * w + .7 * g)).toFixed(3);
      if (labs[i]) { labs[i].style.opacity = (k * (.5 + .5 * g)).toFixed(3); labs[i].style.transform = `translate3d(${(-7 * g).toFixed(1)}px,-50%,0)`; }
    });
    RD.forEach((d, i) => { const a = Y(ext[i][2], fOf(d.e)), b = Y(ext[i][1], fOf(d.s)); roleEls[i].style.transform = `translate3d(0,${a}px,0)`; roleEls[i].style.height = `${Math.max(0, b - a)}px`; roleEls[i].classList.toggle('on', cm <= d.e + .5 && cm >= d.s - .5 && !RD.slice(0, i).some(o => cm <= o.e + .5 && cm >= o.s - .5)); });
    MS.forEach((x, i) => { const y = Y(rOf(x.m), fOf(x.m)); msEls[i].style.transform = `translate3d(0,${y}px,0) rotate(45deg) scale(${1 + mag(y)})`; msEls[i].classList.toggle('past', cm >= x.m); });
    secY = secs.map(x => Y(x.y, x.y / dh)); secEls.forEach((el, i) => { el.style.transform = `translate3d(0,${secY[i]}px,0) scale(${1 + .8 * mag(secY[i])})`; el.classList.toggle('past', r >= secs[i].y); });
    const bt = tl ? PAD + fOf(monthAt(s + rT)) * sp : PAD + s / dh * sp, bb = tl ? PAD + fOf(monthAt(s + vh)) * sp : bt + vh / dh * sp;
    band.style.transform = `translate3d(0,${bt}px,0)`; band.style.height = `${Math.max(2, bb - bt)}px`; band.style.opacity = L.toFixed(3);
    fill.style.height = `${nY}px`; needle.style.transform = `translate3d(0,${nY}px,0)`; needle.style.opacity = tl ? 1 : clamp(p / .03).toFixed(3);
    needle.classList.toggle('above', nY > rail.clientHeight - 24);
    roll(tl ? fmtS(cm) : two(Math.round(p * 100)));
    rail.setAttribute('aria-valuenow', Math.round(p * 100)); if (tl) rail.setAttribute('aria-valuetext', fmt(cm));
    if (gy === null) { ghost.style.opacity = 0; tip.style.opacity = 0; }
    else { const y = clamp(gy, PAD, PAD + sp); ghost.style.transform = `translate3d(0,${y}px,0)`; ghost.style.opacity = .9; tip.style.transform = `translate3d(0,${y}px,0) translateY(-50%)`; tip.textContent = label((y - PAD) / sp, y); tip.style.opacity = 1; }
  }
  const intent = on => { clearTimeout(st.timer); st.timer = setTimeout(() => { st.hover = +on; st.target = +on; st.key = ''; }, 150); };
  const fAt = y => clamp((y - rail.getBoundingClientRect().top - PAD) / span());
  rail.addEventListener('pointerenter', () => intent(true));
  rail.addEventListener('pointerleave', () => { st.ghost = null; if (!st.drag) intent(false); });
  rail.addEventListener('pointermove', e => { st.ghost = e.clientY - rail.getBoundingClientRect().top; if (!st.drag) return; st.moved = Math.max(st.moved, Math.abs(e.clientY - st.startY)); if (st.moved > 4) scrollTo({ top: target(fAt(e.clientY)), behavior: 'instant' }); });
  rail.addEventListener('pointerdown', e => { if (e.button) return; e.preventDefault(); Object.assign(st, { drag: true, startY: e.clientY, moved: 0, down: e.target, hover: 1 }); rail.setPointerCapture(e.pointerId); st.target = 1; });
  const up = e => {
    if (!st.drag) return; st.drag = false;
    const role = st.down?.closest('.rail-role'), b = rail.getBoundingClientRect(), inside = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
    const hTop = (header?.offsetHeight || 0) + 24, gy = e.clientY - b.top, sec = !tl && secs.find((x, i) => Math.abs(secY[i] - gy) < 6);
    if (st.moved <= 4) scrollTo({ top: role ? docTop(RD[roleEls.indexOf(role)].el) - hTop : sec ? sec.y - hTop : target(fAt(e.clientY)), behavior: 'smooth' });
    if (!inside) { st.ghost = null; intent(false); }
  };
  rail.addEventListener('pointerup', up); rail.addEventListener('pointercancel', up);
  const ro = new ResizeObserver(measure);
  function toggle() {
    const on = mq.matches; root.classList.toggle('has-rail', on); cancelAnimationFrame(st.raf);
    if (on) { ro.observe(document.body); measure(); rail.classList.add('init'); frame(performance.now()); requestAnimationFrame(() => requestAnimationFrame(() => rail.classList.remove('init'))); } else ro.disconnect();
  }
  mq.addEventListener('change', toggle); addEventListener('resize', measure); document.fonts?.ready.then(measure);
  toggle();
}

initScrollRail();
