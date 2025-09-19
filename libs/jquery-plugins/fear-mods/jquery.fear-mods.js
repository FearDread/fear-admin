/*!
 * Fear Portfolio jQuery Plugin - Singleton Refactor
 * Version: 3.0.0
 * Author: FearDread
 * Description: A comprehensive, modular jQuery plugin using singleton pattern
 * Build Date: September 2025
 */

(function($, window, document, undefined) {
  'use strict';

  // Plugin constants
  const PLUGIN_NAME = 'fearPortfolio';
  const VERSION = '3.0.0';
  const DATA_KEY = `plugin_${PLUGIN_NAME}`;

  // Default configuration
  const DEFAULTS = {
    debug: false,
    autoInit: true,
    
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
    
    typed: {
      selector: '#typed',
      stringsElement: '#typed-strings',
      loop: true,
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2500,
      headlineSelector: '.animated-headline'
    },
    
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
    
    countdown: {
      selector: '#countdown',
      targetDate: new Date(2025, 9, 20),
      format: 'D',
      timezone: +10
    },
    
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
    
    skillbars: {
      selector: '.skillbar',
      from: 0,
      speed: 4000,
      interval: 100,
      useIntersectionObserver: true
    },
    
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
    
    callbacks: {
      onInit: null,
      onLoadComplete: null,
      onDestroy: null,
      onModuleInit: null,
      onModuleDestroy: null
    }
  };

  // Utility Singleton
  const Utils = (() => {
    let options = {};

    const log = (message, type = 'log') => {
      if (options.debug && console && console[type]) {
        console[type](`[${PLUGIN_NAME}] ${message}`);
      }
    };

    const isFunction = (fn) => typeof fn === 'function';

    const debounce = (func, wait, immediate) => {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = () => {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    const throttle = (func, limit) => {
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
    };

    const setOptions = (opts) => {
      options = opts;
    };

    return {
      log,
      isFunction,
      debounce,
      throttle,
      setOptions
    };
  })();

  // Module Registry Singleton
  const ModuleRegistry = (() => {
    const modules = new Map();
    let globalOptions = {};

    const register = (name, instance) => {
      modules.set(name, instance);
      Utils.log(`Module ${name} registered`);
      
      if (Utils.isFunction(globalOptions.callbacks?.onModuleInit)) {
        globalOptions.callbacks.onModuleInit.call(null, name);
      }
    };

    const unregister = (name) => {
      if (modules.has(name)) {
        const module = modules.get(name);
        if (module.destroy) {
          module.destroy();
        }
        modules.delete(name);
        Utils.log(`Module ${name} unregistered`);
        
        if (Utils.isFunction(globalOptions.callbacks?.onModuleDestroy)) {
          globalOptions.callbacks.onModuleDestroy.call(null, name);
        }
      }
    };

    const get = (name) => modules.get(name);

    const has = (name) => modules.has(name);

    const clear = () => {
      modules.forEach((_, name) => unregister(name));
    };

    const setGlobalOptions = (options) => {
      globalOptions = options;
    };

    return {
      register,
      unregister,
      get,
      has,
      clear,
      setGlobalOptions
    };
  })();

  // Loader Module Singleton
  const LoaderModule = (() => {
    let isInitialized = false;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Loader module already initialized', 'warn');
        return Promise.resolve();
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Loader module');

      const { selectors, logoScaleDelay, loaderHideDelay, bodyLoadDelay } = config;
      
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
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Loader module');
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Typed Module Singleton
  const TypedModule = (() => {
    let isInitialized = false;
    let instance = null;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Typed module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Typed module');

      const { selector, stringsElement, headlineSelector, ...opts } = config;
      const $headline = $(headlineSelector);
      
      if ($headline.length && window.Typed) {
        instance = new Typed(selector, {
          stringsElement,
          ...opts
        });
      }
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Typed module');
      
      if (instance) {
        instance.destroy();
        instance = null;
      }
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Swiper Module Singleton
  const SwiperModule = (() => {
    let isInitialized = false;
    let instance = null;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Swiper module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Swiper module');

      const { selector, options: swiperOptions } = config;
      const $swiper = $(selector);
      
      if ($swiper.length && window.Swiper) {
        instance = new Swiper(selector, swiperOptions);
      }
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Swiper module');
      
      if (instance) {
        instance.destroy();
        instance = null;
      }
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Magnific Popup Module Singleton
  const MagnificPopupModule = (() => {
    let isInitialized = false;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('MagnificPopup module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing MagnificPopup module');

      const { selector, options: popupOptions } = config;
      const $trigger = $(selector);
      
      if ($trigger.length && $.magnificPopup) {
        $trigger.magnificPopup({
          ...popupOptions,
          callbacks: {
            beforeOpen: () => $('body').addClass('overflow-hidden'),
            close: () => $('body').removeClass('overflow-hidden'),
            ...popupOptions.callbacks
          }
        });
      }
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying MagnificPopup module');
      
      const $trigger = $(config.selector);
      if ($trigger.length) {
        $trigger.magnificPopup('destroy');
      }
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Countdown Module Singleton
  const CountdownModule = (() => {
    let isInitialized = false;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Countdown module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Countdown module');

      const { selector, targetDate, format, timezone } = config;
      const $countdown = $(selector);
      
      if ($countdown.length && $.countdown) {
        $countdown.countdown({
          until: $.countdown.UTCDate(timezone, targetDate.getFullYear(), 
                 targetDate.getMonth(), targetDate.getDate()),
          format
        });
      }
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Countdown module');
      
      const $countdown = $(config.selector);
      if ($countdown.length && $countdown.countdown) {
        $countdown.countdown('destroy');
      }
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Vegas Module Singleton
  const VegasModule = (() => {
    let isInitialized = false;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Vegas module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Vegas module');

      const { backgrounds, ...commonOptions } = config;
      
      Object.entries(backgrounds).forEach(([key, bgConfig]) => {
        const $element = $(bgConfig.selector);
        if ($element.length && $.fn.vegas) {
          const slides = bgConfig.images.map(src => ({ src }));
          $element.vegas({ ...commonOptions, slides });
        }
      });
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Vegas module');
      
      const { backgrounds } = config;
      Object.values(backgrounds).forEach((bgConfig) => {
        const $element = $(bgConfig.selector);
        if ($element.length && $element.vegas) {
          $element.vegas('destroy');
        }
      });
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Skillbars Module Singleton
  const SkillbarsModule = (() => {
    let isInitialized = false;
    let config = {};
    let observers = [];

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Skillbars module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Skillbars module');

      const $skillbars = $(config.selector);
      
      if (!$skillbars.length) return;

      if ($.fn.skillBars) {
        $skillbars.skillBars(config);
      } else {
        initCustomSkillbars($skillbars);
      }
    };

    const initCustomSkillbars = ($skillbars) => {
      $skillbars.each((index, element) => {
        const $skillbar = $(element);
        const $bar = $skillbar.find('.skillbar-bar');
        const $percent = $skillbar.find('.skillbar-percent');
        const percent = parseInt($bar.attr('data-percent') || '0');
        
        if (config.useIntersectionObserver && window.IntersectionObserver) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateSkillbar($bar, $percent, percent);
                observer.unobserve(entry.target);
              }
            });
          });
          observer.observe(element);
          observers.push(observer);
        } else {
          animateSkillbar($bar, $percent, percent);
        }
      });
    };

    const animateSkillbar = ($bar, $percent, targetPercent) => {
      const { speed, interval } = config;
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
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Skillbars module');
      
      observers.forEach(observer => observer.disconnect());
      observers = [];
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Mailchimp Module Singleton
  const MailchimpModule = (() => {
    let isInitialized = false;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Mailchimp module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Mailchimp module');

      const $form = $(config.selector);
      
      if (!$form.length) return;

      if ($.fn.ajaxChimp) {
        $form.ajaxChimp({
          callback: handleCallback,
          url: config.url
        });
      } else {
        $form.on('submit.fearPortfolio', handleSubmit);
      }
    };

    const handleCallback = (resp) => {
      const { selectors, successDelay } = config;
      const $notify = $(selectors.notify);
      const $form = $notify.find(selectors.form);
      const isSuccess = resp.result === 'success';
      const messageSelector = isSuccess ? selectors.successMessage : selectors.errorMessage;
      
      $form.addClass('is-hidden');
      $notify.find(messageSelector).addClass('is-visible');
      
      setTimeout(() => {
        $notify.find(messageSelector).removeClass('is-visible');
        $form.delay(300).removeClass('is-hidden');
        $(config.selector).trigger('reset');
      }, successDelay);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleCallback({ result: 'success' });
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Mailchimp module');
      
      $(config.selector).off('.fearPortfolio');
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Contact Form Module Singleton
  const ContactFormModule = (() => {
    let isInitialized = false;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('ContactForm module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing ContactForm module');

      const $form = $(config.selector);
      
      if ($form.length) {
        $form.on('submit.fearPortfolio', handleSubmit);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      $.ajax({
        type: 'POST',
        url: config.url,
        data: $(e.target).serialize()
      })
      .done(() => showSuccess())
      .fail(() => Utils.log('Contact form submission failed', 'error'));
    };

    const showSuccess = () => {
      const { selectors, successDelay } = config;
      const $container = $(selectors.container);
      const $form = $container.find(selectors.form);
      const $replyGroup = $container.find(selectors.replyGroup);
      
      $form.addClass('is-hidden');
      $replyGroup.addClass('is-visible');
      
      setTimeout(() => {
        $replyGroup.removeClass('is-visible');
        $form.delay(300).removeClass('is-hidden');
        $(config.selector).trigger('reset');
      }, successDelay);
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying ContactForm module');
      
      $(config.selector).off('.fearPortfolio');
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Particles Module Singleton
  const ParticlesModule = (() => {
    let isInitialized = false;
    let config = {};

    const init = (options) => {
      if (isInitialized) {
        Utils.log('Particles module already initialized', 'warn');
        return;
      }

      config = options;
      isInitialized = true;
      Utils.log('Initializing Particles module');

      const { selector, config: particleConfig } = config;
      const $container = $(selector);
      
      if ($container.length && window.particlesJS) {
        particlesJS(selector.replace('#', ''), particleConfig);
      }
    };

    const destroy = () => {
      if (!isInitialized) return;
      Utils.log('Destroying Particles module');
      
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom.forEach(pjs => {
          if (pjs.pJS.fn.vendors.destroypJS) {
            pjs.pJS.fn.vendors.destroypJS();
          }
        });
      }
      
      isInitialized = false;
      config = {};
    };

    return { init, destroy };
  })();

  // Main Plugin Singleton
  const FearPortfolio = (() => {
    let isInitialized = false;
    let options = {};
    let $element = null;

    // Module mapping
    const moduleMap = {
      loader: LoaderModule,
      typed: TypedModule,
      swiper: SwiperModule,
      magnificPopup: MagnificPopupModule,
      countdown: CountdownModule,
      vegas: VegasModule,
      skillbars: SkillbarsModule,
      mailchimp: MailchimpModule,
      contactForm: ContactFormModule,
      particles: ParticlesModule
    };

    const init = (element, opts = {}) => {
      if (isInitialized) {
        Utils.log('Plugin already initialized', 'warn');
        return FearPortfolio;
      }

      $element = $(element);
      options = $.extend(true, {}, DEFAULTS, opts);
      
      Utils.setOptions(options);
      ModuleRegistry.setGlobalOptions(options);
      
      Utils.log(`Initializing ${PLUGIN_NAME} v${VERSION}`);
      isInitialized = true;

      if (options.autoInit) {
        $(document).ready(() => onDOMReady());
        $(window).on('load.fearPortfolio', () => onWindowLoad());
      }
      
      if (Utils.isFunction(options.callbacks.onInit)) {
        options.callbacks.onInit.call(FearPortfolio);
      }

      return FearPortfolio;
    };

    const onDOMReady = () => {
      const domModules = ['swiper', 'magnificPopup', 'countdown', 'vegas', 
                         'skillbars', 'mailchimp', 'contactForm', 'particles'];

      domModules.forEach(name => {
        if (options.modules[name] && moduleMap[name]) {
          initModule(name);
        }
      });
    };

    const onWindowLoad = () => {
      const loaderPromise = options.modules.loader 
        ? initModule('loader')
        : Promise.resolve();

      loaderPromise.then(() => {
        if (options.modules.typed && moduleMap.typed) {
          initModule('typed');
        }
        
        if (Utils.isFunction(options.callbacks.onLoadComplete)) {
          options.callbacks.onLoadComplete.call(FearPortfolio);
        }
      });
    };

    const initModule = (name) => {
      try {
        const module = moduleMap[name];
        if (!module) {
          Utils.log(`Module ${name} not found`, 'error');
          return Promise.reject(new Error(`Module ${name} not found`));
        }

        const config = options[name];
        const result = module.init(config);
        ModuleRegistry.register(name, module);
        return result || Promise.resolve();
      } catch (error) {
        Utils.log(`Error initializing module ${name}: ${error.message}`, 'error');
        return Promise.reject(error);
      }
    };

    const enableModule = (name) => {
      if (!moduleMap[name]) {
        Utils.log(`Module ${name} not found`, 'error');
        return FearPortfolio;
      }

      options.modules[name] = true;
      
      if (isInitialized && !ModuleRegistry.has(name)) {
        initModule(name);
      }
      
      return FearPortfolio;
    };

    const disableModule = (name) => {
      options.modules[name] = false;
      ModuleRegistry.unregister(name);
      return FearPortfolio;
    };

    const getModule = (name) => ModuleRegistry.get(name);

    const updateOptions = (newOptions) => {
      options = $.extend(true, options, newOptions);
      Utils.setOptions(options);
      ModuleRegistry.setGlobalOptions(options);
      return FearPortfolio;
    };

    const destroy = () => {
      if (!isInitialized) return FearPortfolio;

      Utils.log('Destroying plugin instance');
      
      ModuleRegistry.clear();
      $(window).off('.fearPortfolio');
      $(document).off('.fearPortfolio');
      
      if (Utils.isFunction(options.callbacks.onDestroy)) {
        options.callbacks.onDestroy.call(FearPortfolio);
      }
      
      if ($element) {
        $element.removeData(DATA_KEY);
      }
      
      isInitialized = false;
      options = {};
      $element = null;
      
      return FearPortfolio;
    };

    const getVersion = () => VERSION;

    const isInit = () => isInitialized;

    return {
      init,
      enableModule,
      disableModule,
      getModule,
      updateOptions,
      destroy,
      getVersion,
      isInit
    };
  })();

  // jQuery plugin wrapper
  $.fn[PLUGIN_NAME] = function(options, ...args) {
    return this.each(function() {
      const $element = $(this);
      let instance = $element.data(DATA_KEY);
      
      if (!instance) {
        instance = Object.create(FearPortfolio);
        instance.init(this, options);
        $element.data(DATA_KEY, instance);
        return;
      }
      
      if (typeof options === 'string') {
        const method = options;
        if (typeof instance[method] === 'function') {
          const result = instance[method].apply(instance, args);
          return result !== undefined ? result : this;
        } else {
          throw new Error(`Method ${method} does not exist on ${PLUGIN_NAME}`);
        }
      }
      
      if (typeof options === 'object') {
        instance.updateOptions(options);
      }
    });
  };

  // Static properties
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

  // Global access
  window.FearPortfolio = FearPortfolio;

})(jQuery, window, document);