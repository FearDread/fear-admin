
(($, window, undefined) => {
  // ==================== PORTFOLIO MODULE ====================
  const jbird = FEAR.create('FearPortfolio', ($GUI) => {
    const PLUGIN_NAME = 'fearPortfolio';
    const VERSION = '2.0.0';

    let config = {};
    let moduleInstances = new Map();

    // Default configuration
    const defaults = {
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
      }
    };

    // ==================== MODULE: LOADER ====================
    const initLoader = async () => {
      const cfg = config.loader;
      $GUI.log(`Initializing loader module`);
      $GUI.emit('module:start', { name: 'loader' });

      try {
        await $GUI.timeout(cfg.logoScaleDelay);
        $GUI.$(cfg.selectors.logo).addClass('scaleOut');

        await $GUI.timeout(cfg.loaderHideDelay);
        $GUI.$(cfg.selectors.loader).addClass('loaded');
        $GUI.$(cfg.selectors.main).addClass('active animate-in');
        $GUI.$(cfg.selectors.homeTriger).addClass('active-link');

        await $GUI.timeout(cfg.bodyLoadDelay - cfg.loaderHideDelay);
        $GUI.$(cfg.selectors.body).addClass('loaded');

        $GUI.emit('module:complete', { name: 'loader' });
        $GUI.emit('loader:complete');

        return { name: 'loader', status: 'loaded' };
      } catch (error) {
        $GUI.warn('Loader module error:', error);
        throw error;
      }
    }

    const initVegas = async () => {
      var bgndKenburns = $GUI.$('#bgndKenburns');
      if (bgndKenburns.length) {
        bgndKenburns.vegas({
          timer: false,
          delay: 8000,
          transition: 'fade2',
          transitionDuration: 2000,
          slides: [
            { src: "img/backgrounds/960x1080-kenburns-1.webp" },
            { src: "img/backgrounds/960x1080-kenburns-2.webp" },
            { src: "img/backgrounds/960x1080-kenburns-3.webp" }
          ],
          animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
        });
      }

      var bgndKenburnsFull = $GUI.$('#bgndKenburnsFull');
      if (bgndKenburnsFull.length) {
        bgndKenburnsFull.vegas({
          timer: false,
          delay: 8000,
          transition: 'fade2',
          transitionDuration: 2000,
          slides: [
            { src: "img/backgrounds/1920x1080-kenburns-1.webp" },
            { src: "img/backgrounds/1920x1080-kenburns-2.webp" },
            { src: "img/backgrounds/1920x1080-kenburns-3.webp" }
          ],
          animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
        });
      }
    }

    // ==================== MODULE: TYPED ====================
    const initTyped = async () => {
      const cfg = config.typed;
      $GUI.log(`Initializing typed module`);

      $GUI.emit('module:start', { name: 'typed' });

      return new Promise((resolve, reject) => {
        const $headline = $GUI.$(cfg.headlineSelector);

        if ($headline.length && window.Typed) {
          try {
            const instance = new window.Typed(cfg.selector, {
              stringsElement: cfg.stringsElement,
              loop: cfg.loop,
              typeSpeed: cfg.typeSpeed,
              backSpeed: cfg.backSpeed,
              backDelay: cfg.backDelay
            });

            moduleInstances.set('typed', instance);
            $GUI.emit('module:complete', { name: 'typed' });
            $GUI.emit('typed:complete');
            resolve({ name: 'typed', status: 'loaded', instance });
          } catch (error) {
            $GUI.warn('Typed module error:', error);
            reject(error);
          }
        } else {
          $GUI.log('Typed library not found or headline missing, skipping');
          resolve({ name: 'typed', status: 'skipped' });
        }
      });
    };

    // ==================== MODULE: SWIPER ====================
    const initSwiper = async () => {
      const cfg = config.swiper;
      $GUI.log(`Initializing swiper module`);

      $GUI.emit('module:start', { name: 'swiper' });

      return new Promise((resolve, reject) => {
        const $swiper = $GUI.$(cfg.selector);

        if ($swiper.length && window.Swiper) {
          try {
            const instance = new window.Swiper(cfg.selector, cfg.options);

            moduleInstances.set('swiper', instance);
            $GUI.emit('module:complete', { name: 'swiper' });
            $GUI.emit('swiper:complete');
            resolve({ name: 'swiper', status: 'loaded', instance });
          } catch (error) {
            $GUI.warn('Swiper module error:', error);
            reject(error);
          }
        } else {
          $GUI.log('Swiper library not found or element missing, skipping');
          resolve({ name: 'swiper', status: 'skipped' });
        }
      });
    };

    const initParticles = async () => {
      const { selector, config } = defaults.particles;
      const $container = $GUI.$(selector);

      if ($container.length && window.particlesJS) {
        particlesJS(selector.replace('#', ''), config);
      }
    }

    // ==================== MODULE: MAGNIFIC POPUP ====================
    const initMagnificPopup = async () => {
      const cfg = config.magnificPopup;
      $GUI.log(`Initializing magnificPopup module`);

      $GUI.emit('module:start', { name: 'magnificPopup' });

      return new Promise((resolve) => {
        const $trigger = $GUI.$(cfg.selector);

        if ($trigger.length && $.magnificPopup) {
          $trigger.magnificPopup({
            ...cfg.options,
            callbacks: {
              beforeOpen: () => $GUI.$('body').addClass('overflow-hidden'),
              close: () => $GUI.$('body').removeClass('overflow-hidden')
            }
          });

          $GUI.emit('module:complete', { name: 'magnificPopup' });
          $GUI.emit('magnificPopup:complete');
          resolve({ name: 'magnificPopup', status: 'loaded' });
        } else {
          $GUI.log('Magnific Popup library not found or trigger missing, skipping');
          resolve({ name: 'magnificPopup', status: 'skipped' });
        }
      });
    };

    // ==================== MODULE: SKILLBARS ====================
    const initSkillbars = async () => {
      const cfg = config.skillbars;
      $GUI.log(`Initializing skillbars module`);

      $GUI.emit('module:start', { name: 'skillbars' });

      const $skillbars = $GUI.$(cfg.selector);

      if (!$skillbars.length) {
        $GUI.log('No skillbars found, skipping');
        return { name: 'skillbars', status: 'skipped' };
      }

      const animateSkillbar = ($bar, $percent, targetPercent) => {
        return new Promise((resolve) => {
          let currentPercent = 0;
          const increment = targetPercent / (cfg.speed / cfg.interval);

          const timer = setInterval(() => {
            currentPercent += increment;
            if (currentPercent >= targetPercent) {
              currentPercent = targetPercent;
              clearInterval(timer);
              resolve();
            }

            $bar.css('width', `${currentPercent}%`);
            $percent.text(`${Math.round(currentPercent)}%`);
          }, cfg.interval);
        });
      };

      const promises = [];
      const observers = [];

      $skillbars.each((index, element) => {
        const promise = new Promise((resolve) => {
          const $skillbar = $GUI.$(element);
          const $bar = $skillbar.find('.skillbar-bar');
          const $percent = $skillbar.find('.skillbar-percent');
          const percent = parseInt($bar.attr('data-percent') || '0', 10);

          if (cfg.useIntersectionObserver && window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  animateSkillbar($bar, $percent, percent).then(resolve);
                  observer.unobserve(entry.target);
                }
              });
            });
            observer.observe(element);
            observers.push(observer);
          } else {
            animateSkillbar($bar, $percent, percent).then(resolve);
          }
        });
        promises.push(promise);
      });

      moduleInstances.set('skillbars', { observers });

      await Promise.all(promises);

      $GUI.emit('module:complete', { name: 'skillbars' });
      $GUI.emit('skillbars:complete');

      return { name: 'skillbars', status: 'loaded' };
    };

    // ==================== MODULE: CONTACT FORM ====================
    const initContactForm = async () => {
      const cfg = config.contactForm;
      $GUI.log(`Initializing contactForm module`);

      $GUI.emit('module:start', { name: 'contactForm' });

      const $form = $GUI.$(cfg.selector);

      if (!$form.length) {
        $GUI.log('Contact form not found, skipping');
        return { name: 'contactForm', status: 'skipped' };
      }

      const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
          await $GUI.fetch(cfg.url, {
            method: 'POST',
            body: formData
          });

          await showSuccess();
          $GUI.emit('contactForm:success');
        } catch (error) {
          $GUI.warn('Contact form submission failed:', error);
          $GUI.emit('contactForm:error', error);
        }
      };

      const showSuccess = async () => {
        const { selectors, successDelay } = cfg;
        const $container = $GUI.$(selectors.container);
        const $formEl = $container.find(selectors.form);
        const $replyGroup = $container.find(selectors.replyGroup);

        $formEl.addClass('is-hidden');
        $replyGroup.addClass('is-visible');

        await $GUI.timeout(successDelay);

        $replyGroup.removeClass('is-visible');

        await $GUI.timeout(300);

        $formEl.removeClass('is-hidden');
        $form[0].reset();
      };

      $form.on('submit', handleSubmit);

      moduleInstances.set('contactForm', { $form, handleSubmit });

      $GUI.emit('module:complete', { name: 'contactForm' });
      $GUI.emit('contactForm:complete');

      return { name: 'contactForm', status: 'loaded' };
    };

    // ==================== PUBLIC API ====================
    return {
      load: async (options = {}) => {
        $GUI.log(`${PLUGIN_NAME} v${VERSION} loading`);
        config = $GUI.utils.merge({}, defaults, options);

        const domModules = [];
        if (config.modules.vegas) domModules.push(initVegas());
        if (config.modules.particles) domModules.push(initParticles());
        if (config.modules.swiper) domModules.push(initSwiper());
        if (config.modules.magnificPopup) domModules.push(initMagnificPopup());
        if (config.modules.skillbars) domModules.push(initSkillbars());
        if (config.modules.contactForm) domModules.push(initContactForm());

        await Promise
          .all(domModules)
          .then(async () => {

            const loadModules = [];
            if (config.modules.loader) loadModules.push(initLoader());
            if (config.modules.typed) loadModules.push(initTyped());

            await Promise
              .all(loadModules)
              .then(() => {
                $GUI.log(`${PLUGIN_NAME} initialization complete`);
                $GUI.emit('fearPortfolio:ready');

                return Promise.resolve();
              })
              .catch((err) => {
                $GUI.warn('Error Loading FearPortfolio.. ', err);
                return Promise.reject();
              });
          })
          .catch((err) => {
            $GUI.warn('Error Loading FearPortfolio.. ', err);
            return Promise.reject();
          });

      },

      unload: async () => {
        $GUI.log(`${PLUGIN_NAME} unloading`);

        // Destroy module instances
        moduleInstances.forEach((instance, name) => {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }

          // Disconnect observers for skillbars
          if (name === 'skillbars' && instance.observers) {
            instance.observers.forEach(observer => observer.disconnect());
          }

          // Remove event handlers for contact form
          if (name === 'contactForm' && instance.$form) {
            instance.$form.off('submit', instance.handleSubmit);
          }
        });

        moduleInstances.clear();

        $GUI.emit('fearPortfolio:unloaded');

        return Promise.resolve();
      },

      getModule: (name) => {
        return moduleInstances.get(name) || null;
      },

      getConfig: () => {
        return { ...config };
      },

      updateConfig: (newConfig) => {
        config = $GUI.utils.merge(config, newConfig);
        return config;
      }
    };
  });

  $(document).ready(async () => {
    await jbird.start('FearPortfolio')
      .then(() => {
        console.log('%c FEAR Portfolio INITIALIZED ', 'background: #222; color: #bada55; font-size: 16px; font-weight: bold;');
      })
      .catch(err => {
        console.error('Failed to start application:', err);
      });
  });

})(jQuery, window);