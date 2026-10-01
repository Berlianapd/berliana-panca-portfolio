const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks?.classList.remove('open'));
});

// Scroll reveal — one of the main interaction layers, kept intentionally subtle.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Highlight the navigation item for the section currently on screen.
const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav-links a').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
);
sections.forEach((section) => sectionObserver.observe(section));

// Desktop cursor glow — lightweight direct positioning, no continuous animation loop.
const cursorGlow = document.querySelector('.cursor-glow');
const cursorDot = document.querySelector('.cursor-dot');
if (window.matchMedia('(pointer: fine)').matches && cursorGlow && cursorDot) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = '1';
    cursorDot.style.opacity = '1';
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    cursorGlow.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
}

// Small 3D tilt effect for project cards.

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 3;
    const rotateX = (0.5 - y) * 3;
    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// Experience photo slots: missing optional photos stay hidden, so you can simply
// drop your own images into assets/images/experience/ using the filenames below.
document.querySelectorAll('.experience-gallery').forEach((gallery) => {
  const photos = [...gallery.querySelectorAll('img')];
  let loaded = 0;
  let failed = 0;

  const checkGallery = () => {
    if (failed === photos.length) gallery.classList.add('is-empty');
  };

  photos.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      loaded += 1;
      return;
    }
    img.addEventListener('load', () => { loaded += 1; }, { once: true });
    img.addEventListener('error', () => {
      failed += 1;
      img.closest('.experience-photo')?.remove();
      checkGallery();
    }, { once: true });
  });

  if (failed === photos.length) gallery.classList.add('is-empty');
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
