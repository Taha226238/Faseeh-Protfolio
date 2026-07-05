/**
 * carousel.js — Horizontal project card carousel
 */
(function () {
  'use strict';

  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  if (!track || !prevBtn || !nextBtn || !pauseBtn) return;

  const CARD_GAP = 28; // px gap between cards (matches CSS 1.75rem)
  let currentIndex = 0;
  let isPlaying = true;
  let autoTimer = null;
  let cardWidth = 0;
  let visibleCount = 1;

  const cards = Array.from(track.children);
  const total = cards.length;

  function getCardWidth() {
    const card = cards[0];
    if (!card) return 340;
    return card.getBoundingClientRect().width + CARD_GAP;
  }

  function getVisibleCount() {
    const container = track.parentElement.getBoundingClientRect().width;
    const cw = getCardWidth();
    return Math.max(1, Math.floor(container / cw));
  }

  function getMaxIndex() {
    return Math.max(0, total - getVisibleCount());
  }

  function goTo(index) {
    const max = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, max));
    cardWidth = getCardWidth();
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    // Update focus for accessibility
    cards.forEach((c, i) => c.setAttribute('aria-hidden', i < currentIndex || i >= currentIndex + getVisibleCount() ? 'true' : 'false'));
  }

  function next() { goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1); }
  function prev() { goTo(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  pauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    pauseBtn.innerHTML = isPlaying ? '&#9646;&#9646;' : '&#9654;';
    pauseBtn.setAttribute('aria-label', isPlaying ? 'Pause autoplay' : 'Resume autoplay');
    isPlaying ? startAuto() : stopAuto();
  });

  function startAuto() { autoTimer = setInterval(next, 3800); }
  function stopAuto() { clearInterval(autoTimer); }
  function resetAuto() { if (isPlaying) { stopAuto(); startAuto(); } }

  // Keyboard support on cards
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
  });

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(currentIndex), { passive: true });

  // Init
  goTo(0);
  if (isPlaying) startAuto();
})();
