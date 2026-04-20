/* ================================================================
   common.js  —  shared logic: content layer, nav, overlays, 3D,
                 in-page lightbox gallery
   Minimal gallery redesign · v3
   ================================================================ */

const DATA_VERSION = 5;

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
        if (item.category    === undefined) item.category     = '';
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
let currentLang = localStorage.getItem('lang') || 'tr';
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

  // Masonry gallery with hover overlays
  let galleryHTML = '';
  const allImgs = aw.images || [];
  if (allImgs.length > 1) {
    const thumbs = allImgs.map((img, i) =>
      `<div class="rw-masonry-item" data-lb-idx="${i}">
         <img src="${img.path}" alt="${_esc(img.caption || '')}">
         <div class="rw-masonry-overlay">
           <div class="rw-masonry-overlay-title">${_esc(title)}</div>
           <div class="rw-masonry-overlay-meta">${medium ? _esc(medium) : ''}</div>
         </div>
         ${img.isMain ? '<span class="rw-masonry-main">★</span>' : ''}
       </div>`).join('');
    galleryHTML = `<div class="reading-sec-label">${l === 'tr' ? 'görseller' : 'images'}</div>
      <div class="rw-masonry-grid" id="rw-thumbstrip">${thumbs}</div>`;
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
          `<div class="rw-masonry-item rw-mat-thumb" data-mat-idx="${mi}" data-img-idx="${j}">
             <img src="${img.path}" alt="${_esc(img.caption || '')}">
             <div class="rw-masonry-overlay">
               <div class="rw-masonry-overlay-title">${_esc(mat.label || '')}</div>
             </div>
           </div>`).join('');
        matsHTML += lbl + `<div class="rw-masonry-grid rw-mat-strip" data-mat="${mi}">${thumbs}</div>`;
      } else if (mat.type === '3d') {
        const safeTitle = _esc(title).replace(/'/g, "\\'");
        const safePath = (mat.path || '').replace(/'/g, "\\'");
        // Auto-open 3D viewer inline
        matsHTML += lbl + `<div class="rw-3d-container" data-model-path="${safePath}" data-model-title="${safeTitle}">
          <model-viewer 
            src="${mat.path}" 
            alt="${_esc(title)}"
            camera-controls 
            auto-rotate 
            shadow-intensity="1" 
            exposure="0.85"
            style="width:100%;height:400px;background:#f5f5f5;border-radius:4px;">
          </model-viewer>
        </div>`;
      } else if (mat.type === 'pdf') {
        // Secure PDF viewer - no download, no select
        const pdfId = 'pdf-' + Math.random().toString(36).substr(2, 9);
        matsHTML += lbl + `<div class="rw-pdf-container rw-pdf-secure" data-pdf-path="${mat.path}" data-pdf-id="${pdfId}">
          <div class="pdf-viewer-wrap" id="${pdfId}" 
            oncontextmenu="return false;" 
            onselectstart="return false;"
            ondragstart="return false;"
            style="user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;">
            <div class="pdf-controls">
              <button onclick="pdfPrevPage('${pdfId}')" class="pdf-ctrl-btn">◀ ${l === 'tr' ? 'önceki' : 'prev'}</button>
              <span class="pdf-page-info" id="${pdfId}-info">1 / 1</span>
              <button onclick="pdfNextPage('${pdfId}')" class="pdf-ctrl-btn">${l === 'tr' ? 'sonraki' : 'next'} ▶</button>
              <button onclick="pdfZoomOut('${pdfId}')" class="pdf-ctrl-btn">−</button>
              <span class="pdf-zoom-info" id="${pdfId}-zoom">100%</span>
              <button onclick="pdfZoomIn('${pdfId}')" class="pdf-ctrl-btn">+</button>
            </div>
            <div class="pdf-canvas-wrap" id="${pdfId}-wrap" style="overflow:auto;max-height:600px;background:#f5f5f5;border:1px solid var(--line);border-radius:4px;">
              <canvas id="${pdfId}-canvas" style="display:block;margin:0 auto;"></canvas>
            </div>
            <div class="pdf-loading" id="${pdfId}-loading" style="text-align:center;padding:40px;color:var(--mid);">
              ${l === 'tr' ? 'PDF yükleniyor...' : 'Loading PDF...'}
            </div>
          </div>
        </div>`;
      } else if (mat.type === 'video') {
        matsHTML += lbl + `<video controls style="width:100%;max-width:100%;margin-top:8px;" src="${mat.path}"></video>`;
      } else if (mat.type === 'youtube') {
        // Extract YouTube video ID from URL or use as-is
        let videoId = mat.path || '';
        let isShort = false;
        
        if (videoId.includes('youtube.com/shorts/')) {
          // YouTube Shorts URL
          const match = videoId.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
          if (match) {
            videoId = match[1];
            isShort = true;
          }
        } else if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
          // Regular YouTube URL
          const match = videoId.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (match) videoId = match[1];
        }
        
        if (videoId) {
          if (isShort) {
            // Shorts: vertical aspect ratio (9:16)
            matsHTML += lbl + `<div class="rw-youtube-container rw-youtube-short" style="position:relative;width:100%;max-width:350px;margin:8px auto 0;">
              <div style="position:relative;padding-bottom:177.78%;height:0;overflow:hidden;border-radius:8px;">
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                  style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>
              </div>
            </div>`;
          } else {
            // Regular: horizontal aspect ratio (16:9)
            matsHTML += lbl + `<div class="rw-youtube-container" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin-top:8px;border-radius:4px;">
              <iframe src="https://www.youtube.com/embed/${videoId}" 
                style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>`;
          }
        }
      }
    });
  }

  const descParas = (desc || '').split(/\n\n+/).filter(p => p.trim())
    .map(p => `<p>${_esc(p).replace(/\n/g,'<br>')}</p>`).join('');

  // Series link
  let seriesHTML = '';
  if (aw.series && aw.series.trim()) {
    const seriesDefs = SITE.series || [];
    const serDef = seriesDefs.find(s => s.en === aw.series);
    const seriesName = serDef ? (l === 'tr' ? serDef.tr : serDef.en) : aw.series;
    const seriesCount = SITE.artworks.filter(a => a.series === aw.series && a.id !== aw.id).length;
    if (seriesCount > 0) {
      const seriesEncoded = encodeURIComponent(aw.series.toLowerCase());
      const seriesUrl = 'artworks.html#ser:' + seriesEncoded;
      seriesHTML = `<div class="rw-series-link" style="margin-top:24px;padding:16px;background:#f9f9f9;border:1px solid var(--line);border-radius:4px;">
        <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--mid);margin-bottom:6px;">${l === 'tr' ? 'bu seri' : 'this series'}</div>
        <div style="font-size:14px;color:var(--ink);margin-bottom:8px;">${_esc(seriesName)}</div>
        <a href="${seriesUrl}" onclick="event.preventDefault(); closeReading(); window.location.href = '${seriesUrl}';" class="rw-series-btn" style="display:inline-block;font-size:11px;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--ink);padding-bottom:2px;">
          ${l === 'tr' ? `bu serinin ${seriesCount} diğer eserini gör →` : `see ${seriesCount} other work${seriesCount > 1 ? 's' : ''} in this series →`}
        </a>
      </div>`;
    }
  }

  openReading(`
    ${heroHTML}${infoHTML}
    <div class="reading-sec-label">${l === 'tr' ? 'açıklama' : 'about this work'}</div>
    <div class="reading-desc">${descParas || `<p>${_esc(desc || '')}</p>`}</div>
    ${seriesHTML}${galleryHTML}${matsHTML}
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
    strip.querySelectorAll('.rw-masonry-item').forEach(th => {
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

/* ═══════════════════════════════════════════════════════════════
   DESIGN ENHANCEMENTS
   - Scroll reveal animations
   - Back to top button
   - Scroll progress bar
   ═══════════════════════════════════════════════════════════════ */

/* ── SCROLL REVEAL ANIMATIONS ──────────────────────────────────── */
(function() {
  const revealElements = () => {
    const reveals = document.querySelectorAll('.reveal:not(.active)');
    const windowHeight = window.innerHeight;
    
    reveals.forEach((el, i) => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 100;
      
      if (elementTop < windowHeight - revealPoint) {
        // Add staggered delay based on visible order
        el.style.animationDelay = (i * 0.1) + 's';
        el.classList.add('active');
      }
    });
  };
  
  // Initial reveal for elements already in view
  window.addEventListener('load', () => {
    setTimeout(revealElements, 100);
  });
  
  // Reveal on scroll
  window.addEventListener('scroll', revealElements, { passive: true });
})();

/* ── BACK TO TOP BUTTON ────────────────────────────────────────── */
(function() {
  // Create button if it doesn't exist
  if (document.getElementById('back-to-top')) return;
  
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>`;
  document.body.appendChild(btn);
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
})();

/* ── SCROLL PROGRESS BAR ───────────────────────────────────────── */
(function() {
  if (document.getElementById('scroll-progress')) return;
  
  const progress = document.createElement('div');
  progress.id = 'scroll-progress';
  document.body.appendChild(progress);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progress.style.width = scrollPercent + '%';
  }, { passive: true });
})();

/* ── SMOOTH PAGE TRANSITIONS ──────────────────────────────────────── */
(function() {
  // Intercept internal link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Skip external links, anchors, and special links
    if (href.startsWith('http') || 
        href.startsWith('#') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        link.hasAttribute('download')) {
      return;
    }
    
    // Skip if it's the current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (href === currentPage) return;
    
    e.preventDefault();
    
    // Add exit animation
    document.body.classList.add('page-exit');
    
    // Navigate after animation
    setTimeout(() => {
      window.location.href = href;
    }, 250);
  });
})();

/* ══════════════════════════════════════════════════════════════════════
   SECURE PDF VIEWER - No download, no select, no copy
   Uses PDF.js to render PDF as canvas images
   ══════════════════════════════════════════════════════════════════════ */

// PDF viewer state storage
const pdfViewers = {};

// Load PDF.js library dynamically
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize PDF viewers after content loads
function initSecurePdfViewers() {
  const containers = document.querySelectorAll('.rw-pdf-secure');
  containers.forEach(container => {
    const pdfPath = container.dataset.pdfPath;
    const pdfId = container.dataset.pdfId;
    if (pdfPath && pdfId && !pdfViewers[pdfId]) {
      loadAndRenderPdf(pdfId, pdfPath);
    }
  });
}

async function loadAndRenderPdf(pdfId, pdfPath) {
  try {
    const pdfjsLib = await loadPdfJs();
    const loadingEl = document.getElementById(pdfId + '-loading');
    const canvasEl = document.getElementById(pdfId + '-canvas');
    
    if (!canvasEl) return;
    
    const pdf = await pdfjsLib.getDocument(pdfPath).promise;
    
    pdfViewers[pdfId] = {
      pdf: pdf,
      currentPage: 1,
      totalPages: pdf.numPages,
      scale: 1.0
    };
    
    if (loadingEl) loadingEl.style.display = 'none';
    
    renderPdfPage(pdfId);
    updatePdfInfo(pdfId);
  } catch (err) {
    console.error('PDF load error:', err);
    const loadingEl = document.getElementById(pdfId + '-loading');
    if (loadingEl) {
      loadingEl.textContent = 'PDF yüklenemedi / Could not load PDF';
      loadingEl.style.color = '#c00';
    }
  }
}

async function renderPdfPage(pdfId) {
  const viewer = pdfViewers[pdfId];
  if (!viewer) return;
  
  const page = await viewer.pdf.getPage(viewer.currentPage);
  const canvas = document.getElementById(pdfId + '-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const viewport = page.getViewport({ scale: viewer.scale * 1.5 }); // Higher res for clarity
  
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width = (viewport.width / 1.5) + 'px';
  canvas.style.height = (viewport.height / 1.5) + 'px';
  
  await page.render({
    canvasContext: ctx,
    viewport: viewport
  }).promise;
}

function updatePdfInfo(pdfId) {
  const viewer = pdfViewers[pdfId];
  if (!viewer) return;
  
  const infoEl = document.getElementById(pdfId + '-info');
  const zoomEl = document.getElementById(pdfId + '-zoom');
  
  if (infoEl) infoEl.textContent = `${viewer.currentPage} / ${viewer.totalPages}`;
  if (zoomEl) zoomEl.textContent = Math.round(viewer.scale * 100) + '%';
}

function pdfPrevPage(pdfId) {
  const viewer = pdfViewers[pdfId];
  if (!viewer || viewer.currentPage <= 1) return;
  viewer.currentPage--;
  renderPdfPage(pdfId);
  updatePdfInfo(pdfId);
}

function pdfNextPage(pdfId) {
  const viewer = pdfViewers[pdfId];
  if (!viewer || viewer.currentPage >= viewer.totalPages) return;
  viewer.currentPage++;
  renderPdfPage(pdfId);
  updatePdfInfo(pdfId);
}

function pdfZoomIn(pdfId) {
  const viewer = pdfViewers[pdfId];
  if (!viewer || viewer.scale >= 3) return;
  viewer.scale += 0.25;
  renderPdfPage(pdfId);
  updatePdfInfo(pdfId);
}

function pdfZoomOut(pdfId) {
  const viewer = pdfViewers[pdfId];
  if (!viewer || viewer.scale <= 0.5) return;
  viewer.scale -= 0.25;
  renderPdfPage(pdfId);
  updatePdfInfo(pdfId);
}

// Auto-init PDF viewers when reading overlay content changes
const pdfObserver = new MutationObserver(() => {
  setTimeout(initSecurePdfViewers, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  const readingBody = document.getElementById('reading-body');
  if (readingBody) {
    pdfObserver.observe(readingBody, { childList: true, subtree: true });
  }
});
