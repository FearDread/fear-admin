;(function($, window, document, undefined) {
  'use strict';

  var PLUGIN_NAME = 'FEAR';
  var DATA_KEY = 'fear_data';
  var VERSION = '2.0.0';

  // Default configuration
  var defaults = {
    // Core settings
    preloadDelay: 800,
    fadeSpeed: 200,
    fragmentPath: 'js/fragments/',
    contactAPI: '/api/contact',
    debug: false,
    enableCache: true,
    lazyLoadImages: true,
    debounceDelay: 100,
    accessibility: {
      enabled: true,
      announceRouteChanges: true,
      focusManagement: true,
      keyboardNavigation: true
    },
    animations: {
      enabled: true,
      reducedMotion: true, // Respect prefers-reduced-motion
      easing: 'ease-in-out'
    },
    router: {
      hashChange: true,
      pushState: false,
      fallbackRoute: 'home',
      beforeRouteChange: null,
      afterRouteChange: null
    },
    components: {
      cursor: { enabled: true, smoothing: 0.15 },
      progressBars: { animationDelay: 100 },
      circularProgress: { size: 110, thickness: 2 },
      modal: { closeOnEscape: true, closeOnOverlay: true }
    },
    routes: {
      home: { name: 'home', html: null, callback: null, title: 'Home' },
      about: { name: 'about', html: null, callback: null, title: 'About' },
      works: { name: 'works', html: null, callback: null, title: 'Works' },
      github: { name: 'github', html: null, callback: null, title: 'GitHub' },
      contact: { name: 'contact', html: null, callback: null, title: 'Contact' }
    },
    
    // Event callbacks
    callbacks: {
      onInitialized: null,
      onRouteChange: null,
      onModalOpen: null,
      onModalClose: null,
      onError: null
    }
  };

  // Utility functions
  var utils = {
    // Debounce function
    debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    
    // Throttle function
    throttle: function(func, limit) {
      var inThrottle;
      return function() {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(function() { inThrottle = false; }, limit);
        }
      };
    },
    
    // Check for reduced motion preference
    prefersReducedMotion: function() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Generate unique ID
    generateId: function() {
      return 'fear_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Sanitize HTML
    sanitizeHtml: function(html) {
      var temp = document.createElement('div');
      temp.textContent = html;
      return temp.innerHTML;
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
      var rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  };

  // Main plugin constructor
  function Fear(element, options) {
    this.element = element;
    this.$element = $(element);
    this.settings = $.extend(true, {}, defaults, options);
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.observers = {};
    this.currentRoute = null;
    this.isDestroyed = false;
    
    // Device detection
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Performance tracking
    this.performanceMetrics = {
      initStart: performance.now(),
      routeLoadTimes: new Map()
    };
    
    this._name = PLUGIN_NAME;
    this._defaults = defaults;
    this._version = VERSION;
    
    this.init();
  }

  // Plugin prototype methods
  Fear.prototype = {
    
    // Initialize the plugin
    init: function() {
      var self = this;
      
      if (this.isDestroyed) return;
      
      this.log('Initializing FEAR App v' + VERSION + '...');
      
      // Check for required dependencies
      if (!this.checkDependencies()) {
        this.handleError('Missing required dependencies');
        return;
      }
      
      // Setup accessibility
      if (this.settings.accessibility.enabled) {
        this.setupAccessibility();
      }
      
      // Setup performance observers
      this.setupPerformanceObservers();
      
      // Setup modal first
      this.setupModal();
      
      // Initialize intersection observer for lazy loading
      if (this.settings.lazyLoadImages) {
        this.setupIntersectionObserver();
      }
      
      // Preload and start
      this.preload(function() {
        if (self.isDestroyed) return;
        
        self.bindEvents();
        self.initRouter();
        self.initComponents();
        
        self.performanceMetrics.initEnd = performance.now();
        self.log('FEAR App initialized successfully in ' + 
                (self.performanceMetrics.initEnd - self.performanceMetrics.initStart).toFixed(2) + 'ms');
        
        self.trigger('fear:initialized');
        
        // Execute callback
        if (self.settings.callbacks.onInitialized) {
          self.settings.callbacks.onInitialized.call(self);
        }
      });

      return this;
    },

    // Check for required dependencies
    checkDependencies: function() {
      var missing = [];
      
      if (typeof $ === 'undefined') missing.push('jQuery');
      
      if (missing.length > 0) {
        this.log('Missing dependencies: ' + missing.join(', '));
        return false;
      }
      
      return true;
    },

    // Setup accessibility features
    setupAccessibility: function() {
      var self = this;
      
      // Add ARIA live region for route announcements
      if (this.settings.accessibility.announceRouteChanges) {
        this.$announcer = $('<div>', {
          'aria-live': 'polite',
          'aria-atomic': 'true',
          'class': 'sr-only fear-route-announcer'
        }).appendTo('body');
      }
      
      // Setup keyboard navigation
      if (this.settings.accessibility.keyboardNavigation) {
        this.setupKeyboardNavigation();
      }
      
      // Setup focus management
      if (this.settings.accessibility.focusManagement) {
        this.$element.attr('role', 'application');
      }
    },

    // Setup keyboard navigation
    setupKeyboardNavigation: function() {
      var self = this;
      
      $(document).on('keydown.fear', function(e) {
        // Escape key to close modal
        if (e.keyCode === 27 && self.settings.components.modal.closeOnEscape) {
          self.closeModal();
        }
        
        // Arrow keys for navigation (when appropriate)
        if (e.target.tagName.toLowerCase() !== 'input' && 
            e.target.tagName.toLowerCase() !== 'textarea') {
          
          switch(e.keyCode) {
            case 37: // Left arrow
              self.navigateToAdjacent('prev');
              break;
            case 39: // Right arrow
              self.navigateToAdjacent('next');
              break;
          }
        }
      });
    },

    // Setup performance observers
    setupPerformanceObservers: function() {
      if ('PerformanceObserver' in window) {
        try {
          var self = this;
          
          // Observe resource loading
          this.observers.resource = new PerformanceObserver(function(list) {
            var entries = list.getEntries();
            entries.forEach(function(entry) {
              if (entry.name.includes(self.settings.fragmentPath)) {
                self.log('Fragment loaded: ' + entry.name + ' in ' + entry.duration.toFixed(2) + 'ms');
              }
            });
          });
          
          this.observers.resource.observe({entryTypes: ['resource']});
        } catch (e) {
          this.log('Performance Observer not fully supported');
        }
      }
    },

    // Setup intersection observer for lazy loading
    setupIntersectionObserver: function() {
      if ('IntersectionObserver' in window) {
        var self = this;
        
        this.observers.intersection = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              self.loadLazyImage(entry.target);
            }
          });
        }, {
          rootMargin: '50px'
        });
      }
    },

    // Load lazy image
    loadLazyImage: function(img) {
      var $img = $(img);
      var src = $img.data('lazy-src');
      
      if (src && !$img.attr('src')) {
        $img.attr('src', src)
            .removeAttr('data-lazy-src')
            .removeClass('lazy-load');
        
        if (this.observers.intersection) {
          this.observers.intersection.unobserve(img);
        }
      }
    },

    // Enhanced preloader with progress tracking
    preload: function(callback) {
      var self = this;
      var $preloader = $('#preloader');
      var $progressBar = $preloader.find('.progress-bar');
      var speed = this.isMobile ? 0 : this.settings.preloadDelay;
      
      // Simulate loading progress
      if ($progressBar.length && !this.isMobile) {
        var progress = 0;
        var interval = setInterval(function() {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          $progressBar.css('width', progress + '%');
        }, 100);
      }

      setTimeout(function() {
        if ($preloader.length) {
          if (!self.isMobile && !utils.prefersReducedMotion()) {
            $preloader.addClass('preloaded');
            setTimeout(function() {
              $preloader.remove();
              if (callback) callback();
            }, 1200);
          } else {
            $preloader.remove();
            if (callback) callback();
          }
        } else {
          if (callback) callback();
        }
      }, speed);
    },

    // Enhanced modal setup
    setupModal: function() {
      if (!this.$element.find('.fear_modalbox').length) {
        var modalId = utils.generateId();
        var modalHTML = [
          '<div class="fear_modalbox" id="' + modalId + '" role="dialog" aria-modal="true" aria-hidden="true">',
            '<div class="modal_overlay"></div>',
            '<div class="box_inner" role="document">',
              '<div class="close">',
                '<button type="button" aria-label="Close modal">',
                  '<i class="icon-cancel" aria-hidden="true"></i>',
                '</button>',
              '</div>',
              '<div class="description_wrap"></div>',
            '</div>',
          '</div>'
        ].join('');
        
        this.$element.prepend(modalHTML);
        this.$modal = this.$element.find('.fear_modalbox');
        
        // Setup overlay click to close
        if (this.settings.components.modal.closeOnOverlay) {
          this.$modal.find('.modal_overlay').on('click.fear', this.closeModal.bind(this));
        }
      }
    },

    // Enhanced event binding with delegation and debouncing
    bindEvents: function() {
      var self = this;

      // Navigation links with history support
      this.$element.on('click.fear', '.transition_link a', 
        utils.debounce(function(e) {
          self.handleNavigation(e, $(this));
        }, this.settings.debounceDelay)
      );

      // Mobile menu toggle
      this.$element.on('click.fear', '.fear_topbar .trigger .hamburger', function(e) {
        self.handleMobileMenu(e, $(this));
      });

      // Mobile menu links
      this.$element.on('click.fear', '.fear_mobile_menu ul li a', function(e) {
        self.closeMobileMenu();
      });

      // Modal close (both button and overlay)
      this.$element.on('click.fear', '.fear_modalbox .close button, .fear_modalbox .modal_overlay', function(e) {
        e.preventDefault();
        self.closeModal();
      });

      // Contact form with enhanced validation
      this.$element.on('click.fear', '.contact_form #send_message', 
        utils.debounce(function(e) {
          e.preventDefault();
          self.handleContactForm();
        }, 500)
      );

      // Portfolio popup
      this.$element.on('click.fear', '.fear_portfolio .portfolio_popup', function(e) {
        e.preventDefault();
        self.handlePortfolioPopup($(this));
      });

      // News popup
      this.$element.on('click.fear', '.fear_news .news_popup, .fear_news .news_list h3 a', function(e) {
        e.preventDefault();
        self.handleNewsPopup($(this));
      });

      // About modal
      this.$element.on('click.fear', '.fear_about .fear_button a', function(e) {
        e.preventDefault();
        self.handleAboutModal($(this));
      });

      // Window resize handler
      $(window).on('resize.fear', 
        utils.throttle(function() {
          self.handleResize();
        }, 100)
      );

      // Handle visibility change for performance
      $(document).on('visibilitychange.fear', function() {
        self.handleVisibilityChange();
      });
    },

    // Handle window resize
    handleResize: function() {
      // Reinitialize cursor on resize
      if (this.settings.components.cursor.enabled && !this.isTouch) {
        this.initCursor();
      }
      
      this.trigger('fear:resize');
    },

    // Handle visibility change
    handleVisibilityChange: function() {
      if (document.hidden) {
        this.trigger('fear:hidden');
      } else {
        this.trigger('fear:visible');
      }
    },

    // Enhanced navigation handler with history support
    handleNavigation: function(e, $link) {
      var $listItem = $link.closest('li');
      var $allItems = this.$element.find('.transition_link li');
      var route = $link.attr('href').replace('#', '');

      if (!$listItem.hasClass('active')) {
        $allItems.removeClass('active');
        $listItem.addClass('active');
        
        // Update browser history if pushState is enabled
        if (this.settings.router.pushState && history.pushState) {
          history.pushState({route: route}, '', '#' + route);
        }
      }
    },

    // Navigate to adjacent route
    navigateToAdjacent: function(direction) {
      var routes = Object.keys(this.settings.routes);
      var currentIndex = routes.indexOf(this.currentRoute);
      var newIndex;
      
      if (direction === 'next') {
        newIndex = currentIndex + 1 >= routes.length ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex - 1 < 0 ? routes.length - 1 : currentIndex - 1;
      }
      
      this.navigateTo(routes[newIndex]);
    },

    // Enhanced mobile menu handler
    handleMobileMenu: function(e, $hamburger) {
      e.preventDefault();
      var $mobileMenu = this.$element.find('.fear_mobile_menu');
      var isOpen = $hamburger.hasClass('is-active');
      
      $hamburger.toggleClass('is-active');
      $mobileMenu.toggleClass('opened');
      
      // Manage focus and ARIA attributes
      if (this.settings.accessibility.enabled) {
        $mobileMenu.attr('aria-hidden', isOpen);
        
        if (!isOpen) {
          // Focus first menu item when opening
          setTimeout(function() {
            $mobileMenu.find('a:first').focus();
          }, 100);
        }
      }
    },

    // Close mobile menu
    closeMobileMenu: function() {
      var $hamburger = this.$element.find('.fear_topbar .trigger .hamburger');
      var $mobileMenu = this.$element.find('.fear_mobile_menu');
      
      $hamburger.removeClass('is-active');
      $mobileMenu.removeClass('opened');
      
      if (this.settings.accessibility.enabled) {
        $mobileMenu.attr('aria-hidden', 'true');
      }
    },

    // Enhanced modal methods
    openModal: function(content, options) {
      var self = this;
      var settings = $.extend({
        title: '',
        className: '',
        onOpen: null,
        onClose: null
      }, options);
      
      var $modal = this.$element.find('.fear_modalbox');
      var $content = $modal.find('.description_wrap');
      
      // Set content
      if (typeof content === 'string') {
        $content.html(content);
      } else {
        $content.empty().append(content);
      }
      
      // Add custom class
      if (settings.className) {
        $modal.addClass(settings.className);
      }
      
      // Set title for accessibility
      if (settings.title) {
        $modal.attr('aria-label', settings.title);
      }
      
      $modal.removeClass('closing').addClass('opened').attr('aria-hidden', 'false');
      
      // Focus management
      if (this.settings.accessibility.focusManagement) {
        this.previousFocus = document.activeElement;
        setTimeout(function() {
          var $focusableElements = $modal.find('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
          if ($focusableElements.length) {
            $focusableElements.first().focus();
          }
        }, 100);
      }
      
      this.trigger('fear:modal:opened', { content: content, options: settings });
      
      if (settings.onOpen) {
        settings.onOpen.call(this);
      }
      
      if (this.settings.callbacks.onModalOpen) {
        this.settings.callbacks.onModalOpen.call(this, content, settings);
      }
    },

    closeModal: function() {
      var $modal = this.$element.find('.fear_modalbox');
      
      $modal.addClass('closing').removeClass('opened').attr('aria-hidden', 'true');
      
      setTimeout(function() {
        $modal.removeClass('closing').find('.description_wrap').empty();
      }, 300);
      
      // Restore focus
      if (this.previousFocus && this.settings.accessibility.focusManagement) {
        this.previousFocus.focus();
        this.previousFocus = null;
      }
      
      this.trigger('fear:modal:closed');
      
      if (this.settings.callbacks.onModalClose) {
        this.settings.callbacks.onModalClose.call(this);
      }
    },


    // Enhanced component initialization
    initComponents: function() {
      try {
        this.convertImgsToSvg();
        this.initBackgroundImages();
        
        if (this.settings.components.cursor.enabled && !this.isTouch) {
          this.initCursor();
        }
        
        this.initProgressBars();
        this.initCircularProgress();
        this.initLazyLoading();
        
        this.log('Components initialized');
        this.trigger('fear:components:initialized');
      } catch (e) {
        this.handleError('Component initialization error: ' + e.message, { error: e });
      }
    },

    // Initialize lazy loading for images
    initLazyLoading: function() {
      if (!this.settings.lazyLoadImages || !this.observers.intersection) {
        return;
      }
      
      var self = this;
      this.$element.find('img[data-lazy-src]').each(function() {
        $(this).addClass('lazy-load');
        self.observers.intersection.observe(this);
      });
    },

    // Enhanced SVG conversion with error handling
    convertImgsToSvg: function() {
      var self = this;
      
      this.$element.find('img.html').each(function() {
        var $img = $(this);
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        var imgAlt = $img.attr('alt');

        if (imgURL && !$img.data('svg-processed')) {
          $img.data('svg-processed', true);
          
          $.get(imgURL, function(data) {
            try {
              var $svg = $(data).find('svg');
              if ($svg.length) {
                if (imgClass) {
                  $svg.attr('class', imgClass + ' replaced-svg');
                }
                if (imgAlt) {
                  $svg.attr('aria-label', imgAlt);
                }
                $svg.removeAttr('xmlns:a');
                $img.replaceWith($svg);
              }
            } catch (e) {
              self.log('Error processing SVG: ' + e.message);
            }
          }, 'xml').fail(function() {
            self.log('Failed to load SVG: ' + imgURL);
          });
        }
      });
    },

    // Initialize background images with lazy loading support
    initBackgroundImages: function() {
      var self = this;
      
      this.$element.find('[data-img-url]').each(function() {
        var $element = $(this);
        var url = $element.data('img-url');
        var isLazy = $element.data('lazy') === true;
        
        if (url && !isLazy) {
          self.setBackgroundImage($element, url);
        } else if (url && isLazy && utils.isInViewport(this)) {
          self.setBackgroundImage($element, url);
        }
      });
    },

    // Set background image with loading state
    setBackgroundImage: function($element, url) {
      var img = new Image();
      var self = this;
      
      img.onload = function() {
        $element.css('background-image', 'url(' + url + ')')
                .addClass('bg-loaded')
                .removeClass('bg-loading');
      };
      
      img.onerror = function() {
        self.log('Failed to load background image: ' + url);
        $element.removeClass('bg-loading').addClass('bg-error');
      };
      
      $element.addClass('bg-loading');
      img.src = url;
    },

    // Enhanced cursor with smooth movement
    initCursor: function() {
      if (this.isTouch) return;
      
      var $cursor = this.$element.find('.mouse-cursor');
      if (!$cursor.length) return;

      var $cursorInner = $('.cursor-inner');
      var $cursorOuter = $('.cursor-outer');
      var smoothing = this.settings.components.cursor.smoothing;
      var mousePos = { x: 0, y: 0 };
      var cursorPos = { x: 0, y: 0 };
      
      if ($cursorInner.length && $cursorOuter.length) {
        // Smooth cursor movement
        var updateCursor = function() {
          cursorPos.x += (mousePos.x - cursorPos.x) * smoothing;
          cursorPos.y += (mousePos.y - cursorPos.y) * smoothing;
          
          $cursorOuter.css('transform', 'translate(' + cursorPos.x + 'px, ' + cursorPos.y + 'px)');
          $cursorInner.css('transform', 'translate(' + mousePos.x + 'px, ' + mousePos.y + 'px)');
          
          requestAnimationFrame(updateCursor);
        };
        
        $(window).off('mousemove.fear').on('mousemove.fear', 
          utils.throttle(function(e) {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
          }, 16)
        );

        $('body').off('mouseenter.fear mouseleave.fear')
          .on('mouseenter.fear',