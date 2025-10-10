(($, window, undefined) => {
    // ============================================
    // Core App Module
    // ============================================
    FEAR.create('FearCore', (GUI) => {

        const createPreloader = () => ({
            init: async () => {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const $preloader = GUI.$('#preloader');

                if (!isMobile) {
                    await GUI.timeout(800);
                    $preloader.addClass('preloaded');
                    await GUI.timeout(1200);
                    $preloader.remove();
                } else {
                    $preloader.remove();
                }
                return true;
            }
        });

        const createModalManager = () => {
            let $modalBox = null;

            return {
                init: async () => {
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

                    // Bind close event
                    $modalBox.find('.close a').on('click', (e) => {
                        e.preventDefault();
                        this.close();
                    });

                    return true;
                },

                open: async (content) => {
                    $modalBox.find('.description_wrap').html(content);
                    $modalBox.addClass('opened');
                    return true;
                },

                close: async () => {
                    $modalBox.removeClass('opened');
                    $modalBox.find('.description_wrap').html('');
                    return true;
                }
            };
        };

        const createMobileMenu = () => ({
            init: async () => {
                const $hamburger = GUI.$('.fear_topbar .trigger .hamburger');
                const $mobileMenu = GUI.$('.fear_mobile_menu');
                const $menuItems = GUI.$('.fear_mobile_menu ul li a');

                const toggleMenu = (e) => {
                    e.preventDefault();
                    if ($hamburger.hasClass('is-active')) {
                        $hamburger.removeClass('is-active');
                        $mobileMenu.removeClass('opened');
                    } else {
                        $hamburger.addClass('is-active');
                        $mobileMenu.addClass('opened');
                    }
                };

                const closeMenu = () => {
                    $hamburger.removeClass('is-active');
                    $mobileMenu.removeClass('opened');
                };

                $hamburger.on('click', toggleMenu);
                $menuItems.on('click', closeMenu);

                return true;
            }
        });

        return {
            load: async (options) => {
                GUI.log('FearCore: Loading...');
                GUI.GDREA = {};
                const preloader = createPreloader();
                const modalManager = createModalManager();
                const mobileMenu = createMobileMenu();

                await Promise.all([
                    preloader.init(),
                    mobileMenu.init(),
                    modalManager.init()
                ])
                    .then(() => GUI.log('FearCore: Loaded successfully'))
                    .catch(err => GUI.warn("Error loading FearCore Modules : ", err))
            },

            unload: () => {
                GUI.log('FearCore: Unloading...');
            }
        };
    });

    // ============================================
    // Router Module
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

    // ============================================
    // Methods Module
    // ============================================
    FEAR.create('FearMethods', (GUI) => {

        const createMethodsManager = () => ({
            imgToSvg: async () => {
                const $images = GUI.$('img.svg');
                const promises = [];

                $images.each((index, img) => {
                    const $img = $(img);
                    const imgClass = $img.attr('class');
                    const imgURL = $img.attr('src');

                    const promise = GUI.fetch(imgURL, { dataType: 'xml' })
                        .then(response => {
                            const $svg = $(response.data).find('svg');
                            if (imgClass) {
                                $svg.attr('class', `${imgClass} replaced-svg`);
                            }
                            $svg.removeAttr('xmlns:a');
                            $img.replaceWith($svg);
                        })
                        .catch(err => GUI.warn('SVG conversion failed for:', imgURL, err));

                    promises.push(promise);
                });

                await Promise.all(promises);
            },

            applyImages: async () => {
                const $elements = GUI.$('*[data-img-url]');

                $elements.each((index, element) => {
                    const $el = $(element);
                    const url = $el.data('img-url');
                    $el.css('background-image', `url(${url})`);
                });
            },

            bindLocationLinks: async () => {
                const $buttons = GUI.$('.href_location');

                $buttons.on('click', (e) => {
                    e.preventDefault();
                    const address = $(e.currentTarget).text().replace(/\s/g, '+');
                    window.open(`https://maps.google.com/?q=${address}`);
                });
            },

            initCursor: async () => {
                const $cursor = GUI.$('.mouse-cursor');

                if ($cursor.length === 0) return false;

                const cursorInner = document.querySelector('.cursor-inner');
                const cursorOuter = document.querySelector('.cursor-outer');

                if (!cursorInner || !cursorOuter) return false;

                // Subscribe to cursor events via broker (use 'add' not 'listen')
                GUI.add('cursor:move', (data) => {
                    cursorInner.style.transform = `translate(${data.clientX}px, ${data.clientY}px)`;
                    cursorOuter.style.transform = `translate(${data.clientX}px, ${data.clientY}px)`;
                });

                GUI.add('cursor:hover:enter', () => {
                    cursorInner.classList.add('cursor-hover');
                    cursorOuter.classList.add('cursor-hover');
                });

                GUI.add('cursor:hover:leave', () => {
                    cursorInner.classList.remove('cursor-hover');
                    cursorOuter.classList.remove('cursor-hover');
                });

                // Wire up DOM events to emit broker events
                $(window).on('mousemove', (e) => {
                    GUI.emit('cursor:move', {
                        clientX: e.clientX,
                        clientY: e.clientY
                    });
                });

                $(document.body).on('mouseenter', 'a, .fear_topbar .trigger, .cursor-pointer', () =>
                    GUI.emit('cursor:hover:enter')
                );

                $(document.body).on('mouseleave', 'a, .fear_topbar .trigger, .cursor-pointer', () =>
                    GUI.emit('cursor:hover:leave')
                );

                cursorInner.style.visibility = 'visible';
                cursorOuter.style.visibility = 'visible';

                return true;
            },

            initContactForm: async () => {
                const $submitBtn = GUI.$('.contact_form #send_message');

                $submitBtn.on('click', async (e) => {
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

                    try {
                        const response = await GUI.fetch('http://fear.master.com/fear/api/mail/contact', {
                            method: 'POST',
                            data: {
                                ajax_name: formData.name,
                                ajax_email: formData.email,
                                ajax_message: formData.message,
                                ajax_subject: formData.subject,
                                ajax_source: 'gdrea.fear@gmail.com'
                            }
                        });

                        $returnMessage.html(response.data);

                        if ($returnMessage.find('.contact_error').length) {
                            $returnMessage.slideDown(500).delay(2000).slideUp(500);
                        } else {
                            $returnMessage.html(`<span class='contact_success'>${successMsg}</span>`);
                            $returnMessage.slideDown(500).delay(4000).slideUp(500);
                            GUI.$('#contact_form')[0].reset();
                        }
                    } catch (err) {
                        GUI.warn('Contact form submission failed:', err);
                        GUI.emit('error', err);
                        $returnMessage.html('<span class="contact_error">Submission failed. Please try again.</span>');
                        $returnMessage.slideDown(500).delay(3000).slideUp(500);
                    }
                });
            }
        });

        return {
            load: async (options) => {
                GUI.log('FearMethods: Loading...');

                const methods = createMethodsManager();

                // Store methods reference on GUI
                GUI.methods = methods;

                // Initialize methods on load
                await methods.imgToSvg();
                await methods.applyImages();
                await methods.bindLocationLinks();
                await methods.initCursor();

                // Listen for route changes to reinitialize methods
                GUI.add('route:rendered', async () => {
                    await methods.imgToSvg();
                    await methods.applyImages();
                    await methods.bindLocationLinks();
                    await methods.initContactForm();
                });

                GUI.log('FearMethods: Loaded successfully');
            },

            unload: () => {
                GUI.log('FearMethods: Unloading...');
                // Remove event listeners
                GUI.remove('route:rendered');
            }
        };
    });

    // ============================================
    // Navigation Module
    // ============================================
    FEAR.create('FearNavigation', (GUI) => {

        return {
            load: async (options) => {
                GUI.log('FearNavigation: Loading...');

                const $buttons = GUI.$('.transition_link a');
                const $listItems = GUI.$('.transition_link li');

                $buttons.on('click', (e) => {
                    const $element = $(e.currentTarget);
                    const $parent = $element.closest('li');

                    if (!$parent.hasClass('active')) {
                        $listItems.removeClass('active');
                        $parent.addClass('active');
                    }
                });

                GUI.log('FearNavigation: Loaded successfully');
            },

            unload: () => {
                GUI.log('FearNavigation: Unloading...');
                GUI.$('.transition_link a').off('click');
            }
        };
    });

    // ============================================
    // Bootstrap Application
    // ============================================
    $(document).ready(() => {
        const mods = ['FearCore', 'FearRouter', 'FearMethods', 'FearNavigation'];
        FEAR.start()
            .then(() => {
                FEAR.log('%c FEAR SPA INITIALIZED ', 'background: #222; color: #bada55; font-size: 16px; font-weight: bold;');
            })
            .catch(err => {
                FEAR.warn('Failed to start application:', err);
            });
    });

})(jQuery, window);