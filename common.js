/* ═══════════════════════════════════════════════════════
   common.js  —  shared logic for all pages
   ═══════════════════════════════════════════════════════ */

/* ── LANGUAGE ── */
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

document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang); // apply saved lang on load
});

/* ── READING OVERLAY ── */
let savedScroll = 0;

function openReading(html, badge, topTitle) {
  const overlay = document.getElementById('reading-overlay');
  const body    = document.getElementById('reading-body');
  const badgeEl = document.getElementById('reading-badge');
  const titleEl = document.getElementById('reading-top-title');
  const fab     = document.getElementById('back-fab');

  if (!overlay) return;

  body.innerHTML   = html;
  badgeEl.textContent  = badge;
  titleEl.textContent  = topTitle;

  savedScroll = window.scrollY;
  document.body.style.overflow = 'hidden';

  overlay.scrollTop = 0;
  overlay.classList.add('open');

  setTimeout(() => { if (fab) fab.classList.add('visible'); }, 220);
}

function closeReading() {
  const overlay = document.getElementById('reading-overlay');
  const fab     = document.getElementById('back-fab');
  if (!overlay) return;
  overlay.classList.remove('open');
  if (fab) fab.classList.remove('visible');
  document.body.style.overflow = '';
  window.scrollTo(0, savedScroll);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeReading();
    closeViewer();
  }
});

/* ── OPEN HELPERS ── */
function openArtwork(idx) {
  const aw = SITE.artworks[idx];
  const l  = currentLang;
  const title  = l==='tr' ? aw.titleTR  : aw.title;
  const medium = l==='tr' ? aw.mediumTR : aw.medium;
  const desc   = l==='tr' ? aw.descTR   : aw.desc;
  const lbl = {
    about:   l==='tr'?'Bu eser hakkında':'About this work',
    photos:  l==='tr'?'Ek fotoğraflar':'Additional photos',
    view3d:  l==='tr'?'3D\'yi Gör':'View 3D',
    addImg:  l==='tr'?'Ana görsel ekle':'add main image',
    photo:   l==='tr'?'fotoğraf':'photo',
  };

  const heroHTML = aw.image
    ? `<img class="reading-hero-img" src="${aw.image}" alt="${title}">`
    : `<div class="reading-hero-ph"><span>${lbl.addImg}</span></div>`;

  const threeDBtn = aw.model
    ? `<button class="btn-3d" onclick="openViewer('${aw.model}','${title}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/><polyline points="12 2 12 20"/><polyline points="3 6.5 12 11 21 6.5"/>
        </svg>
        ${lbl.view3d}
      </button>`
    : '';

  const extraPhotos = (aw.extraImages && aw.extraImages.length)
    ? aw.extraImages.map(src => `<div class="reading-photo"><img src="${src}" alt=""></div>`).join('')
    : [0,1,2].map(()=>`<div class="reading-photo"><div class="reading-photo-ph"><span>${lbl.photo}</span></div></div>`).join('');

  const html = `
    ${heroHTML}
    <div class="reading-title">${title}</div>
    <div class="reading-meta">${aw.year} · ${medium}</div>
    ${threeDBtn}
    <div class="reading-sec-label">${lbl.about}</div>
    <div class="reading-desc"><p>${desc}</p></div>
    <div class="reading-sec-label">${lbl.photos}</div>
    <div class="reading-photos">${extraPhotos}</div>
  `;

  openReading(html, l==='tr'?'Eser':'Artwork', title);
}

function openPoem(idx) {
  const pm = SITE.poems[idx];
  const l  = currentLang;
  const title = l==='tr' ? pm.titleTR : pm.title;
  const body  = l==='tr' ? pm.bodyTR  : pm.body;
  const html = `
    <div class="reading-title">${title}</div>
    <div class="reading-meta">${pm.year}</div>
    <div class="reading-sec-label">${l==='tr'?'Şiir':'Poem'}</div>
    <div class="reading-text">${escHtml(body)}</div>
  `;
  openReading(html, l==='tr'?'Şiir':'Poem', title);
}

function openArticle(idx) {
  const ar = SITE.articles[idx];
  const l  = currentLang;
  const title = l==='tr' ? ar.titleTR : ar.title;
  const type  = l==='tr' ? ar.typeTR  : ar.type;
  const body  = l==='tr' ? ar.bodyTR  : ar.body;
  // split paragraphs on double newline
  const paras = body.split(/\n\n+/).map(p=>`<p>${escHtml(p.replace(/\n/g,'<br>'))}</p>`).join('');
  const html = `
    <div class="reading-title">${title}</div>
    <div class="reading-meta">${ar.year} · ${type}</div>
    <div class="reading-sec-label">${l==='tr'?'Makale':'Article'}</div>
    <div class="reading-desc">${paras}</div>
  `;
  openReading(html, type, title);
}

function escHtml(str) {
  return str
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

/* ── 3D VIEWER ── */
function openViewer(modelSrc, title) {
  const overlay = document.getElementById('viewer-overlay');
  const mv      = document.getElementById('model-viewer-el');
  const titleEl = document.getElementById('viewer-title-el');
  if (!overlay || !mv) return;
  mv.src = modelSrc;
  if (titleEl) titleEl.textContent = title || '';
  overlay.classList.add('open');
}

function closeViewer() {
  const overlay = document.getElementById('viewer-overlay');
  const mv      = document.getElementById('model-viewer-el');
  if (!overlay) return;
  overlay.classList.remove('open');
  // Stop rendering by clearing src
  if (mv) setTimeout(() => { mv.src = ''; }, 400);
}
