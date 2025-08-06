/* Ghap.com App Module */
$.GUI().create('App', function(gui) {
    var $container, mediaListener, maps;

    $container = gui.$('.page-container');

    // dynamic responsive styles
    mediaListener = new gui.ui.media({
        media:'(max-width: 1024)',
        in: function() {
            console.log('media in');
        },
        out: function() {
            console.log('media out');
        },
        both: function() {
            console.log('media both');
        }
    });

    maps = {
        location: null,
        init: function (obj) {
            var map, mapOptions;

            mapOptions = {
                position: "TOP_CENTER",
                zoom: 13,
                zoomControl: true,
                zoomControlOpt: {
                    style: 'SMALL',
                    position: 'TOP_LEFT'
                },
                panControl: false,
                scrollwheel: false
            };

            map = new google.maps.Map(document.getElementById('map'), mapOptions);

            this.setMarker(map, obj);
        },
        setMarker: function (map, obj) {
            var _this = this, icon, marker;

            this.location = new google.maps.LatLng(obj.latitude, obj.longitude);

            marker = new google.maps.Marker({
                map: map,
                title: obj.title,
                position: _this.location 
            });

            map.setCenter(marker.getPosition());
        }
    };

    function scrollTop() {
        $container.animate({
            'scrollTop': gui.$(window).height()
        }, 500);
    }

    function showCaption($div) {
        if ($div.length > 0) {

            setTimeout(function() {

                $div.addClass('is-loaded');
                showCaption($div.next());

            }, 150);
        }
    }

    function openPage(e) {
        var $selected = gui.$(this),
            toggle = !$selected.hasClass('is-full-width');

        if (toggle) {
            projectToggle($selected, $container, toggle);
        } 
    }

    function closePage() {
        projectToggle($('.is-full-width'), $container, false);
    }

    function projectToggle($project, $container, bool) {
        var mediaQuery, delay;

        if (bool) {
            $container.addClass('project-is-open');
            $project.addClass('is-full-width').siblings('.single-page').removeClass('is-loaded');

        } else {
            mediaQuery = window.getComputedStyle(document.querySelector('.page-container'), '::before').getPropertyValue('content');
            delay = (mediaQuery === 'mobile') ? 100 : 0;

            $container.removeClass('project-is-open');

            $project.animate({opacity: 0}, 800, function() {
                $project.removeClass('is-loaded');
                $container.find('.page-scroll').attr('style', '');

                setTimeout(function() {
                    $project.attr('style', '').removeClass('is-full-width').find('.page-title').attr('style', '');
                }, delay);

                setTimeout(function(){
                    showCaption($('.page-container .single-page').eq(0));
                }, 300);
            });
        }
    }

    function containerScroll() {
        requestAnim(changeOpacity);
    }

    function requestAnim(value) {
        return window.requestAnimationFrame(value);
    }

    function changeOpacity() {
        var newOpacity = 1 - ($('.page-container').scrollTop()) / 300;

        $('.page-container .page-scroll').css('opacity', newOpacity);
        $('.is-full-width .page-title').css('opacity', newOpacity);
    }

    return {
        initPlugins: function () {
            $('.open-portfolio').magnificPopup({
                type: 'inline',
                midClick: true,
                zoom: {
                    enabled: true,
                    duration: 300,
                    easing: 'ease-in-out'
                }
            });

            $('#portfolio').mixItUp();

            $("#testimonial-slides").owlCarousel({
                navigation: false,
                slideSpeed: 300,
                paginationSpeed: 400,
                singleItem: true
            });
        },
        bindEvents: function() {
            var _this = this;

            $container.scroll(containerScroll);

            $('.page-close', $container).click(closePage);
            $('.page-scroll', $container).click(scrollTop);
            $('.single-page').click(openPage);
            $('form.contact-form .submit').click(function () {
                var data;

                data = gui.serialize('form.contact-form');

                gui.xhr({type: 'POST', url: '/contact', data: data,
                    success: function (res) {
                        gui.log('contact form res = ', res);

                        if (res.status === 200) {

                            $('#image-loader').fadeOut();
                            $('#message-warning').hide();
                            $('#contactForm').fadeOut();
                            $('#message-success').fadeIn();
                            
                        } else {
                            $('#image-loader').fadeOut();
                            $('#message-warning').html(msg);
                            $('#message-warning').fadeIn();
                        }
                    },
                    error: function (err) {
                        if (err) {
                            gui.warn('Error: ', err);
                        }
                    }
                });
            });

            maps.init({
                title: 'My Address',
                latitude: 36.1439353,
                longitude: -115.1780559 
            });
        },
        preload: function() {
            $('.loader').fadeOut();
            $('.preloader').delay(350).fadeOut('slow');
            $('body').delay(350);
        },
        load: function() {
            var _this = this, charm;

            gui.$(window).load(function () {

                gui.timeout(function(){
                    _this.preload();
                    _this.bindEvents();
                    _this.initPlugins();

                    gui.$('.single-page').background({
                        afterLoaded: function() {
                            showCaption($('.single-page', $container).eq(0));
                            //$('.page-info').niceScroll({styler:'fb', cursorcolor:"#FFF"});
                        }
                    });

                    charm = new gui.ui.charm();
                    charm.init();

                }, 1000);

                mediaListener();
            });
        },
        unload: function() {}
    };
}).start();
