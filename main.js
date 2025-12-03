

(function() {
  'use strict';

  const THEME_STORAGE_KEY = 'portfolio-theme-preference';
  
  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Restore saved preference on page load
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light') {
      themeToggle.checked = true;
    }

    // Save preference when toggled
    themeToggle.addEventListener('change', function() {
      const theme = this.checked ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    });
  }


  function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.tags button');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;

    // Map project cards to their categories
    const categoryMap = {
      'Marketplace Web App': ['frontend', 'full-stack'],
      'Data-Leak Detection Algorithm': ['data/ml'],
      'Automated Trading Bot': ['data/ml', 'experiments']
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.textContent.toLowerCase().trim();
        
        // Update active state on buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter project cards
        projectCards.forEach(card => {
          const heading = card.querySelector('h3');
          if (!heading) return;
          
          const projectName = heading.textContent.trim();
          const categories = categoryMap[projectName] || [];
          
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease-out';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  function initSmoothScroll() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Disable smooth scroll behavior for users who prefer reduced motion
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    // Handle anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Update focus for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    });
  }


  function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea');
    
    inputs.forEach(input => {
      // Create error message container
      const errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.setAttribute('aria-live', 'polite');
      errorEl.style.cssText = `
        display: block;
        color: var(--accent-red);
        font-size: var(--font-sm);
        margin-block-start: 0.25rem;
        min-height: 1.25em;
      `;
      input.parentNode.appendChild(errorEl);

      // Validate on blur
      input.addEventListener('blur', function() {
        validateInput(this, errorEl);
      });

      // Clear error on input
      input.addEventListener('input', function() {
        if (this.validity.valid) {
          errorEl.textContent = '';
          this.setAttribute('aria-invalid', 'false');
        }
      });
    });

    // Prevent form submission (demo only)
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        const errorEl = input.parentNode.querySelector('.form-error');
        if (!validateInput(input, errorEl)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-message success';
        successMsg.textContent = 'Form submitted successfully! (Demo only)';
        successMsg.setAttribute('role', 'status');
        form.appendChild(successMsg);
        
        setTimeout(() => successMsg.remove(), 3000);
      }
    });
  }

  function validateInput(input, errorEl) {
    if (!input.validity.valid) {
      let message = '';
      
      if (input.validity.valueMissing) {
        message = `${input.previousElementSibling?.textContent || 'This field'} is required`;
      } else if (input.validity.typeMismatch && input.type === 'email') {
        message = 'Please enter a valid email address';
      } else if (input.validity.tooShort) {
        message = `Please enter at least ${input.minLength} characters`;
      }
      
      errorEl.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorEl.id || '');
      return false;
    }
    
    errorEl.textContent = '';
    input.setAttribute('aria-invalid', 'false');
    return true;
  }


  function initLazyAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, article, project-card').forEach(el => {
      el.classList.add('animate-target');
      observer.observe(el);
    });
  }


  function init() {
    initThemeToggle();
    initProjectFilters();
    initSmoothScroll();
    initFormValidation();
    initLazyAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();