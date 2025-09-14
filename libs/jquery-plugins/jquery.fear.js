;(function($, window, document, undefined) {
  'use strict';

  var PLUGIN_NAME = 'FEAR';
  var DATA_KEY = 'plugin_' + PLUGIN_NAME;

  // Default configuration
  var defaults = {
    preloadDelay: 800,
    fadeSpeed: 200,
    fragmentPath: 'js/fragments/',
    contactAPI: 'http://fear.master.com/fear/api/mail/contact',
    routes: {
      home: { name: 'home', html: null, callback: null },
      about: { name: 'about', html: null, callback: null },
      works: { name: 'works', html: null, callback: null },
      github: { name: 'github', html: null, callback: null },
      contact: { name: 'contact', html: null, callback: null }
    },
    debug: false
  };

  // Main plugin constructor
  function Fear(element, options) {
    this.element = element;
    this.$element = $(element);
    this.settings = $.extend(true, {}, defaults, options);
    this.cache = {};
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    
    this._name = PLUGIN_NAME;
    this._defaults = defaults;
    
    this.init();
  }

  // Plugin prototype methods
  Fear.prototype = {
    
    // Initialize the plugin
    init: function() {
      var self = this;
      
      this.log('Initializing FEAR App...');
      
      // Setup modal first
      this.setupModal();
      
      // Preload and start
      this.preload(function() {
        self.bindEvents();
        self.initRouter();
        self.initComponents();
        self.log('FEAR App initialized successfully');
        self.trigger('fear:initialized');
      });

      return this;
    },

    // Preloader
    preload: function(callback) {
      var self = this;
      var $preloader = $('#preloader');
      var speed = this.isMobile ? 0 : this.settings.preloadDelay;

      setTimeout(function() {
        if ($preloader.length) {
          if (!self.isMobile) {
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

    // Setup modal structure
    setupModal: function() {
      if (!this.$element.find('.fear_modalbox').length) {
        var modalHTML = [
          '<div class="fear_modalbox">',
            '<div class="box_inner">',
              '<div class="close">',
                '<a href="#"><i class="icon-cancel"></i></a>',
              '</div>',
              '<div class="description_wrap"></div>',
            '</div>',
          '</div>'
        ].join('');
        
        this.$element.prepend(modalHTML);
      }
    },

    // Event binding
    bindEvents: function() {
      var self = this;

      // Navigation links
      this.$element.on('click.fear', '.transition_link a', function(e) {
        self.handleNavigation(e, $(this));
      });

      // Mobile menu toggle
      this.$element.on('click.fear', '.fear_topbar .trigger .hamburger', function(e) {
        self.handleMobileMenu(e, $(this));
      });

      // Mobile menu links
      this.$element.on('click.fear', '.fear_mobile_menu ul li a', function(e) {
        self.closeMobileMenu();
      });

      // Modal close
      this.$element.on('click.fear', '.fear_modalbox .close a', function(e) {
        e.preventDefault();
        self.closeModal();
      });

      // Contact form
      this.$element.on('click.fear', '.contact_form #send_message', function(e) {
        e.preventDefault();
        self.handleContactForm();
      });

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
    },

    // Navigation handler
    handleNavigation: function(e, $link) {
      var $listItem = $link.closest('li');
      var $allItems = this.$element.find('.transition_link li');

      if (!$listItem.hasClass('active')) {
        $allItems.removeClass('active');
        $listItem.addClass('active');
      }
    },

    // Mobile menu handler
    handleMobileMenu: function(e, $hamburger) {
      e.preventDefault();
      var $mobileMenu = this.$element.find('.fear_mobile_menu');
      
      $hamburger.toggleClass('is-active');
      $mobileMenu.toggleClass('opened');
    },

    // Close mobile menu
    closeMobileMenu: function() {
      var $hamburger = this.$element.find('.fear_topbar .trigger .hamburger');
      var $mobileMenu = this.$element.find('.fear_mobile_menu');
      
      $hamburger.removeClass('is-active');
      $mobileMenu.removeClass('opened');
    },

    // Modal methods
    openModal: function(content) {
      var $modal = this.$element.find('.fear_modalbox');
      $modal.find('.description_wrap').html(content);
      $modal.addClass('opened');
      this.trigger('fear:modal:opened');
    },

    closeModal: function() {
      var $modal = this.$element.find('.fear_modalbox');
      $modal.removeClass('opened');
      $modal.find('.description_wrap').empty();
      this.trigger('fear:modal:closed');
    },

    // Router implementation
    initRouter: function() {
      var self = this;
      
      this.log('Router initialized');
      
      $(window).on('hashchange.fear popstate.fear', function() {
        self.handleRoute();
      });

      // Initial route
      this.handleRoute();
    },

    handleRoute: function() {
      var hash = window.location.hash.replace('#', '') || 'home';
      var route = this.settings.routes[hash];

      if (!route) {
        this.log('Route not found: ' + hash);
        return;
      }

      if (route.html) {
        this.renderRoute(route);
      } else {
        this.fetchRoute(route);
      }
    },

    fetchRoute: function(route) {
      var self = this;
      
      // Check cache
      if (this.cache[route.name]) {
        route.html = this.cache[route.name];
        this.renderRoute(route);
        return;
      }

      $.ajax({
        url: this.settings.fragmentPath + route.name + '.html',
        cache: true,
        success: function(data) {
          route.html = data;
          self.cache[route.name] = data;
          self.renderRoute(route);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self.log('Error loading route: ' + textStatus + ' - ' + errorThrown);
          self.trigger('fear:route:error', { route: route.name, error: textStatus });
        }
      });
    },

    renderRoute: function(route) {
      var self = this;
      var $container = this.$element.find('.fear_container');
      
      $container.fadeOut(this.settings.fadeSpeed, function() {
        $container.empty().html(route.html);
        
        $container.fadeIn(self.settings.fadeSpeed, function() {
          // Execute route callback
          if (route.callback && typeof route.callback === 'function') {
            route.callback();
          }
          
          // Reinitialize components
          self.initComponents();
          self.trigger('fear:route:loaded', { route: route.name });
        });
      });
    },

    // Component initialization
    initComponents: function() {
      this.convertImgsToSvg();
      this.initBackgroundImages();
      this.initCursor();
      this.initProgressBars();
      this.initCircularProgress();
      this.log('Components initialized');
    },

    // Convert images to SVG
    convertImgsToSvg: function() {
      var self = this;
      
      this.$element.find('img.html').each(function() {
        var $img = $(this);
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        if (imgURL) {
          $.get(imgURL, function(data) {
            var $svg = $(data).find('svg');
            if ($svg.length) {
              if (imgClass) {
                $svg.attr('class', imgClass + ' replaced-svg');
              }
              $svg.removeAttr('xmlns:a');
              $img.replaceWith($svg);
            }
          }, 'xml').fail(function() {
            self.log('Failed to load SVG: ' + imgURL);
          });
        }
      });
    },

    // Initialize background images
    initBackgroundImages: function() {
      this.$element.find('[data-img-url]').each(function() {
        var $element = $(this);
        var url = $element.data('img-url');
        if (url) {
          $element.css('background-image', 'url(' + url + ')');
        }
      });
    },

    // Initialize cursor
    initCursor: function() {
      var $cursor = this.$element.find('.mouse-cursor');
      if (!$cursor.length) return;

      var $cursorInner = $('.cursor-inner');
      var $cursorOuter = $('.cursor-outer');
      
      if ($cursorInner.length && $cursorOuter.length) {
        $(window).off('mousemove.fear').on('mousemove.fear', function(e) {
          $cursorOuter.css('transform', 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)');
          $cursorInner.css('transform', 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)');
        });

        $('body').off('mouseenter.fear').on('mouseenter.fear', 'a, .fear_topbar .trigger, .cursor-pointer', function() {
          $cursorInner.addClass('cursor-hover');
          $cursorOuter.addClass('cursor-hover');
        });

        $('body').off('mouseleave.fear').on('mouseleave.fear', 'a, .fear_topbar .trigger, .cursor-pointer', function() {
          var $this = $(this);
          if (!$this.closest('.cursor-pointer').length) {
            $cursorInner.removeClass('cursor-hover');
            $cursorOuter.removeClass('cursor-hover');
          }
        });

        $cursorInner.css('visibility', 'visible');
        $cursorOuter.css('visibility', 'visible');
      }
    },

    // Initialize progress bars
    initProgressBars: function() {
      this.$element.find('.progress_inner').each(function() {
        var $progress = $(this);
        var value = parseInt($progress.data('value'), 10);
        var color = $progress.data('color');
        var $bar = $progress.find('.bar_in');
        var $barWrap = $progress.find('.bar');

        $bar.css({
          width: value + '%',
          backgroundColor: color
        });

        setTimeout(function() {
          $barWrap.addClass('open');
        }, 100);
      });
    },

    // Initialize circular progress
    initCircularProgress: function() {
      var $circles = this.$element.find('.circular_progress_bar .myCircle');
      
      $circles.each(function() {
        var $element = $(this);
        if (!$element.find('.number').length) {
          $element.append('<span class="number"></span>');
        }
        
        var value = $element.data('value');
        
        // Check if circleProgress plugin is available
        if ($.fn.circleProgress) {
          var mainColor = '#007bff';
          
          // Try to get CSS custom property
          if (window.getComputedStyle && document.documentElement) {
            var computedColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
            if (computedColor) {
              mainColor = computedColor;
            }
          }
          
          $element.circleProgress({
            size: 110,
            value: 0,
            animation: { duration: 1400 },
            thickness: 2,
            fill: mainColor,
            emptyFill: 'rgba(0,0,0,0)',
            startAngle: -Math.PI / 2
          }).on('circle-animation-progress', function(event, progress, stepValue) {
            $(this).find('.number').text(parseInt(stepValue.toFixed(2) * 100) + '%');
          });

          setTimeout(function() {
            $element.circleProgress('value', value);
          }, 1400);
        }
      });
    },

    // Contact form handler
    handleContactForm: function() {
      var self = this;
      var $form = this.$element.find('.contact_form');
      var name = $form.find('#name').val();
      var email = $form.find('#email').val();
      var message = $form.find('#message').val();
      var subject = $form.find('#subject').val();
      var $returnMessage = $form.find('.returnmessage');

      $returnMessage.empty();

      // Validation
      if (!name || !email || !message) {
        this.$element.find('div.empty_notice').slideDown(500).delay(2000).slideUp(500);
        return;
      }

      // Submit form
      $.post(this.settings.contactAPI, {
        ajax_name: name,
        ajax_email: email,
        ajax_message: message,
        ajax_subject: subject,
        ajax_source: "gdrea.fear@gmail.com"
      })
      .done(function(data) {
        $returnMessage.html(data);
        
        if (!$returnMessage.find('span.contact_error').length) {
          var success = $returnMessage.data('success') || 'Message sent successfully!';
          $returnMessage.append('<span class="contact_success">' + success + '</span>');
          $form[0].reset();
        }
        
        $returnMessage.slideDown(500).delay(4000).slideUp(500);
        self.trigger('fear:contact:sent', { success: !$returnMessage.find('span.contact_error').length });
      })
      .fail(function() {
        self.log('Contact form submission failed');
        self.trigger('fear:contact:error');
      });
    },

    // Portfolio popup handler
    handlePortfolioPopup: function($element) {
      var $parent = $element.closest('.list_inner');
      var content = $parent.find('.fear_hidden_content').html();
      var image = $parent.find('.image .main').data('img-url');
      var title = $parent.find('.details h3').text();
      var category = $parent.find('.details span').text();

      var popupContent = [
        '<div class="portfolio_popup_details">',
          '<div class="top_image">',
            '<img src="img/thumbs/4-2.jpg" alt="" />',
            '<div class="main" data-img-url="' + image + '"></div>',
          '</div>',
          '<div class="portfolio_main_title">',
            '<h3>' + title + '</h3>',
            '<span><a href="#">' + category + '</a></span>',
          '</div>',
          content,
        '</div>'
      ].join('');

      this.openModal(popupContent);
      this.initBackgroundImages();
    },

    // News popup handler
    handleNewsPopup: function($element) {
      var $parent = $element.closest('.list_inner');
      var content = $parent.find('.fear_hidden_content').html();
      var image = $parent.find('.image .main').data('img-url');
      var title = $parent.find('.details h3 a').text();
      var category = $parent.find('.details span').html();

      var popupContent = [
        '<div class="news_popup_details">',
          '<div class="top_image">',
            '<img src="img/thumbs/4-2.jpg" alt="" />',
            '<div class="main" data-img-url="' + image + '"></div>',
          '</div>',
          '<div class="news_main_title">',
            '<h3>' + title + '</h3>',
            '<span>' + category + '</span>',
          '</div>',
          content,
        '</div>'
      ].join('');

      this.openModal(popupContent);
      this.initBackgroundImages();
    },

    // About modal handler
    handleAboutModal: function($element) {
      var hiddenContent = this.$element.find('.fear_hidden_content').html();
      
      this.openModal(hiddenContent);
      this.initBackgroundImages();
      this.initProgressBars();
      this.initCircularProgress();
      
      // Initialize carousel if available
      if ($.fn.owlCarousel) {
        this.$element.find('.fear_modalbox .owl-carousel').owlCarousel({
          loop: true,
          items: 1,
          margin: 0,
          autoplay: true,
          autoplayTimeout: 7000,
          dots: false,
          nav: false
        });
      }
    },

    // GitHub API integration
    fetchGitHubProfile: function(username) {
      var self = this;
      username = username || 'FearDread';
      
      return $.ajax({
        url: 'https://api.github.com/users/' + username,
        success: function(data) {
          self.log('GitHub profile loaded:', data);
          self.trigger('fear:github:loaded', data);
          return data;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self.log('GitHub API error:', textStatus);
          self.trigger('fear:github:error', textStatus);
        }
      });
    },

    // Utility methods
    log: function(message, data) {
      if (this.settings.debug) {
        console.log('[' + PLUGIN_NAME + '] ' + message, data || '');
      }
    },

    trigger: function(eventName, data) {
      this.$element.trigger(eventName, data || {});
    },

    // Add route
    addRoute: function(name, route) {
      this.settings.routes[name] = route;
      return this;
    },

    // Remove route
    removeRoute: function(name) {
      delete this.settings.routes[name];
      return this;
    },

    // Navigate to route
    navigateTo: function(route) {
      window.location.hash = route;
      return this;
    },

    // Get current route
    getCurrentRoute: function() {
      return window.location.hash.replace('#', '') || 'home';
    },

    // Destroy plugin
    destroy: function() {
      this.$element.off('.fear');
      $(window).off('.fear');
      $('body').off('.fear');
      this.$element.removeData(DATA_KEY);
      this.log('Plugin destroyed');
    }
  };

  // jQuery plugin wrapper
  $.fn[PLUGIN_NAME] = function(options) {
    return this.each(function() {
      if (!$.data(this, DATA_KEY)) {
        $.data(this, DATA_KEY, new Fear(this, options));
      }
    });
  };

  // Global access
  $.fn[PLUGIN_NAME].Constructor = Fear;
  $.fn[PLUGIN_NAME].defaults = defaults;

  // Auto-initialize if element exists
  $(document).ready(function() {
    var $fearElement = $('.fear_all_wrap');
    if ($fearElement.length) {
      $fearElement[PLUGIN_NAME]({
        debug: true
      });
    }
  });

})(jQuery, window, document);