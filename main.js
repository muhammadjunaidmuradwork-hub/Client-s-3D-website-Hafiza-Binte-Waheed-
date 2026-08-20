/* ============================================
   MAIN APPLICATION LOGIC
   Hafiza Binte Waheed — Quran Academy
   ============================================ */

'use strict';

// ============================================================
// NAVBAR
// ============================================================
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll state — handled by Lenis in animations.js when available
  if (!window.HBW?.lenis) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      const btn = document.getElementById('backToTop');
      if (btn) {
        if (window.scrollY > 400) btn.classList.add('visible');
        else btn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // Mobile menu toggle
  if (hamburger && navLinks) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
      navLinks.classList.add('open');
      hamburger.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) closeMenu();
      else openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id], div[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            a.classList.remove('active-nav');
            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.classList.add('active-nav');
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' }
  );

  sections.forEach((s) => sectionObserver.observe(s));
})();

// ============================================================
// BACK TO TOP
// ============================================================
function scrollToTop() {
  if (window.HBW?.lenis) {
    window.HBW.lenis.scrollTo(0, { duration: 2 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}



// ============================================================
// TESTIMONIALS CAROUSEL
// ============================================================
(function initTestimonials() {
  const track  = document.getElementById('testimonialsTrack');
  if (!track) return;

  const originalCards = Array.from(track.querySelectorAll('.testimonial-card')).slice(0, 16); // First 16 are original
  const dotsEl = document.getElementById('testimonialDots');

  let currentIndex   = 0;
  let cardWidth      = 287.5; // 270px card + 17.5px half-gap for centering
  let visibleCount   = 4; // Now showing 4 cards at once
  let autoPlayTimer  = null;
  let isDragging     = false;
  let startX         = 0;
  let startTranslate = 0;
  let isInitialized  = false;

  function getVisibleCount() {
    if (window.innerWidth <= 600)  return 1;
    if (window.innerWidth <= 900)  return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
  }

  function getCardWidth() {
    const card = track.querySelector('.testimonial-card');
    if (card) {
      return card.offsetWidth + 24; // Card width + gap
    }
    return 294; // 270 + 24
  }

  function getMaxIndex() {
    return originalCards.length; // Max index is 16 (we have duplicates)
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const max = originalCards.length;
    for (let i = 0; i < max; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsEl) return;
    const displayIndex = currentIndex % originalCards.length;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === displayIndex);
    });
  }

  function goTo(index) {
    visibleCount = getVisibleCount();
    cardWidth = getCardWidth(); // Dynamic card width calculation
    
    // Handle infinite loop
    if (index >= originalCards.length) {
      // Jump back without animation
      track.style.transition = 'none';
      currentIndex = index % originalCards.length;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      // Force reflow
      void track.offsetHeight;
      // Restore transition
      track.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    } else if (index < 0) {
      currentIndex = 0;
      track.style.transform = `translateX(0)`;
    } else {
      currentIndex = Math.max(0, index);
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    updateDots();
  }

  window.slideTestimonials = function (dir) {
    goTo(currentIndex + dir);
    resetAutoPlay();
  };

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      goTo(currentIndex + 1);
    }, 5000); // Slide every 5 seconds
  }

  // Touch/drag support
  track.addEventListener('touchstart', (e) => {
    isDragging     = true;
    startX         = e.touches[0].clientX;
    startTranslate = currentIndex * getCardWidth();
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const diff = startX - e.touches[0].clientX;
    track.style.transform = `translateX(-${startTranslate + diff}px)`;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    track.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    if (Math.abs(diff) > 60) {
      goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    } else {
      goTo(currentIndex);
    }
    isDragging = false;
    resetAutoPlay();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('testimonials');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowLeft')  window.slideTestimonials(-1);
      if (e.key === 'ArrowRight') window.slideTestimonials(1);
    }
  });

  window.addEventListener('resize', () => {
    if (isInitialized) {
      buildDots();
      goTo(currentIndex);
    }
  });

  // Initialize once
  function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    
    track.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    buildDots();
    goTo(0);
    resetAutoPlay();
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Also wait for images to load
  window.addEventListener('load', () => {
    if (!isInitialized) initialize();
  });
})();

// ============================================================
// NEWSLETTER FORM
// ============================================================
function handleNewsletterSubmit(event) {
  event.preventDefault();
  const form  = event.target;
  const input = form.querySelector('input[type="email"]');
  const email = input ? input.value.trim() : '';

  if (!email) return;

  // Simulate submission (redirect to ConvertKit)
  const convertKitUrl = 'https://hafizabintewaheed.com'; // Replace with actual ConvertKit URL
  const subscribeUrl  = `https://app.kit.com/forms/7558613/subscriptions?email_address=${encodeURIComponent(email)}`;

  // Show success feedback
  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
    btn.style.background = 'linear-gradient(135deg, #2D8A50, #38B16A)';
    btn.disabled = true;

    // Open subscription in new tab
    window.open(subscribeUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
      if (input) input.value = '';
    }, 4000);
  }
}

// ============================================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (window.HBW?.scrollTo) {
        window.HBW.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Page load — hero handled by animations.js
window.addEventListener('load', () => {
  document.body.classList.add('is-ready');
});
