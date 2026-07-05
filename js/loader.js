/**
 * loader.js
 * Runs a 0 → 100 % progress bar, then slides the loader off screen.
 * Keeps the page locked (overflow:hidden) while loading.
 */
(function () {
  'use strict';

  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loaderBar');
  const pct      = document.getElementById('loaderPct');
  if (!loader || !bar || !pct) return;

  // Lock scroll immediately
  document.body.classList.add('loading');

  let progress = 0;
  const DURATION = 1800;   // ms — total fill time
  const STEP     = 16;     // ~60fps
  const increment = (STEP / DURATION) * 100;

  /* ── Count up the bar ── */
  const ticker = setInterval(() => {
    progress = Math.min(progress + increment + Math.random() * 1.2, 100);

    const rounded = Math.floor(progress);
    bar.style.width  = rounded + '%';
    pct.textContent  = rounded + '%';

    if (progress >= 100) {
      clearInterval(ticker);
      bar.style.width = '100%';
      pct.textContent = '100%';
      dismiss();
    }
  }, STEP);

  /* ── Dismiss the loader ── */
  function dismiss() {
    // Short pause at 100% so the eye can register it
    setTimeout(() => {
      loader.classList.add('loader--exit');

      // After the slide-up transition, fully hide and unlock scroll
      loader.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName !== 'transform' && e.propertyName !== 'opacity') return;
        loader.classList.add('loader--done');
        document.body.classList.remove('loading');
        loader.removeEventListener('transitionend', onEnd);
      }, { once: false });

      // Fallback — unlock after 900ms no matter what
      setTimeout(() => {
        loader.classList.add('loader--done');
        document.body.classList.remove('loading');
      }, 900);

    }, 260);
  }

  /* ── Safety net: if page takes too long, dismiss anyway ── */
  setTimeout(() => {
    if (!loader.classList.contains('loader--exit')) {
      clearInterval(ticker);
      bar.style.width = '100%';
      pct.textContent = '100%';
      dismiss();
    }
  }, 4000);

})();
