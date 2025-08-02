
const FEAR = (() => {
    const defaultRoutes = {
        "#home": (url) => {
            console.log('home was called...');
            //utils.renderPageTemplate("#home-page-template");
        },
        "#about": (url) => {
            console.log('about was called...');
            //utils.renderPageTemplate("#about-page-template");
        },
        "#contact": (url) => {
            console.log('contact was called...');
            //utils.renderPageTemplate("#contact-page-template");
        }
    }

    return {
        start: async () => {
            return this.load();
        },
        load: () => {
            var speed = 500;
            setTimeout(() => { this.preloader(); }, speed);
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
        router: {
            routes: {},
            init: function () {
                console.log('router was created...');
                this.bindEvents();

                // Manually trigger a hashchange to start the router.
                // This make the render function look for the route called "" (empty string)
                // and call it"s function
                $(window).trigger("hashchange");
            },
            bindEvents: function () {

                // Event handler that calls the render function on every hashchange.
                // The render function will look up the route and call the function
                // that is mapped to the route name in the route map.
                // .bind(this) changes the scope of the function to the
                // current object rather than the element the event is bound to.
                $(window).on("hashchange", this.render.bind(this));
            },
        },
        bind_events: () => {
            $(document).on('click', '[data-link]', (e) => {
                e.preventDefault();//prevent anchor click default behaviour.

                var page = $(this).attr('href');//get url from clicked link.
                var routes = page.substring(0, page.lastIndexOf('.'));//remove file extension that shows up in the url bar.

                window.history.pushState(null, null, routes);//assign new url to address bar and add page in browser history without reloading the page.
                this.render(page);
            }),
                $(window).on('popstate', () => {

                    var url = window.location.href;//get page url from address bar.
                    var routes = url.substring(url.lastIndexOf('/') + 1);//return page route from url.
                    var page = routes != '' ? url + ".html" : "home.html";//if route is empty assign home.html to page to ajax load the default content.

                    console.log(page);
                    this.render(page);
                });
        },
        render: (page) => {

            // Get the keyword from the url.
            var keyName = window.location.hash.split("/")[0];

            // Grab anything after the hash
            var url = window.location.hash;

            // Hide whatever page is currently shown.
            $("#fear_container")
                .find(".active")
                .hide()
                .removeClass("active");

            // Call the the function
            // by key name
            if (this.routes[keyName]) {
                const page = this.routes[keyName];

                $.get(page, (pageContent) => {//return selected page content trough ajax.
                    $("#fear_container").html(pageContent);//load content into main div
                });
            }
        },
        picker: () => {
            if ($('.this.settings').length) {
                // attach background for all colors
                var list = $('.this.settings .colors li a');
                list.each(() => {
                    $(this).css({ backgroundColor: $(this).data('color') });
                });

                // change root color
                list.on('click', () => {
                    var element = $(this);
                    var color = element.data('color');
                    $(':root').css('--main-color', color);
                    return false;
                });
            }
        },
        modal: () => {

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
                            var progressDOM = container.find('.this.swiper_progress');
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
            this.imgtosvg();
        },
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
        my_progress: () => {

        },
        mycarousel: () => {

            var carousel = $('.this.modalbox .owl-carousel');

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
        circular_progress: () => {

        },
        about_popup: () => {
            var button = $('.fear_about .this.button a');
            var close = $('.fear_modalbox .close');
            var modalBox = $('.fear_modalbox');
            var hiddenContent = $('.fear_hidden_content').html();

            button.on('click', function () {
                modalBox.addClass('opened');
                modalBox.find('.description_wrap').html(hiddenContent);
                
                this.data_images();
                this.my_progress();
                this.circular_progress();
                this.mycarousel();
                this.location();
            });
            close.on('click', function () {
                modalBox.removeClass('opened');
                modalBox.find('.description_wrap').html('');
            });
        },
        page_transition: () => {
            var section = $('.fear.section');
            var allLi = $('.transition_link li');
            var button = $('.transition_link a');
            var wrapper = $('.fear.all_wrap');
            var enter = wrapper.data('enter');
            var exit = wrapper.data('exit');

            button.on('click', function () {
                var element = $(this);
                var href = element.attr('href');

                if (element.parent().hasClass('this.button')) {

                    $('.menu .transition_link a[href="' + href + '"]').trigger('click');
                    this.hashtag();

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
        hashtag: () => {

            var ccc = $('.this.header .menu .ccc');
            var element = $('.this.header .menu .active a');

            $('.this.header .menu a').on('mouseenter', function () {
                var e = $(this);
                this.current_link(ccc, e);
            });

            $('.this.header .menu').on('mouseleave', function () {
                element = $('.this.header .menu .active a');
                this.current_link(ccc, element);
                element.parent().siblings().removeClass('mleave');
            });

        },
        current_link: (ccc, ele) => {
            if (!ele.length) { return false; }
            
            var left = ele.offset().left;
            var width = ele.outerWidth();
            var menuleft = $('.this.header .menu').offset().left;
            
            ele.parent().removeClass('mleave');
            ele.parent().siblings().addClass('mleave');

            ccc.css({ left: (left - menuleft) + 'px', width: width + 'px' });
        },
    };

}).start()

/*  
 *  Router - Handles routing and rendering for the order pages
 *
 *  Summary:
 *      - url hash changes
 *      - render function checks routes for the hash changes
 *      - function for that hash gets called and loads page content 
 */
const router = {

    // An object of all the routes
    routes: {},
    init: function () {
        console.log('router was created...');
        this.bindEvents();

        // Manually trigger a hashchange to start the router.
        // This make the render function look for the route called "" (empty string)
        // and call it"s function
        $(window).trigger("hashchange");
    },
    bindEvents: function () {

        // Event handler that calls the render function on every hashchange.
        // The render function will look up the route and call the function
        // that is mapped to the route name in the route map.
        // .bind(this) changes the scope of the function to the
        // current object rather than the element the event is bound to.
        $(window).on("hashchange", this.render.bind(this));
    },
    // Checks the current url hash tag
    // and calls the function with that name
    // in the routes
    render: function () {

        // Get the keyword from the url.
        var keyName = window.location.hash.split("/")[0];

        // Grab anything after the hash
        var url = window.location.hash;

        // Hide whatever page is currently shown.
        $("#page-container")
            .find(".active")
            .hide()
            .removeClass("active");

        // Call the the function
        // by key name
        if (this.routes[keyName]) {
            this.routes[keyName](url);

            // Render the error page if the 
            // keyword is not found in routes.
        } else {
            utils.pageNotFoundError();
        }
    }
};

// Create a new instance of the router
var spaRouter = $.extend({}, router, {
    routes: spaRoutes
});

spaRouter.init();
window.location.hash = "#home";

/*
 * Copyright (c) 2022 Marketify
 * Author: Marketify
 * This file is made for CURRENT TEMPLATE
*/

$(document).ready(function () {

    "use strict";

    // here all ready functions

    this.picker();
    this.modalbox();
    this.page_transition();
    this.trigger_menu();
    this.about_popup();
    this.portfolio_popup();
    this.news_popup();
    this.cursor();
    this.imgtosvg();
    this.popup();
    this.data_images();
    this.contact_form();
    hashtag();
    this.swiper();
    this.headline();
    this.location();
    this.color_switcher();
    this.cursor_switcher();
    this.switcher_opener();

    $(window).load('body', function () {
        this.my_load();
    });

});

// -----------------------------------------------------
// ---------------   FUNCTIONS    ----------------------
// -----------------------------------------------------

// -----------------------------------------------------
// ---------------   COLOR PICKER    -------------------
// -----------------------------------------------------

function this.picker(){

    "use strict";



}

// -------------------------------------------------
// -------------  PROGRESS BAR  --------------------
// -------------------------------------------------

function this.my_progress(){

    "use strict";

}

// -----------------------------------------------------
// ---------------   CIRCULAR PROGRESS   ---------------
// -----------------------------------------------------

function this.circular_progress(){

    "use strict";

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
}

// -----------------------------------------------------
// --------------------   MODALBOX    ------------------
// -----------------------------------------------------

function this.modalbox(){
    "use strict";

    

// -----------------------------------------------------
// -------------   PAGE TRANSITION    ------------------
// -----------------------------------------------------

function this.page_transition(){

    "use strict";


}

// -----------------------------------------------------
// ---------------   TRIGGER MENU    -------------------
// -----------------------------------------------------


function this.trigger_menu(){
    "use strict";

    var hamburger = $('.this.topbar .trigger .hamburger');
    var mobileMenu = $('.this.mobile_menu');
    var mobileMenuList = $('.this.mobile_menu ul li a');

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
        $('.this.topbar .trigger .hamburger').removeClass('is-active');
        mobileMenu.removeClass('opened');
        return false;
    });
}

// -------------------------------------------------
// ---------------  ABOUT POPUP  -------------------
// -------------------------------------------------

function this.about_popup(){

    "use strict";

    var button = $('.this.about .this.button a');
    var close = $('.this.modalbox .close');
    var modalBox = $('.this.modalbox');
    var hiddenContent = $('.this.hidden_content').html();

    button.on('click', function () {
        modalBox.addClass('opened');
        modalBox.find('.description_wrap').html(hiddenContent);
        
        this.data_images();
        this.my_progress();
        this.circular_progress();
        this.mycarousel();
        this.location();
    });
    close.on('click', function () {
        modalBox.removeClass('opened');
        modalBox.find('.description_wrap').html('');
    });
}

// -------------------------------------------------
// -----------  PORTFOLIO POPUP  -------------------
// -------------------------------------------------

function this.portfolio_popup(){

    "use strict";

    var modalBox = $('.this.modalbox');
    var button = $('.this.portfolio .portfolio_popup');
    var closePopup = modalBox.find('.close');

    button.off().on('click', function () {
        var element = $(this);
        var parent = element.closest('.list_inner');
        var content = parent.find('.this.hidden_content').html();
        var image = parent.find('.image .main').data('img-url');
        var title = parent.find('.details h3').text();
        var category = parent.find('.details span').text();
        modalBox.addClass('opened');
        modalBox.find('.description_wrap').html(content);
        modalBox.find('.portfolio_popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="' + image + '"></div></div>');
        modalBox.find('.portfolio_popup_details .top_image').after('<div class="portfolio_main_title"><h3>' + title + '</h3><span><a href="#">' + category + '</a></span><div>');
        this.data_images();
        this.popup();
        return false;
    });
    closePopup.on('click', function () {
        modalBox.removeClass('opened');
        modalBox.find('.description_wrap').html('');
        return false;
    });
}

// -------------------------------------------------
// ----------------  NEWS POPUP  -------------------
// -------------------------------------------------

function this.news_popup(){

    "use strict";

    var modalBox = $('.this.modalbox');
    var button = $('.this.news .news_popup,.this.news .news_list h3 a');
    var closePopup = modalBox.find('.close');

    button.off().on('click', function () {
        var element = $(this);
        var parent = element.closest('.list_inner');
        var content = parent.find('.this.hidden_content').html();
        var image = parent.find('.image .main').data('img-url');
        var title = parent.find('.details h3 a').text();
        var category = parent.find('.details span').html();
        modalBox.addClass('opened');
        modalBox.find('.description_wrap').html(content);
        modalBox.find('.news_popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="' + image + '"></div></div>');
        modalBox.find('.news_popup_details .top_image').after('<div class="news_main_title"><h3>' + title + '</h3><span>' + category + '</span><div>');
        this.data_images();
        return false;
    });
    closePopup.on('click', function () {
        modalBox.removeClass('opened');
        modalBox.find('.description_wrap').html('');
        return false;
    });
}

// -----------------------------------------------------
// ---------------   PRELOADER   -----------------------
// -----------------------------------------------------

function this.preloader(){


}

// -----------------------------------------------------
// -----------------   MY LOAD    ----------------------
// -----------------------------------------------------

function this.my_load(){

    "use strict";

    var speed = 500;
    setTimeout(function () { this.preloader(); }, speed);
}

// -----------------------------------------------------
// ------------------   CURSOR    ----------------------
// -----------------------------------------------------

function this.cursor(){

    "use strict";

    var myCursor = $('.mouse-cursor');

    if (myCursor.length) {
        if ($("body")) {
            const e = document.querySelector(".cursor-inner"),
                t = document.querySelector(".cursor-outer");
            let n, i = 0,
                o = !1;
            window.onmousemove = function (s) {
                o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
            }, $("body").on("mouseenter", "a,.this.topbar .trigger, .cursor-pointer", function () {
                e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
            }), $("body").on("mouseleave", "a,.this.topbar .trigger, .cursor-pointer", function () {
                $(this).is("a") && $(this).closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
            }), e.style.visibility = "visible", t.style.visibility = "visible"
        }
    }
};

// -----------------------------------------------------
// ---------------    IMAGE TO SVG    ------------------
// -----------------------------------------------------

function this.imgtosvg(){

    "use strict";

}

// -----------------------------------------------------
// --------------------   POPUP    ---------------------
// -----------------------------------------------------

function this.popup(){

    "use strict";

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
}

// -----------------------------------------------------
// ---------------   DATA IMAGES    --------------------
// -----------------------------------------------------

function this.data_images(){

    "use strict";

}

// -----------------------------------------------------
// ----------------    CONTACT FORM    -----------------
// -----------------------------------------------------

function this.contact_form(){

    "use strict";

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
}

// -----------------------------------------------------
// --------------    OWL CAROUSEL    -------------------
// -----------------------------------------------------

function this.mycarousel(){

    "use strict";

}

// -----------------------------------------------------
// -------------------    HASHTAG    -------------------
// -----------------------------------------------------

function hashtag() {


}

function currentLink(ccc, e) {
    "use strict";
    if (!e.length) { return false; }
    var left = e.offset().left;
    var width = e.outerWidth();
    var menuleft = $('.this.header .menu').offset().left;
    e.parent().removeClass('mleave');
    e.parent().siblings().addClass('mleave');
    ccc.css({ left: (left - menuleft) + 'px', width: width + 'px' });

}

// -----------------------------------------------------
// ---------------   SWIPER SLIDER    ------------------
// -----------------------------------------------------

function this.swiper(){
    "use strict";


}

// -------------------------------------------------
// -----------------  LOCATION  --------------------
// -------------------------------------------------

function this.location(){

    "use strict";

    var button = $('.href_location');
    button.on('click', function () {
        var element = $(this);
        var address = element.text();
        address = address.replace(/\ /g, '+');
        var text = 'https://maps.google.com/?q=';
        window.open(text + address);
        return false;
    });
}

// -----------------------------------------------------
// ---------------------   SWITCHERS    ----------------
// -----------------------------------------------------

function this.color_switcher(){

    "use strict";

    var list = $('.this.settings .colors li a');

    list.on('click', function () {
        var element = $(this);
        var elval = element.attr('class');
        element.closest('.this.all_wrap').attr('data-color', '' + elval + '');
        //		this.circular_progress();
        return false;
    });
}

function this.cursor_switcher(){

    "use strict";

    var wrapper = $('.this.all_wrap');
    var button = $('.this.settings .cursor li a');
    var show = $('.this.settings .cursor li a.show');
    var hide = $('.this.settings .cursor li a.hide');

    button.on('click', function () {
        var element = $(this);
        if (!element.hasClass('showme')) {
            button.removeClass('showme');
            element.addClass('showme');
        }
        return false;
    });
    show.on('click', function () {
        wrapper.attr('data-magic-cursor', '')
    });
    hide.on('click', function () {
        wrapper.attr('data-magic-cursor', 'hide')
    });

}

function this.switcher_opener(){

    "use strict";

    var settings = $('.this.settings');
    var button = settings.find('.link');

    button.on('click', function () {
        var element = $(this);
        if (element.hasClass('opened')) {
            element.removeClass('opened');
            element.closest('.this.settings').removeClass('opened');
        } else {
            element.addClass('opened');
            element.closest('.this.settings').addClass('opened');
        }
        return false;
    });
}