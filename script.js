const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');

document.querySelectorAll('.photo-tile').forEach((tile) => {
  tile.addEventListener('click', () => {
    const image = tile.querySelector('img');
    if (!image) return; // Placeholder tiles stay inert until an image is added.
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

const clips = document.querySelectorAll('.video-card video[data-src]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function prepareClip(video, shouldPlay) {
  if (!video.src) {
    video.src = video.dataset.src;
    video.load();
  }
  if (shouldPlay && !reducedMotion) {
    const playback = video.play();
    if (playback) playback.catch(() => {}); // Controls remain available if autoplay is blocked.
  } else {
    video.pause();
  }
}

if ('IntersectionObserver' in window) {
  const clipObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => prepareClip(target, isIntersecting));
  }, { rootMargin: '160px 0px', threshold: 0.15 });
  clips.forEach((video) => clipObserver.observe(video));
} else {
  clips.forEach((video) => prepareClip(video, true));
}
