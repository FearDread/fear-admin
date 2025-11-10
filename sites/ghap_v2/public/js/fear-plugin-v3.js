/*!
 * Fear Portfolio jQuery Plugin - Refactored
 * Version: 2.0.0
 * Author: FearDread
 * Description: A comprehensive, modular jQuery plugin for portfolio and landing page functionality
 * Build Date: September 2025
 */

(function($, window, document, undefined) {
  'use strict';

  // Plugin name and version
  const PLUGIN_NAME = 'fearPortfolio';
  const VERSION = '2.0.0';

  // Default configuration
  const DEFAULTS = {
    // Core settings
    debug: false,
    autoInit: true,
    
    // Module enablement
    modules: {
      loader: true,
      typed: true,
      swiper: true,
      magnificPopup: true,
      countdown: true,
      vegas: true,
      skillbars: true,
      mailchimp: true,
      contactForm: true,
      particles: true
    },

    // Loader settings
    loader: {
      logoScaleDelay: 0,
      loaderHideDelay: 300,
      bodyLoadDelay: 1400,
      selectors: {
        logo: '.loader__logo',
        loader: '.loader',
        main: '#main',
        body: 'body',
        homeTriger: '#home-trigger'
      }
    },
    
    // Typed.js settings
    typed: {
      selector: '#typed',
      stringsElement: '#typed-strings',
      loop: true,
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2500,
      headlineSelector: '.animated-headline'
    },
    
    // Swiper settings
    swiper: {
      selector: '.swiper',
      options: {
        grabCursor: true,
        effect: 'creative',
        creativeEffect: {
          prev: { translate: ['-20%', 0, -1] },
          next: { translate: ['100%', 0, 0] }
        },
        parallax: true,
        speed: 1300,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    },
    
    // Magnific Popup settings
    magnificPopup: {
      selector: '#showreel-trigger',
      options: {
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
      }
    },
    
    // Countdown settings
    countdown: {
      selector: '#countdown',
      targetDate: new Date(2025, 9, 20), // October 20, 2025
      format: 'D',
      timezone: +10
    },
    
    // Vegas settings
    vegas: {
      timer: false,
      delay: 8000,
      transition: 'fade2',
      transitionDuration: 2000,
      animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight'],
      backgrounds: {
        standard: {
          selector: '#bgndKenburns',
          images: [
            'img/backgrounds/960x1080-kenburns-1.webp',
            'img/backgrounds/960x1080-kenburns-2.webp',
            'img/backgrounds/960x1080-kenburns-3.webp'
          ]
        },
        fullscreen: {
          selector: '#bgndKenburnsFull',
          images: [
            'img/backgrounds/1920x1080-kenburns-1.webp',
            'img/backgrounds/1920x1080-kenburns-2.webp',
            'img/backgrounds/1920x1080-kenburns-3.webp'
          ]
        }
      }
    },
    
    // Skillbars settings
    skillbars: {
      selector: '.skillbar',
      from: 0,
      speed: 4000,
      interval: 100,
      useIntersectionObserver: true
    },
    
    // Mailchimp settings
    mailchimp: {
      selector: '.notify-form',
      url: 'https://club.us10.list-manage.com/subscribe/post?u=e8d650c0df90e716c22ae4778&amp;id=54a7906900&amp;f_id=00b64ae4f0',
      successDelay: 5000,
      selectors: {
        notify: '.notify',
        form: '.form',
        successMessage: '.subscription-ok',
        errorMessage: '.subscription-error'
      }
    },
    
    // Contact form settings
    contactForm: {
      selector: '#sayhello-form',
      url: 'mail.php',
      successDelay: 5000,
      selectors: {
        container: '.sayhello',
        form: '.form',
        replyGroup: '.reply-group'
      }
    },
    
    // Particles settings
    particles: {
      selector: '#triangles-js',
      config: {
        particles: {
          number: {
            value: 33,
            density: { enable: true, value_area: 1420.4657549380909 }
          },
          color: { value: '#ffffff' },
          shape: {
            type: 'triangle',
            stroke: { width: 0, color: '#000000' }
          },
          opacity: {
            value: 0.06313181133058181,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 11.83721462448409,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 4,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      }
    },
    
    // Event callbacks
    callbacks: {
      onInit: null,
      onLoadComplete: null,
      onDestroy: null,
      onModuleInit: null,
      onModuleDestroy: null
    }
  };

  // Utility functions
  const Utils = {
    log: function(message, type = 'log') {
      if (this.debug && console && console[type]) {
        console[type](`[${PLUGIN_NAME}] ${message}`);
      }
    },

    isFunction: function(fn) {
      return typeof fn === 'function';
    },

    debounce: function(func, wait, immediate) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }
  };

  // Base Module Class
  class BaseModule {
    constructor(core, name, config) {
      this.core = core;
      this.name = name;
      this.config = config;
      this.isInitialized = false;
      this.log = Utils.log.bind(this.config);
    }

    init() {
      if (this.isInitialized) {
        this.log(`Module ${this.name} already initialized`, 'warn');
        return;
      }

      this.log(`Initializing module: ${this.name}`);
      this.isInitialized = true;
      
      if (Utils.isFunction(this.core.options.callbacks.onModuleInit)) {
        this.core.options.callbacks.onModuleInit.call(this.core, this.name);
      }
    }

    destroy() {
      if (!this.isInitialized) return;

      this.log(`Destroying module: ${this.name}`);
      this.isInitialized = false;
      
      if (Utils.isFunction(this.core.options.callbacks.onModuleDestroy)) {
        this.core.options.callbacks.onModuleDestroy.call(this.core, this.name);
      }
    }
  }

  // Loader Module
  class LoaderModule extends BaseModule {
    init() {
      super.init();
      const { selectors, logoScaleDelay, loaderHideDelay, bodyLoadDelay } = this.config;
      
      return new Promise((resolve) => {
        $(selectors.logo).addClass('scaleOut');
        
        setTimeout(() => {
          $(selectors.loader).addClass('loaded');
          $(selectors.main).addClass('active animate-in');
          $(selectors.homeTriger).addClass('active-link');
        }, loaderHideDelay);
        
        setTimeout(() => {
          $(selectors.body).addClass('loaded');
          resolve();
        }, bodyLoadDelay);
      });
    }
  }

  // Typed Module
  class TypedModule extends BaseModule {
    init() {
      super.init();
      const { selector, stringsElement, headlineSelector, ...options } = this.config;
      const $headline = $(headlineSelector);
      
      if ($headline.length && window.Typed) {
        this.instance = new Typed(selector, {
          stringsElement,
          ...options
        });
      }
    }

    destroy() {
      if (this.instance) {
        this.instance.destroy();
        this.instance = null;
      }
      super.destroy();
    }
  }

  // Swiper Module
  class SwiperModule extends BaseModule {
    init() {
      super.init();
      const { selector, options } = this.config;
      const $swiper = $(selector);
      
      if ($swiper.length && window.Swiper) {
        this.instance = new Swiper(selector, options);
      }
    }

    destroy() {
      if (this.instance) {
        this.instance.destroy();
        this.instance = null;
      }
      super.destroy();
    }
  }

  // Magnific Popup Module
  class MagnificPopupModule extends BaseModule {
    init() {
      super.init();
      const { selector, options } = this.config;
      const $trigger = $(selector);
      
      if ($trigger.length && $.magnificPopup) {
        $trigger.magnificPopup({
          ...options,
          callbacks: {
            beforeOpen: () => $('body').addClass('overflow-hidden'),
            close: () => $('body').removeClass('overflow-hidden'),
            ...options.callbacks
          }
        });
      }
    }
  }

  // Countdown Module
  class CountdownModule extends BaseModule {
    init() {
      super.init();
      const { selector, targetDate, format, timezone } = this.config;
      const $countdown = $(selector);
      
      if ($countdown.length && $.countdown) {
        $countdown.countdown({
          until: $.countdown.UTCDate(timezone, targetDate.getFullYear(), 
                 targetDate.getMonth(), targetDate.getDate()),
          format
        });
      }
    }
  }

  // Vegas Module
  class VegasModule extends BaseModule {
    init() {
      super.init();
      const { backgrounds, ...commonOptions } = this.config;
      
      Object.entries(backgrounds).forEach(([key, bgConfig]) => {
        const $element = $(bgConfig.selector);
        if ($element.length && $.fn.vegas) {
          const slides = bgConfig.images.map(src => ({ src }));
          $element.vegas({ ...commonOptions, slides });
        }
      });
    }
  }

  // Skillbars Module
  class SkillbarsModule extends BaseModule {
    init() {
      super.init();
      const $skillbars = $(this.config.selector);
      
      if (!$skillbars.length) return;

      if ($.fn.skillBars) {
        $skillbars.skillBars(this.config);
      } else {
        this.initCustomSkillbars($skillbars);
      }
    }

    initCustomSkillbars($skillbars) {
      $skillbars.each((index, element) => {
        const $skillbar = $(element);
        const $bar = $skillbar.find('.skillbar-bar');
        const $percent = $skillbar.find('.skillbar-percent');
        const percent = parseInt($bar.attr('data-percent') || '0');
        
        if (this.config.useIntersectionObserver && window.IntersectionObserver) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.animateSkillbar($bar, $percent, percent);
                observer.unobserve(entry.target);
              }
            });
          });
          observer.observe(element);
        } else {
          this.animateSkillbar($bar, $percent, percent);
        }
      });
    }

    animateSkillbar($bar, $percent, targetPercent) {
      const { speed, interval } = this.config;
      let currentPercent = 0;
      const increment = targetPercent / (speed / interval);
      
      const timer = setInterval(() => {
        currentPercent += increment;
        if (currentPercent >= targetPercent) {
          currentPercent = targetPercent;
          clearInterval(timer);
        }
        
        $bar.css('width', `${currentPercent}%`);
        $percent.text(`${Math.round(currentPercent)}%`);
      }, interval);
    }
  }

  // Mailchimp Module
  class MailchimpModule extends BaseModule {
    init() {
      super.init();
      const $form = $(this.config.selector);
      
      if (!$form.length) return;

      if ($.fn.ajaxChimp) {
        $form.ajaxChimp({
          callback: (resp) => this.handleCallback(resp),
          url: this.config.url
        });
      } else {
        $form.on('submit', (e) => this.handleSubmit(e));
      }
    }

    handleCallback(resp) {
      const { selectors, successDelay } = this.config;
      const $notify = $(selectors.notify);
      const $form = $notify.find(selectors.form);
      const isSuccess = resp.result === 'success';
      const messageSelector = isSuccess ? selectors.successMessage : selectors.errorMessage;
      
      $form.addClass('is-hidden');
      $notify.find(messageSelector).addClass('is-visible');
      
      setTimeout(() => {
        $notify.find(messageSelector).removeClass('is-visible');
        $form.delay(300).removeClass('is-hidden');
        $(this.config.selector).trigger('reset');
      }, successDelay);
    }

    handleSubmit(e) {
      e.preventDefault();
      // Simulate success for demo
      this.handleCallback({ result: 'success' });
    }
  }

  // Contact Form Module
  class ContactFormModule extends BaseModule {
    init() {
      super.init();
      const $form = $(this.config.selector);
      
      if ($form.length) {
        $form.on('submit', (e) => this.handleSubmit(e));
      }
    }

    handleSubmit(e) {
      e.preventDefault();
      
      $.ajax({
        type: 'POST',
        url: this.config.url,
        data: $(e.target).serialize()
      })
      .done(() => this.showSuccess())
      .fail(() => this.log('Contact form submission failed', 'error'));
    }

    showSuccess() {
      const { selectors, successDelay } = this.config;
      const $container = $(selectors.container);
      const $form = $container.find(selectors.form);
      const $replyGroup = $container.find(selectors.replyGroup);
      
      $form.addClass('is-hidden');
      $replyGroup.addClass('is-visible');
      
      setTimeout(() => {
        $replyGroup.removeClass('is-visible');
        $form.delay(300).removeClass('is-hidden');
        $(this.config.selector).trigger('reset');
      }, successDelay);
    }
  }

  // Particles Module
  class ParticlesModule extends BaseModule {
    init() {
      super.init();
      const { selector, config } = this.config;
      const $container = $(selector);
      
      if ($container.length && window.particlesJS) {
        particlesJS(selector.replace('#', ''), config);
      }
    }
  }

  // Main Plugin Class
  class FearPortfolio {
    constructor(element, options) {
      this.element = element;
      this.$element = $(element);
      this.options = $.extend(true, {}, DEFAULTS, options);
      this.modules = new Map();
      this.isInitialized = false;
      
      // Bind utility functions
      this.log = Utils.log.bind(this.options);
      this.debounce = Utils.debounce;
      this.throttle = Utils.throttle;
      
      if (this.options.autoInit) {
        this.init();
      }
    }

    init() {
      if (this.isInitialized) {
        this.log('Plugin already initialized', 'warn');
        return this;
      }

      this.log(`Initializing ${PLUGIN_NAME} v${VERSION}`);
      this.isInitialized = true;

      // Initialize on DOM ready
      $(document).ready(() => this.onDOMReady());
      
      // Initialize on window load
      $(window).on('load', () => this.onWindowLoad());
      
      // Trigger init callback
      if (Utils.isFunction(this.options.callbacks.onInit)) {
        this.options.callbacks.onInit.call(this);
      }

      return this;
    }

    onDOMReady() {
      const moduleMap = {
        swiper: SwiperModule,
        magnificPopup: MagnificPopupModule,
        countdown: CountdownModule,
        vegas: VegasModule,
        skillbars: SkillbarsModule,
        mailchimp: MailchimpModule,
        contactForm: ContactFormModule,
        particles: ParticlesModule
      };

      Object.entries(moduleMap).forEach(([name, ModuleClass]) => {
        if (this.options.modules[name]) {
          this.initModule(name, ModuleClass);
        }
      });
    }

    onWindowLoad() {
      const loaderPromise = this.options.modules.loader 
        ? this.initModule('loader', LoaderModule)
        : Promise.resolve();

      loaderPromise.then(() => {
        if (this.options.modules.typed) {
          this.initModule('typed', TypedModule);
        }
        
        if (Utils.isFunction(this.options.callbacks.onLoadComplete)) {
          this.options.callbacks.onLoadComplete.call(this);
        }
      });
    }

    initModule(name, ModuleClass) {
      try {
        const config = this.options[name];
        const module = new ModuleClass(this, name, config);
        const result = module.init();
        this.modules.set(name, module);
        return result;
      } catch (error) {
        this.log(`Error initializing module ${name}: ${error.message}`, 'error');
        return Promise.reject(error);
      }
    }

    // Public API methods
    enableModule(name) {
      this.options.modules[name] = true;
      return this;
    }

    disableModule(name) {
      this.options.modules[name] = false;
      if (this.modules.has(name)) {
        this.modules.get(name).destroy();
        this.modules.delete(name);
      }
      return this;
    }

    getModule(name) {
      return this.modules.get(name);
    }

    updateOptions(newOptions) {
      this.options = $.extend(true, this.options, newOptions);
      return this;
    }

    destroy() {
      this.log('Destroying plugin instance');
      
      // Destroy all modules
      this.modules.forEach((module) => module.destroy());
      this.modules.clear();
      
      // Remove event listeners
      $(window).off(`.${PLUGIN_NAME}`);
      $(document).off(`.${PLUGIN_NAME}`);
      
      // Trigger destroy callback
      if (Utils.isFunction(this.options.callbacks.onDestroy)) {
        this.options.callbacks.onDestroy.call(this);
      }
      
      // Clean up
      this.$element.removeData(`plugin_${PLUGIN_NAME}`);
      this.isInitialized = false;
      
      return this;
    }

    // Version info
    static get version() {
      return VERSION;
    }
  }

  // jQuery plugin wrapper
  $.fn[PLUGIN_NAME] = function(options, ...args) {
    return this.each(function() {
      const $element = $(this);
      let instance = $element.data(`plugin_${PLUGIN_NAME}`);
      
      // Initialize if not exists
      if (!instance) {
        instance = new FearPortfolio(this, options);
        $element.data(`plugin_${PLUGIN_NAME}`, instance);
        return;
      }
      
      // Handle method calls
      if (typeof options === 'string') {
        const method = options;
        if (typeof instance[method] === 'function') {
          const result = instance[method].apply(instance, args);
          return result !== undefined ? result : this;
        } else {
          throw new Error(`Method ${method} does not exist on ${PLUGIN_NAME}`);
        }
      }
      
      // Update options
      if (typeof options === 'object') {
        instance.updateOptions(options);
      }
    });
  };

  // Static methods and properties
  $.fn[PLUGIN_NAME].Constructor = FearPortfolio;
  $.fn[PLUGIN_NAME].defaults = DEFAULTS;
  $.fn[PLUGIN_NAME].version = VERSION;

  // Auto-initialize with data attributes
  $(document).ready(() => {
    $('[data-fear-portfolio]').each(function() {
      const $element = $(this);
      const options = $element.data('fear-portfolio-options') || {};
      $element[PLUGIN_NAME](options);
    });
  });

})(jQuery, window, document);