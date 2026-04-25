/* ═══════════════════════════════════════
   common.js — tarık yiğit / veretrir.art
   Shared utilities and data management
   ═══════════════════════════════════════ */

const DATA_VERSION = 6;

// Initialize SITE from localStorage or data.js
(function initSite() {
  const stored = localStorage.getItem('veretrir_site');
  if (stored) {
    try {
      window.SITE = JSON.parse(stored);
    } catch (e) {
      window.SITE = window.SITE || {};
    }
  }
  
  // Ensure arrays exist
  SITE.artworks = SITE.artworks || [];
  SITE.projects = SITE.projects || [];
  SITE.poems = SITE.poems || [];
  SITE.articles = SITE.articles || [];
  SITE.books = SITE.books || [];
  SITE.categories = SITE.categories || [];
  SITE.series = SITE.series || [];
  SITE.texts = SITE.texts || {};
  SITE.heroSlider = SITE.heroSlider || {};
})();

// Escape HTML
function _esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
