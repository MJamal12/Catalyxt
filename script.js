(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', function () {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .problem-card, .feature-card, .step, .price-card, .compare-wrap, .work-card, .quote-card, .cta-copy, .form-card, .problem-kicker'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const setError = function (name, message) {
    const input = form.elements[name];
    const slot = form.querySelector('[data-error-for="' + name + '"]');
    if (!input || !slot) return;
    input.closest('.field').classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    slot.textContent = message || '';
  };

  const validate = function () {
    const errors = {};
    const value = function (n) { return (form.elements[n].value || '').trim(); };

    if (value('name').length < 2) errors.name = 'Please tell us your name.';
    if (value('business').length < 2) errors.business = 'Please enter your business name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) errors.email = 'Enter a valid email address.';

    const phone = value('phone');
    if (phone && phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid phone number.';

    if (!value('industry')) errors.industry = 'Pick the closest option.';

    return errors;
  };

  ['name', 'business', 'email', 'phone', 'industry'].forEach(function (n) {
    const field = form.elements[n];
    field.addEventListener('input', function () { setError(n, ''); });
    field.addEventListener('change', function () { setError(n, ''); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const errors = validate();
    ['name', 'business', 'email', 'phone', 'industry'].forEach(function (n) {
      setError(n, errors[n]);
    });

    const first = Object.keys(errors)[0];
    if (first) {
      status.classList.add('is-error');
      status.textContent = 'Please fix the highlighted fields.';
      form.elements[first].focus();
      return;
    }

    // Placeholder submit. Swap for a real endpoint or form service.
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending…';

    window.setTimeout(function () {
      form.reset();
      button.disabled = false;
      button.textContent = 'Get my free consultation';
      status.classList.remove('is-error');
      status.textContent = 'Thanks, we got it. Expect a reply within one business day.';
    }, 700);
  });
})();
