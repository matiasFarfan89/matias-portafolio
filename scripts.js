/* =============================================
   MATIAS FARFAN — Portfolio Scripts
   - Navbar scroll effect
   - Reveal-on-scroll via IntersectionObserver
   - Staggered reveal for grid children
   - Contact form validation + feedback
   - Back-to-top button
   ============================================= */

(function () {
  'use strict';

  /* ---- NAVBAR SCROLL EFFECT ---- */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- ACTIVE NAV LINK HIGHLIGHT ---- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---- REVEAL ON SCROLL ---- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      // Skip bare "#" placeholders (e.g. project links) — invalid scroll targets
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        const collapse = document.getElementById('navMenu');
        if (collapse && collapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(collapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });

  /* ---- BACK TO TOP ---- */
  const backBtn = document.getElementById('backToTop');
  window.addEventListener(
    'scroll',
    () => backBtn.classList.toggle('visible', window.scrollY > 500),
    { passive: true }
  );
  backBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---- CONTACT FORM ---- */
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Bootstrap validation classes
      form.classList.add('was-validated');

      if (!form.checkValidity()) {
        showMsg('Please fill in all fields correctly.', 'error');
        return;
      }

      // Simulate async send
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending…';

      setTimeout(() => {
        showMsg("✓ Message sent! I'll get back to you soon.", 'success');
        form.reset();
        form.classList.remove('was-validated');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="bi bi-arrow-right"></i>';
      }, 2500);
    });
  }

  function showMsg(text, type) {
    formMsg.textContent = text;
    formMsg.className = `form-feedback ${type}`;
    setTimeout(() => (formMsg.textContent = ''), 5000);
  }

  /* ---- TYPING cursor on hero name (optional flair) ---- */
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.style.borderRight = '3px solid var(--accent)';
    heroName.style.paddingRight = '4px';
    // Remove cursor after animation completes
    setTimeout(() => {
      heroName.style.borderRight = 'none';
      heroName.style.paddingRight = '0';
    }, 2200);
  }

})();
