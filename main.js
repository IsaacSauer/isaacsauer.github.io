// ── EmailJS ──────────────────────────────────────────────────────
emailjs.init({ publicKey: "x8sJ8w_rEMgrHYxjP" });

// ── Section metadata ─────────────────────────────────────────────
const SECTIONS = {
  about: { label: 'about.ts', icon: 'ts', lang: 'TypeScript', crumb: ['isaac-sauer', 'about.ts'] },
  experience: { label: 'experience.json', icon: 'json', lang: 'JSON', crumb: ['isaac-sauer', 'experience.json'] },
  projects: { label: 'index.ts', icon: 'ts', lang: 'TypeScript', crumb: ['isaac-sauer', 'projects', 'index.ts'] },
  gallery: { label: 'gallery.tsx', icon: 'tsx', lang: 'TSX', crumb: ['isaac-sauer', 'gallery.tsx'] },
  music: { label: 'music.tsx', icon: 'tsx', lang: 'TSX', crumb: ['isaac-sauer', 'music.tsx'] },
  contact: { label: 'contact.ts', icon: 'ts', lang: 'TypeScript', crumb: ['isaac-sauer', 'contact.ts'] },
};

let currentSection = 'about';
let openTabs = ['about'];
let sidebarOpen = true;
let terminalOpen = false;

// ── Line numbers ──────────────────────────────────────────────────
function buildLineNumbers(sectionId) {
  const container = document.querySelector(`#sec-${sectionId} .cc`);
  const lnDiv = document.getElementById(`ln-${sectionId}`);
  if (!container || !lnDiv) return;
  const lines = container.querySelectorAll('.cl').length;
  lnDiv.innerHTML = Array.from({ length: lines }, (_, i) => `<span>${i + 1}</span>`).join('');
}

// ── Section switching ─────────────────────────────────────────────
function openSection(id, treeItemEl, tabEl) {
  if (!SECTIONS[id]) return;

  // hide old section
  document.getElementById(`sec-${currentSection}`)?.classList.remove('active');

  // show new section
  document.getElementById(`sec-${id}`)?.classList.add('active');
  currentSection = id;

  // update sidebar active state
  document.querySelectorAll('.ti').forEach(el => el.classList.remove('active'));
  if (treeItemEl) treeItemEl.classList.add('active');
  else {
    document.querySelectorAll(`.ti[data-section="${id}"]`).forEach(el => el.classList.add('active'));
  }

  // update or add tab
  if (!openTabs.includes(id)) {
    openTabs.push(id);
    addTab(id);
  }
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  const existingTab = tabEl || document.querySelector(`.tab[data-section="${id}"]`);
  if (existingTab) existingTab.classList.add('active');

  // update breadcrumb
  const meta = SECTIONS[id];
  const crumbs = meta.crumb;
  const bcEl = document.getElementById('breadcrumb');
  bcEl.innerHTML = crumbs.map((c, i) =>
    i < crumbs.length - 1
      ? `<span>${c}</span><span class="bc-sep">›</span>`
      : `<span class="bc-cur">${c}</span>`
  ).join('');

  // update status bar
  document.getElementById('sb-lang').textContent = meta.lang;
  document.getElementById('sb-pos').textContent = 'Ln 1, Col 1';

  // scroll to top
  document.getElementById('editorArea').scrollTop = 0;
}

function addTab(id) {
  const meta = SECTIONS[id];
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.dataset.section = id;
  tab.innerHTML = `<i class="t-ico ${meta.icon} fa-brands fa-js"></i><span>${meta.label}</span><span class="t-x" onclick="closeTab(event,'${id}')">×</span>`;
  tab.onclick = function (e) {
    if (e.target.classList.contains('t-x')) return;
    openSection(id, null, this);
  };
  document.getElementById('tabBar').appendChild(tab);
}

function closeTab(e, id) {
  e.stopPropagation();
  openTabs = openTabs.filter(t => t !== id);
  document.querySelector(`.tab[data-section="${id}"]`)?.remove();
  if (currentSection === id) {
    const fallback = openTabs[openTabs.length - 1] || 'about';
    if (!openTabs.includes(fallback)) {
      openTabs = ['about'];
      addTab('about');
    }
    openSection(fallback, null);
  }
}

// ── Sidebar toggle ────────────────────────────────────────────────
function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('collapsed', !sidebarOpen);
  document.querySelectorAll('.ai')[0].classList.toggle('active', sidebarOpen);
}

// ── Folder toggle ─────────────────────────────────────────────────
function toggleFolder(el) {
  const chevron = el.querySelector('.fa-chevron-right, .fa-chevron-down');
  const siblings = el.nextElementSibling;
  if (!siblings || !siblings.classList.contains('ti-children')) return;
  const hidden = siblings.classList.toggle('hidden');
  if (chevron) {
    chevron.classList.toggle('fa-chevron-right', hidden);
    chevron.classList.toggle('fa-chevron-down', !hidden);
  }
  // change folder icon
  const folderIcon = el.querySelectorAll('.fa-folder, .fa-folder-open')[0] ||
    el.querySelector('.fa-folder-open, .fa-folder');
  if (folderIcon) {
    folderIcon.classList.toggle('fa-folder', !hidden);
    folderIcon.classList.toggle('fa-folder-open', hidden);
  }
}

// ── Terminal ──────────────────────────────────────────────────────
const TERMINAL_LINES = [
  ['tp', '$ '], ['tc', 'npm run build'],
  ['to', '> portfolio build'],
  ['ts-ok', '✓ compiled in 420ms'],
  ['ts-ok', '✓ 0 errors · 1 warning (TODO: update portfolio)'],
  ['', ''],
  ['tp', '$ '], ['tc', '_'],
];

function buildTerminal() {
  const out = document.getElementById('termOut');
  const html = [];
  let i = 0;

  while (i < TERMINAL_LINES.length) {
    const [cls, text] = TERMINAL_LINES[i];

    if (cls === '') {
      html.push('<br>');
      i++;
    } else if (cls === 'tp') {
      // Prompt + command are paired on one line, emit together then break
      html.push(`<span class="${cls}">${text}</span>`);
      if (i + 1 < TERMINAL_LINES.length && TERMINAL_LINES[i + 1][0] === 'tc') {
        i++;
        const [cls2, text2] = TERMINAL_LINES[i];
        html.push(`<span class="${cls2}">${text2}</span>`);
      }
      html.push('<br>');
      i++;
    } else {
      // Output line — each span gets its own line
      html.push(`<span class="${cls}">${text}</span><br>`);
      i++;
    }
  }

  out.innerHTML = html.join('');
}

function toggleTerminal() {
  terminalOpen = !terminalOpen;
  document.getElementById('termPanel').classList.toggle('open', terminalOpen);
  if (terminalOpen && !document.getElementById('termOut').innerHTML) buildTerminal();
}

// ── Command palette ───────────────────────────────────────────────
const CMD_ITEMS = Object.entries(SECTIONS).map(([id, m]) => ({ id, label: m.label, icon: m.icon }));

function openCmd() {
  document.getElementById('cmdOverlay').classList.add('open');
  const inp = document.getElementById('cmdInput');
  inp.value = '';
  inp.focus();
  renderCmdResults('');
}

function closeCmd(e) {
  if (e.target === document.getElementById('cmdOverlay') || !e) {
    document.getElementById('cmdOverlay').classList.remove('open');
  }
}

function renderCmdResults(query) {
  const q = query.toLowerCase();
  const filtered = CMD_ITEMS.filter(it => it.label.toLowerCase().includes(q));
  const el = document.getElementById('cmdResults');
  el.innerHTML = filtered.map((it, i) =>
    `<div class="cmd-r${i === 0 ? ' sel' : ''}" onclick="cmdSelect('${it.id}')">
      <i class="fa-brands fa-js" style="color:${it.icon === 'json' ? '#d19a66' : it.icon === 'tsx' ? '#56b6c2' : '#61afef'}"></i>
      ${it.label}
    </div>`
  ).join('');
}

function cmdSelect(id) {
  document.getElementById('cmdOverlay').classList.remove('open');
  openSection(id, null);
}

document.getElementById('cmdInput').addEventListener('input', e => renderCmdResults(e.target.value));
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); openCmd(); }
  if (e.key === 'Escape') {
    document.getElementById('cmdOverlay').classList.remove('open');
    closeProjModal(null, true);
  }
});

// ── Mobile nav ────────────────────────────────────────────────────
function setMobileActive(el) {
  document.querySelectorAll('.mn-item').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
}

// ── Toast ─────────────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 3500);
}

// ── Project detail modal ─────────────────────────────────────────
let PROJECTS = {};

function renderCards() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = Object.entries(PROJECTS).map(([id, p]) => `
    <div class="pc" onclick="openProject('${id}')">
      <div class="pc-head">
        <code>const ${p.varName}: Project = {</code>
        <span class="lang-badge ${p.lang.cls}">${p.lang.label}</span>
      </div>
      ${p.image
      ? `<img class="pc-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />`
      : `<div class="pc-no-img"><i class="fa-solid fa-code"></i></div>`}
      <div class="pc-body">
        <div class="pc-name">${p.name}</div>
        <div class="pc-meta"><i class="${p.meta.icon}"></i> ${p.meta.text}</div>
        <div class="pc-desc">${p.desc}</div>
        <div class="pc-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="pc-links" onclick="event.stopPropagation()">
          ${p.cardLinks.map(l => `<a class="pc-link" href="${l.url}" target="_blank"><i class="${l.ico}"></i> ${l.label}</a>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function openProject(id) {
  const p = PROJECTS[id];
  if (!p) return;
  document.getElementById('pmTitle').textContent = p.title;
  const body = document.getElementById('pmBody');
  let html = '';
  if (p.videos.length === 1) {
    html += `<div class="pm-video"><iframe src="https://www.youtube.com/embed/${p.videos[0].id}" allowfullscreen loading="lazy"></iframe></div>`;
  } else if (p.videos.length > 1) {
    html += `<div class="pm-videos">${p.videos.map(v =>
      `<div><div class="pm-video"><iframe src="https://www.youtube.com/embed/${v.id}" allowfullscreen loading="lazy"></iframe></div><div class="pm-vid-label">${v.label}</div></div>`
    ).join('')}</div>`;
  }
  html += p.body;
  if (p.links.length) {
    html += `<div class="pm-links">${p.links.map(l =>
      `<a class="pm-link" href="${l.url}" target="_blank"><i class="${l.ico}"></i> ${l.label}</a>`
    ).join('')}</div>`;
  }
  body.innerHTML = html;
  document.getElementById('projModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjModal(e, force) {
  if (!force && e && e.target !== document.getElementById('projModal')) return;
  document.getElementById('projModal').classList.remove('open');
  document.getElementById('pmBody').innerHTML = '';
  document.body.style.overflow = '';
}

// ── Konami code easter egg ────────────────────────────────────────
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
  if (e.keyCode === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      toast('🎮 Achievement unlocked: Konami Code — You know what\'s up.');
      document.querySelector('.tb-title').textContent = 'isaac-sauer — CHEAT MODE ACTIVATED';
      setTimeout(() => document.querySelector('.tb-title').textContent = 'isaac-sauer — portfolio', 4000);
    }
  } else {
    konamiIdx = 0;
  }
});

// ── Contact form ──────────────────────────────────────────────────
const emailForm = document.getElementById('emailForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('form-msg');

emailForm.addEventListener('submit', function (e) {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  formMsg.textContent = '';
  formMsg.className = '';

  emailjs.send('service_8gj9t52', 'template_axjzm4k', {
    subject: document.getElementById('subject').value,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  }).then(() => {
    formMsg.textContent = 'Message sent successfully!';
    formMsg.className = '';
    emailForm.reset();
  }, () => {
    formMsg.textContent = 'Failed to send. Try again or email directly.';
    formMsg.className = 'err';
  }).finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
    setTimeout(() => { formMsg.textContent = ''; formMsg.className = ''; }, 6000);
  });
});

// ── Status bar line/col update ────────────────────────────────────
document.getElementById('editorArea').addEventListener('scroll', function () {
  const approxLine = Math.floor(this.scrollTop / 21) + 1;
  document.getElementById('sb-pos').textContent = `Ln ${approxLine}, Col 1`;
});

// ── Init ──────────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('data/projects.json');
    PROJECTS = await res.json();
  } catch (e) {
    console.error('Failed to load projects.json', e);
  }
  renderCards();
}
init();
