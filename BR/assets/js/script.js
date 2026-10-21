/* ============================================================
   BR Enterprises - Main JavaScript
   ============================================================ */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initCounterAnimation();
  initProductFilter();
  initContactForm();
  initBackToTop();
  initScrollProgress();
  initActiveNavOnScroll();
  initParallax();
  initGalleryLightbox();
  initHeroSlider();
  addKeyframes();
});

/* ========== HEADER SCROLL EFFECT ========== */
function initHeader() {
  var header = document.getElementById("siteHeader");
  if (!header) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }, { passive: true });
}

/* ========== MOBILE NAVIGATION ========== */
function initMobileNav() {
  var hamburger = document.getElementById("hamburger");
  var mainNav = document.getElementById("mainNav");
  if (!hamburger || !mainNav) return;

  var dropdownItem = mainNav.querySelector(".has-dropdown");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mainNav.classList.toggle("open");
    document.body.classList.toggle("nav-open");
    if (!mainNav.classList.contains("open") && dropdownItem) {
      dropdownItem.classList.remove("open");
    }
  });

  var navCloseBtn = document.getElementById("navCloseBtn");
  if (navCloseBtn) {
    navCloseBtn.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mainNav.classList.remove("open");
      document.body.classList.remove("nav-open");
      if (dropdownItem) dropdownItem.classList.remove("open");
    });
  }

  // Handle dropdown toggle on mobile
  mainNav.querySelectorAll(".has-dropdown").forEach(function (dd) {
    var trigger = dd.querySelector(".nav-link");
    if (trigger) {
      trigger.addEventListener("click", function (e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          e.stopPropagation();
          dd.classList.toggle("open");
        }
      });
    }
  });

  // Close mobile nav when clicking normal links or product links inside the mega-menu
  mainNav.querySelectorAll(".nav-link:not(.has-dropdown > .nav-link), .mega-menu a").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mainNav.classList.remove("open");
      document.body.classList.remove("nav-open");
      if (dropdownItem) dropdownItem.classList.remove("open");
    });
  });

  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
      hamburger.classList.remove("active");
      mainNav.classList.remove("open");
      document.body.classList.remove("nav-open");
      if (dropdownItem) dropdownItem.classList.remove("open");
    }
  });
}

/* ========== SMOOTH SCROLL ========== */
function initSmoothScroll() {
  document.querySelectorAll("a[href^='#']").forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#" || href === "#!") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var headerH = (document.getElementById("siteHeader") || {}).offsetHeight || 80;
      var annoBar = document.getElementById("announcementBar");
      var annoH = annoBar ? annoBar.offsetHeight : 0;
      var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - headerH - annoH - 16;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });
}

/* ========== SCROLL ANIMATIONS ========== */
function initScrollAnimations() {
  var selectors = [
    ".product-card", ".why-card", ".about-feature-item",
    ".contact-detail-item", ".gallery-item", ".client-logo-item",
    ".strip-item", ".section-header", ".about-content",
    ".about-visual", ".contact-info", ".contact-form-wrap"
  ];
  selectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add("fade-up");
      el.style.transitionDelay = ((i % 6) * 80) + "ms";
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        (function (t) { setTimeout(function () { t.style.transitionDelay = ""; }, 1200); })(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".fade-up").forEach(function (el) { observer.observe(el); });
}

/* ========== COUNTER ANIMATION ========== */
function initCounterAnimation() {
  var counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 2000;
    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target).toLocaleString("en-IN");
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
}

/* ========== PRODUCT FILTER ========== */
function initProductFilter() {
  var filterBtns = document.querySelectorAll(".filter-btn");
  var productCards = document.querySelectorAll(".product-card");
  var searchInput = document.getElementById("productSearch");
  if (!productCards.length) return;

  var currentFilter = "all";
  var currentSearch = "";

  function applyFilterAndSearch() {
    var query = currentSearch.trim().toLowerCase();
    var visibleCount = 0;

    productCards.forEach(function (card, i) {
      var category = card.getAttribute("data-category") || "";
      var text = card.textContent.toLowerCase();
      var matchesCategory = currentFilter === "all" || category === currentFilter;
      var matchesSearch = !query || text.indexOf(query) !== -1;

      if (matchesCategory && matchesSearch) {
        visibleCount++;
        card.style.display = "flex";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(function () {
          card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, (visibleCount % 8) * 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        setTimeout(function () { card.style.display = "none"; }, 250);
      }
    });
  }

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter") || "all";
        applyFilterAndSearch();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      currentSearch = e.target.value || "";
      applyFilterAndSearch();
    });
  }

  // Pre-filter from URL parameter or hash (e.g. ?category=speed or #speed)
  try {
    var urlParams = new URLSearchParams(window.location.search);
    var targetCategory = urlParams.get("category") || (window.location.hash ? window.location.hash.replace("#", "") : null);
    if (targetCategory) {
      var matchingBtn = document.querySelector('.filter-btn[data-filter="' + targetCategory + '"]');
      if (matchingBtn) {
        matchingBtn.click();
      }
    }
  } catch (err) {}
}

/* ========== CONTACT FORM ========== */
function initContactForm() {
  var form = document.getElementById("contactForm");
  var successMsg = document.getElementById("formSuccess");
  var submitBtn = document.getElementById("submitBtn");
  var productSelect = document.getElementById("fproduct");

  // Pre-select product from URL parameter ?product=...
  if (productSelect) {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var productParam = urlParams.get("product");
      if (productParam) {
        var cleanParam = decodeURIComponent(productParam).toLowerCase();
        for (var i = 0; i < productSelect.options.length; i++) {
          var optText = productSelect.options[i].text.toLowerCase();
          if (optText.indexOf(cleanParam) !== -1 || cleanParam.indexOf(optText) !== -1) {
            productSelect.selectedIndex = i;
            productSelect.style.borderColor = "var(--primary)";
            break;
          }
        }
      }
    } catch (err) {}
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fname = (document.getElementById("fname") || {}).value || "";
    var fphone = (document.getElementById("fphone") || {}).value || "";
    fname = fname.trim(); fphone = fphone.trim();

    if (!fname) { shakeField("fname"); return; }
    if (fphone.length < 10) { shakeField("fphone"); return; }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(function () {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.style.background = "#00c896";
      if (successMsg) { successMsg.style.display = "block"; }

      setTimeout(function () {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.style.background = "";
        if (successMsg) successMsg.style.display = "none";
      }, 4000);
    }, 1800);
  });

  function shakeField(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = "#ff4d4d";
    el.style.animation = "shake 0.4s ease";
    el.addEventListener("animationend", function () { el.style.animation = ""; }, { once: true });
    el.focus();
    setTimeout(function () { el.style.borderColor = ""; }, 2000);
  }
}

/* ========== SCROLL PROGRESS BAR ========== */
function initScrollProgress() {
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  function update() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
  var btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) btn.classList.add("visible");
    else btn.classList.remove("visible");
  }, { passive: true });
  btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
}

/* ========== ACTIVE NAV ON SCROLL ========== */
function initActiveNavOnScroll() {
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) link.classList.add("active");
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ========== PARALLAX ========== */
function initParallax() {
  var heroSection = document.querySelector(".hero-section");
  if (!heroSection) return;
  if (window.innerWidth < 768) return;

  window.addEventListener("scroll", function () {
    var scrollY = window.pageYOffset;
    if (scrollY < window.innerHeight * 1.5) {
      var gridOverlay = heroSection.querySelector(".hero-grid-overlay");
      if (gridOverlay) gridOverlay.style.transform = "translateY(" + (scrollY * 0.2) + "px)";
      var bgOverlay = heroSection.querySelector(".hero-bg-overlay");
      if (bgOverlay) bgOverlay.style.transform = "translateY(" + (scrollY * 0.1) + "px)";
    }
  }, { passive: true });
}

/* ========== GALLERY LIGHTBOX ========== */
function initGalleryLightbox() {
  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");

    function activate() {
      var img = item.querySelector("img");
      if (!img) return;
      var label = img.getAttribute("alt") || "";
      var overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px;cursor:pointer;";
      var big = document.createElement("img");
      big.src = img.currentSrc || img.src;
      big.alt = label;
      big.style.cssText = "max-width:100%;max-height:80vh;border-radius:14px;border:1px solid rgba(245,197,24,0.3);object-fit:contain;";
      var cap = document.createElement("p");
      cap.textContent = label;
      cap.style.cssText = "color:#fff;font-weight:600;font-size:16px;text-align:center;";
      var close = document.createElement("button");
      close.textContent = "Close";
      close.style.cssText = "background:#f5c518;color:#000;border:none;padding:10px 24px;border-radius:50px;font-weight:700;cursor:pointer;font-size:14px;";
      overlay.appendChild(big); overlay.appendChild(cap); overlay.appendChild(close);
      document.body.appendChild(overlay);
      close.addEventListener("click", function () { overlay.remove(); });
      overlay.addEventListener("click", function (e) { if (e.target !== big) overlay.remove(); });
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", esc); }
      });
    }

    item.addEventListener("click", activate);
    item.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
  });
}

/* ========== DYNAMIC KEYFRAMES ========== */
function addKeyframes() {
  var style = document.createElement("style");
  style.textContent = [
    "@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }",
    "@keyframes fadeIn { from{opacity:0} to{opacity:1} }",
    "@keyframes scaleIn { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }",
    "@keyframes fadeInUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }",
    "body.nav-open { overflow: hidden; }"
  ].join("\n");
  document.head.appendChild(style);
}

/* ========== HEADER HIDE ON SCROLL DOWN ========== */
(function () {
  var lastScroll = 0;
  var header = document.getElementById("siteHeader");
  if (!header) return;
  window.addEventListener("scroll", function () {
    if (window.innerWidth <= 900 || document.body.classList.contains("nav-open")) {
      header.style.transform = "translateY(0)";
      return;
    }
    var current = window.scrollY;
    if (current > 200) {
      if (current > lastScroll + 4) header.style.transform = "translateY(-100%)";
      else if (current < lastScroll - 4) header.style.transform = "translateY(0)";
    } else {
      header.style.transform = "translateY(0)";
    }
    lastScroll = current;
  }, { passive: true });
})();

/* ========== PRODUCT SPEC TOOLTIPS ========== */
document.querySelectorAll(".product-specs span").forEach(function (span) {
  span.style.cursor = "help";
  span.title = span.textContent.trim();
});

/* ========== HERO BACKGROUND SLIDESHOW LOOP ========== */
function initHeroSlider() {
  var slides = document.querySelectorAll(".hero-slide");
  if (!slides || slides.length < 2) return;

  var currentIndex = 0;
  var intervalTime = 4500; // 4.5 seconds per photo

  setInterval(function () {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, intervalTime);
}