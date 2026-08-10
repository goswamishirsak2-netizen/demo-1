/**
 * RS FITNESS CENTRE - "ENERGY IN MOTION" CONTROLLER
 * Minimalist Editorial Fitness & Wellness Studio | Belgharia, Kolkata
 * Contact: +91-9147761154
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initInteractiveProgramList();
  initGalleryLightbox();
  initConsultationForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. STICKY MINIMAL NAVBAR
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   2. MOBILE DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const links = document.querySelectorAll('.mobile-drawer-link, .mobile-drawer-actions a');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    toggleBtn.classList.add('active');
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    toggleBtn.classList.remove('active');
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  links.forEach(l => {
    l.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. SCROLL REVEAL
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. INTERACTIVE VERTICAL PROGRAM LIST (EDITORIAL HOVER ENGINE)
   ========================================================================== */
function initInteractiveProgramList() {
  const programItems = document.querySelectorAll('.program-item');
  const previewImg = document.getElementById('programPreviewImg');

  if (!programItems.length || !previewImg) return;

  const programConfigs = {
    fitness: {
      src: 'assets/images/program-fitness-bright.png',
      position: 'center 20%'
    },
    zumba: {
      src: 'assets/images/program-zumba-bright.png',
      position: 'center 15%'
    },
    yoga: {
      src: 'assets/images/program-yoga.png',
      position: 'center center'
    },
    selfdefence: {
      src: 'assets/images/program-selfdefence.png',
      position: 'center 20%'
    },
    kids: {
      src: 'assets/images/kids-defence.png',
      position: 'center 20%'
    }
  };

  programItems.forEach(item => {
    const key = item.getAttribute('data-program');

    const activateItem = () => {
      programItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const config = programConfigs[key];
      if (config && previewImg.getAttribute('src') !== config.src) {
        previewImg.style.opacity = '0';
        setTimeout(() => {
          previewImg.src = config.src;
          previewImg.style.objectPosition = config.position;
          previewImg.style.opacity = '1';
        }, 150);
      }
    };

    item.addEventListener('mouseenter', activateItem);
    item.addEventListener('click', activateItem);
  });
}

/* ==========================================================================
   5. ASYMMETRICAL GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-collage-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const closeBtn = document.getElementById('lightboxClose');

  if (!items.length || !lightbox) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-caption-title');

      if (img && lightboxImg) lightboxImg.src = img.src;
      if (title && lightboxTitle) lightboxTitle.textContent = title.textContent;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeBox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeBox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeBox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeBox();
  });
}

/* ==========================================================================
   6. CONSULTATION BOOKING FORM
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('editorialBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookName')?.value.trim() || 'Prospective Member';
    const phone = document.getElementById('bookPhone')?.value.trim() || '';
    const discipline = document.getElementById('bookProgram')?.value || 'General Fitness';

    if (!phone) {
      alert('Please enter your phone number.');
      return;
    }

    const text = encodeURIComponent(
      `Hi RS Fitness Centre, my name is ${name} (${phone}). I would like to enquire about "${discipline}" classes at your Belgharia studio.`
    );
    const waUrl = `https://wa.me/919147761154?text=${text}`;
    window.open(waUrl, '_blank');
  });
}

/* ==========================================================================
   7. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#' || id.length <= 1) return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.pageYOffset - 75;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
