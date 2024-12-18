	
 
 
$(document).ready(function() {
    $( window ).scroll(function() {
          var height = $(window).scrollTop();
          if(height >= 100) {
              $('header').addClass('fixed-menu');
          } else {
              $('header').removeClass('fixed-menu');
          }
      });
  });




  

 $(document).ready(function(){

		$('.slider-divu').owlCarousel({
	   loop: true,
	   margin:30,
	   autoplay:true,
	   nav:false,
	   dots:true,
	   responsive: {
		   0: {
			   items:1
		   },
		   600: {
			   items:1
		   },
		   667: {
			 items:1
		   },
		   1000: {
			   items:3
		   }
	   }
	})


	$('.omonlsidert').owlCarousel({
		loop: true,
		margin:30,
		autoplay:false,
		nav:true,
		dots:false,
		responsive: {
			0: {
				items:1
			},
			600: {
				items:1
			},
			667: {
			  items:1
			},
			1000: {
				items:1
			}
		}
	 })

	
   
	
$('.slider-testi-20').owlCarousel({
	loop: true,
	margin:30,
	autoplay:true,
	nav:false,
	dots:true,
	responsive: {
	  0: {
		items:1
	  },
	  375: {
		items:1
	  },
	  600: {
		  items:1
	  },
	  667: {
		items:2
	  },
	  1000: {
		  items:2
	  },
	  1024: {
		items:3
	  },
	  1200: {
		items:3
	  }
  
	}
  })

  $('.slider-oi').owlCarousel({
	loop: true,
	margin:30,
	autoplay:true,
	nav:false,
	dots:true,
	responsive: {
	  0: {
		items:1
	  },
	  375: {
		items:2
	  },
	  600: {
		  items:2
	  },
	  667: {
		items:2
	  },
	  896: {
		  items:3
	  },
	  1024: {
		items:3
	  },
	  1180: {
		items:3
	  },
	  1200: {
		items:4
	  }
  
	}
  })


		$('.slider-div').owlCarousel({
		loop: true,
		margin:40,
		autoplay:true,
		nav:false,
		dots:true,
		responsive: {
			0: {
				items:1
			},
			600: {
				items:1
			},
			667: {
			items:1
			},
			768: {
				items:2
			},
			1000: {
				items:2
			}
		}
	})
  
});









$(document).ready(function(){
	$('.slider-testi').owlCarousel({
	loop: true,
	margin:30,
	autoplay:true,
	nav:false,
	dots:true,
	responsive: {
		0: {
			items:1
		},
		600: {
			items:1
		},
		667: {
		items:1
		},
		1000: {
			items:1
		}
	}
})

});



$(document).ready(function(){
	$('.like-slide ').owlCarousel({
	loop: true,
	margin:30,
	autoplay:true,
	nav:false,
	dots:true,
	responsive: {
		0: {
			items:1
		},
		600: {
			items:1
		},
		667: {
		items:2
		},
		1000: {
			items:4
		}
	}
})



});



// counting js
$(document).ready(function(){
var a = 0;
$(window).scroll(function() {

  var oTop = $('#counter').offset().top - window.innerHeight;
  if (a == 0 && $(window).scrollTop() > oTop) {
    $('.counter-value').each(function() {
      var $this = $(this),
        countTo = $this.attr('data-count');
      $({
        countNum: $this.text()
      }).animate({
          countNum: countTo
        },

        {

          duration: 2000,
          easing: 'swing',
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
            //alert('finished');
          }

        });
    });
    a = 1;
  }

});

});
  //  bank js
$(document).ready(function(){
  $("#customRadio1").click(function(){
    $("#ac-2").hide();
  });
  $("#customRadio1").click(function(){
    $("#ac-1").show();
  });
   $("#customRadio2").click(function(){
    $("#ac-1").hide();
  });
  $("#customRadio2").click(function(){
    $("#ac-2").show();
  });
});



// products list grid js
$(document).ready(function() {
	$('#list').click(function(event){event.preventDefault();$('#products .item').addClass('list-group-item');});
	$('#grid').click(function(event){event.preventDefault();$('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item');});
	$('#list').click(function(event){event.preventDefault();$('#products .item').removeClass('grid-group-item');});
  });
  
  $(document).ready(function(){
  $('.listed-bn ul li a').click(function(){
	$('.listed-bn li a').removeClass("active");
	$(this).addClass("active");
  });
  });


  
$(document).ready(function () {
	var sync1 = $("#sync1");
	var sync2 = $("#sync2");
	var slidesPerPage = 4; //globaly define number of elements per page
	var syncedSecondary = true;
  
	sync1
	  .owlCarousel({
		items: 1,
		slideSpeed: 2000,
		nav: false,
		autoplay: false,
		dots: false,
		loop: true,
		responsiveRefreshRate: 200,
		
	  })
	  .on("changed.owl.carousel", syncPosition);
  
	sync2
	  .on("initialized.owl.carousel", function () {
		sync2.find(".owl-item").eq(0).addClass("current");
	  })
	  .owlCarousel({
		items: slidesPerPage,
		dots: true,
		nav: false,
		smartSpeed: 200,
		slideSpeed: 500,
		slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
		responsiveRefreshRate: 100
	  })
	  .on("changed.owl.carousel", syncPosition2);
  
	function syncPosition(el) {
	  //if you set loop to false, you have to restore this next line
	  //var current = el.item.index;
  
	  //if you disable loop you have to comment this block
	  var count = el.item.count - 1;
	  var current = Math.round(el.item.index - el.item.count / 2 - 0.5);
  
	  if (current < 0) {
		current = count;
	  }
	  if (current > count) {
		current = 0;
	  }
  
	  //end block
  
	  sync2
		.find(".owl-item")
		.removeClass("current")
		.eq(current)
		.addClass("current");
	  var onscreen = sync2.find(".owl-item.active").length - 1;
	  var start = sync2.find(".owl-item.active").first().index();
	  var end = sync2.find(".owl-item.active").last().index();
  
	  if (current > end) {
		sync2.data("owl.carousel").to(current, 100, true);
	  }
	  if (current < start) {
		sync2.data("owl.carousel").to(current - onscreen, 100, true);
	  }
	}
  
	function syncPosition2(el) {
	  if (syncedSecondary) {
		var number = el.item.index;
		sync1.data("owl.carousel").to(number, 100, true);
	  }
	}
  
	sync2.on("click", ".owl-item", function (e) {
	  e.preventDefault();
	  var number = $(this).index();
	  sync1.data("owl.carousel").to(number, 300, true);
	});
  });



// quantity
(function () {
    "use strict";
    var jQueryPlugin = (window.jQueryPlugin = function (ident, func) {
      return function (arg) {
        if (this.length > 1) {
          this.each(function () {
            var $this = $(this);
  
            if (!$this.data(ident)) {
              $this.data(ident, func($this, arg));
            }
          });
  
          return this;
        } else if (this.length == 1) {
          if (!this.data(ident)) {
            this.data(ident, func(this, arg));
          }
  
          return this.data(ident);
        }
      };
    });
  })();
  
  (function () {
    "use strict";
    function Guantity($root) {
      const element = $root;
      const quantity = $root.first("data-quantity");
      const quantity_target = $root.find("[data-quantity-target]");
      const quantity_minus = $root.find("[data-quantity-minus]");
      const quantity_plus = $root.find("[data-quantity-plus]");
      var quantity_ = quantity_target.val();
      $(quantity_minus).click(function () {
        quantity_target.val(--quantity_);
      });
      $(quantity_plus).click(function () {
        quantity_target.val(++quantity_);
      });
    }
    $.fn.Guantity = jQueryPlugin("Guantity", Guantity);
    $("[data-quantity]").Guantity();
  })();


  // rating js 






  
  $(document).ready(function () {
	$('.navbar .dmenu').hover(function () {
			$(this).find('.sm-menu').first().stop(true, true).slideDown(150);
		}, function () {
			$(this).find('.sm-menu').first().stop(true, true).slideUp(105)
		});
	}); 
	 
		$(document).ready(function() {
		$(".megamenu").on("click", function(e) {
			e.stopPropagation();
		});
	});
	