/* ═══════════════════════════════════════
   common.js — tarık yiğit / veretrir.art
   Shared utilities and data management
   ═══════════════════════════════════════ */

const DATA_VERSION = 7;

// Initialize SITE - check localStorage first, fall back to data.js
(function initSite() {
  // SITE should already be defined by data.js (loaded before this script)
  const fromDataJs = window.SITE || {};
  
  // Check localStorage for admin edits
  const stored = localStorage.getItem('veretrir_site');
  const storedVersion = localStorage.getItem('veretrir_version');
  
  if (stored && storedVersion === String(DATA_VERSION)) {
    try {
      window.SITE = JSON.parse(stored);
      console.log('Loaded SITE from localStorage');
    } catch (e) {
      window.SITE = fromDataJs;
      console.log('localStorage parse error, using data.js');
    }
  } else {
    // Use data.js directly
    window.SITE = fromDataJs;
    console.log('Using SITE from data.js');
  }
  
  // Ensure arrays exist
  if (!window.SITE) window.SITE = {};
  SITE.artworks = SITE.artworks || [];
  SITE.poems = SITE.poems || [];
  SITE.articles = SITE.articles || [];
  SITE.books = SITE.books || [];
  SITE.texts = SITE.texts || {};
})();

// Language
let currentLang = localStorage.getItem('veretrir_lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('veretrir_lang', lang);
}

// Escape HTML
function _esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
