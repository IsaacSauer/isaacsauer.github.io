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
