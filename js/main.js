/**
 * main.js — Nav, theme toggle, tabs, copy email, form validation
 */
(function () {
  'use strict';

  /* ── Sticky nav ── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Theme toggle ── */
  const html = document.body;
  const THEME_KEY = 'mf-theme';

  function applyTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }

  // Restore saved theme
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);

  function toggleTheme() {
    const current = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(current);
  }

  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('themeToggleFooter')?.addEventListener('click', toggleTheme);

  /* ── Floating card tabs ── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabWho = document.getElementById('tab-who');
  const tabWhat = document.getElementById('tab-what');
  if (tabBtns.length && tabWho && tabWhat) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => { b.classList.remove('tab-btn--active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('tab-btn--active');
        btn.setAttribute('aria-selected', 'true');
        if (btn.dataset.tab === 'who') {
          tabWho.classList.remove('tab-content--hidden');
          tabWhat.classList.add('tab-content--hidden');
        } else {
          tabWhat.classList.remove('tab-content--hidden');
          tabWho.classList.add('tab-content--hidden');
        }
      });
    });
  }

  /* ── Copy email ── */
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('Faseehzhd@gmail.com').then(() => {
        copyBtn.classList.add('copied');
        copyBtn.setAttribute('aria-label', 'Email copied!');
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.setAttribute('aria-label', 'Copy email address to clipboard');
        }, 2000);
      });
    });
  }

  /* ── Contact form validation ── */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      function validate(id, msg) {
        const input = document.getElementById(id);
        const errEl = input?.nextElementSibling?.nextElementSibling;
        if (!input) return;
        const isEmpty = !input.value.trim();
        const isEmailBad = id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        if (isEmpty || isEmailBad) {
          if (errEl) errEl.textContent = msg;
          input.style.borderBottomColor = '#e05c5c';
          valid = false;
        } else {
          if (errEl) errEl.textContent = '';
          input.style.borderBottomColor = '';
        }
      }

      validate('name', 'Please enter your name.');
      validate('email', 'Please enter a valid email address.');
      validate('message', 'Please write a message.');

      if (valid && formSuccess) {
        formSuccess.textContent = 'Message sent! I\'ll be in touch soon.';
        form.reset();
        setTimeout(() => { formSuccess.textContent = ''; }, 5000);
      }
    });

    // Clear error on input
    form.querySelectorAll('.form-input').forEach((input) => {
      input.addEventListener('input', () => {
        input.style.borderBottomColor = '';
        const err = input.nextElementSibling?.nextElementSibling;
        if (err) err.textContent = '';
      });
    });
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');
  if (sections.length && navLinkEls.length) {
    const activeObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinkEls.forEach((link) => {
            link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach((s) => activeObs.observe(s));
  }
})();
