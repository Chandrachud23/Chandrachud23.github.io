// ---- Year in footer ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Theme toggle (respects saved + system preference) ----
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// ---- Nav shadow on scroll ----
(function () {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---- Gallery lightbox ----
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('img');
  const open = (src, alt) => { lbImg.src = src; lbImg.alt = alt || ''; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); };
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; };
  document.querySelectorAll('.gallery img').forEach((img) => {
    img.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
  });
  lb.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ---- Tabbed sections ----
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const TABS = {
    about: ['about'],
    research: ['research', 'projects'],
    publications: ['publications'],
    experience: ['experience', 'education'],
    awards: ['awards'],
    gallery: ['gallery'],
    contact: ['contact']
  };
  const idToTab = {};
  Object.keys(TABS).forEach((t) => { idToTab[t] = t; TABS[t].forEach((id) => { idToTab[id] = t; }); });

  const links = [...document.querySelectorAll('.tab-link')];
  const sections = [...document.querySelectorAll('#main > section.section')];
  const hero = document.getElementById('top');
  let current = null;

  function showTab(name, doScroll) {
    if (!TABS[name]) name = 'about';
    if (name === current) { if (doScroll) window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    current = name;
    const ids = TABS[name];
    if (hero) hero.hidden = name !== 'about';   // hero (photo + intro) only on the landing tab
    sections.forEach((s) => {
      const on = ids.indexOf(s.id) !== -1;
      s.hidden = !on;
      if (on) s.classList.add('in');
    });
    links.forEach((l) => {
      const active = l.dataset.tab === name;
      l.classList.toggle('active', active);
      l.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (history.replaceState) history.replaceState(null, '', '#' + name);
    if (doScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // intercept in-page anchor clicks that map to a tab (nav tabs, hero "View research", etc.)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (id === 'top') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const tab = idToTab[id];
    if (tab) { e.preventDefault(); showTab(tab, true); }
  });

  // arrow-key navigation across the tablist
  const tablist = document.querySelector('.nav-links');
  if (tablist) tablist.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = links.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    const n = (i + (e.key === 'ArrowRight' ? 1 : links.length - 1)) % links.length;
    links[n].focus();
    showTab(links[n].dataset.tab, false);
  });

  // react to back/forward
  window.addEventListener('hashchange', () => {
    showTab(idToTab[location.hash.slice(1)] || 'about', false);
  });

  // initial tab (supports deep links like #publications); always land at the top so the hero shows
  showTab(idToTab[(location.hash || '').slice(1)] || 'about', false);
  window.scrollTo(0, 0);
  window.addEventListener('load', () => window.scrollTo(0, 0));
})();

// ---- Scroll reveal (section panels only; hero stays always visible) ----
(function () {
  const els = document.querySelectorAll('.section');
  els.forEach((el) => el.classList.add('reveal'));
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
})();
