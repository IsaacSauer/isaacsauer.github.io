function projectIdFromPage() {
  return new URLSearchParams(window.location.search).get('id');
}

function projectFileUrl(url = '') {
  if (!url || /^(?:https?:|data:|\/)/i.test(url)) return url;
  return `/${url.replace(/^\.\//, '')}`;
}

function safeText(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function projectUrl(id) {
  return `/projects/project/?id=${encodeURIComponent(id)}`;
}

function renderVideos(videos = []) {
  if (!videos.length) return '';
  const frames = videos.map(video => `<div>
    <div class="case-video"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(video.id)}" title="${safeText(video.label || 'Project video')}" allowfullscreen loading="lazy"></iframe></div>
    ${videos.length > 1 ? `<p class="video-label">${safeText(video.label || 'Video')}</p>` : ''}
  </div>`).join('');
  return `<h2>Demos</h2><div class="case-videos${videos.length === 1 ? ' single' : ''}">${frames}</div>`;
}

function renderAsset(project) {
  if (!project.image) return '';
  const path = projectFileUrl(project.image);
  return `<div class="case-image"><img src="${safeText(path)}" alt="${safeText(project.name || project.title || 'Project image')}"></div>`;
}

function renderProject(id, project, entries) {
  const title = project.title || project.name || id;
  const links = project.links?.length ? project.links : (project.cardLinks || []);
  const stack = [project.lang?.label, ...(project.tags || [])].filter(Boolean).join(' · ');
  const index = entries.findIndex(([entryId]) => entryId === id);
  const previous = entries[(index - 1 + entries.length) % entries.length];
  const next = entries[(index + 1) % entries.length];

  document.title = `${title} — Isaac Sauer`;
  document.querySelector('[data-title]').textContent = title;
  document.querySelector('[data-label]').textContent = project.meta?.text || 'Project';
  document.querySelector('[data-summary]').innerHTML = project.desc || '';
  document.querySelector('[data-body]').innerHTML = `${renderAsset(project)}${project.body || ''}${renderVideos(project.videos)}`;
  document.querySelector('[data-meta]').innerHTML = `
    <div class="case-row"><b>Context</b><span>${safeText(project.meta?.text || 'Independent project')}</span></div>
    <div class="case-row"><b>Stack</b><span>${safeText(stack || 'Not specified')}</span></div>`;
  document.querySelector('[data-actions]').innerHTML = links.map(link => `
    <a href="${safeText(projectFileUrl(link.url))}" target="_blank" rel="noreferrer"><span>${safeText(link.label)}</span><span>↗</span></a>`).join('');

  const sourceAssets = document.querySelector('[data-assets]');
  if (sourceAssets) sourceAssets.remove();

  const previousLink = document.querySelector('[data-prev]');
  const nextLink = document.querySelector('[data-next]');
  previousLink.href = projectUrl(previous[0]);
  previousLink.querySelector('b').textContent = previous[1].title || previous[1].name || previous[0];
  nextLink.href = projectUrl(next[0]);
  nextLink.querySelector('b').textContent = next[1].title || next[1].name || next[0];
}

async function initProjectPage() {
  const root = document.querySelector('[data-project-page]');
  if (!root) return;

  try {
    const response = await fetch('/data/projects.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const projects = await response.json();
    const id = projectIdFromPage();
    const project = projects[id];
    if (!project) throw new Error(`Unknown project: ${id}`);
    renderProject(id, project, Object.entries(projects));
  } catch (error) {
    document.querySelector('[data-title]').textContent = 'Project not found';
    document.querySelector('[data-summary]').textContent = 'This project could not be loaded from data/projects.json.';
    document.querySelector('[data-body]').innerHTML = '<p><a href="/projects/">Return to the project archive →</a></p>';
    console.error('Failed to load project', error);
  }
}

initProjectPage();
