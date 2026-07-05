/**
 * animations.js
 * Scroll reveals · Counter · Parallax · Word reveal · Magnetic buttons
 */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ────────────────────────────────────────────
   * 1. Intersection Observer — reveal elements
   * ──────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach((el) => obs.observe(el));
  }

  /* ────────────────────────────────────────────
   * 2. Timeline line draw
   * ──────────────────────────────────────────── */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        timeline.classList.add('line-drawn');
      }
    }, { threshold: 0.08 }).observe(timeline);
  }

  /* ────────────────────────────────────────────
   * 3. Hero word reveal
   * ──────────────────────────────────────────── */
  function wordReveal(el, delay = 200) {
    if (!el || reduced) return;
    el.classList.add('word-reveal');
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) =>
      `<span class="wr-word"><span class="wr-inner" style="transition-delay:${delay + i * 65}ms">${w}</span></span>`
    ).join(' ');
    // Trigger
    requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add('animated'))
    );
  }

  wordReveal(document.querySelector('.hero__sub'), 300);

  /* ────────────────────────────────────────────
   * 4. Counting stats
   * ──────────────────────────────────────────── */
  function countUp(el, target, ms) {
    if (reduced) { el.childNodes[0].textContent = target; return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / ms, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      // Set only the text node (first child), leave suffix span intact
      el.childNodes[0].textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const statNums = document.querySelectorAll('.hero__stat-num');
  if (statNums.length) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target, parseInt(e.target.dataset.target, 10), 1600);
          e.target._obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.9 }).observe(statNums[0]) && statNums.forEach((el) => {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          countUp(el, parseInt(el.dataset.target, 10), 1600);
          obs.unobserve(el);
        }
      }, { threshold: 0.9 });
      obs.observe(el);
    });
  }

  /* ────────────────────────────────────────────
   * 5. Parallax — hero image
   * ──────────────────────────────────────────── */
  const heroWrap = document.querySelector('.hero__img-wrap');
  if (heroWrap && !reduced && window.innerWidth > 768) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroWrap.style.transform = `translateY(${window.scrollY * 0.1}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ────────────────────────────────────────────
   * 6. Magnetic buttons
   * ──────────────────────────────────────────── */
  if (!reduced) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

})();
