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

// ---- Scroll reveal ----
(function () {
  const els = document.querySelectorAll('.section, .hero-text, .hero-photo');
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
