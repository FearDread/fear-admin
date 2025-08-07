
window.FEAR = (async ($, window) => {

    const App = {
        start: async () => {
            App.bindEvents();
            App.run();

            return App;
        },
        load: (callback) => {
            var speed = 500;
            setTimeout(() => {
                App.preload();

                if (callback) {
                    return callback()
                }
            }, speed);
        },
        preload: () => {
            var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
            var preloader = $('#preloader');

            if (!isMobile) {
                setTimeout(() => { preloader.addClass('preloaded'); }, 800);
                setTimeout(() => { preloader.remove(); }, 2000);
            } else {
                preloader.remove();
            }
        },
        bindEvents: () => {

            $(document).ready(() => {
                //App._legacy_page_transition();

                App.load(() => {
                    App.router.init();
                });
            });

            $(document).on('click', '[data-link]', (e) => {
                e.preventDefault();//prevent anchor click default behaviour.

                var page = $(this).attr('href');//get url from clicked link.
                var routes = page.substring(0, page.lastIndexOf('.'));//remove file extension that shows up in the url bar.

                window.history.pushState(null, null, routes);//assign new url to address bar and add page in browser history without reloading the page.
                App.router.render(page);
            });
            $(window).on('popstate', () => {

                var url = window.location.href;
                var routes = url.substring(url.lastIndexOf('/') + 1);//return page route from url.
                var page = routes != '' ? url + ".html" : "home.html";//if route is empty assign home.html to page to ajax load the default content.

                console.log(page);
                App.router.route(page);
            });
        },
        run: () => {
            Object.keys(App).forEach(prop => {

                if (prop == 'utils' || prop == 'methods' || prop == 'plugins') {

                    for (const func in App[prop]) {

                        if (App[prop].hasOwnProperty(func)) {
                            // Run App methods in utils, methods, and plugins
                            App[prop][func]();
                        }
                    }
                }
            })
        },

        _legacy_page_transition: () => {
            var section = $('.fear_section');
            var allLi = $('.transition_link li');
            var button = $('.transition_link a');
            var wrapper = $('.fear_all_wrap');
            var enter = wrapper.data('enter');
            var exit = wrapper.data('exit');

            button.on('click', function () {
                var element = $(this);
                var href = element.attr('href');
                console.log('href = ', href);
                //_this.router.loadPage(href);
                //$(window).trigger('hashchange', {data: href});
                if (element.parent().hasClass('fear_button')) {

                    $('.menu .transition_link a[href="' + href + '"]').trigger('click');
                    App.router.hashtag();

                    return false;
                }

                var sectionID = $(href);
                var parent = element.closest('li');

                if (!parent.hasClass('active')) {
                    allLi.removeClass('active');
                    wrapper.find(section).removeClass('animated ' + enter);

                    if (wrapper.hasClass('opened')) {
                        wrapper.find(section).addClass('animated ' + exit);
                    }

                    parent.addClass('active');
                    wrapper.addClass('opened');

                    wrapper.find(sectionID).removeClass('animated ' + exit).addClass('animated ' + enter);

                    $(section).addClass('hidden');
                    $(sectionID).removeClass('hidden').addClass('active');
                }
                return false;
            });
        },

        router: {
            templates: {},
            routes: ['#home', '#about', '#works', '#contact'],

            init: () => {
                console.log('router was created...');
                App.router.bindEvents();

                $(window).trigger("hashchange");
            },
            bindEvents: () => {
                console.log('router hit ', App.router);
                $(window).on("hashchange", App.router.route.bind(this));
            },
            checkRoute: (hash) => {
                return App.router.routes.includes(hash);

            },
            fetch: (path) => {
                if (!App.router.checkRoute(path)) return false;
                path = path.replace("#", "");
                var source;
                console.log('fetch path =', path);

                $.ajax({
                    url: 'js/fragments/' + path + '.html',
                    cache: true,
                    success: (data) => {
                        source = data;
                        App.router.templates[path] = source;
                        App.router.renderTemplate(path, source);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.error("Error loading template:", textStatus, errorThrown);
                    }
                });
            },
            hashtag: () => {

                var ccc = $('.fear_header .menu .ccc');
                var element = $('.fear_header .menu .active a');

                $('.fear_header .menu a').on('mouseenter', function () {
                    var e = $(this);
                    App.router.link(ccc, e);
                });

                $('.fear_header .menu').on('mouseleave', function () {
                    element = $('.fear_header .menu .active a');
                    App.router.link(ccc, element);
                    element.parent().siblings().removeClass('mleave');
                });

            },
            link: (ccc, ele) => {
                if (!ele && !ele.length) { return false; }

                var left = ele.offset().left;
                var width = ele.outerWidth();
                var menuleft = $('.fear_header .menu').offset().left;

                ele.parent().removeClass('mleave');
                ele.parent().siblings().addClass('mleave');

                ccc.css({ left: (left - menuleft) + 'px', width: width + 'px' });
            },
            route: (href) => {
                var keyName = window.location.hash.split("/")[0];

                if (keyName == "") keyName = "#home";
                if (!href) href = keyName.replace("#", "");

                if (App.router.routes.includes(keyName)) {
                    if (App.router.templates.hasOwnProperty(href)) {
                        App.router.renderTemplate(keyName, App.router.templates[href])
                    }
                    App.router.fetch(keyName)
                } else {
                    App.router.renderError();
                }
            },
            renderTemplate: (href, source) => {
                var _data = {};
                var templateScript = $(source).html();
                var template = Handlebars.compile(templateScript);

                var container = $('.fear_container');
                var section = $('.fear_section');
                var wrapper = $('.fear_all_wrap');

                var enter = wrapper.data('enter');
                var exit = wrapper.data('exit');

                var sectionID = $(href);

                $(container).empty();
                $(container).append(template(_data));

                wrapper.find(section).removeClass('animated ' + enter);

                if (wrapper.hasClass('opened')) {
                    wrapper.find(section).addClass('animated ' + exit);
                }

                wrapper.addClass('opened');

                wrapper.find(sectionID).removeClass('animated ' + exit).addClass('animated ' + enter);

                $(section).addClass('hidden');
                $(sectionID).removeClass('hidden').addClass('active');
                return false;
            },
            renderError: () => {
                var data = { errorMessage: "404 - Page Not Found" };
                App.router.renderTemplate("#error-page-template", data);
            },
        },

        utils: {
            imgtosvg: () => {

                $('img.html').each(function () {

                    var $img = $(this);
                    var imgClass = $img.attr('class');
                    var imgURL = $img.attr('src');

                    $.get(imgURL, function (data) {
                        // Get the SVG tag, ignore the rest
                        var $svg = $(data).find('svg');

                        // Add replaced image's classes to the new SVG
                        if (typeof imgClass !== 'undefined') {
                            $svg = $svg.attr('class', imgClass + ' replaced-svg');
                        }

                        // Remove any invalid XML tags as per http://validator.w3.org
                        $svg = $svg.removeAttr('xmlns:a');

                        // Replace image with new SVG
                        $img.replaceWith($svg);

                    }, 'xml');

                });
            },
            data_images: () => {

                var data = $('*[data-img-url]');

                data.each(function () {
                    var element = $(this);
                    var url = element.data('img-url');
                    element.css({ backgroundImage: 'url(' + url + ')' });
                });
            },
            get_location: () => {
                var button = $('.href_location');
                button.on('click', function () {
                    var element = $(this);
                    var address = element.text();
                    address = address.replace(/\ /g, '+');
                    var text = 'https://maps.google.com/?q=';
                    window.open(text + address);
                    return false;
                });
            },
        },

        methods: {
            cursor: () => {

                var myCursor = $('.mouse-cursor');

                if (myCursor.length) {
                    if ($("body")) {
                        const e = document.querySelector(".cursor-inner"),
                            t = document.querySelector(".cursor-outer");
                        let n, i = 0,
                            o = !1;
                        window.onmousemove = function (s) {
                            o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
                        }, $("body").on("mouseenter", "a,.fear_topbar .trigger, .cursor-pointer", function () {
                            e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
                        }), $("body").on("mouseleave", "a,.fear_topbar .trigger, .cursor-pointer", function () {
                            $(this).is("a") && $(this).closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
                        }), e.style.visibility = "visible", t.style.visibility = "visible"
                    }
                }
            },
            contact: () => {

                $(".contact_form #send_message").on('click', function () {

                    var name = $(".contact_form #name").val();
                    var email = $(".contact_form #email").val();
                    var message = $(".contact_form #message").val();
                    var subject = $(".contact_form #subject").val();
                    var success = $(".contact_form .returnmessage").data('success');

                    $(".contact_form .returnmessage").empty(); //To empty previous error/success message.
                    //checking for blank fields	
                    if (name === '' || email === '' || message === '') {

                        $('div.empty_notice').slideDown(500).delay(2000).slideUp(500);
                    }
                    else {
                        // Returns successful data submission message when the entered information is stored in database.
                        $.post("modal/contact.html", { ajax_name: name, ajax_email: email, ajax_message: message, ajax_subject: subject }, function (data) {

                            $(".contact_form .returnmessage").append(data);//Append returned message to message paragraph
                            if ($(".contact_form .returnmessage span.contact_error").length) {
                                $(".contact_form .returnmessage").slideDown(500).delay(2000).slideUp(500);
                            } else {
                                $(".contact_form .returnmessage").append("<span class='contact_success'>" + success + "</span>");
                                $(".contact_form .returnmessage").slideDown(500).delay(4000).slideUp(500);
                            }

                            if (data === "") {
                                $("#contact_form")[0].reset();//To reset form fields on success
                            }

                        });
                    }
                    return false;
                });
            },
            modal: () => {
                $('.fear_all_wrap').prepend('<div class="fear_modalbox"><div class="box_inner"><div class="close"><a href="#"><i class="icon-cancel"></i></a></div><div class="description_wrap"></div></div></div>')
            },
            galleries: () => {
                $('.gallery_zoom').each(function () { // the containers for all your galleries
                    $(this).magnificPopup({
                        delegate: 'a.zoom', // the selector for gallery item
                        type: 'image',
                        gallery: {
                            enabled: true
                        },
                        removalDelay: 300,
                        mainClass: 'mfp-fade'
                    });

                });
                $('.popup-youtube, .popup-vimeo').each(function () { // the containers for all your galleries
                    $(this).magnificPopup({
                        disableOn: 700,
                        type: 'iframe',
                        mainClass: 'mfp-fade',
                        removalDelay: 160,
                        preloader: false,
                        fixedContentPos: false
                    });
                });

                $('.soundcloude_link').magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true,
                    },
                });
            },
            about: () => {
                var button = $('.fear_about .fear_button a');
                var close = $('.fear_modalbox .close');
                var modalBox = $('.fear_modalbox');
                var hiddenContent = $('.fear_hidden_content').html();

                button.on('click', function () {
                    modalBox.addClass('opened');
                    modalBox.find('.description_wrap').html(hiddenContent);

                    App.utils.data_images();
                    App.plugins.my_progress();
                    App.plugins.circular_progress();
                    App.plugins.my_carousel();
                    App.utils.get_location();
                });
                close.on('click', function () {
                    modalBox.removeClass('opened');
                    modalBox.find('.description_wrap').html('');
                });
            },
            portfolio: () => {
                var modalBox = $('.fear_modalbox');
                var button = $('.fear_portfolio .portfolio_popup');
                var closePopup = modalBox.find('.close');

                button.off().on('click', function () {
                    var element = $(this);
                    var parent = element.closest('.list_inner');
                    var content = parent.find('.fear_hidden_content').html();
                    var image = parent.find('.image .main').data('img-url');
                    var title = parent.find('.details h3').text();
                    var category = parent.find('.details span').text();

                    modalBox.addClass('opened');
                    modalBox.find('.description_wrap').html(content);
                    modalBox.find('.portfolio_popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="' + image + '"></div></div>');
                    modalBox.find('.portfolio_popup_details .top_image').after('<div class="portfolio_main_title"><h3>' + title + '</h3><span><a href="#">' + category + '</a></span><div>');

                    App.utils.data_images();
                    App.plugins.popup();

                    return false;
                });
                closePopup.on('click', function () {
                    modalBox.removeClass('opened');
                    modalBox.find('.description_wrap').html('');
                    return false;
                });
            },
            news: () => {

                var modalBox = $('.fear_modalbox');
                var button = $('.fear_news .news_popup, .fear_news .news_list h3 a');
                var closePopup = modalBox.find('.close');

                button.off().on('click', function () {
                    var element = $(this);
                    var parent = element.closest('.list_inner');
                    var content = parent.find('.fear_hidden_content').html();
                    var image = parent.find('.image .main').data('img-url');
                    var title = parent.find('.details h3 a').text();
                    var category = parent.find('.details span').html();

                    modalBox.addClass('opened');
                    modalBox.find('.description_wrap').html(content);
                    modalBox.find('.news_popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="' + image + '"></div></div>');
                    modalBox.find('.news_popup_details .top_image').after('<div class="news_main_title"><h3>' + title + '</h3><span>' + category + '</span><div>');


                    App.utils.data_images();
                    return false;
                });
                closePopup.on('click', function () {
                    modalBox.removeClass('opened');
                    modalBox.find('.description_wrap').html('');
                    return false;
                });
            }
        },

        plugins: {
            headline: () => {
                //set animation timing
                var animationDelay = 2500,
                    //loading bar effect
                    barAnimationDelay = 3800,
                    barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
                    //letters effect
                    lettersDelay = 50,
                    //type effect
                    typeLettersDelay = 150,
                    selectionDuration = 500,
                    typeAnimationDelay = selectionDuration + 800,
                    //clip effect 
                    revealDuration = 600,
                    revealAnimationDelay = 1500;

                initHeadline();


                function initHeadline() {
                    //insert <i> element for each letter of a changing word
                    singleLetters($('.cd-headline.letters').find('b'));
                    //initialise headline animation
                    animateHeadline($('.cd-headline'));
                }

                function singleLetters($words) {
                    $words.each(function () {
                        var word = $(this),
                            letters = word.text().split(''),
                            selected = word.hasClass('is-visible');
                        for (i in letters) {
                            if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                            letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
                        }
                        var newLetters = letters.join('');
                        word.html(newLetters).css('opacity', 1);
                    });
                }

                function animateHeadline($headlines) {
                    var duration = animationDelay;
                    $headlines.each(function () {
                        var headline = $(this);

                        if (headline.hasClass('loading-bar')) {
                            duration = barAnimationDelay;
                            setTimeout(function () { headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
                        } else if (headline.hasClass('clip')) {
                            var spanWrapper = headline.find('.cd-words-wrapper'),
                                newWidth = spanWrapper.width() + 10
                            spanWrapper.css('width', newWidth);
                        } else if (!headline.hasClass('type')) {
                            //assign to .cd-words-wrapper the width of its longest word
                            var words = headline.find('.cd-words-wrapper b'),
                                width = 0;
                            words.each(function () {
                                var wordWidth = $(this).width();
                                if (wordWidth > width) width = wordWidth;
                            });
                            headline.find('.cd-words-wrapper').css('width', width);
                        };

                        //trigger animation
                        setTimeout(function () { hideWord(headline.find('.is-visible').eq(0)) }, duration);
                    });
                }

                function hideWord($word) {
                    var nextWord = takeNext($word);

                    if ($word.parents('.cd-headline').hasClass('type')) {
                        var parentSpan = $word.parent('.cd-words-wrapper');
                        parentSpan.addClass('selected').removeClass('waiting');
                        setTimeout(function () {
                            parentSpan.removeClass('selected');
                            $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
                        }, selectionDuration);
                        setTimeout(function () { showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

                    } else if ($word.parents('.cd-headline').hasClass('letters')) {
                        var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
                        hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
                        showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

                    } else if ($word.parents('.cd-headline').hasClass('clip')) {
                        $word.parents('.cd-words-wrapper').animate({ width: '2px' }, revealDuration, function () {
                            switchWord($word, nextWord);
                            showWord(nextWord);
                        });

                    } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
                        $word.parents('.cd-words-wrapper').removeClass('is-loading');
                        switchWord($word, nextWord);
                        setTimeout(function () { hideWord(nextWord) }, barAnimationDelay);
                        setTimeout(function () { $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

                    } else {
                        switchWord($word, nextWord);
                        setTimeout(function () { hideWord(nextWord) }, animationDelay);
                    }
                }

                function showWord($word, $duration) {
                    if ($word.parents('.cd-headline').hasClass('type')) {
                        showLetter($word.find('i').eq(0), $word, false, $duration);
                        $word.addClass('is-visible').removeClass('is-hidden');

                    } else if ($word.parents('.cd-headline').hasClass('clip')) {
                        $word.parents('.cd-words-wrapper').animate({ 'width': $word.width() + 10 }, revealDuration, function () {
                            setTimeout(function () { hideWord($word) }, revealAnimationDelay);
                        });
                    }
                }

                function hideLetter($letter, $word, $bool, $duration) {
                    $letter.removeClass('in').addClass('out');

                    if (!$letter.is(':last-child')) {
                        setTimeout(function () { hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
                    } else if ($bool) {
                        setTimeout(function () { hideWord(takeNext($word)) }, animationDelay);
                    }

                    if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
                        var nextWord = takeNext($word);
                        switchWord($word, nextWord);
                    }
                }

                function showLetter($letter, $word, $bool, $duration) {
                    $letter.addClass('in').removeClass('out');

                    if (!$letter.is(':last-child')) {
                        setTimeout(function () { showLetter($letter.next(), $word, $bool, $duration); }, $duration);
                    } else {
                        if ($word.parents('.cd-headline').hasClass('type')) { setTimeout(function () { $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200); }
                        if (!$bool) { setTimeout(function () { hideWord($word) }, animationDelay) }
                    }
                }

                function takeNext($word) {
                    return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
                }

                function takePrev($word) {
                    return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
                }

                function switchWord($oldWord, $newWord) {
                    $oldWord.removeClass('is-visible').addClass('is-hidden');
                    $newWord.removeClass('is-hidden').addClass('is-visible');
                }
            },
            progress: () => {
                $('.progress_inner').each(function () {
                    var progress = $(this);
                    var pValue = parseInt(progress.data('value'), 10);
                    var pColor = progress.data('color');
                    var pBarWrap = progress.find('.bar');
                    var pBar = progress.find('.bar_in');

                    pBar.css({ width: pValue + '%', backgroundColor: pColor });
                    setTimeout(() => { pBarWrap.addClass('open'); });
                });
            },
            carousel: () => {

                var carousel = $('.fear_modalbox .owl-carousel');

                carousel.owlCarousel({
                    loop: true,
                    items: 1,
                    lazyLoad: false,
                    margin: 0,
                    autoplay: true,
                    autoplayTimeout: 7000,
                    dots: false,
                    nav: false,
                    navSpeed: false,
                    responsive: {
                        0: {
                            items: 1
                        },
                        768: {
                            items: 1
                        }
                    }
                });

            },
            circular: () => {

                var circVal = 110;

                var colorSchemes = $(':root').css('--main-color');

                $('.circular_progress_bar .myCircle').each(function () {
                    var element = $(this);
                    element.append('<span class="number"></span>');
                    var value = element.data('value');
                    element.circleProgress({
                        size: circVal,
                        value: 0,
                        animation: { duration: 1400 },
                        thickness: 2,
                        fill: colorSchemes,
                        emptyFill: 'rgba(0,0,0,0)',
                        startAngle: -Math.PI / 2
                    }).on('circle-animation-progress', function (event, progress, stepValue) {
                        element.find('.number').text(parseInt(stepValue.toFixed(2) * 100) + '%');
                    });
                    element.circleProgress('value', 1.0);
                    setTimeout(function () { element.circleProgress('value', value); }, 1400);
                });
            },
            menu: () => {

                var hamburger = $('.fear_topbar .trigger .hamburger');
                var mobileMenu = $('.fear_mobile_menu');
                var mobileMenuList = $('.fear_mobile_menu ul li a');

                hamburger.on('click', function () {
                    var element = $(this);

                    if (element.hasClass('is-active')) {
                        element.removeClass('is-active');
                        mobileMenu.removeClass('opened');
                    } else {
                        element.addClass('is-active');
                        mobileMenu.addClass('opened');
                    }
                    return false;
                });

                mobileMenuList.on('click', function () {
                    $('.fear_topbar .trigger .hamburger').removeClass('is-active');
                    mobileMenu.removeClass('opened');
                    return false;
                });
            },
            swiper: () => {
                $('.swiper-section').each(function () {
                    var element = $(this);
                    var container = element.find('.swiper-container');
                    var mySwiper = new Swiper(container, {
                        loop: false,
                        slidesPerView: 1,
                        spaceBetween: 0,
                        loopAdditionalSlides: 1,
                        autoplay: {
                            delay: 6000,
                        },
                        navigation: {
                            nextEl: '.my_next',
                            prevEl: '.my_prev',
                        },
                        pagination: {
                            el: '.this.swiper_progress',
                            type: 'custom', // progressbar
                            renderCustom: function (swiper, current, total) {
                                // progress animation
                                var scale, translateX;
                                var progressDOM = container.find('.fear_swiper_progress');
                                if (progressDOM.hasClass('fill')) {
                                    translateX = '0px';
                                    scale = parseInt((current / total) * 100) / 100;
                                } else {
                                    scale = parseInt((1 / total) * 100) / 100;
                                    translateX = (current - 1) * parseInt((100 / total) * 100) / 100 + 'px';
                                }


                                progressDOM.find('.all span').css({ transform: 'translate3d(' + translateX + ',0px,0px) scaleX(' + scale + ') scaleY(1)' });
                                if (current < 10) { current = '0' + current; }
                                if (total < 10) { total = '0' + total; }
                                progressDOM.find('.current').html(current);
                                progressDOM.find('.total').html(total);
                            }
                        },
                        breakpoints: {
                            700: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            }
                        }
                    });
                });

                App.utils.imgtosvg();
            },
        }
    };

    await App.start();

})(jQuery, window);
