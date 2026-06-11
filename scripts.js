/* =============================================
   MATIAS FARFAN — Portfolio Scripts
   - Vanilla mobile nav toggle (no Bootstrap)
   - Navbar scroll effect + active link highlight
   - Reveal-on-scroll via IntersectionObserver
   - Typewriter hero subtitle
   - Hero canvas particle field
   - Ambient orb parallax
   - Project grid filter
   - Contact form validation + feedback
   - Back-to-top button
   All motion respects prefers-reduced-motion.
   ============================================= */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- MOBILE NAV TOGGLE ---- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close when tapping outside the menu
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---- NAVBAR SCROLL EFFECT ---- */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- ACTIVE NAV LINK HIGHLIGHT ---- */
  const sections = document.querySelectorAll('section[id]');
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
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const delay = reduceMotion ? 0 : siblings.indexOf(entry.target) * 80;
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
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        closeMenu();
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
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  );

  /* ---- TYPEWRITER (hero subtitle) ---- */
  const typeTarget = document.getElementById('typeText');
  const ROLES = [
    'Full-Stack Developer',
    'Automation Builder',
    'Linux Enthusiast',
    'Next.js Developer',
  ];

  if (typeTarget) {
    if (reduceMotion) {
      typeTarget.textContent = ROLES[0];
    } else {
      let role = 0;
      let chars = 0;
      let deleting = false;

      const tick = () => {
        const word = ROLES[role];
        chars += deleting ? -1 : 1;
        typeTarget.textContent = word.slice(0, chars);

        let delay;
        if (!deleting && chars === word.length) {
          delay = 1800; // pause on the full word
          deleting = true;
        } else if (deleting && chars === 0) {
          deleting = false;
          role = (role + 1) % ROLES.length;
          delay = 400;
        } else {
          delay = deleting ? 45 : 70 + Math.random() * 55;
        }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 700); // let the fade-up entrance land first
    }
  }

  /* ---- HERO CANVAS PARTICLES ---- */
  const canvas = document.getElementById('heroCanvas');

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const VIOLET = '139, 133, 255';
    const MINT = '0, 245, 196';
    const LINK_DIST = 130;
    let particles = [];
    let rafId = null;
    let visible = true;

    function buildParticles() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 0.7 + Math.random() * 1.5,
        color: Math.random() < 0.18 ? MINT : VIOLET,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around the edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.55)`;
        ctx.fill();
      }

      // Faint links between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${VIOLET}, ${(1 - dist / LINK_DIST) * 0.14})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (rafId === null && visible && !document.hidden) {
        rafId = requestAnimationFrame(step);
      }
    }
    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // Pause when the hero is off-screen or the tab is hidden
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () =>
      document.hidden ? stop() : start()
    );

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildParticles, 200);
    });

    buildParticles();
    start();
  }

  /* ---- AMBIENT ORB PARALLAX ---- */
  const orbs = document.querySelectorAll('[data-speed]');

  if (orbs.length && !reduceMotion) {
    let ticking = false;
    function moveOrbs() {
      orbs.forEach((orb) => {
        const speed = parseFloat(orb.dataset.speed) || 0;
        orb.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
      });
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(moveOrbs);
          ticking = true;
        }
      },
      { passive: true }
    );
    moveOrbs();
  }

  /* ---- PROJECT FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      projectCards.forEach((card) => {
        card.classList.toggle(
          'is-hidden',
          filter !== 'all' && card.dataset.type !== filter
        );
      });
    });
  });

  /* ---- CONTACT FORM ---- */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

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
        submitBtn.innerHTML = 'Send Message <i class="bi bi-arrow-right" aria-hidden="true"></i>';
      }, 2500);
    });
  }

  function showMsg(text, type) {
    formMsg.textContent = text;
    formMsg.className = `form-feedback ${type}`;
    setTimeout(() => (formMsg.textContent = ''), 5000);
  }
})();
