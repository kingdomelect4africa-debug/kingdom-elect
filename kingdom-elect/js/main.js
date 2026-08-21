const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('open')));

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const groups = new Map();
  revealEls.forEach((el) => {
    const group = el.closest('[data-reveal-group]');
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(el);
  });
  groups.forEach((els) => els.forEach((el, i) => el.style.setProperty('--delay', `${Math.min(i * 0.09, 0.6)}s`)));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
}

document.querySelectorAll('[data-count-to]').forEach((el) => {
  if (reduceMotion) { return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(el);
      const target = el.getAttribute('data-count-to');
      const numeric = parseFloat(target.replace(/[^0-9.]/g, ''));
      const suffix = target.replace(/^[0-9.]+/, '');
      const isDecimal = target.includes('.');
      const start = performance.now();
      const duration = 1500;
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = numeric * eased;
        el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  io.observe(el);
});
