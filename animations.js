/* ============================================
   PREMIUM SCROLL EXPERIENCE ENGINE
   Hafiza Binte Waheed — Quran Academy
   Lenis · GSAP · ScrollTrigger · SplitType
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth <= 768;

  let lenis = null;
  let splitInstances = [];

  // Expose for main.js
  window.HBW = window.HBW || {};
  window.HBW.lenis = null;
  window.HBW.scrollTo = scrollToTarget;

  // ============================================================
  // LOADER — cinematic entrance
  // ============================================================
  function initLoader(onComplete) {
    const loader = document.getElementById('loader');
    if (!loader || prefersReducedMotion) {
      loader?.remove();
      onComplete();
      return;
    }

    document.body.classList.add('is-loading');

    const tl = gsap.timeline({
      onComplete: () => {
        loader.remove();
        document.body.classList.remove('is-loading');
        onComplete();
      },
    });

    tl.to('.loader-arabic', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('.loader-brand span', {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.035,
        ease: 'power4.out',
      }, '-=0.3')
      .to('.loader-bar-fill', { width: '100%', duration: 1.4, ease: 'power2.inOut' }, '-=0.2')
      .to('.loader-sub', { opacity: 1, duration: 0.5 }, '-=0.6')
      .to('#loader', {
        yPercent: -100,
        duration: 1.1,
        ease: 'power4.inOut',
        delay: 0.25,
      });
  }

  // ============================================================
  // LENIS — buttery smooth scroll
  // ============================================================
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return null;

    lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    window.HBW.lenis = lenis;

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      updateScrollProgress(e.scroll);
      updateNavbar(e.scroll);
      updateBackToTop(e.scroll);
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  function scrollToTarget(target, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { offset: options.offset ?? -85, duration: options.duration ?? 1.6 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateScrollProgress(scroll) {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${(scroll / max) * 100}%` : '0%';
  }

  function updateNavbar(scroll) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    navbar.classList.toggle('scrolled', scroll > 60);
  }

  function updateBackToTop(scroll) {
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('visible', scroll > 400);
  }

  // ============================================================
  // CUSTOM CURSOR + MAGNETIC ELEMENTS
  // ============================================================
  function initCursor() {
    if (isTouch || isMobile) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    const cursorText = document.createElement('div');
    cursorText.className = 'cursor-text-el';
    document.body.appendChild(cursorText);

    let mx = 0, my = 0;
    let dx = 0, dy = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    document.addEventListener('mousedown', () => {
      dot.classList.add('clicking');
      ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      dot.classList.remove('clicking');
      ring.classList.remove('clicking');
    });

    const hoverables = 'a, button, [data-magnetic], .course-card, .testimonial-card, .glimpse-item, .resource-card, input';
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest(hoverables);
      if (t) {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
        const text = t.getAttribute('data-cursor-text');
        if (text) {
          cursorText.textContent = text;
          cursorText.classList.add('show');
        }
      }
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest(hoverables);
      if (t) {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
        cursorText.classList.remove('show');
      }
    });

    function tick() {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      dot.style.left = `${dx}px`;
      dot.style.top = `${dy}px`;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      cursorText.style.left = `${rx}px`;
      cursorText.style.top = `${ry + 28}px`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  function initMagnetic() {
    if (isTouch) return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // ============================================================
  // SPLIT TEXT
  // ============================================================
  function initSplitText() {
    if (typeof SplitType === 'undefined') return;

    document.querySelectorAll('[data-split]').forEach((el) => {
      const split = new SplitType(el, { types: 'lines,words,chars', tagName: 'span' });
      splitInstances.push(split);

      el.querySelectorAll('.char').forEach((char) => {
        char.style.display = 'inline-block';
        if (char.textContent === ' ') char.innerHTML = '&nbsp;';
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          el.classList.add('is-revealed');
          gsap.to(el.querySelectorAll('.char'), {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.75,
            stagger: 0.018,
            ease: 'power4.out',
          });
        },
      });
    });
  }

  // ============================================================
  // HERO ENTRANCE
  // ============================================================
  function initHeroEntrance() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && typeof SplitType !== 'undefined') {
      const split = new SplitType(heroTitle, { types: 'lines,words,chars' });
      splitInstances.push(split);
      heroTitle.querySelectorAll('.char').forEach((c) => {
        c.style.display = 'inline-block';
        if (c.textContent === ' ') c.innerHTML = '&nbsp;';
      });
    }

    gsap.set('.navbar', { y: -80, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.15 });

    tl.to('.navbar', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0)
      .to('.hero-badge', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.1)
      .to('.hero-arabic', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to('.hero-title .char', {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.85,
        stagger: 0.022,
        ease: 'power4.out',
      }, '-=0.4')
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-scroll-hint', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.3');

    // Hero parallax fade on scroll
    gsap.to('.hero-content', {
      y: -80,
      opacity: 0,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    gsap.to('.hero-scroll-hint', {
      opacity: 0,
      y: 30,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '30% top',
        scrub: true,
      },
    });

    gsap.to('.hero-overlay', {
      opacity: 0.95,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // ============================================================
  // DATA-REVEAL SYSTEM
  // ============================================================
  function initRevealSystem() {
    document.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });

    document.querySelectorAll('[data-reveal="pop"]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => el.classList.add('popped'),
      });
    });

    document.querySelectorAll('[data-reveal="line"]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => el.classList.add('revealed'),
      });
    });

    document.querySelectorAll('[data-reveal="curtain"]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          el.classList.add('revealed');
          const curtain = el.querySelector('.img-curtain, .glimpse-curtain');
          if (curtain) curtain.classList.add('revealed');
        },
      });
    });

    // About image curtain
    ScrollTrigger.create({
      trigger: '.about-img-wrapper',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        document.querySelector('.img-curtain')?.classList.add('revealed');
      },
    });

    // About text blocks
    ['.about-desc', '.about-features'].forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            setTimeout(() => el.classList.add('revealed'), i * 120);
          },
        });
      });
    });

    document.querySelectorAll('.stat-block').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('revealed'),
      });
    });

    ScrollTrigger.create({
      trigger: '.youtube-cta',
      start: 'top 88%',
      once: true,
      onEnter: () => document.querySelector('.youtube-cta')?.classList.add('revealed'),
    });
  }

  // ============================================================
  // COUNTERS — scrubbed number animation
  // ============================================================
  function initCounters() {
    document.querySelectorAll('.counter').forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el.closest('.stats-strip') || el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => { el.textContent = Math.floor(obj.val); },
        onComplete: () => { el.textContent = target; },
      });
    });
  }

  // ============================================================
  // HORIZONTAL COURSES — pinned scroll journey
  // ============================================================
  function initHorizontalCourses() {
    const outer = document.getElementById('coursesPinOuter');
    const track = document.getElementById('coursesTrack');
    const hint = document.querySelector('.courses-scroll-hint');
    if (!outer || !track) return;

    if (isMobile) {
      outer.style.height = 'auto';
      track.style.flexDirection = 'column';
      track.style.width = '100%';
      track.style.padding = '0 1.5rem';
      document.querySelectorAll('.course-card').forEach((card) => {
        card.style.width = '100%';
      });
      gsap.from('.course-card', {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.courses-section', start: 'top 75%' },
      });
      return;
    }

    function setup() {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id === 'courses-h') st.kill();
      });

      const cards = track.querySelectorAll('.course-card');
      const trackWidth = track.scrollWidth;
      const scrollDistance = trackWidth - window.innerWidth + 120;

      outer.style.height = `${window.innerHeight + scrollDistance}px`;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 80),
        ease: 'none',
        scrollTrigger: {
          id: 'courses-h',
          trigger: outer,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: '.courses-pin-inner',
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (hint) hint.style.opacity = String(1 - self.progress * 2);
            cards.forEach((card, i) => {
              const cardProgress = (self.progress * cards.length) - i;
              card.classList.toggle('is-active', cardProgress > 0 && cardProgress < 1.2);
            });
          },
        },
      });

      gsap.from('.courses-header > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: outer, start: 'top 70%' },
      });
    }

    setup();
    window.addEventListener('resize', () => ScrollTrigger.refresh());
  }

  // ============================================================
  // ABOUT — parallax + floating cards
  // ============================================================
  function initAboutSection() {
    const wrapper = document.querySelector('.about-img-wrapper');
    if (wrapper) {
      gsap.to(wrapper, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    gsap.from('.about-text-col', {
      x: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
    });

    gsap.from('.about-image-col', {
      x: -80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
    });
  }

  // ============================================================
  // STATS STRIP — dramatic scale reveal
  // ============================================================
  function initStatsStrip() {
    gsap.from('.stats-strip', {
      scaleY: 0,
      transformOrigin: 'center top',
      duration: 1,
      ease: 'power4.inOut',
      scrollTrigger: { trigger: '.stats-strip', start: 'top 90%' },
    });

    gsap.from('.stat-block h3', {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.stats-strip-inner', start: 'top 80%' },
    });
  }

  // ============================================================
  // QUIZ — floating deco parallax
  // ============================================================
  function initQuizSection() {
    gsap.to('.quiz-deco-text', {
      x: -120,
      ease: 'none',
      scrollTrigger: {
        trigger: '.quiz-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    gsap.from('.quiz-wrapper', {
      rotateX: 8,
      transformPerspective: 1000,
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.quiz-wrapper', start: 'top 85%' },
    });
  }

  // ============================================================
  // TESTIMONIALS — bg text parallax + card stagger
  // ============================================================
  function initTestimonialsSection() {
    gsap.to('.testimonials-bg-text', {
      x: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    gsap.from('.testimonial-card', {
      opacity: 0,
      y: 60,
      rotateY: -8,
      transformPerspective: 800,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.testimonials-track', start: 'top 85%' },
    });
  }

  // ============================================================
  // GALLERY — stagger scale reveal
  // ============================================================
  function initGallerySection() {
    gsap.from('.glimpse-item', {
      scale: 0.85,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.glimpse-grid', start: 'top 85%' },
    });
  }

  // ============================================================
  // RESOURCES — wave stagger
  // ============================================================
  function initResourcesSection() {
    document.querySelectorAll('.resource-card').forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        once: true,
        onEnter: () => setTimeout(() => card.classList.add('popped'), i * 100),
      });
    });

    gsap.to('.resources-deco-circle', {
      scale: 1.3,
      rotate: 45,
      ease: 'none',
      scrollTrigger: {
        trigger: '.resources-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }

  // ============================================================
  // NEWSLETTER — scale + glow pulse on scroll
  // ============================================================
  function initNewsletterSection() {
    ScrollTrigger.create({
      trigger: '.newsletter-inner',
      start: 'top 85%',
      once: true,
      onEnter: () => document.querySelector('.newsletter-inner')?.classList.add('popped'),
    });

    gsap.to('.nl-glow', {
      scale: 1.5,
      opacity: 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.newsletter-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // ============================================================
  // FOOTER — dramatic reveal
  // ============================================================
  function initFooterSection() {
    gsap.from('.footer-brand-name .char, .footer-brand-name', {
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.02,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-top', start: 'top 85%' },
    });

    gsap.from('.footer-grid > *', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-grid', start: 'top 90%' },
    });
  }

  // ============================================================
  // MARQUEE — speed up on scroll
  // ============================================================
  function initMarquee() {
    const inner = document.getElementById('marqueeInner');
    if (!inner) return;

    ScrollTrigger.create({
      trigger: '.marquee-section',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const speed = 28 - self.progress * 12;
        inner.style.animationDuration = `${Math.max(speed, 12)}s`;
      },
    });
  }

  // ============================================================
  // CARD GLOW + LAZY IMAGES
  // ============================================================
  function initCardGlow() {
    document.querySelectorAll('.course-card, .resource-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  function initLazyImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      if (img.complete) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'));
    });
  }

  // ============================================================
  // SECTION LABELS — slide in from left
  // ============================================================
  function initSectionLabels() {
    gsap.utils.toArray('.section-label').forEach((label) => {
      gsap.from(label, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: label, start: 'top 90%' },
      });
    });
  }

  // ============================================================
  // BOOT
  // ============================================================
  function boot() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.getElementById('loader')?.remove();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initLoader(() => {
      initLenis();
      initCursor();
      initMagnetic();
      initHeroEntrance();
      initSplitText();
      initRevealSystem();
      initCounters();
      initAboutSection();
      initStatsStrip();
      initHorizontalCourses();
      initQuizSection();
      initTestimonialsSection();
      initGallerySection();
      initResourcesSection();
      initNewsletterSection();
      initFooterSection();
      initMarquee();
      initSectionLabels();
      initCardGlow();
      initLazyImages();

      ScrollTrigger.refresh();

      window.addEventListener('load', () => ScrollTrigger.refresh());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
