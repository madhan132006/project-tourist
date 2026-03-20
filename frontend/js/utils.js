/* ============================================================
   UTILS.JS — Shared utilities for Smart Tourist Safety System
   ============================================================ */

// ─── THEME MANAGEMENT ───
const THEME_KEY = 'tss_theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.classList.toggle('active', saved === 'light');
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.classList.toggle('active', next === 'light');
  });
}

function applyTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
}

// ─── TOAST NOTIFICATIONS ───
function showToast(message, type = 'success', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── LOADING STATE ───
function setLoading(el, loading, originalText) {
  if (!el) return;
  if (loading) {
    el._orig = el.innerHTML;
    el.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.5rem;"><span style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;"></span> Loading...</span>';
    el.disabled = true;
  } else {
    el.innerHTML = el._orig || originalText || 'Done';
    el.disabled = false;
  }
}

// ─── FORMAT HELPERS ───
function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(dateStr) {
  return formatDate(dateStr) + ' ' + formatTime(dateStr);
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return formatDate(dateStr);
}

// ─── HASH UTILITIES ───
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
}

function generateBlockHash(index, prevHash, timestamp, data) {
  const raw = `${index}${prevHash}${timestamp}${JSON.stringify(data)}`;
  return simpleHash(raw).padEnd(64, simpleHash(raw).slice(0, 16));
}

// ─── SCROLL REVEAL ───
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ─── ACTIVE NAV LINK ───
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a, .navbar-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === path || a.getAttribute('href') === './' + path) {
      a.classList.add('active');
    }
  });
}

// ─── GEOLOCATION ───
function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setActiveNav();
  initScrollReveal();
});
