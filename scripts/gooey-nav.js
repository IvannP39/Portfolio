// Simple vanilla JS to animate the gooey blob under the active nav item and spawn particles
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('gooeyNav');
  if (!nav) return;
  const links = nav.querySelectorAll('.gn-link');
  const blob = document.getElementById('gn-blob');
  const particlesContainer = document.getElementById('gn-particles');

  // Position blob under an element
  function moveBlobTo(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = nav.getBoundingClientRect();
    const left = rect.left - parentRect.left + (rect.width - blob.offsetWidth) / 2;
    const top = rect.top - parentRect.top + (rect.height - blob.offsetHeight) / 2;
    blob.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    blob.style.width = `${Math.max(90, rect.width + 20)}px`;
  }

  // spawn a particle at target coords and animate it outward
  function spawnParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'gn-particle';
    particlesContainer.appendChild(p);
    p.style.left = `${x - 4}px`;
    p.style.top = `${y - 4}px`;
    // random direction
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 40;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    p.style.opacity = '1';
    p.style.transition = `transform 700ms cubic-bezier(.22,1,.36,1), opacity 700ms ease`;
    requestAnimationFrame(() => {
      p.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.3)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 900);
  }

  // initialize: set active based on initialActiveIndex data attr or first
  let activeIndex = 0;
  const initial = nav.getAttribute('data-initial-index');
  if (initial) activeIndex = parseInt(initial, 10) || 0;

  function setActive(i, el) {
    links.forEach(l => l.classList.remove('active'));
    if (links[i]) links[i].classList.add('active');
    moveBlobTo(el || links[i]);
  }

  // attach events
  links.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      // allow normal anchor navigation
      setActive(i, link);
      // spawn a few particles around the clicked link center
      const rect = link.getBoundingClientRect();
      const parentRect = nav.getBoundingClientRect();
      const cx = rect.left - parentRect.left + rect.width / 2;
      const cy = rect.top - parentRect.top + rect.height / 2;
      for (let k = 0; k < 6; k++) spawnParticle(cx + (Math.random() - 0.5) * 10, cy + (Math.random() - 0.5) * 10);
    });

    // hover micro-movement
    link.addEventListener('mouseenter', () => moveBlobTo(link));
  });

  // initial placement once fonts/styles computed
  setTimeout(() => {
    setActive(activeIndex, links[activeIndex]);
  }, 80);

  // reposition on resize
  window.addEventListener('resize', () => {
    const active = nav.querySelector('.gn-link.active') || links[0];
    moveBlobTo(active);
  });

});

// Back-to-top button behaviour — initialize on DOMContentLoaded to ensure element exists
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  // show when scrolled down
  function onScroll() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  // smooth scroll to top
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  // initial state
  onScroll();
});
