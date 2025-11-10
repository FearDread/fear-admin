(($, window, undefined) => {
/**
 * Preloader Module
 */
FEAR.create('Preloader', function (GUI) {
    return {
        load: function (options = {}) {
            return new Promise((resolve) => {
                GUI.log('Preloader module loading');

                const speed = options.speed || 500;
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
                const $preloader = GUI.$('#preloader');

                setTimeout(() => {
                    if (!isMobile) {
                        setTimeout(() => { $preloader.addClass('preloaded'); }, 800);
                        setTimeout(() => {
                            $preloader.remove();
                            resolve();
                        }, 2000);
                    } else {
                        $preloader.remove();
                        resolve();
                    }
                }, speed);
            });
        }
    };
}, { speed: 500 });

/**
 * Modal Module
 */
FEAR.create('Modal', function (GUI) {
    const modal = GUI.$('.fear_modalbox');
    const modalHTML = `
      <div class="fear_modalbox">
        <div class="box_inner">
          <div class="close">
            <a href="#"><i class="icon-cancel"></i></a>
          </div>
          <div class="description_wrap"></div>
        </div>
      </div>
    `;
    modal.about = () => {
	var button			= jQuery('.fear_about .fear_button a');
	var close			= jQuery('.fear_modalbox .close');
	var hiddenContent	= jQuery('.fear_hidden_content').html();
	
	button.on('click', function(){
		modal.addClass('opened');
		modal.find('.description_wrap').html(hiddenContent);
		GUI.ui.methods.imgToSvg();
		GUI.ui.methods.progress();
		GUI.ui.methods.circular_progress();

	});
	close.on('click',function(){
		modal.removeClass('opened');
		modal.find('.description_wrap').html('');
	});
}

// -------------------------------------------------
// -----------  PORTFOLIO POPUP  -------------------
// -------------------------------------------------

modal.portfolio = () => {
	var button			= GUI.$('.fear_portfolio .portfolio_popup');
	var closePopup		= modal.find('.close');
	
	button.off().on('click', function(){
		var element 	= GUI.$(this);
		var parent 		= element.closest('.list_inner');
		var content 	= parent.find('.fear_hidden_content').html();
		var image		= parent.find('.image .main').data('img-url');
		var title		= parent.find('.details h3').text();
		var category	= parent.find('.details span').text();
		modalBox.addClass('opened');
		modalBox.find('.description_wrap').html(content);
		modalBox.find('.portfolio_popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="'+image+'"></div></div>');
		modalBox.find('.portfolio_popup_details .top_image').after('<div class="portfolio_main_title"><h3>'+title+'</h3><span><a href="#">'+category+'</a></span><div>');
		fear_data_images();
		fear_popup();
		return false;
	});
	closePopup.on('click',function(){
		modalBox.removeClass('opened');
		modalBox.find('.description_wrap').html('');
		return false;
	});

}

// -------------------------------------------------
// ----------------  NEWS POPUP  -------------------
// -------------------------------------------------

function fear_news_popup(){
	
	"use strict";
	
	var modalBox		= jQuery('.fear_modalbox');
	var button			= jQuery('.fear_news .news_popup,.fear_news .news_list h3 a');
	var closePopup		= modalBox.find('.close');
	
	button.off().on('click',function(){
		var element 	= jQuery(this);
		var parent 		= element.closest('.list_inner');
		var content 	= parent.find('.fear_hidden_content').html();
		var image		= parent.find('.image .main').data('img-url');
		var title		= parent.find('.details h3 a').text();
		var category	= parent.find('.details span').html();
		modalBox.addClass('opened');
		modalBox.find('.description_wrap').html(content);
		modalBox.find('.news_popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="'+image+'"></div></div>');
		modalBox.find('.news_popup_details .top_image').after('<div class="news_main_title"><h3>'+title+'</h3><span>'+category+'</span><div>');
		fear_data_images();
		return false;
	});
	closePopup.on('click',function(){
		modalBox.removeClass('opened');
		modalBox.find('.description_wrap').html('');
		return false;
	});
}
    return {
        load: function (options = {}) {
            GUI.log('Modal module loading');
            GUI.$('.fear_all_wrap').prepend(modalHTML);
            // Set up event handlers
            GUI.$('.fear_modalbox .close').on('click', function (e) {
                e.preventDefault();
                GUI.$('.fear_modalbox').removeClass('opened');
                GUI.$('.fear_modalbox .description_wrap').html('');
            });

            // Expose modal API
            GUI.modal = {
                open: (content) => {
                    GUI.$('.fear_modalbox').addClass('opened');
                    GUI.$('.fear_modalbox .description_wrap').html(content);
                },
                close: () => {
                    GUI.$('.fear_modalbox').removeClass('opened');
                    GUI.$('.fear_modalbox .description_wrap').html('');
                }
            };

            return Promise.resolve();
        },

        unload: function () {
            GUI.$('.fear_modalbox').remove();
            delete GUI.modal;
            return Promise.resolve();
        }
    };
});

/**
 * Mobile Menu Module
 */
FEAR.create('MobileMenu', function (GUI) {
    return {
        load: function (options = {}) {
            GUI.log('Mobile menu module loading');

            const $hamburger = GUI.$('.fear_topbar .trigger .hamburger');
            const $mobileMenu = GUI.$('.fear_mobile_menu');
            const $menuLinks = GUI.$('.fear_mobile_menu ul li a');

            $hamburger.on('click', function (e) {
                e.preventDefault();
                const $el = GUI.$(this);

                if ($el.hasClass('is-active')) {
                    $el.removeClass('is-active');
                    $mobileMenu.removeClass('opened');
                } else {
                    $el.addClass('is-active');
                    $mobileMenu.addClass('opened');
                }
            });

            $menuLinks.on('click', function () {
                $hamburger.removeClass('is-active');
                $mobileMenu.removeClass('opened');
            });

            return Promise.resolve();
        }
    };
});

/**
 * Router Module
 */
// ============================================
FEAR.create('FearRouter', (GUI) => {

    const createRouter = () => {
        const routes = {
            home: { name: 'home', html: null, data: null },
            about: { name: 'about', html: null, data: null },
            works: { name: 'works', html: null, data: null },
            github: { name: 'github', html: null, data: null },
            contact: { name: 'contact', html: null, data: null }
        };

        const router = {
            init: async () => {
                GUI.log('Router: Initializing...');

                // Bind hash change events
                $(window).on('hashchange', () => router.route());
                $(window).on('popstate', () => router.route());

                // Trigger initial route
                await router.route();
                return true;
            },

            route: async () => {
                let loc = window.location.hash.replace("#", "");
                if (loc === '') loc = 'home';

                const route = routes[loc] || routes['home'];

                // Emit route start event
                GUI.emit('route:start', { path: loc });

                if (route.html !== null) {
                    await router
                        .render(route)
                        .then(() => { })
                        .catch((err) => GUI.warn("Error rendering route", err));
                } else {
                    await router.fetch(route)
                        .then(() => GUI.emit('route:complete', { path: loc }))
                        .catch((err) => GUI.warn("Error fetching route :", err));
                }
            },

            fetch: async (route) => {
                await GUI.fetch(`js/fragments/${route.name}.html`, {
                    cache: true
                })
                    .then(async (response) => route.html = response.data)
                    .then(() => router.render(route))
                    .catch((error) => {
                        GUI.warn(`Error loading template for ${route.name}:`, error);
                        GUI.emit('error', error);
                        throw error;
                    })

            },

            fetchGitProfile: async () => {
                try {
                    const response = await GUI.fetch('https://api.github.com/users/FearDread');
                    GUI.log('GitHub data loaded:', response.data);
                    return response.data;
                } catch (error) {
                    GUI.warn('Error loading GitHub profile:', error);
                    GUI.emit('error', error);
                    throw error;
                }
            },

            render: async (source) => {
                const $container = GUI.$('.fear_container');

                try {
                    // Use animateAsync from GUI
                    await $container.animateAsync({ opacity: 0 }, 200);

                    // Update content
                    $container.html(source.html);

                    // Fade in
                    await $container.animateAsync({ opacity: 1 }, 200);

                    // Emit route rendered event
                    GUI.emit('route:rendered', source);
                } catch (err) {
                    // Fallback without animation
                    $container.html(source.html);
                    GUI.emit('route:rendered', source);
                }
            }
        };

        return router;
    };

    return {
        load: async (options) => {
            GUI.log('FearRouter: Loading...');

            const router = createRouter();

            try {
                await router.init();

                // Store router reference on GUI for access by other modules
                GUI.router = router;

                GUI.log('FearRouter: Loaded successfully');
            } catch (err) {
                GUI.warn('FearRouter load failed:', err);
                throw err;
            }
        },

        unload: () => {
            GUI.log('FearRouter: Unloading...');
            $(window).off('hashchange popstate');
        }
    };
});


/**
 * UI Methods Module
 */
FEAR.create('UIMethods', function (GUI) {
    const methods = {};

    methods.imgToSvg = () => {
        GUI.$('img.html').each(function () {
            const $img = GUI.$(this);
            const imgClass = $img.attr('class');
            const imgURL = $img.attr('src');

            GUI.$.get(imgURL, (data) => {
                let $svg = GUI.$(data).find('svg');
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }
                $svg = $svg.removeAttr('xmlns:a');
                $img.replaceWith($svg);
            }, 'xml');
        });
    };

    methods.dataImages = () => {
        GUI.$('*[data-img-url]').each(function () {
            const $el = GUI.$(this);
            const url = $el.data('img-url');
            $el.css({ backgroundImage: `url(${url})` });
        });
    };

    methods.cursor = () => {
        const $myCursor = GUI.$('.mouse-cursor');

        if ($myCursor.length) {
            const cursorInner = document.querySelector('.cursor-inner');
            const cursorOuter = document.querySelector('.cursor-outer');

            if (!cursorInner || !cursorOuter) return;

            window.onmousemove = (e) => {
                cursorOuter.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                cursorInner.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            };

            GUI.$('body').on('mouseenter', 'a, .fear_topbar .trigger, .cursor-pointer', function () {
                cursorInner.classList.add('cursor-hover');
                cursorOuter.classList.add('cursor-hover');
            });

            GUI.$('body').on('mouseleave', 'a, .fear_topbar .trigger, .cursor-pointer', function () {
                if (!GUI.$(this).closest('.cursor-pointer').length) {
                    cursorInner.classList.remove('cursor-hover');
                    cursorOuter.classList.remove('cursor-hover');
                }
            });

            cursorInner.style.visibility = 'visible';
            cursorOuter.style.visibility = 'visible';
        }
    };

    methods.mycarousel = () => {

    }

    return {
        load: function (options = {}) {
            GUI.log('UI Methods module loading');

            // Run all methods
            Object.keys(methods).forEach(key => {
                try {
                    methods[key]();
                } catch (err) {
                    GUI.warn(`Error running method ${key}:`, err);
                }
            });

            // Expose methods API
            GUI.ui = methods;

            // Listen for route changes to re-run methods
            GUI.add('route:rendered', () => {
                methods.imgToSvg();
                methods.dataImages();
            });

            return Promise.resolve();
        },

        unload: function () {
            delete GUI.ui;
            return Promise.resolve();
        }
    };
});

/**
 * Contact Form Module
 */
FEAR.create('ContactForm', function (GUI) {
    return {
        load: function (options = {}) {
            GUI.log('Contact form module loading');

            GUI.$('.contact_form #send_message').on('click', function (e) {
                e.preventDefault();

                const name = GUI.$('.contact_form #name').val();
                const email = GUI.$('.contact_form #email').val();
                const message = GUI.$('.contact_form #message').val();
                const subject = GUI.$('.contact_form #subject').val();
                const success = GUI.$('.contact_form .returnmessage').data('success');

                GUI.$('.contact_form .returnmessage').empty();

                if (!name || !email || !message) {
                    GUI.$('div.empty_notice').slideDown(500).delay(2000).slideUp(500);
                    return false;
                }

                GUI.$.post(options.apiUrl || 'http://fear.master.com/fear/api/mail/contact', {
                    ajax_name: name,
                    ajax_email: email,
                    ajax_message: message,
                    ajax_subject: subject,
                    ajax_source: options.sourceEmail || 'gdrea.fear@gmail.com'
                }, (data) => {
                    const $returnMsg = GUI.$('.contact_form .returnmessage');
                    $returnMsg.append(data);

                    if ($returnMsg.find('span.contact_error').length) {
                        $returnMsg.slideDown(500).delay(2000).slideUp(500);
                    } else {
                        $returnMsg.append(`<span class='contact_success'>${success}</span>`);
                        $returnMsg.slideDown(500).delay(4000).slideUp(500);
                    }

                    if (data === '') {
                        GUI.$('#contact_form')[0].reset();
                    }
                });

                return false;
            });

            return Promise.resolve();
        }
    };
});

/**
 * Application Bootstrap
 */
// Configure GUI
FEAR.configure({
    name: 'FEAR_SPA',
    version: '3.0.0',
    logLevel: 0
});

FEAR.start()
    .then(() => {
        FEAR.debug.log('FEAR SPA initialized successfully');
        // Emit application ready event
        /*
        FEAR.start('Metrics', {
            displayMetrics: false,
            enabled: true
        });
        */
        FEAR.broker.emit('app:ready');
    })
    .catch((err) => {
        console.error('❌ Error loading FEAR SPA:', err);
        FEAR.debug.warn('Application startup failed:', err);
    })



}) (jQuery, window);