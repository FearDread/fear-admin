/**
 * OT Theme jQuery Plugin
 * A comprehensive jQuery plugin for modern web themes
 * @version 1.0.0
 */
(function($, window, document, undefined) {
    'use strict';

    // Plugin name
    const pluginName = 'otTheme';
    
    // Default options
    const defaults = {
        // Preloader options
        preloader: {
            enabled: true,
            fadeOut: true,
            closeButton: '.preloaderCls'
        },
        
        // Mobile menu options
        mobileMenu: {
            menuToggleBtn: '.ot-menu-toggle',
            bodyToggleClass: 'ot-body-visible',
            subMenuClass: 'ot-submenu',
            subMenuParent: 'ot-item-has-children',
            subMenuParentToggle: 'ot-active',
            meanExpandClass: 'ot-mean-expand',
            appendElement: '<span class="ot-mean-expand"></span>',
            subMenuToggleClass: 'ot-open',
            toggleSpeed: 400
        },
        
        // Sticky header options
        stickyHeader: {
            enabled: true,
            threshold: 500,
            stickyClass: 'sticky',
            categoryMenuClass: 'close-category'
        },
        
        // Scroll top options
        scrollTop: {
            enabled: true,
            threshold: 50,
            animationSpeed: 750
        },
        
        // Slider options
        slider: {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false
            }
        },
        
        // Animation options
        animations: {
            enabled: true,
            threshold: 0.99,
            duration: 900
        },
        
        // Contact form options
        contactForm: {
            selector: '.ajax-contact',
            messageContainer: '.form-messages'
        }
    };

    // Plugin constructor
    function OTTheme(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend(true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    // Plugin prototype
    OTTheme.prototype = {
        
        init: function() {
            this.initPreloader();
            this.initMobileMenu();
            this.initStickyHeader();
            this.initScrollTop();
            this.initDataAttributes();
            this.initSliders();
            this.initAnimations();
            this.initPopups();
            this.initFilters();
            this.initCounters();
            this.initShapeMockup();
            this.initProgressBars();
            this.initCountdown();
            this.initSectionPosition();
            this.initLettering();
            this.initWooCommerce();
            this.initContactForm();
            this.initHoverEffects();
            this.initWorkProcess();
            this.initScrollCue();
        },
        
        // Preloader functionality
        initPreloader: function() {
            if (!this.options.preloader.enabled) return;
            
            const self = this;
            
            $(window).on('load', function() {
                if (self.options.preloader.fadeOut) {
                    $('.preloader').fadeOut();
                }
                $('.swiper-fade').addClass('fade-ani');
            });
            
            if ($(this.options.preloader.closeButton).length > 0) {
                $(this.options.preloader.closeButton).on('click', function(e) {
                    e.preventDefault();
                    $('.preloader').css('display', 'none');
                });
            }
        },
        
        // Mobile menu functionality
        initMobileMenu: function() {
            const options = this.options.mobileMenu;
            
            $.fn.otmobilemenu = function(settings) {
                const config = $.extend({}, options, settings);
                
                return this.each(function() {
                    const $menu = $(this);
                    
                    function toggleMenu() {
                        $menu.toggleClass(config.bodyToggleClass);
                        const subMenus = '.' + config.subMenuClass;
                        $(subMenus).each(function() {
                            if ($(this).hasClass(config.subMenuToggleClass)) {
                                $(this).removeClass(config.subMenuToggleClass)
                                       .css('display', 'none')
                                       .parent()
                                       .removeClass(config.subMenuParentToggle);
                            }
                        });
                    }
                    
                    // Setup submenu structure
                    $menu.find('li').each(function() {
                        const $submenu = $(this).find('ul');
                        $submenu.addClass(config.subMenuClass)
                               .css('display', 'none')
                               .parent()
                               .addClass(config.subMenuParent);
                        $submenu.prev('a').append(config.appendElement);
                        $submenu.next('a').append(config.appendElement);
                    });
                    
                    // Submenu toggle functionality
                    const expandClass = '.' + config.meanExpandClass;
                    $(expandClass).on('click', function(e) {
                        e.preventDefault();
                        const $parent = $(this).parent();
                        const $submenu = $parent.next('ul').length > 0 ? 
                                        $parent.next('ul') : $parent.prev('ul');
                        
                        if ($submenu.length > 0) {
                            $parent.parent().toggleClass(config.subMenuParentToggle);
                            $submenu.slideToggle(config.toggleSpeed)
                                   .toggleClass(config.subMenuToggleClass);
                        }
                    });
                    
                    // Menu toggle button
                    $(config.menuToggleBtn).on('click', function() {
                        toggleMenu();
                    });
                    
                    // Close menu when clicking outside
                    $menu.on('click', function(e) {
                        e.stopPropagation();
                        toggleMenu();
                    });
                    
                    $menu.find('div').on('click', function(e) {
                        e.stopPropagation();
                    });
                });
            };
            
            $('.ot-menu-wrapper').otmobilemenu();
        },
        
        // Sticky header functionality
        initStickyHeader: function() {
            if (!this.options.stickyHeader.enabled) return;
            
            const options = this.options.stickyHeader;
            
            $(window).scroll(function() {
                if ($(this).scrollTop() > options.threshold) {
                    $('.sticky-wrapper').addClass(options.stickyClass);
                    $('.category-menu').addClass(options.categoryMenuClass);
                } else {
                    $('.sticky-wrapper').removeClass(options.stickyClass);
                    $('.category-menu').removeClass(options.categoryMenuClass);
                }
            });
            
            $('.menu-expand').on('click', function(e) {
                e.preventDefault();
                $('.category-menu').toggleClass('open-category');
            });
        },
        
        // Scroll to top functionality
        initScrollTop: function() {
            if (!this.options.scrollTop.enabled || !$('.scroll-top').length) return;
            
            const scrollTop = document.querySelector('.scroll-top');
            const path = document.querySelector('.scroll-top path');
            const pathLength = path.getTotalLength();
            
            // Setup path animation
            path.style.transition = path.style.WebkitTransition = 'none';
            path.style.strokeDasharray = pathLength + ' ' + pathLength;
            path.style.strokeDashoffset = pathLength;
            path.getBoundingClientRect();
            path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
            
            const updatePath = function() {
                const scroll = $(window).scrollTop();
                const height = $(document).height() - $(window).height();
                const progress = pathLength - (scroll * pathLength / height);
                path.style.strokeDashoffset = progress;
            };
            
            updatePath();
            $(window).scroll(updatePath);
            
            // Show/hide scroll top button
            $(window).on('scroll', function() {
                if ($(this).scrollTop() > this.options.scrollTop.threshold) {
                    $(scrollTop).addClass('show');
                } else {
                    $(scrollTop).removeClass('show');
                }
            }.bind(this));
            
            // Smooth scroll to top
            $(scrollTop).on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: 0
                }, this.options.scrollTop.animationSpeed);
                return false;
            }.bind(this));
        },
        
        // Data attributes functionality
        initDataAttributes: function() {
            // Background images
            $('[data-bg-src]').each(function() {
                const bgSrc = $(this).attr('data-bg-src');
                $(this).css('background-image', 'url(' + bgSrc + ')')
                       .removeAttr('data-bg-src')
                       .addClass('background-image');
            });
            
            // Background colors
            $('[data-bg-color]').each(function() {
                const bgColor = $(this).attr('data-bg-color');
                $(this).css('background-color', bgColor)
                       .removeAttr('data-bg-color');
            });
            
            // Mask images
            $('[data-mask-src]').each(function() {
                const maskSrc = $(this).attr('data-mask-src');
                $(this).css({
                    'mask-image': 'url(' + maskSrc + ')',
                    '-webkit-mask-image': 'url(' + maskSrc + ')'
                }).addClass('bg-mask')
                  .removeAttr('data-mask-src');
            });
            
            // Theme colors
            $('[data-theme-color]').each(function() {
                const themeColor = $(this).attr('data-theme-color');
                this.style.setProperty('--theme-color', themeColor);
                $(this).removeAttr('data-theme-color');
            });
            
            // Animations
            $('[data-ani]').each(function() {
                const animation = $(this).data('ani');
                $(this).addClass(animation);
            });
            
            $('[data-ani-delay]').each(function() {
                const delay = $(this).data('ani-delay');
                $(this).css('animation-delay', delay);
            });
        },
        
        // Slider functionality
        initSliders: function() {
            const self = this;
            
            $('.ot-slider').each(function() {
                const $slider = $(this);
                const sliderOptions = $slider.data('slider-options');
                const $prevBtn = $slider.find('.slider-prev');
                const $nextBtn = $slider.find('.slider-next');
                const $pagination = $slider.find('.slider-pagination');
                const autoplay = sliderOptions.autoplay;
                
                const defaultOptions = {
                    slidesPerView: 1,
                    spaceBetween: sliderOptions.spaceBetween || 30,
                    loop: sliderOptions.loop !== false,
                    speed: sliderOptions.speed || 1000,
                    autoplay: autoplay || {
                        delay: 6000,
                        disableOnInteraction: false
                    },
                    navigation: {
                        nextEl: $nextBtn.get(0),
                        prevEl: $prevBtn.get(0)
                    },
                    pagination: {
                        el: $pagination.get(0),
                        clickable: true,
                        renderBullet: function(index, className) {
                            return '<span class="' + className + '" aria-label="Go to Slide ' + (index + 1) + '"></span>';
                        }
                    }
                };
                
                const customOptions = JSON.parse($slider.attr('data-slider-options') || '{}');
                const finalOptions = $.extend({}, defaultOptions, customOptions);
                
                new Swiper($slider.get(0), finalOptions);
                
                // Handle container styling
                if ($('.slider-area').length > 0) {
                    $('.slider-area').closest('.container').parent().addClass('arrow-wrap');
                }
            });
            
            // External slider controls
            $('[data-slider-prev], [data-slider-next]').on('click', function() {
                const target = $(this).data('slider-prev') || $(this).data('slider-next');
                const $slider = $(target);
                
                if ($slider.length && $slider[0].swiper) {
                    const swiper = $slider[0].swiper;
                    if ($(this).data('slider-prev')) {
                        swiper.slidePrev();
                    } else {
                        swiper.slideNext();
                    }
                }
            });
            
            // Slider thumbnails
            $.fn.activateSliderThumbs = function(options) {
                const settings = $.extend({
                    sliderTab: false,
                    tabButton: '.tab-btn'
                }, options);
                
                return this.each(function() {
                    const $container = $(this);
                    const $buttons = $container.find(settings.tabButton);
                    const $indicator = $('<span class="indicator"></span>').appendTo($container);
                    const sliderSelector = $container.data('slider-tab');
                    const swiper = $(sliderSelector)[0].swiper;
                    
                    function updateIndicator($button) {
                        const position = $button.position();
                        const marginTop = parseInt($button.css('margin-top'), 10) || 0;
                        const marginLeft = parseInt($button.css('margin-left'), 10) || 0;
                        
                        $indicator.css({
                            '--height-set': $button.outerHeight() + 'px',
                            '--width-set': $button.outerWidth() + 'px',
                            '--pos-y': (position.top + marginTop) + 'px',
                            '--pos-x': (position.left + marginLeft) + 'px'
                        });
                    }
                    
                    $buttons.on('click', function(e) {
                        e.preventDefault();
                        const $this = $(this);
                        
                        $this.addClass('active').siblings().removeClass('active');
                        updateIndicator($this);
                        
                        $this.prevAll(settings.tabButton).addClass('list-active');
                        $this.nextAll(settings.tabButton).removeClass('list-active');
                        
                        if (settings.sliderTab) {
                            const index = $this.index();
                            swiper.slideTo(index);
                        }
                    });
                    
                    if (settings.sliderTab && swiper) {
                        swiper.on('slideChange', function() {
                            const index = swiper.realIndex;
                            const $button = $buttons.eq(index);
                            
                            $button.addClass('active').siblings().removeClass('active');
                            updateIndicator($button);
                            
                            $button.prevAll(settings.tabButton).addClass('list-active');
                            $button.nextAll(settings.tabButton).removeClass('list-active');
                        });
                        
                        const initialIndex = swiper.activeIndex;
                        const $initialButton = $buttons.eq(initialIndex);
                        $initialButton.addClass('active').siblings().removeClass('active');
                        updateIndicator($initialButton);
                        
                        $initialButton.prevAll(settings.tabButton).addClass('list-active');
                        $initialButton.nextAll(settings.tabButton).removeClass('list-active');
                    }
                });
            };
            
            if ($('.hero-thumb').length) {
                $('.hero-thumb').activateSliderThumbs({
                    sliderTab: true,
                    tabButton: '.tab-btn'
                });
            }
        },
        
        // Contact form functionality
        initContactForm: function() {
            const formSelector = this.options.contactForm.selector;
            const messageContainer = this.options.contactForm.messageContainer;
            const emailField = '[name="email"]';
            const $messages = $(messageContainer);
            
            function validateForm() {
                let isValid = true;
                
                function validateFields(fields) {
                    fields = fields.split(',');
                    for (let i = 0; i < fields.length; i++) {
                        const fieldSelector = formSelector + ' ' + fields[i];
                        const $field = $(fieldSelector);
                        
                        if ($field.val()) {
                            $field.removeClass('is-invalid');
                        } else {
                            $field.addClass('is-invalid');
                            isValid = false;
                        }
                    }
                }
                
                validateFields('[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]');
                
                // Email validation
                const $emailField = $(emailField);
                const emailPattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                
                if ($emailField.val() && $emailField.val().match(emailPattern)) {
                    $emailField.removeClass('is-invalid');
                } else {
                    $emailField.addClass('is-invalid');
                    isValid = false;
                }
                
                return isValid;
            }
            
            function submitForm() {
                const formData = $(formSelector).serialize();
                
                if (validateForm()) {
                    $.ajax({
                        url: $(formSelector).attr('action'),
                        data: formData,
                        type: 'POST'
                    }).done(function(response) {
                        $messages.removeClass('error')
                                .addClass('success')
                                .text(response);
                        $(formSelector + ' input:not([type="submit"]),' + formSelector + ' textarea').val('');
                    }).fail(function(xhr) {
                        $messages.removeClass('success')
                                .addClass('error');
                        
                        if (xhr.responseText !== '') {
                            $messages.html(xhr.responseText);
                        } else {
                            $messages.html('Oops! An error occurred and your message could not be sent.');
                        }
                    });
                }
            }
            
            $(formSelector).on('submit', function(e) {
                e.preventDefault();
                submitForm();
            });
        },
        
        // Popup and modal functionality
        initPopups: function() {
            // Side menu functionality
            function initSideMenu(menuClass, triggerClass, closeClass, activeClass) {
                $(triggerClass).on('click', function(e) {
                    e.preventDefault();
                    $(menuClass).addClass(activeClass);
                });
                
                $(menuClass).on('click', function(e) {
                    e.stopPropagation();
                    $(menuClass).removeClass(activeClass);
                });
                
                $(menuClass + ' > div').on('click', function(e) {
                    e.stopPropagation();
                    $(menuClass).addClass(activeClass);
                });
                
                $(closeClass).on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(menuClass).removeClass(activeClass);
                });
            }
            
            initSideMenu('.sidemenu-info', '.sideMenuInfo', '.sideMenuCls', 'show');
            initSideMenu('.sidemenu-cart', '.sideMenuCart', '.sideMenuCls', 'show');
            initSideMenu('.popup-search-box', '.searchBoxToggler', '.searchClose', 'show');
            
            // Magnific popup
            if ($.fn.magnificPopup) {
                $('.popup-image').magnificPopup({
                    type: 'image',
                    mainClass: 'mfp-zoom-in',
                    removalDelay: 260,
                    gallery: {
                        enabled: true
                    }
                });
                
                $('.popup-video').magnificPopup({
                    type: 'iframe',
                    mainClass: 'mfp-zoom-in',
                    removalDelay: 260
                });
                
                $('.popup-content').magnificPopup({
                    type: 'inline',
                    midClick: true,
                    mainClass: 'mfp-zoom-in',
                    removalDelay: 260
                });
            }
        },
        
        // Filter functionality
        initFilters: function() {
            if (!$.fn.imagesLoaded || !$.fn.isotope) return;
            
            $('.filter-active').imagesLoaded(function() {
                if ($('.filter-active').length > 0) {
                    const $grid = $('.filter-active').isotope({
                        itemSelector: '.filter-item',
                        filter: '*',
                        masonry: {
                            columnWidth: 1
                        }
                    });
                    
                    $('.filter-menu-active').on('click', 'button', function() {
                        const filterValue = $(this).attr('data-filter');
                        $grid.isotope({
                            filter: filterValue
                        });
                    });
                    
                    $('.filter-menu-active').on('click', 'button', function(e) {
                        e.preventDefault();
                        $(this).addClass('active')
                               .siblings('.active')
                               .removeClass('active');
                    });
                }
            });
            
            // Masonry layout
            $('.masonary-active, .woocommerce-Reviews .comment-list').imagesLoaded(function() {
                const selector = '.masonary-active, .woocommerce-Reviews .comment-list';
                
                if ($(selector).length > 0) {
                    $(selector).isotope({
                        itemSelector: '.filter-item, .woocommerce-Reviews .comment-list li',
                        filter: '*',
                        masonry: {
                            columnWidth: 1
                        }
                    });
                }
                
                $('[data-bs-toggle="tab"]').on('shown.bs.tab', function() {
                    $(selector).isotope({
                        filter: '*'
                    });
                });
            });
        },
        
        // Counter functionality
        initCounters: function() {
            if ($.fn.counterUp) {
                $('.counter-number').counterUp({
                    delay: 10,
                    time: 1000
                });
                
                $('.counter-number2').counterUp({
                    delay: 25,
                    time: 1600
                });
            }
        },
        
        // Shape mockup functionality
        initShapeMockup: function() {
            $.fn.shapeMockup = function() {
                return $(this).each(function() {
                    const $element = $(this);
                    const top = $element.data('top');
                    const right = $element.data('right');
                    const bottom = $element.data('bottom');
                    const left = $element.data('left');
                    
                    $element.css({
                        top: top,
                        right: right,
                        bottom: bottom,
                        left: left
                    }).removeAttr('data-top')
                      .removeAttr('data-right')
                      .removeAttr('data-bottom')
                      .removeAttr('data-left')
                      .parent()
                      .addClass('shape-mockup-wrap');
                });
            };
            
            if ($('.shape-mockup').length) {
                $('.shape-mockup').shapeMockup();
            }
        },
        
        // Progress bar functionality
        initProgressBars: function() {
            if ($.fn.waypoint) {
                $('.progress-bar').waypoint(function() {
                    $('.progress-bar').css({
                        animation: 'animate-positive 2.6s',
                        opacity: '1'
                    });
                }, {
                    offset: '75%'
                });
            }
        },
        
        // Countdown functionality
        initCountdown: function() {
            $.fn.countdown = function() {
                return $(this).each(function() {
                    const $countdown = $(this);
                    const endTime = new Date($countdown.data('offer-date')).getTime();
                    
                    function getElement(selector) {
                        return $countdown.find(selector);
                    }
                    
                    const timer = setInterval(function() {
                        const now = new Date().getTime();
                        const distance = endTime - now;
                        
                        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        
                        // Add leading zeros
                        days = days < 10 ? '0' + days : days;
                        hours = hours < 10 ? '0' + hours : hours;
                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        seconds = seconds < 10 ? '0' + seconds : seconds;
                        
                        if (distance < 0) {
                            clearInterval(timer);
                            $countdown.addClass('expired');
                            $countdown.find('.message').css('display', 'block');
                        } else {
                            getElement('.day').html(days);
                            getElement('.hour').html(hours);
                            getElement('.minute').html(minutes);
                            getElement('.seconds').html(seconds);
                        }
                    }, 1000);
                });
            };
            
            if ($('.counter-list').length) {
                $('.counter-list').countdown();
            }
        },
        
        // Section positioning functionality
        initSectionPosition: function() {
            $.fn.sectionPosition = function(posAttr, targetAttr) {
                return $(this).each(function() {
                    const $element = $(this);
                    const halfHeight = Math.floor($element.height() / 2);
                    const position = $element.attr(posAttr);
                    const target = $element.attr(targetAttr);
                    const $target = $(target);
                    
                    const paddingTop = parseInt($target.css('padding-top'), 10) || 0;
                    const paddingBottom = parseInt($target.css('padding-bottom'), 10) || 0;
                    
                    if (position === 'top-half') {
                        $target.css('padding-bottom', (paddingBottom + halfHeight) + 'px');
                        $element.css('margin-top', '-' + halfHeight + 'px');
                    } else if (position === 'bottom-half') {
                        $target.css('padding-top', (paddingTop + halfHeight) + 'px');
                        $element.css('margin-bottom', '-' + halfHeight + 'px');
                    }
                });
            };
            
            if ($('[data-sec-pos]').length) {
                $('[data-sec-pos]').imagesLoaded(function() {
                    $('[data-sec-pos]').sectionPosition('data-sec-pos', 'data-pos-for');
                });
            }
        },
        
        // Text lettering functionality
        initLettering: function() {
            function splitText($element, splitBy, className, separator) {
                const text = $element.text().split(splitBy);
                let html = '';
                
                if (text.length) {
                    $(text).each(function(index, item) {
                        html += '<span class="' + className + (index + 1) + '">' + item + '</span>' + separator;
                    });
                    $element.empty().append(html);
                }
            }
            
            const letteringMethods = {
                init: function() {
                    return this.each(function() {
                        splitText($(this), '', 'char', '');
                    });
                },
                words: function() {
                    return this.each(function() {
                        splitText($(this), ' ', 'word', ' ');
                    });
                },
                lines: function() {
                    return this.each(function() {
                        const tempMarker = 'eefec303079ad17405c889e092e105b0';
                        splitText($(this).children('br').replaceWith(tempMarker).end(), tempMarker, 'line', '');
                    });
                }
            };
            
            $.fn.lettering = function(method) {
                if (method && letteringMethods[method]) {
                    return letteringMethods[method].apply(this, [].slice.call(arguments, 1));
                } else if (method === 'letters' || !method) {
                    return letteringMethods.init.apply(this, [].slice.call(arguments, 0));
                } else {
                    $.error('Method ' + method + ' does not exist on jQuery.lettering');
                    return this;
                }
            };
            
            if ($('.circle-title-anime').length) {
                $('.circle-title-anime').lettering();
            }
        },
        
       // WooCommerce functionality
        initWooCommerce: function() {
            // Product variations
            $('.product-size a, .product-color a, .widget-size-wrap a').on('click', function(e) {
                e.preventDefault();
                $(this).siblings().removeClass('active');
                $(this).toggleClass('active');
            });
            
            // Shipping address toggle
            $('#ship-to-different-address-checkbox').on('change', function() {
                if ($(this).is(':checked')) {
                    $('#ship-to-different-address').next('.shipping_address').slideDown();
                } else {
                    $('#ship-to-different-address').next('.shipping_address').slideUp();
                }
            });
            
            // Login form toggle
            $('.woocommerce-form-login-toggle a').on('click', function(e) {
                e.preventDefault();
                $('.woocommerce-form-login').slideToggle();
            });
            
            // Coupon form toggle
            $('.woocommerce-form-coupon-toggle a').on('click', function(e) {
                e.preventDefault();
                $('.woocommerce-form-coupon').slideToggle();
            });
            
            // Shipping calculator toggle
            $('.shipping-calculator-button').on('click', function(e) {
                e.preventDefault();
                $(this).next('.shipping-calculator-form').slideToggle();
            });
            
            // Payment methods
            $('.wc_payment_methods input[type="radio"]:checked').siblings('.payment_box').show();
            $('.wc_payment_methods input[type="radio"]').each(function() {
                $(this).on('change', function() {
                    $('.payment_box').slideUp();
                    $(this).siblings('.payment_box').slideDown();
                });
            });
            
            // Rating system
            $('.rating-select .stars a').each(function() {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    $(this).siblings().removeClass('active');
                    $(this).parent().parent().addClass('selected');
                    $(this).addClass('active');
                });
            });
            
            // Quantity controls
            $('.quantity-plus').each(function() {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    const $input = $(this).siblings('.qty-input');
                    const currentVal = parseInt($input.val(), 10);
                    
                    if (!isNaN(currentVal)) {
                        $input.val(currentVal + 1);
                    }
                });
            });
            
            $('.quantity-minus').each(function() {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    const $input = $(this).siblings('.qty-input');
                    const currentVal = parseInt($input.val(), 10);
                    
                    if (!isNaN(currentVal) && currentVal > 1) {
                        $input.val(currentVal - 1);
                    }
                });
            });
        },
        
        // Hover effects functionality
        initHoverEffects: function() {
            $(document).on('mouseover', '.hover-item', function() {
                $('.hover-item').removeClass('item-active');
                $(this).addClass('item-active');
            });
        },
        
        // Work process functionality
        initWorkProcess: function() {
            $(document).ready(function() {
                $('.work-process-list li').on('mouseenter', function() {
                    const index = $(this).index();
                    $('.work-process-list li').each(function(i) {
                        if (i <= index) {
                            $(this).addClass('dot-active');
                        }
                    });
                });
                
                $('.work-process-list li').on('mouseleave', function() {
                    $('.work-process-list li').removeClass('dot-active');
                });
            });
        },
        
        // Animation functionality
        initAnimations: function() {
            if (!this.options.animations.enabled) return;
            
            // Initialize scroll animations if available
            if (typeof scrollCue !== 'undefined') {
                scrollCue.init({
                    percentage: this.options.animations.threshold,
                    duration: this.options.animations.duration
                });
            }
        },
        
        // Initialize ScrollCue
        initScrollCue: function() {
            if (typeof scrollCue !== 'undefined') {
                scrollCue.init({
                    percentage: 0.99,
                    duration: 900
                });
            }
        },
        
        // Public methods
        destroy: function() {
            // Remove event listeners and clean up
            $(window).off('.otTheme');
            $(document).off('.otTheme');
            this.$element.removeData(pluginName);
        },
        
        refresh: function() {
            this.destroy();
            this.init();
        },
        
        // Get current options
        getOptions: function() {
            return this.options;
        },
        
        // Update options
        setOptions: function(options) {
            this.options = $.extend(true, {}, this.options, options);
            this.refresh();
        }
    };

    // Plugin wrapper
    $.fn[pluginName] = function(options) {
        const args = arguments;
        
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new OTTheme(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            let returns;
            
            this.each(function() {
                const instance = $.data(this, 'plugin_' + pluginName);
                
                if (instance instanceof OTTheme && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
            
            return returns !== undefined ? returns : this;
        }
    };
    
    // Static methods for global functionality
    $[pluginName] = {
        // Global initialization
        init: function(options) {
            return $('body').otTheme(options);
        },
        
        // Get default options
        defaults: function() {
            return defaults;
        },
        
        // Version
        version: '1.0.0'
    };

})(jQuery, window, document);

// Auto-initialize on document ready
$(document).ready(function() {
    'use strict';
    
    // Initialize the plugin globally
    $.otTheme.init();
});

// Usage examples:
/*
// Basic initialization
$('body').otTheme();

// With custom options
$('body').otTheme({
    preloader: {
        enabled: true,
        fadeOut: true
    },
    stickyHeader: {
        threshold: 300
    }
});

// Call methods
$('body').otTheme('refresh');
$('body').otTheme('destroy');

// Update options
$('body').otTheme('setOptions', {
    scrollTop: {
        threshold: 100
    }
});

// Get options
var options = $('body').otTheme('getOptions');