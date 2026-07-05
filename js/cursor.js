/**
 * cursor.js
 * Inner dot  → snaps instantly to mouse (set via left/top)
 * Outer ring → lags behind with LERP easing
 * Label      → follows ring position
 * Disabled on touch/coarse-pointer devices
 */
(function () {
  'use strict';

  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.getElementById('cursor');
  const dot    = document.getElementById('cursorDot');
  const ring   = document.getElementById('cursorRing');
  const label  = cursor ? cursor.querySelector('.cursor__label') : null;

  if (!cursor || !dot || !ring) return;

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;
  const LERP = 0.12;

  /* Track exact mouse position */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* RAF loop — dot snaps, ring lags */
  function tick() {
    /* Dot — instant */
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    /* Ring — smoothed */
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    /* Label follows ring */
    if (label) {
      label.style.left = ringX + 'px';
      label.style.top  = ringY + 'px';
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ── Hover interactions ── */
  const hoverSel   = 'a, button, input, textarea, select, .pill, .carousel-btn, .tab-btn, .edu-card, .copy-btn, .theme-toggle';
  const projectSel = '.project-card, .project-card__img-wrap';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(projectSel)) {
      cursor.classList.add('expanded', 'show-label');
    } else if (e.target.closest(hoverSel)) {
      cursor.classList.add('expanded');
      cursor.classList.remove('show-label');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const t = e.target;
    if (t.closest(projectSel) || t.closest(hoverSel)) {
      cursor.classList.remove('expanded', 'show-label');
    }
  });

  /* Hide when pointer leaves window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    if (label) label.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '';
    ring.style.opacity = '';
    if (label) label.style.opacity = '';
  });
})();
