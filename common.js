/* ═══════════════════════════════════════════════════════
   common.js  —  shared logic for all pages
   ═══════════════════════════════════════════════════════ */
 
/* ══════════════════════════════
   PAGE SLIDE TRANSITION
══════════════════════════════ */
let _navigating = false;
 
function navigate(url) {
  if (_navigating) return;
  _navigating = true;
  const mask = document.getElementById('page-transition-mask');
  mask.classList.remove('slide-out');
  mask.classList.add('slide-in');
  setTimeout(() => { window.location.href = url; }, 370);
}
 
/* Intercept all internal nav links */
document.addEventListener('DOMContentLoaded', () => {
  /* Slide-out on page load (incoming animation) */
  const mask = document.getElementById('page-transition-mask');
  mask.classList.remove('slide-in');
  mask.classList.add('slide-out');
  setTimeout(() => { mask.classList.remove('slide-out'); }, 400);
 
  /* Attach to all same-origin links except reading/overlay */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('http') &&
      !a.dataset.noTransition
    ) {
      a.addEventListener('click', e => {
        e.preventDefault();
        navigate(href);
      });
    }
  });
 
  /* Apply saved language */
  setLang(currentLang);
});
 
/* ══════════════════════════════
   LANGUAGE
══════════════════════════════ */
let currentLang = localStorage.getItem('lang') || 'en';
 
function setLang(l) {
  currentLang = l;
  localStorage.setItem('lang', l);
  document.documentElement.lang = l;
  document.querySelectorAll('[data-en]').forEach(el => {
    const v = el.getAttribute('data-' + l);
    if (v !== null) el.innerHTML = v;
  });
  const en = document.getElementById('b-en');
  const tr = document.getElementById('b-tr');
  if (en) en.classList.toggle('on', l === 'en');
  if (tr) tr.classList.toggle('on', l === 'tr');
}
 
/* ══════════════════════════════
   READING OVERLAY
══════════════════════════════ */
let _savedScroll = 0;
 
function openReading(html, badge, topTitle) {
  const overlay = document.getElementById('reading-overlay');
  const body    = document.getElementById('reading-body');
  const badgeEl = document.getElementById('reading-badge');
  const titleEl = document.getElementById('reading-top-title');
  const fab     = document.getElementById('back-fab');
  if (!overlay) return;
 
  body.innerHTML       = html;
  badgeEl.textContent  = badge;
  titleEl.textContent  = topTitle;
 
  _savedScroll = window.scrollY;
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
  overlay.classList.add('open');
  setTimeout(() => { if (fab) fab.classList.add('visible'); }, 230);
}
 
function closeReading() {
  const overlay = document.getElementById('reading-overlay');
  const fab     = document.getElementById('back-fab');
  if (!overlay) return;
  overlay.classList.remove('open');
  if (fab) fab.classList.remove('visible');
  document.body.style.overflow = '';
  window.scrollTo(0, _savedScroll);
}
 
/* ══════════════════════════════
   OPEN HELPERS
══════════════════════════════ */
function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
 
function openArtwork(idx) {
  const aw = SITE.artworks[idx];
  const l  = currentLang;
  const title  = l === 'tr' ? aw.titleTR  : aw.title;
  const medium = l === 'tr' ? aw.mediumTR : aw.medium;
  const desc   = l === 'tr' ? aw.descTR   : aw.desc;
 
  const lbl = {
    about:  l === 'tr' ? 'Bu eser hakkında'  : 'About this work',
    photos: l === 'tr' ? 'Ek fotoğraflar'    : 'Additional photos',
    view3d: l === 'tr' ? '3D\'yi Görüntüle'  : 'View 3D',
    addImg: l === 'tr' ? 'Ana görsel ekle'   : 'Add main image',
    photo:  l === 'tr' ? 'fotoğraf'          : 'photo',
  };
 
  const heroHTML = aw.image
    ? `<img class="reading-hero-img" src="${aw.image}" alt="${_esc(title)}">`
    : `<div class="reading-hero-ph"><span>${lbl.addImg}</span></div>`;
 
  const btn3d = aw.model
    ? `<button class="btn-3d" onclick="openViewer('${aw.model}','${_esc(title)}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/>
          <polyline points="12 2 12 20"/>
          <polyline points="3 6.5 12 11 21 6.5"/>
        </svg>
        ${lbl.view3d}
      </button>`
    : '';
 
  const photos = (aw.extraImages && aw.extraImages.length)
    ? aw.extraImages.map(s => `<div class="reading-photo"><img src="${s}" alt=""></div>`).join('')
    : Array(3).fill(0).map(() => `<div class="reading-photo"><div class="reading-photo-ph"><span>${lbl.photo}</span></div></div>`).join('');
 
  openReading(`
    ${heroHTML}
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${aw.year} · ${_esc(medium)}</div>
    ${btn3d}
    <div class="reading-sec-label">${lbl.about}</div>
    <div class="reading-desc"><p>${_esc(desc)}</p></div>
    <div class="reading-sec-label">${lbl.photos}</div>
    <div class="reading-photos">${photos}</div>
  `, l === 'tr' ? 'Eser' : 'Artwork', title);
}
 
function openPoem(idx) {
  const pm = SITE.poems[idx];
  const l  = currentLang;
  const title = l === 'tr' ? pm.titleTR : pm.title;
  const body  = l === 'tr' ? pm.bodyTR  : pm.body;
  const lbl   = l === 'tr' ? 'Şiir' : 'Poem';
 
  openReading(`
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${pm.year}</div>
    <div class="reading-sec-label">${lbl}</div>
    <div class="reading-text">${_esc(body)}</div>
  `, lbl, title);
}
 
function openArticle(idx) {
  const ar = SITE.articles[idx];
  const l  = currentLang;
  const title = l === 'tr' ? ar.titleTR : ar.title;
  const type  = l === 'tr' ? ar.typeTR  : ar.type;
  const body  = l === 'tr' ? ar.bodyTR  : ar.body;
  const paras = body.split(/\n\n+/)
    .map(p => `<p>${_esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
 
  openReading(`
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${ar.year} · ${_esc(type)}</div>
    <div class="reading-sec-label">${_esc(type)}</div>
    <div class="reading-desc">${paras}</div>
  `, _esc(type), title);
}
 
/* ══════════════════════════════
   3D VIEWER
══════════════════════════════ */
function openViewer(src, title) {
  const overlay = document.getElementById('viewer-overlay');
  const mv      = document.getElementById('model-viewer-el');
  const titleEl = document.getElementById('viewer-title-el');
  if (!overlay || !mv) return;
  mv.setAttribute('src', src);
  if (titleEl) titleEl.textContent = title || '';
  overlay.classList.add('open');
}
 
function closeViewer() {
  const overlay = document.getElementById('viewer-overlay');
  const mv      = document.getElementById('model-viewer-el');
  if (!overlay) return;
  overlay.classList.remove('open');
  if (mv) setTimeout(() => mv.removeAttribute('src'), 400);
}
 
/* ESC closes whatever is open */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const viewer = document.getElementById('viewer-overlay');
  if (viewer && viewer.classList.contains('open')) { closeViewer(); return; }
  closeReading();
});
