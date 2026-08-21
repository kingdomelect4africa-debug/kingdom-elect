const kfSteps = document.querySelectorAll('.kf-step');
const kfNodes = document.querySelectorAll('.kf-node');

if (kfSteps.length && 'IntersectionObserver' in window) {
  const kfObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = [...kfSteps].indexOf(entry.target);
        kfNodes.forEach((node, i) => {
          node.classList.toggle('active', i === idx);
          node.classList.toggle('done', i < idx);
        });
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  kfSteps.forEach((step) => kfObserver.observe(step));
}

const fiveLetters = document.querySelectorAll('.five-letter');
const fivePanels = document.querySelectorAll('.five-panel');
fiveLetters.forEach((letter) => {
  letter.addEventListener('click', () => {
    const key = letter.dataset.key;
    fiveLetters.forEach((l) => l.classList.toggle('active', l === letter));
    fivePanels.forEach((p) => p.classList.toggle('active', p.dataset.key === key));
  });
});
