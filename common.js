/* ================================================================
   common.js  —  shared logic: content layer, nav, overlays, 3D,
                 in-page lightbox gallery
   Minimal gallery redesign · v3
   ================================================================ */

const DATA_VERSION = 3;

/* ── CONTENT LAYER ─────────────────────────────────────────────── */
let SITE;
(function () {
  try {
    const stored  = localStorage.getItem('veretrir_data');
    const storedV = parseInt(localStorage.getItem('veretrir_data_v') || '0', 10);
    if (stored && storedV === DATA_VERSION) {
      SITE = JSON.parse(stored);
    } else {
      localStorage.removeItem('veretrir_data');
      SITE = JSON.parse(JSON.stringify(SITE_BASE));
    }
    Object.keys(SITE_BASE).forEach(k => {
      if (SITE[k] === undefined) SITE[k] = JSON.parse(JSON.stringify(SITE_BASE[k]));
    });
    if (SITE.artwork) delete SITE.artwork;
    ['artworks','projects'].forEach(col => {
      (SITE[col] || []).forEach(item => {
        if (!item.images)    item.images    = [];
        if (!item.materials) item.materials = [];
        if (item.displayImage === undefined) item.displayImage = null;
        if (item.featured    === undefined) item.featured     = false;
        if (item.workType    === undefined) item.workType     = '3d';
      });
    });
    localStorage.setItem('veretrir_data_v', String(DATA_VERSION));
  } catch(e) {
    SITE = JSON.parse(JSON.stringify(SITE_BASE));
  }
})();

/* ── PAGE TRANSITIONS ─────────────────────────────────────────── */
let _nav = false;
function navigate(url) {
  if (_nav) return; _nav = true;
  const m = document.getElementById('page-transition-mask');
  if (!m) { location.href = url; return; }
  m.style.opacity = '1'; m.style.pointerEvents = 'all';
  setTimeout(() => location.href = url, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  const m = document.getElementById('page-transition-mask');
  if (m) {
    m.style.opacity = '1';
    requestAnimationFrame(() => {
      m.style.transition = 'opacity 0.4s ease';
      m.style.opacity = '0';
      setTimeout(() => { m.style.pointerEvents = 'none'; }, 400);
    });
  }
  document.querySelectorAll('a[href]').forEach(a => {
    const h = a.getAttribute('href');
    if (h && !h.startsWith('#') && !h.startsWith('mailto:') &&
        !h.startsWith('http') && !a.dataset.noTransition)
      a.addEventListener('click', e => { e.preventDefault(); navigate(h); });
  });
  setLang(currentLang);
  _initLightbox();
});

/* ── LANGUAGE ─────────────────────────────────────────────────── */
let currentLang = localStorage.getItem('lang') || 'en';
function setLang(l) {
  currentLang = l; localStorage.setItem('lang', l);
  document.documentElement.lang = l;
  document.querySelectorAll('[data-en]').forEach(el => {
    const v = el.getAttribute('data-' + l);
    if (v !== null) el.innerHTML = v;
  });
  ['b-en','b-tr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('on', id === 'b-' + l);
  });
}

/* ── ESCAPE ───────────────────────────────────────────────────── */
function _esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── READING OVERLAY ─────────────────────────────────────────── */
let _scroll = 0;
function openReading(html, badge, title) {
  const o = document.getElementById('reading-overlay');
  if (!o) return;
  document.getElementById('reading-body').innerHTML = html;
  document.getElementById('reading-badge').textContent  = badge;
  document.getElementById('reading-top-title').textContent = title;
  _scroll = window.scrollY;
  document.body.style.overflow = 'hidden';
  o.scrollTop = 0; o.classList.add('open');
  setTimeout(() => {
    const f = document.getElementById('back-fab');
    if (f) f.classList.add('visible');
  }, 200);
}
function closeReading() {
  const o = document.getElementById('reading-overlay');
  const f = document.getElementById('back-fab');
  if (!o) return;
  o.classList.remove('open');
  if (f) f.classList.remove('visible');
  document.body.style.overflow = '';
  window.scrollTo(0, _scroll);
}

/* ── IMAGE HELPERS ───────────────────────────────────────────── */
function _mainImg(aw) {
  if (!aw.images || !aw.images.length) return null;
  const main = aw.images.find(i => i.isMain);
  return (main || aw.images[0]).path;
}
function _getDisplayImage(aw) {
  return aw.displayImage || (aw.images && aw.images[0] ? aw.images[0].path : null);
}

/* ── IN-PAGE LIGHTBOX ────────────────────────────────────────── */
let _lb = { images: [], cur: 0 };
let _lbScale = 1;

function _initLightbox() {
  if (document.getElementById('lb-overlay')) return;
  const lb = document.createElement('div');
  lb.id = 'lb-overlay';
  lb.innerHTML = `
    <div id="lb-bg"></div>
    <button id="lb-close" aria-label="Close">✕</button>
    <button id="lb-prev" aria-label="Previous">←</button>
    <button id="lb-next" aria-label="Next">→</button>
    <div id="lb-stage"><img id="lb-img" src="" alt="" draggable="false"></div>
    <div id="lb-counter"></div>
    <div id="lb-hint">scroll to zoom · esc to close</div>`;
  document.body.appendChild(lb);

  document.getElementById('lb-bg').addEventListener('click', closeLightbox);
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); lbMove(-1); });
  document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); lbMove( 1); });

  document.addEventListener('keydown', e => {
    const lbEl = document.getElementById('lb-overlay');
    if (!lbEl || !lbEl.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lbMove(-1);
    if (e.key === 'ArrowRight') lbMove( 1);
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === '+' || e.key === '=') lbZoom(1.2);
    if (e.key === '-') lbZoom(1/1.2);
  });

  document.getElementById('lb-stage').addEventListener('wheel', e => {
    e.preventDefault();
    lbZoom(e.deltaY < 0 ? 1.15 : 1/1.15);
  }, { passive: false });

  let tsx = 0;
  const stage = document.getElementById('lb-stage');
  stage.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tsx;
    if (Math.abs(dx) > 50) lbMove(dx < 0 ? 1 : -1);
  });
}

function openLightbox(images, startIdx) {
  _lb.images = images;
  _lb.cur = Math.max(0, Math.min(startIdx, images.length - 1));
  _lbScale = 1;
  _lbRender();
  const overlay = document.getElementById('lb-overlay');
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeLightbox() {
  const overlay = document.getElementById('lb-overlay');
  if (overlay) overlay.classList.remove('open');
  _lbScale = 1;
  const img = document.getElementById('lb-img');
  if (img) img.style.transform = '';
  if (!document.getElementById('reading-overlay')?.classList.contains('open'))
    document.body.style.overflow = '';
}
function lbMove(dir) {
  const n = _lb.images.length; if (!n) return;
  _lb.cur = (_lb.cur + dir + n) % n;
  _lbScale = 1; _lbRender();
}
function lbZoom(factor) {
  _lbScale = Math.max(0.5, Math.min(6, _lbScale * factor));
  const img = document.getElementById('lb-img');
  if (img) img.style.transform = `scale(${_lbScale})`;
}
function _lbRender() {
  const img = document.getElementById('lb-img');
  const ctr = document.getElementById('lb-counter');
  const prev = document.getElementById('lb-prev');
  const next = document.getElementById('lb-next');
  if (!img) return;
  const item = _lb.images[_lb.cur];
  img.style.transform = '';
  img.src = item.path || item;
  img.alt = item.caption || '';
  if (ctr) ctr.textContent = `${_lb.cur + 1} / ${_lb.images.length}`;
  if (prev) prev.style.display = _lb.images.length > 1 ? '' : 'none';
  if (next) next.style.display = _lb.images.length > 1 ? '' : 'none';
}

/* ── ARTWORK / PROJECT DETAIL ────────────────────────────────── */
function _renderWork(aw, badgeLabel) {
  const l = currentLang;
  const title  = l === 'tr' ? (aw.titleTR  || aw.title)  : aw.title;
  const medium = l === 'tr' ? (aw.mediumTR || aw.medium) : aw.medium;
  const desc   = l === 'tr' ? (aw.descTR   || aw.desc)   : aw.desc;

  const mainSrc = _mainImg(aw);
  const heroHTML = mainSrc
    ? `<div class="rw-hero-wrap"><img class="rw-hero-img" src="${mainSrc}" alt="${_esc(title)}"></div>`
    : `<div class="reading-hero-ph"><span>${l === 'tr' ? 'görsel eklenecek' : 'image coming soon'}</span></div>`;

  const infoHTML = `<div class="rw-info-bar">
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${_esc(aw.year || '')}${medium ? ' · ' + _esc(medium) : ''}</div>
  </div>`;

  let galleryHTML = '';
  const allImgs = aw.images || [];
  if (allImgs.length > 1) {
    const thumbs = allImgs.map((img, i) =>
      `<div class="rw-gallery-item" data-lb-idx="${i}">
         <img src="${img.path}" alt="${_esc(img.caption || '')}">
         ${img.isMain ? '<span class="rw-gallery-main">★</span>' : ''}
       </div>`).join('');
    galleryHTML = `<div class="reading-sec-label">${l === 'tr' ? 'görseller' : 'images'}</div>
      <div class="rw-gallery-grid" id="rw-thumbstrip">${thumbs}</div>`;
  }

  let matsHTML = '';
  if (aw.materials && aw.materials.length) {
    aw.materials.forEach((mat, mi) => {
      const lbl = `<div class="reading-sec-label">${_esc(mat.label || mat.type)}</div>`;
      if (mat.type === 'text') {
        const content = l === 'tr' ? (mat.contentTR || mat.content) : mat.content;
        const paras = (content || '').split(/\n\n+/).map(p => `<p>${_esc(p).replace(/\n/g,'<br>')}</p>`).join('');
        matsHTML += lbl + `<div class="reading-desc">${paras}</div>`;
      } else if (mat.type === 'image-gallery' || mat.type === 'gif') {
        const imgs = mat.images || [];
        const thumbs = imgs.map((img, j) =>
          `<div class="rw-gallery-item rw-mat-thumb" data-mat-idx="${mi}" data-img-idx="${j}">
             <img src="${img.path}" alt="${_esc(img.caption || '')}">
           </div>`).join('');
        matsHTML += lbl + `<div class="rw-gallery-grid rw-mat-strip" data-mat="${mi}">${thumbs}</div>`;
      } else if (mat.type === '3d') {
        const safeTitle = _esc(title).replace(/'/g, "\\'");
        const safePath = (mat.path || '').replace(/'/g, "\\'");
        matsHTML += lbl + `<button class="btn-3d" onclick="openViewer('${safePath}','${safeTitle}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/><polyline points="12 2 12 20"/><polyline points="3 6.5 12 11 21 6.5"/>
          </svg>${l === 'tr' ? '3d görüntüle' : 'view 3d'}</button>`;
      } else if (mat.type === 'pdf') {
        matsHTML += lbl + `<a href="${mat.path}" target="_blank" rel="noopener" class="btn-3d" style="text-decoration:none;">↓ ${l === 'tr' ? 'pdf indir' : 'download pdf'}</a>`;
      } else if (mat.type === 'video') {
        matsHTML += lbl + `<video controls style="width:100%;max-width:100%;margin-top:8px;" src="${mat.path}"></video>`;
      }
    });
  }

  const descParas = (desc || '').split(/\n\n+/).filter(p => p.trim())
    .map(p => `<p>${_esc(p).replace(/\n/g,'<br>')}</p>`).join('');

  openReading(`
    ${heroHTML}${infoHTML}
    <div class="reading-sec-label">${l === 'tr' ? 'açıklama' : 'about this work'}</div>
    <div class="reading-desc">${descParas || `<p>${_esc(desc || '')}</p>`}</div>
    ${galleryHTML}${matsHTML}
  `, badgeLabel, title);

  requestAnimationFrame(() => _attachGalleryLightbox(aw));
}

function _attachGalleryLightbox(aw) {
  const allImgs = aw.images || [];
  const heroImg = document.querySelector('.rw-hero-img');
  if (heroImg) {
    heroImg.addEventListener('click', () => {
      const mainIdx = allImgs.findIndex(i => i.isMain);
      openLightbox(allImgs, mainIdx >= 0 ? mainIdx : 0);
    });
  }
  const strip = document.getElementById('rw-thumbstrip');
  if (strip) {
    strip.querySelectorAll('.rw-gallery-item').forEach(th => {
      th.addEventListener('click', () => openLightbox(allImgs, parseInt(th.dataset.lbIdx, 10)));
    });
  }
  document.querySelectorAll('.rw-mat-strip').forEach(mStrip => {
    const mi = parseInt(mStrip.dataset.mat, 10);
    const matImgs = (aw.materials[mi] && aw.materials[mi].images) || [];
    mStrip.querySelectorAll('.rw-mat-thumb').forEach(th => {
      th.addEventListener('click', () => openLightbox(matImgs, parseInt(th.dataset.imgIdx, 10)));
    });
  });
}

function openArtwork(idx) {
  const aw = SITE.artworks[idx]; if (!aw) return;
  _renderWork(aw, currentLang === 'tr' ? 'eser' : 'artwork');
}
function openProject(idx) {
  const p = SITE.projects[idx]; if (!p) return;
  _renderWork(p, currentLang === 'tr' ? 'proje' : 'project');
}

/* ── WRITINGS ────────────────────────────────────────────────── */
function openPoem(idx) {
  const pm = SITE.poems[idx]; if (!pm) return;
  const l = currentLang;
  const title = l === 'tr' ? (pm.titleTR || pm.title) : pm.title;
  const body  = l === 'tr' ? (pm.bodyTR  || pm.body)  : pm.body;
  const lbl   = l === 'tr' ? 'şiir' : 'poem';
  openReading(`
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${_esc(pm.year || '')}</div>
    <div class="reading-sec-label">${lbl}</div>
    <div class="reading-text">${_esc(body)}</div>
  `, lbl, title);
}
function openArticle(idx) {
  const ar = SITE.articles[idx]; if (!ar) return;
  const l = currentLang;
  const title = l === 'tr' ? (ar.titleTR || ar.title) : ar.title;
  const type  = l === 'tr' ? (ar.typeTR  || ar.type)  : ar.type;
  const body  = l === 'tr' ? (ar.bodyTR  || ar.body)  : ar.body;
  const paras = (body || '').split(/\n\n+/).map(p => `<p>${_esc(p).replace(/\n/g,'<br>')}</p>`).join('');
  openReading(`
    <div class="reading-title">${_esc(title)}</div>
    <div class="reading-meta">${_esc(ar.year || '')} · ${_esc(type || '')}</div>
    <div class="reading-sec-label">${_esc(type || '')}</div>
    <div class="reading-desc">${paras}</div>
  `, _esc(type || ''), title);
}

/* ── 3D VIEWER ───────────────────────────────────────────────── */
function openViewer(src, title) {
  const o = document.getElementById('viewer-overlay');
  const mv = document.getElementById('model-viewer-el');
  if (!o || !mv) return;
  mv.setAttribute('src', src);
  const t = document.getElementById('viewer-title-el');
  if (t) t.textContent = title || '';
  o.classList.add('open');
}
function closeViewer() {
  const o = document.getElementById('viewer-overlay');
  const mv = document.getElementById('model-viewer-el');
  if (!o) return;
  o.classList.remove('open');
  if (mv) setTimeout(() => mv.removeAttribute('src'), 400);
}

/* ── ESC key ─────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const lbEl = document.getElementById('lb-overlay');
  if (lbEl && lbEl.classList.contains('open')) { closeLightbox(); return; }
  const v = document.getElementById('viewer-overlay');
  if (v && v.classList.contains('open')) { closeViewer(); return; }
  closeReading();
});
