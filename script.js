/**
 * AppStudio Enterprise Website
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimations();
  initSmoothScroll();
  initDropdowns();
});

/**
 * Header scroll effects
 */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  let lastScroll = 0;
  let ticking = false;
  function updateHeader() {
    const currentScroll = window.pageYOffset;

    // Add scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide/show on scroll direction (optional)
    if (currentScroll > lastScroll && currentScroll > 200) {
      // Scrolling down
      // header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      // header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const body = document.body;
  if (!menuBtn || !mobileNav) return;
  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      body.style.overflow = '';
    });
  });

  // Mobile submenu toggles
  const submenuToggles = mobileNav.querySelectorAll('.mobile-nav-link[data-submenu]');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenuId = this.getAttribute('data-submenu');
      const submenu = document.getElementById(submenuId);
      if (submenu) {
        submenu.classList.toggle('active');
        this.classList.toggle('active');
      }
    });
  });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .service-card');
  if (!animatedElements.length) return;
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Animated number counters
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  counters.forEach(counter => {
    observer.observe(counter);
  });
}
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const step = target / (duration / 16); // 60fps
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Dropdown menus for desktop navigation
 */
function initDropdowns() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    if (!dropdown) return;
    let timeout;
    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      dropdown.style.display = 'block';
      requestAnimationFrame(() => {
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = dropdown.classList.contains('mega-menu') ? 'translateY(0)' : 'translateX(-50%) translateY(0)';
      });
    });
    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = dropdown.classList.contains('mega-menu') ? 'translateY(-10px)' : 'translateX(-50%) translateY(10px)';
      }, 150);
    });
  });
}

/**
 * Form validation (for contact forms)
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      if (isValid) {
        // Show success message
        showFormMessage(form, 'success', 'Thank you! Your message has been sent.');
        form.reset();
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateInput(input);
        }
      });
    });
  });
}
function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;

  // Remove existing error
  input.classList.remove('error');
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) existingError.remove();

  // Required check
  if (input.hasAttribute('required') && !value) {
    showInputError(input, 'This field is required');
    isValid = false;
  }

  // Email validation
  if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showInputError(input, 'Please enter a valid email address');
      isValid = false;
    }
  }

  // Phone validation
  if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      showInputError(input, 'Please enter a valid phone number');
      isValid = false;
    }
  }
  return isValid;
}
function showInputError(input, message) {
  input.classList.add('error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = 'color: #EF4444; font-size: 0.75rem; margin-top: 0.25rem;';
  input.parentElement.appendChild(errorDiv);
}
function showFormMessage(form, type, message) {
  const existingMessage = form.querySelector('.form-message');
  if (existingMessage) existingMessage.remove();
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
        background: ${type === 'success' ? '#D1FAE5' : '#FEE2E2'};
        color: ${type === 'success' ? '#065F46' : '#991B1B'};
    `;
  form.appendChild(messageDiv);

  // Remove after 5 seconds
  setTimeout(() => messageDiv.remove(), 5000);
}

/**
 * Parallax effect for hero sections
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;
  let ticking = false;
  function updateParallax() {
    const scrollY = window.pageYOffset;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
      const yPos = -(scrollY * speed);
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Tab functionality
 */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPanel = tab.getAttribute('data-tab');

        // Update tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update panels
        panels.forEach(panel => {
          if (panel.getAttribute('data-panel') === targetPanel) {
            panel.classList.add('active');
            panel.style.display = 'block';
          } else {
            panel.classList.remove('active');
            panel.style.display = 'none';
          }
        });
      });
    });
  });
}

/**
 * Accordion functionality
 */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (!header || !content) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all accordions in the same group
      const parent = item.parentElement;
      if (parent.hasAttribute('data-accordion-single')) {
        parent.querySelectorAll('.accordion-item').forEach(acc => {
          acc.classList.remove('active');
          acc.querySelector('.accordion-content').style.maxHeight = null;
        });
      }

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });
}

/**
 * Filter functionality for case studies/insights
 */
function initFilters() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');
  if (!filterBtns.length || !filterItems.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      filterItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.classList.add('fade-in', 'visible');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Scroll progress indicator
 */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/**
 * Back to top button
 */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize additional features when needed
document.addEventListener('DOMContentLoaded', function () {
  initFormValidation();
  initLazyLoading();
  initTabs();
  initAccordions();
  initFilters();
  initScrollProgress();
  initBackToTop();
});