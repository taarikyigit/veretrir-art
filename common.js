/* ================================================================
   common.js  —  shared logic: content layer, nav, overlays, 3D
   ================================================================ */

/* ── CONTENT LAYER ─────────────────────────────────────────────── */
let SITE;
(function () {
  try {
    const s = localStorage.getItem('veretrir_data');
    SITE = s ? JSON.parse(s) : JSON.parse(JSON.stringify(SITE_BASE));
    Object.keys(SITE_BASE).forEach(k => { if (SITE[k] === undefined) SITE[k] = SITE_BASE[k]; });
  } catch(e) { SITE = JSON.parse(JSON.stringify(SITE_BASE)); }
})();

/* ── PAGE TRANSITIONS ─────────────────────────────────────────── */
let _nav = false;
function navigate(url) {
  if (_nav) return; _nav = true;
  const m = document.getElementById('page-transition-mask');
  if (!m) { location.href = url; return; }
  m.classList.remove('slide-out'); m.classList.add('slide-in');
  setTimeout(() => location.href = url, 370);
}

document.addEventListener('DOMContentLoaded', () => {
  const m = document.getElementById('page-transition-mask');
  if (m) { m.classList.remove('slide-in'); m.classList.add('slide-out'); setTimeout(() => m.classList.remove('slide-out'), 400); }
  document.querySelectorAll('a[href]').forEach(a => {
    const h = a.getAttribute('href');
    if (h && !h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('http') && !a.dataset.noTransition)
      a.addEventListener('click', e => { e.preventDefault(); navigate(h); });
  });
  setLang(currentLang);
});

/* ── LANGUAGE ─────────────────────────────────────────────────── */
let currentLang = localStorage.getItem('lang') || 'en';
function setLang(l) {
  currentLang = l; localStorage.setItem('lang', l);
  document.documentElement.lang = l;
  document.querySelectorAll('[data-en]').forEach(el => { const v = el.getAttribute('data-'+l); if (v !== null) el.innerHTML = v; });
  ['b-en','b-tr'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('on', id === 'b-'+l); });
}

/* ── ESCAPE ───────────────────────────────────────────────────── */
function _esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── READING OVERLAY ─────────────────────────────────────────── */
let _scroll = 0;
function openReading(html, badge, title) {
  const o = document.getElementById('reading-overlay');
  if (!o) return;
  document.getElementById('reading-body').innerHTML = html;
  document.getElementById('reading-badge').textContent = badge;
  document.getElementById('reading-top-title').textContent = title;
  _scroll = window.scrollY;
  document.body.style.overflow = 'hidden';
  o.scrollTop = 0; o.classList.add('open');
  setTimeout(() => { const f = document.getElementById('back-fab'); if (f) f.classList.add('visible'); }, 230);
}
function closeReading() {
  const o = document.getElementById('reading-overlay');
  const f = document.getElementById('back-fab');
  if (!o) return;
  o.classList.remove('open'); if (f) f.classList.remove('visible');
  document.body.style.overflow = ''; window.scrollTo(0, _scroll);
}

/* ── ARTWORK / PROJECT DETAIL ────────────────────────────────── */
/* Helper: get main image from images array */
function _mainImg(aw) {
  if (!aw.images || !aw.images.length) return null;
  const main = aw.images.find(i => i.isMain);
  return (main || aw.images[0]).path;
}

function _renderWork(aw, badgeLabel, overrideTitle) {
  const l = currentLang;
  // FIXED: Use the passed title that already has correct language
  const title = overrideTitle || (l === 'tr' ? (aw.titleTR || aw.title) : aw.title);
  const medium = l === 'tr' ? (aw.mediumTR || aw.medium) : aw.medium;
  const desc = l === 'tr' ? (aw.descTR || aw.desc) : aw.desc;

  /* Hero image */
  const mainSrc = _mainImg(aw);
  const heroHTML = mainSrc
    ? `<img class="reading-hero-img" src="${mainSrc}" alt="${_esc(title)}">`
    : `<div class="reading-hero-ph"><span>${l==='tr'?'Görsel eklenecek':'Image coming soon'}</span></div>`;

  /* Image gallery (all images stacked) */
  let galleryHTML = '';
  if (aw.images && aw.images.length > 1) {
    const extras = aw.images.filter(i => !i.isMain || aw.images.length === 1);
    if (extras.length) {
      galleryHTML = `<div class="reading-sec-label">${l==='tr'?'Galeri':'Gallery'}</div>
        <div class="reading-photos">
          ${aw.images.map(img => `<div class="reading-photo"><img src="${img.path}" alt="${_esc(img.caption||'')}"></div>`).join('')}
        </div>`;
    }
  }

  /* Materials blocks */
  let matsHTML = '';
  if (aw.materials && aw.materials.length) {
    aw.materials.forEach(mat => {
      const lbl = `<div class="reading-sec-label">${_esc(mat.label||mat.type)}</div>`;
      if (mat.type === 'text') {
        // FIXED: Show Turkish content when language is TR
        const content = l === 'tr' ? (mat.contentTR || mat.content) : mat.content;
        const paras = (content||'').split(/\n\n+/).map(p=>`<p>${_esc(p).replace(/\n/g,'<br>')}</p>`).join('');
        matsHTML += lbl + `<div class="reading-desc">${paras}</div>`;
      } else if (mat.type === 'image-gallery') {
        const imgs = (mat.images||[]).map(i=>`<div class="reading-photo"><img src="${i.path}" alt="${_esc(i.caption||'')}"></div>`).join('');
        matsHTML += lbl + `<div class="reading-photos">${imgs}</div>`;
      } else if (mat.type === 'gif') {
        const imgs = (mat.images||[]).map(i=>`<div class="reading-photo"><img src="${i.path}" alt="" style="image-rendering:auto;"></div>`).join('');
        matsHTML += lbl + `<div class="reading-photos">${imgs}</div>`;
      } else if (mat.type === '3d') {
        const safeTitle = _esc(title).replace(/'/g,"\\'");
        const safePath  = (mat.path||'').replace(/'/g,"\\'");
        matsHTML += lbl + `<button class="btn-3d" onclick="openViewer('${safePath}','${safeTitle}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/>
            <polyline points="12 2 12 20"/><polyline points="3 6.5 12 11 21 6.5"/>
          </svg>
          ${l==='tr'?'3D Görüntüle':'View 3D'}
        </button>`;
      } else if (mat.type === 'pdf') {
        matsHTML += lbl + `<a href="${mat.path}" target="_blank" class="btn-3d" style="text-decoration:none;">
          ↓ ${l==='tr'?'PDF İndir':'Download PDF'}
        </a>`;
      } else if (mat.type === 'video') {
        matsHTML += lbl + `<video controls style="width:100%;max-width:100%;margin-top:8px;" src="${mat.path}"></video>`;
      }
    });
  }

  return openReading(`
    ${heroHTML}
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${_esc(aw.year)}${medium?' · '+_esc(medium):''}</div>
    <div class="reading-sec-label">${l==='tr'?'Açıklama':'About this work'}</div>
    <div class="reading-desc"><p>${_esc(desc||'')}</p></div>
    ${galleryHTML}
    ${matsHTML}
  `, badgeLabel, title);
}

function openArtwork(idx) {
  const aw = SITE.artworks[idx]; if (!aw) return;
  const l = currentLang;
  // FIXED: Show Turkish when language is TR, English when EN
  const title = l === 'tr' ? (aw.titleTR || aw.title) : aw.title;
  const badge = l === 'tr' ? 'Eser' : 'Artwork';
  _renderWork(aw, badge, title);
}

function openProject(idx) {
  const p = SITE.projects[idx]; if (!p) return;
  const l = currentLang;
  // FIXED: Show Turkish when language is TR, English when EN
  const title = l === 'tr' ? (p.titleTR || p.title) : p.title;
  const badge = l === 'tr' ? 'Proje' : 'Project';
  _renderWork(p, badge, title);
}

/* ── WRITINGS ────────────────────────────────────────────────── */
function openPoem(idx) {
  const pm = SITE.poems[idx]; if (!pm) return;
  const l = currentLang;
  // FIXED: Show Turkish when language is TR, English when EN
  const title = l === 'tr' ? (pm.titleTR || pm.title) : pm.title;
  const body = l === 'tr' ? (pm.bodyTR || pm.body) : pm.body;
  const lbl = l === 'tr' ? 'Şiir' : 'Poem';
  openReading(`
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${_esc(pm.year)}</div>
    <div class="reading-sec-label">${lbl}</div>
    <div class="reading-text">${_esc(body)}</div>
  `, lbl, title);
}

function openArticle(idx) {
  const ar = SITE.articles[idx]; if (!ar) return;
  const l = currentLang;
  // FIXED: Show Turkish when language is TR, English when EN
  const title = l === 'tr' ? (ar.titleTR || ar.title) : ar.title;
  const type = l === 'tr' ? (ar.typeTR || ar.type) : ar.type;
  const body = l === 'tr' ? (ar.bodyTR || ar.body) : ar.body;
  const paras = body.split(/\n\n+/).map(p=>`<p>${_esc(p).replace(/\n/g,'<br>')}</p>`).join('');
  openReading(`
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${_esc(ar.year)} · ${_esc(type)}</div>
    <div class="reading-sec-label">${_esc(type)}</div>
    <div class="reading-desc">${paras}</div>
  `, _esc(type), title);
}

/* ── 3D VIEWER ───────────────────────────────────────────────── */
function openViewer(src, title) {
  const o=document.getElementById('viewer-overlay'), mv=document.getElementById('model-viewer-el');
  if (!o||!mv) return;
  mv.setAttribute('src', src);
  const t=document.getElementById('viewer-title-el'); if (t) t.textContent=title||'';
  o.classList.add('open');
}
function closeViewer() {
  const o=document.getElementById('viewer-overlay'), mv=document.getElementById('model-viewer-el');
  if (!o) return; o.classList.remove('open');
  if (mv) setTimeout(()=>mv.removeAttribute('src'),400);
}

document.addEventListener('keydown', e => {
  if (e.key!=='Escape') return;
  const v=document.getElementById('viewer-overlay');
  if (v&&v.classList.contains('open')) { closeViewer(); return; }
  closeReading();
});
