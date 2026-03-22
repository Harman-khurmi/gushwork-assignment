/**
 * Mangalam HDPE Pipes - script.js
 * Handles: sticky bar, carousel + zoom, FAQ accordion,
 *          process tabs (image arrows navigate tabs),
 *          applications scroll, modals, form validation, toast.
 */
(function () {
  'use strict';

  /* ─── TOAST ───────────────────────────────── */
  function showToast(msg, duration) {
    duration = duration || 3500;
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('visible');
      toast.setAttribute('aria-hidden', 'true');
    }, duration);
  }

  /* ─── MOBILE NAV ──────────────────────────── */
  (function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('.mobile-link, .btn').forEach(function (el) {
      el.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = dd.classList.toggle('open');
          trigger.setAttribute('aria-expanded', String(isOpen));
        });
      }
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.nav-dropdown.open').forEach(function (dd) {
        dd.classList.remove('open');
        var t = dd.querySelector('.dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ─── STICKY BAR ──────────────────────────── */
  (function initStickyBar() {
    var stickyBar = document.getElementById('stickyBar');
    var hero = document.getElementById('hero');
    if (!stickyBar || !hero) return;

    var observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      stickyBar.classList.toggle('visible', !entry.isIntersecting);
      stickyBar.setAttribute('aria-hidden', String(entry.isIntersecting));
    }, { rootMargin: '-68px 0px 0px 0px', threshold: 0 });

    observer.observe(hero);
  })();

  /* ─── CAROUSEL ────────────────────────────── */
  /* PLACEHOLDER: replace src values with real product image paths */
  var carouselImages = [
    { src: '/assets/hero.jpg', alt: 'HDPE Pipe - view 1' },
    { src: '/assets/hero2.webp', alt: 'HDPE Pipe - view 2' },
    { src: '/assets/hero3.webp', alt: 'HDPE Pipe - view 3' },
    { src: '/assets/hero4.webp', alt: 'HDPE Pipe - view 4' },
    { src: '/assets/hero5.webp', alt: 'HDPE Pipe - view 5' }
  ];

  var currentImageIndex = 0;

  function setImage(index) {
    currentImageIndex = (index + carouselImages.length) % carouselImages.length;
    var data = carouselImages[currentImageIndex];
    var mainImg = document.getElementById('mainCarouselImg');
    var zoomPrevImg = document.getElementById('zoomPreviewImg');
    if (!mainImg) return;

    mainImg.style.opacity = '0.5';
    mainImg.src = data.src;
    mainImg.alt = data.alt;
    if (zoomPrevImg) { zoomPrevImg.src = data.src; zoomPrevImg.alt = data.alt; }
    mainImg.onload = function () { mainImg.style.opacity = '1'; };

    document.querySelectorAll('.thumb-btn').forEach(function (btn, i) {
      btn.classList.toggle('active', i === currentImageIndex);
    });
  }

  (function initCarousel() {
    document.addEventListener('DOMContentLoaded', function () { setImage(0); });

    document.querySelectorAll('.thumb-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setImage(parseInt(btn.dataset.index, 10));
      });
    });

    var prev = document.getElementById('arrowPrev');
    var next = document.getElementById('arrowNext');
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); setImage(currentImageIndex - 1); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); setImage(currentImageIndex + 1); });

    var main = document.getElementById('carouselMain');
    if (main) {
      main.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') setImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') setImage(currentImageIndex + 1);
      });
    }
  })();

  /* ─── ZOOM ────────────────────────────────── */
  (function initZoom() {
    var carouselMain = document.getElementById('carouselMain');
    var zoomLens = document.getElementById('zoomLens');
    var zoomPreview = document.getElementById('zoomPreview');
    var zoomPrevImg = document.getElementById('zoomPreviewImg');
    var mainImg = document.getElementById('mainCarouselImg');
    if (!carouselMain || !zoomLens || !zoomPreview || !zoomPrevImg || !mainImg) return;

    var ZOOM = 2.5;

    function updateZoom(e) {
      var rect = carouselMain.getBoundingClientRect();
      var x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      var y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      zoomLens.style.left = x + 'px';
      zoomLens.style.top = y + 'px';
      var px = x / rect.width;
      var py = y / rect.height;
      var pw = zoomPreview.offsetWidth;
      var ph = zoomPreview.offsetHeight;
      var iw = rect.width * ZOOM;
      var ih = rect.height * ZOOM;
      var ox = Math.min(0, Math.max(-(px * iw - pw / 2), pw - iw));
      var oy = Math.min(0, Math.max(-(py * ih - ph / 2), ph - ih));
      zoomPrevImg.style.width = iw + 'px';
      zoomPrevImg.style.height = ih + 'px';
      zoomPrevImg.style.transform = 'translate(' + ox + 'px,' + oy + 'px)';
    }

    carouselMain.addEventListener('mouseenter', function () {
      if (window.innerWidth > 1024) zoomPreview.classList.add('active');
    });
    carouselMain.addEventListener('mouseleave', function () {
      zoomPreview.classList.remove('active');
    });
    carouselMain.addEventListener('mousemove', function (e) {
      if (window.innerWidth > 1024) updateZoom(e);
    });
  })();

  /* ─── FAQ ACCORDION ───────────────────────── */
  (function initFaq() {
    document.querySelectorAll('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var answer = btn.closest('.faq-item') && btn.closest('.faq-item').querySelector('.faq-a');
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        // close all
        document.querySelectorAll('.faq-q').forEach(function (ob) {
          ob.setAttribute('aria-expanded', 'false');
          var a = ob.closest('.faq-item') && ob.closest('.faq-item').querySelector('.faq-a');
          if (a) a.classList.remove('open');
        });

        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          if (answer) answer.classList.add('open');
        }
      });
    });
  })();

  /* ─── PROCESS TABS + IMAGE ARROWS ────────── */
  (function initProcessTabs() {
    var tabs = document.querySelectorAll('.process-tab');
    var panels = document.querySelectorAll('.process-panel');

    function goToTab(idx) {
      var total = tabs.length;
      var next = (idx + total) % total;
      tabs.forEach(function (t, i) {
        t.classList.toggle('active', i === next);
        t.setAttribute('aria-selected', String(i === next));
      });
      panels.forEach(function (p, i) {
        p.classList.toggle('active', i === next);
      });
    }

    // Tab button clicks
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        goToTab(parseInt(tab.dataset.tab, 10));
      });
    });

    // Image prev arrows → previous tab
    document.querySelectorAll('.pimg-prev').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var cur = Array.prototype.findIndex.call(tabs, function (t) { return t.classList.contains('active'); });
        goToTab(cur - 1);
      });
    });

    // Image next arrows → next tab
    document.querySelectorAll('.pimg-next').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var cur = Array.prototype.findIndex.call(tabs, function (t) { return t.classList.contains('active'); });
        goToTab(cur + 1);
      });
    });
  })();

  /* ─── APPLICATIONS SCROLL ─────────────────── */
  (function initAppsScroll() {
    var track = document.getElementById('appsTrack');
    if (!track) return;
    var prev = document.getElementById('appsPrev');
    var next = document.getElementById('appsNext');
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -340, behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: 340, behavior: 'smooth' }); });
  })();

  /* ─── MODAL SYSTEM ────────────────────────── */
  function openModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var first = overlay.querySelector('input, select, button:not(.modal-close)');
      if (first) first.focus();
    }, 50);
  }

  function closeModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(function (o) {
    o.addEventListener('click', function (e) { if (e.target === o) closeModal(o.id); });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (o) { closeModal(o.id); });
    }
  });

  var closeB = document.getElementById('closeBrochureModal');
  var closeQ = document.getElementById('closeQuoteModal');
  if (closeB) closeB.addEventListener('click', function () { closeModal('modalBrochure'); });
  if (closeQ) closeQ.addEventListener('click', function () { closeModal('modalQuote'); });

  // Brochure triggers
  ['downloadBtn', 'specsDownloadBtn'].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', function () { openModal('modalBrochure'); });
  });

  // Quote triggers
  ['quoteBtn', 'navContactBtn', 'mobileContactBtn', 'stickyQuoteBtn',
    'featuresQuoteBtn', 'didntFindBtn', 'ctaSubmitBtn'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', function () { openModal('modalQuote'); });
    });

  /* ─── BROCHURE FORM ───────────────────────── */
  (function initBrochureForm() {
    var btn = document.getElementById('downloadBrochureBtn');
    var input = document.getElementById('brochureEmail');
    var errEl = document.getElementById('brochureEmailError');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var val = (input && input.value.trim()) || '';
      if (!val) { showFieldError(input, errEl, 'Email address is required.'); return; }
      if (!isValidEmail(val)) { showFieldError(input, errEl, 'Please enter a valid email address.'); return; }
      clearFieldError(input, errEl);
      /* PLACEHOLDER: replace with real API call */
      closeModal('modalBrochure');
      showToast('✓ Brochure link sent to ' + val);
      if (input) input.value = '';
      var phone = document.getElementById('brochurePhone');
      if (phone) phone.value = '';
    });
  })();

  /* ─── FAQ CATALOGUE FORM ──────────────────── */
  (function initFaqCatalogueForm() {
    var btn = document.getElementById('faqRequestCatalogueBtn');
    var input = document.getElementById('faqCatalogueEmail');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var val = (input && input.value.trim()) || '';
      if (!val || !isValidEmail(val)) {
        if (input) input.classList.add('error');
        showToast('Please enter a valid email address.');
        return;
      }
      if (input) input.classList.remove('error');
      /* PLACEHOLDER: replace with real API call */
      showToast('✓ Catalogue sent to ' + val);
      if (input) input.value = '';
    });
  })();

  /* ─── QUOTE FORM ──────────────────────────── */
  (function initQuoteForm() {
    var btn = document.getElementById('submitQuoteBtn');
    var nameIn = document.getElementById('quoteName');
    var emailIn = document.getElementById('quoteEmail');
    var phoneIn = document.getElementById('quotePhone');
    var nameErr = document.getElementById('quoteNameError');
    var emailErr = document.getElementById('quoteEmailError');
    var phoneErr = document.getElementById('quotePhoneError');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var valid = true;
      var nameVal = (nameIn && nameIn.value.trim()) || '';
      var emailVal = (emailIn && emailIn.value.trim()) || '';
      var phoneVal = (phoneIn && phoneIn.value.trim()) || '';

      if (!nameVal) { showFieldError(nameIn, nameErr, 'Full name is required.'); valid = false; }
      else clearFieldError(nameIn, nameErr);

      if (!isValidEmail(emailVal)) { showFieldError(emailIn, emailErr, 'Please enter a valid email address.'); valid = false; }
      else clearFieldError(emailIn, emailErr);

      if (!isValidPhone(phoneVal)) { showFieldError(phoneIn, phoneErr, 'Please enter a valid 10-digit number.'); valid = false; }
      else clearFieldError(phoneIn, phoneErr);

      if (valid) {
        /* PLACEHOLDER: replace with real API call / CRM submission */
        closeModal('modalQuote');
        showToast("✓ Call-back request submitted! We'll reach you within 24 hours.");
        [nameIn, document.getElementById('quoteCompany'), emailIn, phoneIn].forEach(function (el) {
          if (el) el.value = '';
        });
      }
    });
  })();

  /* ─── HELPERS ─────────────────────────────── */
  function showFieldError(input, el, msg) {
    if (input) input.classList.add('error');
    if (el) el.textContent = msg;
  }
  function clearFieldError(input, el) {
    if (input) input.classList.remove('error');
    if (el) el.textContent = '';
  }
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isValidPhone(v) { return /^[6-9]\d{9}$/.test(v.replace(/[\s\-]/g, '')); }

  // Clear errors on user input
  document.querySelectorAll('.form-input, .faq-cat-input').forEach(function (input) {
    input.addEventListener('input', function () {
      input.classList.remove('error');
      var next = input.nextElementSibling;
      if (next && next.classList.contains('field-error')) next.textContent = '';
    });
  });

  /* ─── SMOOTH SCROLL ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

})();