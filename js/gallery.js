/**
 * Mukul Bithi School - Gallery & Lightbox Controller
 * Features category filtering, full-screen lightbox, keyboard navigation & touch swipe
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFiltering();
  initLightbox();
});

/* Category Filtering */
function initGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === itemCat) {
          item.style.display = 'block';
          item.classList.add('is-revealed');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Fullscreen Accessible Lightbox */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img-wrap img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightboxModal || !galleryItems.length) return;

  let currentIndex = 0;
  let visibleItems = [];

  const updateVisibleItems = () => {
    visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  };

  const showImage = (index) => {
    if (!visibleItems.length) return;

    if (index < 0) index = visibleItems.length - 1;
    if (index >= visibleItems.length) index = 0;

    currentIndex = index;
    const currentItem = visibleItems[currentIndex];
    const img = currentItem.querySelector('img');
    const title = currentItem.querySelector('.gallery-item-title');
    const cat = currentItem.querySelector('.gallery-item-cat');

    if (img && lightboxImg) {
      lightboxImg.src = img.getAttribute('src') || '';
      lightboxImg.alt = img.getAttribute('alt') || 'Mukul Bithi School Gallery';
    }

    if (lightboxCaption && title) {
      const catText = cat ? ` - ${cat.textContent}` : '';
      lightboxCaption.textContent = `${title.textContent}${catText}`;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} of ${visibleItems.length}`;
    }
  };

  const openLightbox = (item) => {
    updateVisibleItems();
    const index = visibleItems.indexOf(item);
    currentIndex = index !== -1 ? index : 0;
    showImage(currentIndex);
    lightboxModal.classList.add('is-open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe Left -> Next image
      showImage(currentIndex + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe Right -> Prev image
      showImage(currentIndex - 1);
    }
  };
}
