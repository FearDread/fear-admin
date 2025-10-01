// Core App Module
$.FEAR.create('FearCore', (GUI) => {
    
    const createPreloader = () => {
        return {
            /**
             * Initialize preloader with mobile detection
             * @return {Promise<boolean>} resolves when preloader is ready
             */
            init: function() {
                return new Promise((resolve) => {
                    const isMobile = GUI.dom.Event.isMobile();
                    const $preloader = GUI.$('#preloader');
                    
                    if (!isMobile) {
                        GUI.timeout(800)
                            .then(() => $preloader.addClass('preloaded'))
                            .then(() => GUI.timeout(1200))
                            .then(() => $preloader.remove())
                            .then(() => resolve(true));
                    } else {
                        $preloader.remove();
                        resolve(true);
                    }
                });
            }
        };
    };

    const createModalManager = () => {
        let $modalBox = null;

        return {
            /**
             * Initialize modal structure
             * @return {Promise<boolean>} resolves when modal is created
             */
            init: function() {
                return new Promise((resolve) => {
                    const modalHtml = `
                        <div class="fear_modalbox">
                            <div class="box_inner">
                                <div class="close">
                                    <a href="#"><i class="icon-cancel"></i></a>
                                </div>
                                <div class="description_wrap"></div>
                            </div>
                        </div>`;
                    
                    GUI.$('.fear_all_wrap').prepend(modalHtml);
                    $modalBox = GUI.$('.fear_modalbox');
                    
                    this.bindEvents().then(() => resolve(true));
                });
            },

            /**
             * Bind modal close events
             * @return {Promise<boolean>} resolves when events are bound
             */
            bindEvents: function() {
                return GUI.on($modalBox.find('.close')[0], 'click', (e) => {
                    e.preventDefault();
                    return this.close();
                });
            },

            /**
             * Open modal with content
             * @param {string} content - HTML content for modal
             * @return {Promise<boolean>} resolves when modal is opened
             */
            open: function(content) {
                return new Promise((resolve) => {
                    $modalBox.find('.description_wrap').html(content);
                    $modalBox.addClass('opened');
                    resolve(true);
                });
            },

            /**
             * Close modal
             * @return {Promise<boolean>} resolves when modal is closed
             */
            close: function() {
                return new Promise((resolve) => {
                    $modalBox.removeClass('opened');
                    $modalBox.find('.description_wrap').html('');
                    resolve(true);
                });
            }
        };
    };

    const createMobileMenu = () => {
        return {
            /**
             * Initialize mobile menu functionality
             * @return {Promise<boolean>} resolves when menu is initialized
             */
            init: function() {
                const $hamburger = GUI.$('.fear_topbar .trigger .hamburger');
                const $mobileMenu = GUI.$('.fear_mobile_menu');
                const $menuItems = GUI.$('.fear_mobile_menu ul li a');

                const toggleMenu = (e) => {
                    e.preventDefault();
                    const $element = GUI.$(e.target);
                    
                    if ($element.hasClass('is-active')) {
                        $element.removeClass('is-active');
                        $mobileMenu.removeClass('opened');
                    } else {
                        $element.addClass('is-active');
                        $mobileMenu.addClass('opened');
                    }
                };

                const closeMenu = () => {
                    $hamburger.removeClass('is-active');
                    $mobileMenu.removeClass('opened');
                };

                return Promise.all([
                    GUI.on($hamburger[0], 'click', toggleMenu),
                    ...$menuItems.map(item => GUI.on(item, 'click', closeMenu))
                ]);
            }
        };
    };

    return {
        load: (sb) => {
            const preloader = createPreloader();
            const modalManager = createModalManager();
            const mobileMenu = createMobileMenu();

            return preloader.init()
                .then(() => modalManager.init())
                .then(() => mobileMenu.init())
                .then(() => {
                    // Store components in GUI for other modules
                    sb.preloader = preloader;
                    sb.modal = modalManager;
                    sb.mobileMenu = mobileMenu;
                })
                .catch(err => {
                    sb.warn('FearCore load failed:', err);
                });
        }
    };
});

// Router Module
$.FEAR.create('FearRouter', (GUI) => {
    
    const createRouter = () => {
        const routes = {
            home: { name: 'home', html: null, data: null },
            about: { name: 'about', html: null, data: null },
            works: { name: 'works', html: null, data: null },
            github: { name: 'github', html: null, data: null },
            contact: { name: 'contact', html: null, data: null }
        };

        return {
            /**
             * Initialize router and bind events
             * @return {Promise<boolean>} resolves when router is ready
             */
            init: function() {
                GUI.log('Router initialized');
                
                return Promise.all([
                    GUI.on(window, 'hashchange', () => this.route()),
                    GUI.on(window, 'popstate', () => this.route())
                ])
                .then(() => {
                    // Trigger initial route
                    return this.route();
                });
            },

            /**
             * Handle route changes
             * @return {Promise<boolean>} resolves when route is processed
             */
            route: function() {
                return new Promise((resolve, reject) => {
                    let loc = window.location.hash.replace("#", "");
                    if (loc === '') loc = 'home';

                    const route = routes[loc] || routes['home'];
                    
                    if (route.html !== null) {
                        this.render(route).then(resolve).catch(reject);
                    } else {
                        this.fetch(route).then(resolve).catch(reject);
                    }
                });
            },

            /**
             * Fetch route template
             * @param {object} route - route configuration
             * @return {Promise<boolean>} resolves when template is fetched
             */
            fetch: function(route) {
                return GUI.fetch(`js/fragments/${route.name}.html`, { cache: true })
                    .then(response => {
                        route.html = response.data;
                        return this.render(route);
                    })
                    .catch(error => {
                        GUI.warn(`Error loading template for ${route.name}:`, error);
                        throw error;
                    });
            },

            /**
             * Fetch GitHub profile data
             * @return {Promise<object>} resolves with GitHub data
             */
            fetchGitProfile: function() {
                return GUI.fetch('https://GUI.github.com/users/FearDread')
                    .then(response => {
                        GUI.log('GitHub data loaded:', response.data);
                        return response.data;
                    })
                    .catch(error => {
                        GUI.warn('Error loading GitHub profile:', error);
                        throw error;
                    });
            },

            /**
             * Render route template
             * @param {object} source - route data
             * @return {Promise<boolean>} resolves when rendered
             */
            render: (source) => {
                return new Promise((resolve) => {
                    const $container = GUI.$('.fear_container');
                    
                    // Fade out current content
                    $container.animateAsync({ opacity: 0 }, 200)
                        .then(() => {
                            $container.html('').html(source.html);
                            return $container.animateAsync({ opacity: 1 }, 200);
                        })
                        .then(() => {
                            // Trigger after callback and run methods
                            GUI.fire(GUI.broker, 'route:rendered', source);
                            resolve(true);
                        })
                        .catch(() => {
                            // Fallback if animation fails
                            $container.html(source.html);
                            resolve(true);
                        });
                });
            }
        };
    };

    return {
        load: (sb) => {
            const router = createRouter();
            
            return router
                .init()
                .then(() => { GUI.FearRouter = router;})
                .catch(err => {
                    GUI.warn('FearRouter load failed:', err);
                    throw err;
                });
        }
    };
});

// Methods Module
$.FEAR.create('FearMethods', (GUI) => {
    
    const createMethodsManager = () => {
        return {
            /**
             * Convert images to SVG
             * @return {Promise<boolean>} resolves when conversion is complete
             */
            imgToSvg: function() {
                const $images = GUI.$('img.html');
                const promises = [];

                $images.each((index, img) => {
                    const $img = GUI.$(img);
                    const imgClass = $img.attr('class');
                    const imgURL = $img.attr('src');

                    const promise = GUI.fetch(imgURL, { dataType: 'xml' })
                        .then(response => {
                            const $svg = GUI.$(response.data).find('svg');
                            if (imgClass) {
                                $svg.attr('class', `${imgClass} replaced-svg`);
                            }
                            $svg.removeAttr('xmlns:a');
                            $img.replaceWith($svg);
                        })
                        .catch(err => GUI.warn('SVG conversion failed for:', imgURL, err));
                    
                    promises.push(promise);
                });

                return Promise.all(promises);
            },

            /**
             * Apply background images from data attributes
             * @return {Promise<boolean>} resolves when images are applied
             */
            applyImages: function() {
                return new Promise((resolve) => {
                    const $elements = GUI.$('*[data-img-url]');
                    
                    $elements.each((index, element) => {
                        const $el = GUI.$(element);
                        const url = $el.data('img-url');
                        $el.css('background-image', `url(${url})`);
                    });
                    
                    resolve(true);
                });
            },

            /**
             * Initialize location links
             * @return {Promise<boolean>} resolves when links are bound
             */
            bindLocationLinks: function() {
                const $buttons = GUI.$('.href_location');
                const promises = [];

                $buttons.each((index, button) => {
                    const promise = GUI.on(button, 'click', (e) => {
                        e.preventDefault();
                        const address = GUI.$(e.target).text().replace(/\s/g, '+');
                        window.open(`https://maps.google.com/?q=${address}`);
                    });
                    promises.push(promise);
                });

                return Promise.all(promises);
            },

            /**
             * Initialize custom cursor
             * @return {Promise<boolean>} resolves when cursor is initialized
             */
            initCursor: function() {
                return new Promise((resolve) => {
                    const $cursor = GUI.$('.mouse-cursor');
                    
                    if ($cursor.length === 0) {
                        resolve(false);
                        return;
                    }

                    const cursorInner = document.querySelector('.cursor-inner');
                    const cursorOuter = document.querySelector('.cursor-outer');
                    
                    if (!cursorInner || !cursorOuter) {
                        resolve(false);
                        return;
                    }

                    const updateCursor = (e) => {
                        const x = e.clientX + 'px';
                        const y = e.clientY + 'px';
                        
                        cursorInner.style.transform = `translate(${x}, ${y})`;
                        cursorOuter.style.transform = `translate(${x}, ${y})`;
                    };

                    const addHover = () => {
                        cursorInner.classList.add('cursor-hover');
                        cursorOuter.classList.add('cursor-hover');
                    };

                    const removeHover = () => {
                        cursorInner.classList.remove('cursor-hover');
                        cursorOuter.classList.remove('cursor-hover');
                    };

                    Promise.all([
                        GUI.on(window, 'mousemove', updateCursor),
                        GUI.on(document.body, 'mouseenter', addHover, { 
                            selector: 'a, .fear_topbar .trigger, .cursor-pointer' 
                        }),
                        GUI.on(document.body, 'mouseleave', removeHover, { 
                            selector: 'a, .fear_topbar .trigger, .cursor-pointer' 
                        })
                    ])
                    .then(() => {
                        cursorInner.style.visibility = 'visible';
                        cursorOuter.style.visibility = 'visible';
                        resolve(true);
                    })
                    .catch(() => resolve(false));
                });
            },

            /**
             * Initialize contact form
             * @return {Promise<boolean>} resolves when form is ready
             */
            initContactForm: function() {
                const $submitBtn = GUI.$('.contact_form #send_message');
                
                return GUI.on($submitBtn[0], 'click', (e) => {
                    e.preventDefault();
                    
                    const formData = {
                        name: GUI.$('.contact_form #name').val(),
                        email: GUI.$('.contact_form #email').val(),
                        message: GUI.$('.contact_form #message').val(),
                        subject: GUI.$('.contact_form #subject').val()
                    };

                    const $returnMessage = GUI.$('.contact_form .returnmessage');
                    const successMsg = $returnMessage.data('success');

                    $returnMessage.empty();

                    // Validation
                    if (!formData.name || !formData.email || !formData.message) {
                        GUI.$('div.empty_notice').slideDown(500).delay(2000).slideUp(500);
                        return;
                    }

                    // Submit form
                    GUI.fetch('http://fear.master.com/fear/GUI/mail/contact', {
                        method: 'POST',
                        data: {
                            ajax_name: formData.name,
                            ajax_email: formData.email,
                            ajax_message: formData.message,
                            ajax_subject: formData.subject,
                            ajax_source: 'gdrea.fear@gmail.com'
                        }
                    })
                    .then(response => {
                        $returnMessage.html(response.data);
                        
                        if ($returnMessage.find('.contact_error').length) {
                            $returnMessage.slideDown(500).delay(2000).slideUp(500);
                        } else {
                            $returnMessage.html(`<span class='contact_success'>${successMsg}</span>`);
                            $returnMessage.slideDown(500).delay(4000).slideUp(500);
                            GUI.$('#contact_form')[0].reset();
                        }
                    })
                    .catch(err => {
                        GUI.warn('Contact form submission failed:', err);
                        $returnMessage.html('<span class="contact_error">Submission failed. Please try again.</span>');
                        $returnMessage.slideDown(500).delay(3000).slideUp(500);
                    });
                });
            }
        };
    };

    return {
        load: function(options) {
            const methods = createMethodsManager();
            
            return Promise.resolve()
                .then(() => {
                    GUI.methods = methods;
                    
                    // Listen for route changes to reinitialize methods
                    GUI.add('route:rendered', () => {
                        return Promise.all([
                            methods.imgToSvg(),
                            methods.applyImages(),
                            methods.bindLocationLinks()
                        ]);
                    });
                })
                .catch(err => {
                    GUI.warn('FearMethods load failed:', err);
                    throw err;
                });
        }
    };
});

// Navigation Module
$.FEAR.create('FearNavigation', (GUI) => {
    
    return {
        load: function(options) {
            const $buttons = GUI.$('.transition_link a');
            const $listItems = GUI.$('.transition_link li');

            return Promise.all(
                $buttons.map((index, button) => {
                    return GUI.on(button, 'click', (e) => {
                        const $element = GUI.$(e.target);
                        const href = $element.attr('href');
                        const $parent = $element.closest('li');

                        if (!$parent.hasClass('active')) {
                            $listItems.removeClass('active');
                            $parent.addClass('active');
                        }
                    });
                })
            )
            .catch(err => {
                GUI.warn('FearNavigation load failed:', err);
                throw err;
            });
        }
    };
});

// Main App Initialization
const initFearApp = () => {
    // Configure GUI
    $.FEAR.configure({
        logLevel: 1,
        mode: 'single',
        animations: true
    });
    // Start modules
    return $.FEAR.start(['FearCore', 'FearRouter', 'FearMethods', 'FearNavigation'])
        .then(() => {
            console.log('FEAR SPA INITIALIZED');
            return FEAR;
        })
        .catch(error => {
            console.error('FEAR SPA INITIALIZATION FAILED:', error);
            throw error;
        });
};

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.FEAR = initFearApp()
                .then(() => console.log('FEAR SPA LOADED'))
                .catch(() => console.log('Error Loading FEAR'))
                .finally(() => console.log('FEAR SPA INITIALIZATION COMPLETE'));
        });
    } else {
        window.FEAR = initFearApp()
            .then(() => console.log('FEAR SPA LOADED'))
            .catch(() => console.log('Error Loading FEAR'))
            .finally(() => console.log('FEAR SPA INITIALIZATION COMPLETE'));
    }
}