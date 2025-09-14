/*!
 * Fear Portfolio jQuery Plugin
 * Version: 1.0.0
 * Author: FearDread
 * Description: A comprehensive jQuery plugin for portfolio and landing page functionality
 * Build Date: August 2025
 */

(function($, window, document, undefined) {
  'use strict';

  // Plugin name and defaults
  const pluginName = 'Fear';
  const defaults = {
    // Loader settings
    loader: {
      enabled: true,
      logoScaleDelay: 0,
      loaderHideDelay: 300,
      bodyLoadDelay: 1400
    },
    
    // Typed.js settings
    typed: {
      enabled: true,
      selector: '#typed',
      stringsElement: '#typed-strings',
      loop: true,
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2500
    },
    
    // Swiper settings
    swiper: {
      enabled: true,
      selector: '.swiper',
      grabCursor: true,
      effect: 'creative',
      creativeEffect: {
        prev: {
          translate: ['-20%', 0, -1]
        },
        next: {
          translate: ['100%', 0, 0]
        }
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
    },
    
    // Magnific Popup settings
    magnificPopup: {
      enabled: true,
      selector: '#showreel-trigger',
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    },
    
    // Countdown settings
    countdown: {
      enabled: true,
      selector: '#countdown',
      until: new Date(2025, 9, 20), // October 20, 2025
      format: 'D'
    },
    
    // Vegas Kenburns settings
    vegas: {
      enabled: true,
      timer: false,
      delay: 8000,
      transition: 'fade2',
      transitionDuration: 2000,
      animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight'],
      backgrounds: {
        bgndKenburns: [
          { src: 'img/backgrounds/960x1080-kenburns-1.webp' },
          { src: 'img/backgrounds/960x1080-kenburns-2.webp' },
          { src: 'img/backgrounds/960x1080-kenburns-3.webp' }
        ],
        bgndKenburnsFull: [
          { src: 'img/backgrounds/1920x1080-kenburns-1.webp' },
          { src: 'img/backgrounds/1920x1080-kenburns-2.webp' },
          { src: 'img/backgrounds/1920x1080-kenburns-3.webp' }
        ]
      }
    },
    
    // Skillbars settings
    skillbars: {
      enabled: true,
      selector: '.skillbar',
      from: 0,
      speed: 4000,
      interval: 100
    },
    
    // Mailchimp settings
    mailchimp: {
      enabled: true,
      selector: '.notify-form',
      url: 'https://club.us10.list-manage.com/subscribe/post?u=e8d650c0df90e716c22ae4778&amp;id=54a7906900&amp;f_id=00b64ae4f0',
      successDelay: 5000
    },
    
    // Contact form settings
    contactForm: {
      enabled: true,
      selector: '#sayhello-form',
      url: 'mail.php',
      successDelay: 5000
    },
    
    // Particles.js settings
    particles: {
      enabled: true,
      selector: '#triangles-js',
      config: {
        particles: {
          number: {
            value: 33,
            density: {
              enable: true,
              value_area: 1420.4657549380909
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'triangle',
            stroke: {
              width: 0,
              color: '#000000'
            },
            polygon: {
              nb_sides: 5
            },
            image: {
              src: 'img/github.svg',
              width: 100,
              height: 100
            }
          },
          opacity: {
            value: 0.06313181133058181,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 11.83721462448409,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
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
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true
      }
    },
    
    // Callbacks
    onInit: null,
    onLoadComplete: null,
    onDestroy: null
  };

  // Plugin constructor
  function Fear(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend(true, {}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    
    this.init();
  }

  // Plugin prototype
  $.extend(Fear.prototype, {
    
    init: () => {
      var self = this;

      $(document).ready(() => self.ready());
      
      $(window).on('load', () => {
        self.onWindowLoad();
      });

      if (typeof this.options.onInit === 'function') {
        this.options.onInit.call(this);
      }
    },
    
    ready: () => {
      if (this.options.swiper.enabled) this.initSwiper();
      if (this.options.magnificPopup.enabled) this.initMagnificPopup();
      if (this.options.countdown.enabled) this.initCountdown();
      if (this.options.vegas.enabled) this.initVegas();
      if (this.options.skillbars.enabled) this.initSkillbars();
      if (this.options.mailchimp.enabled) this.initMailchimp();
      if (this.options.contactForm.enabled) this.initContactForm();
      if (this.options.particles.enabled) this.initParticles();
    },
    
    onWindowLoad: function() {
      var self = this;
      
      if (this.options.loader.enabled) {
        this.initLoader().then(function() {
          if (self.options.typed.enabled) self.initTyped();
          if (typeof self.options.onLoadComplete === 'function') {
            self.options.onLoadComplete.call(self);
          }
        });
      } else {
        if (this.options.typed.enabled) this.initTyped();
        if (typeof this.options.onLoadComplete === 'function') {
          this.options.onLoadComplete.call(this);
        }
      }
    },
    
    // Loader Animation
    initLoader: function() {
      var self = this;
      var options = this.options.loader;
      
      return new Promise(function(resolve) {
        $('.loader__logo').addClass('scaleOut');
        
        setTimeout(function() {
          $('.loader').addClass('loaded');
          $('#main').addClass('active animate-in');
          $('#home-trigger').addClass('active-link');
        }, options.loaderHideDelay);
        
        setTimeout(function() {
          $('body').addClass('loaded');
          resolve();
        }, options.bodyLoadDelay);
      });
    },
    
    // Typed.js initialization
    initTyped: function() {
      var options = this.options.typed;
      var $animatedHeadline = $('.animated-headline');
      
      if ($animatedHeadline.length && typeof Typed !== 'undefined') {
        this.typed = new Typed(options.selector, {
          stringsElement: options.stringsElement,
          loop: options.loop,
          typeSpeed: options.typeSpeed,
          backSpeed: options.backSpeed,
          backDelay: options.backDelay
        });
      }
    },
    
    // Swiper initialization
    initSwiper: function() {
      var options = this.options.swiper;
      var $swiper = $(options.selector);
      
      if ($swiper.length && typeof Swiper !== 'undefined') {
        this.swiper = new Swiper(options.selector, {
          grabCursor: options.grabCursor,
          effect: options.effect,
          creativeEffect: options.creativeEffect,
          parallax: options.parallax,
          speed: options.speed,
          loop: options.loop,
          autoplay: options.autoplay,
          pagination: options.pagination,
          navigation: options.navigation
        });
      }
    },
    
    // Magnific Popup initialization
    initMagnificPopup: function() {
      var options = this.options.magnificPopup;
      var $trigger = $(options.selector);
      
      if ($trigger.length && $.magnificPopup) {
        $trigger.magnificPopup({
          type: options.type,
          mainClass: options.mainClass,
          removalDelay: options.removalDelay,
          preloader: options.preloader,
          fixedContentPos: options.fixedContentPos,
          callbacks: {
            beforeOpen: function() { 
              $('body').addClass('overflow-hidden'); 
            },
            close: function() { 
              $('body').removeClass('overflow-hidden'); 
            }
          }
        });
      }
    },
    
    // Countdown initialization
    initCountdown: function() {
      var options = this.options.countdown;
      var $countdown = $(options.selector);
      
      if ($countdown.length && $.countdown) {
        $countdown.countdown({
          until: $.countdown.UTCDate(+10, options.until.getFullYear(), 
                 options.until.getMonth(), options.until.getDate()),
          format: options.format
        });
      }
    },
    
    // Vegas initialization
    initVegas: function() {
      var options = this.options.vegas;
      
      // Initialize standard kenburns
      var $bgndKenburns = $('#bgndKenburns');
      if ($bgndKenburns.length && $.fn.vegas) {
        $bgndKenburns.vegas($.extend({}, options, {
          slides: options.backgrounds.bgndKenburns
        }));
      }
      
      // Initialize full kenburns
      var $bgndKenburnsFull = $('#bgndKenburnsFull');
      if ($bgndKenburnsFull.length && $.fn.vegas) {
        $bgndKenburnsFull.vegas($.extend({}, options, {
          slides: options.backgrounds.bgndKenburnsFull
        }));
      }
    },
    
    // Skillbars initialization
    initSkillbars: function() {
      var options = this.options.skillbars;
      var $skillbars = $(options.selector);
      
      if ($skillbars.length) {
        if ($.fn.skillBars) {
          // Use existing plugin if available
          $skillbars.skillBars({
            from: options.from,
            speed: options.speed,
            interval: options.interval
          });
        } else {
          // Use custom implementation
          this.initCustomSkillbars($skillbars, options);
        }
      }
    },
    
    // Custom skillbars implementation
    initCustomSkillbars: function($skillbars, options) {
      var self = this;
      
      $skillbars.each(function() {
        var $skillbar = $(this);
        var $bar = $skillbar.find('.skillbar-bar');
        var $percent = $skillbar.find('.skillbar-percent');
        var percent = parseInt($bar.attr('data-percent') || '0');
        
        // Use Intersection Observer if available, fallback to immediate animation
        if (window.IntersectionObserver) {
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                self.animateSkillbar($bar, $percent, percent, options);
                observer.unobserve(entry.target);
              }
            });
          });
          observer.observe($skillbar[0]);
        } else {
          self.animateSkillbar($bar, $percent, percent, options);
        }
      });
    },
    
    // Animate individual skillbar
    animateSkillbar: function($bar, $percent, targetPercent, options) {
      var currentPercent = 0;
      var increment = targetPercent / (options.speed / options.interval);
      
      var timer = setInterval(function() {
        currentPercent += increment;
        if (currentPercent >= targetPercent) {
          currentPercent = targetPercent;
          clearInterval(timer);
        }
        
        $bar.css('width', currentPercent + '%');
        $percent.text(Math.round(currentPercent) + '%');
      }, options.interval);
    },
    
    // Mailchimp initialization
    initMailchimp: function() {
      var self = this;
      var options = this.options.mailchimp;
      var $form = $(options.selector);
      
      if ($form.length) {
        if ($.fn.ajaxChimp) {
          // Use existing plugin if available
          $form.ajaxChimp({
            callback: function(resp) {
              self.mailchimpCallback(resp, options);
            },
            url: options.url
          });
        } else {
          // Custom implementation
          $form.on('submit', function(e) {
            self.handleMailchimpSubmit(e, options);
          });
        }
      }
    },
    
    // Mailchimp callback
    mailchimpCallback: function(resp, options) {
      var $notify = $('.notify');
      var $form = $notify.find('.form');
      
      if (resp.result === 'success') {
        $form.addClass('is-hidden');
        $notify.find('.subscription-ok').addClass('is-visible');
        
        setTimeout(function() {
          $notify.find('.subscription-ok').removeClass('is-visible');
          $form.delay(300).removeClass('is-hidden');
          $(options.selector).trigger('reset');
        }, options.successDelay);
      } else {
        $form.addClass('is-hidden');
        $notify.find('.subscription-error').addClass('is-visible');
        
        setTimeout(function() {
          $notify.find('.subscription-error').removeClass('is-visible');
          $form.delay(300).removeClass('is-hidden');
          $(options.selector).trigger('reset');
        }, options.successDelay);
      }
    },
    
    // Handle Mailchimp submit
    handleMailchimpSubmit: function(e, options) {
      e.preventDefault();
      
      // Simulate success for demo purposes
      this.mailchimpCallback({ result: 'success' }, options);
    },
    
    // Contact form initialization
    initContactForm: function() {
      var self = this;
      var options = this.options.contactForm;
      var $form = $(options.selector);
      
      if ($form.length) {
        $form.on('submit', function(e) {
          e.preventDefault();
          
          $.ajax({
            type: 'POST',
            url: options.url,
            data: $(this).serialize()
          }).done(function() {
            self.showContactSuccess(options);
          }).fail(function() {
            // Handle error if needed
            console.log('Contact form submission failed');
          });
        });
      }
    },
    
    // Show contact success
    showContactSuccess: function(options) {
      var $sayhello = $('.sayhello');
      var $form = $sayhello.find('.form');
      var $replyGroup = $sayhello.find('.reply-group');
      
      $form.addClass('is-hidden');
      $replyGroup.addClass('is-visible');
      
      setTimeout(function() {
        $replyGroup.removeClass('is-visible');
        $form.delay(300).removeClass('is-hidden');
        $(options.selector).trigger('reset');
      }, options.successDelay);
    },
    
    // Particles.js initialization
    initParticles: function() {
      var options = this.options.particles;
      var $container = $(options.selector);
      
      if ($container.length && typeof particlesJS !== 'undefined') {
        particlesJS(options.selector.replace('#', ''), options.config);
      }
    },
    
    // Public methods
    destroy: function() {
      // Clean up event listeners and instances
      if (this.typed) this.typed.destroy();
      if (this.swiper) this.swiper.destroy();
      
      // Remove event listeners
      $(window).off('.ignite');
      $(document).off('.ignite');
      
      // Trigger callback
      if (typeof this.options.onDestroy === 'function') {
        this.options.onDestroy.call(this);
      }
      
      // Remove plugin data
      this.$element.removeData('plugin_' + pluginName);
    },
    
    // Get/Set options
    option: function(key, value) {
      if (arguments.length === 1) {
        return this.options[key];
      } else if (arguments.length === 2) {
        this.options[key] = value;
        return this;
      }
      return this.options;
    }
  });

  // Plugin wrapper
  $.fn[pluginName] = function(options) {
    var args = arguments;
    
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('plugin_' + pluginName);
      
      if (!data) {
        $this.data('plugin_' + pluginName, (data = new Fear(this, options)));
      }
      
      // Handle method calls
      if (typeof options === 'string' && data[options]) {
        return data[options].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
  };

  // Default options access
  $.fn[pluginName].defaults = defaults;

})(jQuery, window, document);


/* Example Usage 
=-----------------------=
$('body').Fear({
    // Disable specific features
    countdown: {
        enabled: false
    },
    vegas: {
        enabled: true
    },
    
    // Custom particles config
    particles: {
        enabled: true,
        config: {
            particles: {
                number: {
                    value: 50
                },
                color: {
                    value: "#ff0000"
                }
            }
        }
    },
    
    // Custom callbacks
    onInit: function() {
        console.log('Ignite plugin initialized!');
    },
    onLoadComplete: function() {
        console.log('All loading complete!');
        // Custom post-load logic here
    },
    onDestroy: function() {
        console.log('Plugin destroyed');
    }
});
*/