var $banner, $item, barH, topH, scrollTop, topS, hS, lastScrollTop, flag, timer, $pText, $pLoad;
	$banner = $('.banner');
	$item = $banner.find("li a");
	$pLoad = $("#txt-loading");
	$pText = ["Let's have some fun."];

/*function fSize() {
	"use strict";
	var wHeight = window.innerHeight || document.documentElement.offsetHeight || document.documentElement.clientHeight,
			i = wHeight / $item.length,
			r = Math.min(i / 2, 30);
	$item.css("font-size", r);
}*/

function resize() {
	"use strict";
	//fSize();
	var fullH = $(window).outerHeight();
	var maxH = fullH;
	if(maxH>700) { maxH = 700; }
	$(".fullH").height(fullH);
	$(".maxH").height(maxH);
	$("html.desktop").getNiceScroll().resize();
	topH = maxH - barH;
	/*if($("#projects.slider").length > 0) {
		topS = fullH;
		$banner.css({"top": 0, "position" : "absolute"});
		topH = topS + barH;
	} else {
		$banner.removeAttr("style").removeClass("invisible");
	}*/
}

function menu() {
	"use strict";
		var i = 1,
		e = setTimeout(function() {
			$banner.removeClass("closing contact-in active go-blog");
			$('.form_msg').remove();
		}, 450);
		return i ? $("body").bind("touchmove", function(n) {
				n.preventDefault();
		}) : ($("body").unbind("touchmove"), $banner.addClass("closing"), clearTimeout(e)), $banner.toggleClass("open", i), !1;
}

function ready() {
	"use strict";
	showFirstPage();
	barH = $banner.outerHeight();
	lastScrollTop = 0,
	flag = 1;
	/*var ias = jQuery.ias({
		container:  '.archived',
		item:       '.item',
		pagination: '#pagination',
		next:       '.next a'
	});*/
	// Add a loader image which is displayed during loading
	/*ias.extension(new IASSpinnerExtension({
    html: '<div class="loading-more"><div class="title">Just a sec</div></div>', // optionally
	}));*/
	if ( $( "#contact-form" ).length ) {
		$.validator.addMethod('answercheck', function (value, element) {
			var test = null; //Perform your test here        
			return this.optional(element) || test;
		}, "type the correct answer -_-");
		$('#contact-form').each(function() {   // <- selects every <form> on page
			$(this).validate({
				ignore: ".ignore",
				errorPlacement: function(error, element) {  },
				rules: {
					name: {
							required: true,
							minlength: 2
					},
					ctrl: {
							answercheck: true
					},
					email: {
							required: true,
							email: true
					},
				},
				submitHandler: function(form) {
					$('.validateform button').prop('disabled', true);
					var data = {
						action: 'contact_ajax',
						security : MyAjax.security,
					};
					var postData = $(form).serializeArray();
					for (var key in data) {
						if (data.hasOwnProperty(key)) {
							postData.push({name:key, value:data[key]});
						}
					}
					$.post(MyAjax.ajaxurl, postData, function(response) {
						var parsed_json = jQuery.parseJSON(response);
						if (parsed_json != 0){
							var msg = $(form).parent();
							//$form.addClass("invisible").find('label').css('cursor','default');
							msg.append(parsed_json);
							$('.form_msg').removeClass("invisible").addClass("visible");
							$(form)[0].reset();
							return false;	
						}
					});
					return false;	
				}
				
			});
		});
	}
	//end formvalidator
	$("body").on("click", ".nav li a, .logo a, .project .read-more, .project .open, #about-us .read-more", function(e){
		e.preventDefault(); var $this = $(this); var $parent = $this.parent(), href = $this.attr("href");
		
		if ( ($this.hasClass("open-contact")) || ($parent.hasClass("open-contact")) || ($this.hasClass("open-blog")) || ($parent.hasClass("open-blog")) ) {
			return true;
		} else {
		
		if(history.pushState) {
						
			if ( $banner.hasClass( "open" ) ) {
				if(location.href===href) {
					$('html, body').scrollTop(0);
				} else {
					loadPage(href);
					setTimeout(function() {
						history.pushState({page: href}, null, href);
					}, 400);			
				}
				setTimeout(function() {
					$banner.removeClass("closing contact-in active go-blog open");
				}, 500);
			} else {
				if(location.href===href) {
					TweenLite.to( window, 1, {scrollTo: {y: 0, autoKill:false} });
				} else {
					if ( ($this.hasClass("active")) || ($parent.hasClass("active")) | (href===location.href) ) {
						return true;
					} else {
						loadPage(href);
						setTimeout(function() {
							history.pushState({page: href}, null, href);
						}, 400);			
					} 
				}
				
			}		
			
		}
			
		}
		
	}).on("click", "#toggle", function(e){
		e.preventDefault(); // When btn is pressed.
		if ( $banner.hasClass( "active" ) ) {
			menu();
		} else {
			if ( $banner.hasClass( "contact-in" ) ) {
				$banner.removeClass("contact-in");
			} else if($banner.hasClass( "go-blog" ) ) {
				$banner.removeClass("go-blog");
			} else {
				menu();
			}
		}
	}).on("click", "#back-top", function(e){
		e.preventDefault();
		TweenLite.to( window, 1, {scrollTo: {y: 0, autoKill:false} });
	}).on("click", "#slider-top", function(e){
		e.preventDefault();
		$("html, body").scrollTop(0);
		//$('.slider').slick("slickGoTo", 0);
		$("body, html").addClass("no-scroll");
		$("body").addClass("loading");
		TweenLite.to( $(".preloader"), 1, {autoAlpha:1 });
		setTimeout(function() {
			TweenLite.to( $(".preloader"), 1, {autoAlpha:0 });
			TweenLite.to( $(".header.home"), 0, {autoAlpha:0 });
			$("body").removeClass("loading");
		}, 2000);
		// setTimeout(function() {
		// 	$(".txt-loading").removeClass("invisible");
		// 	//$('.slider').slick('slickPlay');
		// 	$("html, body").removeClass("no-scroll");
		// 	$("html.desktop").getNiceScroll().resize();
		// 	$(window).trigger('resize');
		// }, 400);
	}).on("click", "#more_posts", function(e){
		e.preventDefault(); // When btn is pressed.
		if($(this).hasClass('disable')) { return true; }
		else { 
			$("#more_posts").addClass("disabled"); // Disable the button, temp.
			load_posts();
		}
	}).on("click", ".controls .pause", function(e){
		e.preventDefault(); // When btn is pressed.
		$('.slider').slick('slickPause');
		$(this).removeClass('pause').addClass('play');
	}).on("click", ".controls .play", function(e){
		e.preventDefault(); // When btn is pressed.
		$('.slider').slick('slickPlay');
		$('.slider').slick('slickNext');
		$(this).addClass('pause').removeClass('play');
	}).on("click", ".open-contact a", function(e){
		e.preventDefault(); // When btn is pressed.
		if($(this).closest("#menu-footer").length>0) {
			$banner.addClass("contact-in active open");
		} else {
			$banner.addClass("contact-in");
		}
	}).on("click", ".open-blog a", function(e){
		e.preventDefault(); // When btn is pressed.
		if($(this).closest("#menu-footer").length>0) {
			$banner.addClass("go-blog active open");
		} else {
			$banner.addClass("go-blog");
		}
	}).on("click", "#close-menu", function(e){
		e.preventDefault(); // When btn is pressed.
		$banner.removeClass("closing contact-in open");
	}).on("click", "#close-blog", function(e){
		e.preventDefault(); // When btn is pressed.
		$banner.removeClass("go-blog");
	}).on("click", ".go-down", function(e){
		e.preventDefault(); // When btn is pressed.
		var fuller = $(this).closest(".section"),
        section = fuller.next().offset().top;

    TweenLite.to( window, 1, {scrollTo: {y: section-barH, autoKill:false} });
	}).on("click", ".tag-ajax", function(e){
		e.preventDefault(); // When btn is pressed.
		var $this = $(this),
		tagID = $this.attr("ID");
		
		if($this.hasClass('current')) {
			$($this).removeClass("current"); 
		} else {
			$($this).addClass("current"); 
		}
		
		// var tempValues = {};
		// $(".tag-ajax.current").each(function(){
		// 	 var th= $(this);
		// 	 tempValues[th.html()] = th.attr('id');
		//  });
		// console.log( tempValues);
		// //$("#loading-animation").show();

		// var data = {
		// 	action: 'load_filter',
		// 	security : MyAjax.security,
		// 	tag: tempValues
		// };
		// $.post(MyAjax.ajaxurl, data, function(response) {
		// 	var parsed_json = jQuery.parseJSON(response);
		// 	if (parsed_json != 0){
		// 		//console.log(parsed_json);
		// 		$("#projects-grid").html(parsed_json);
				
		// 		//jQuery.ias().reinitialize(); 
		// 		//$("#loading-animation").hide();
		// 		return false;
		// 	}
		// });
		
	});
	
	$('.play-button').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedBgPos: true,
		fixedContentPos: false
	});
	
}

window.addEventListener('load', function() {
	"use strict";
	var timeout = null;
  setTimeout(function() {
		clearTimeout(timeout);
    window.addEventListener('popstate', function() {
			timeout = setTimeout(function() {
				loadPage(location.pathname);
			}, 50);
    });
  }, 0);
});

function reBuild() {
	"use strict";
	resize();
	$(window).trigger('resize');
	//jQuery.ias().reinitialize(); 
	if($(".slider").length > 0) {
		$(".slider").on('init', function(event, slick){
			if($("li.go-down").length <= 0) {
				$('<li class="go-down">&#65516;</li>').insertAfter( ".slick-dots li:last-child" );
			}
			hS = $("#projects.slider").outerHeight();
			/*if($(".controls").length <= 0) {
				$('<li class="controls"><button tabindex="0" aria-required="false" role="button" data-role="none" class="pause" type="button">Pause</button></li>').insertAfter( ".slick-dots li:last-child" );
			}*/
		}).slick({
			dots: true,
			speed: 800,
			autoplay: false,
			arrows: false,
			// autoplaySpeed: 45000,
			// infinite: true,
			pauseOnHover: false,
			pauseOnDotsHover: true
		});
	}
	if($("#press").length > 0) {
		$("#press").slick({
			dots: false,
			// speed: 800,
			autoplay: false,
			arrows: false,
			// autoplaySpeed: 45000,
			// infinite: true,
			fade: true,
			cssEase: 'linear',
			// pauseOnHover: true,
			// pauseOnDotsHover: false
		});
	}
}

function preloader() {
	"use strict";
	//var num = 0; 
	var num = Math.floor((Math.random() * 4) + 0);
	$(".txt-loading").text($pText[num]);
	$pLoad.shuffleLetters();
	window.setInterval(function () {
			// increase by num 1, reset to 0 at 4
			if(flag===1) {
				num = (num + 1) % 4;
				$pLoad.shuffleLetters({
					"text": $pText[num]
				});
			}
	}, 3000); // repeat forever, polling every 3 seconds
	
}

function showFirstPage() {
	"use strict";
	$("html.desktop").niceScroll({
		cursorcolor: "#5b5b5a",
		cursorborder: "0px solid #fffef8",
		cursorwidth: "5px",
		cursorborderradius: "0px",
		zindex: "12",
		scrollspeed: "80",
		mousescrollstep: "60",
		bouncescroll: "true",
	});
	TweenLite.to( $(".preloader"), 1, {autoAlpha:1 });
	$("body").addClass("loading"), setTimeout(function() {
		$(".txt-loading").removeClass("invisible");
		preloader();
		function action() {
			showPage(); hidePage();
		}
		function bgimg() {
			$('.main-wrapper img').waitForImages({
					finished: function() {
						action();
						//alert("done");
					},
					each: function() {
						 // ...
					},
					waitForAll: true
			});
		}
		var s = $(".main-wrapper img").length;
		if (s===0) { bgimg(); }
		else { var o = 0;
			$(".main-wrapper img").one("load", function() {}).each(function() {
				this.complete && $(this).load(), o++;
				if(o >= s) { bgimg();}
			});
		}
	}, 400);
}

function loadPage(href) {
	"use strict"; 
	TweenLite.to( $(".preloader"), 1, {autoAlpha:1 });
	$("body").addClass("loading"), setTimeout(function() {
		$(".txt-loading").removeClass("invisible");
		flag = 1;
		preloader();
		$("body, html").addClass("no-scroll");
  }, 400), setTimeout(function() {
		$(".main-wrapper").load(href + " .main-content", function() {
			function action() {
				// showPage(); hidePage();
			}
			function bgimg() {
				$('.main-wrapper img').waitForImages({
						finished: function() {
							action();
							//alert("done");
						},
						each: function() {
							 // ...
						},
						waitForAll: true
				});
			}
			var s = $(".main-wrapper img").length;
			if (s===0) { bgimg(); }
			else { var o = 0;
				$(".main-wrapper img").load(function() {
					o++;
					if(o >= s) { bgimg(); }
				});
			}

		});
	}, 400);
}

function showPage() {
	"use strict";
	 $("html, body").removeClass("no-scroll");
	 var i = 1, e = setTimeout(function() {
		$("html, body").scrollTop(0);
		window.setInterval(function () {
			if( ($(".preloader").hasClass("finished")) && (flag==1)) {
				
				setTimeout(function() {
					TweenLite.to( $(".preloader"), 1, {autoAlpha:0 });
					$("body").removeClass("loading");
					$(".txt-loading").addClass("invisible");
					flag = 0;
				}, 350);
			}
		}, 1000); // repeat forever, polling every 3 seconds
	}, 1e3);

	return i ? $("body").bind("touchmove", function(n) {
			n.preventDefault();
	}) : clearTimeout(e), !1;

}

function hidePage() {
	"use strict";
	$("body, html").removeClass("no-scroll");
	reBuild();
	if($(".section:first").hasClass("bg") || $("#projects.slider").length > 0) {
		$banner.removeClass("invert");
	} else {
		$banner.addClass("invert");
	}
	
}

$(window).scroll( function(){
	"use strict";
	scrollTop = $(this).scrollTop();
	
	/*if($("#projects.slider").length > 0) {
		
		if (scrollTop > lastScrollTop){
			
			clearTimeout( timer );
			timer = setTimeout(function() {
				if ( scrollTop < topS ) { 
					TweenLite.to( window, .7, {scrollTo: {y: topS, autoKill:false} });
					flag = 0;
				} 
			}, 100);
					
		} else {
			
			clearTimeout( timer );
			timer = setTimeout(function() {
				if ( (scrollTop > topS) && (scrollTop < (topS+hS)) ) { 
					TweenLite.to( window, .7, {scrollTo: {y: topS, autoKill:false} });
					flag = 0;
				} 
			}, 100);
			
		}		
		
		lastScrollTop = scrollTop;

	}*/

	$('.desktop .fader').each(function(i) {
		var $this = $(this);
		var height = $this.outerHeight();
		var offset = Math.abs($this.offset().top),
		offset2 = offset + height / 2;
		var calc = 1 - (scrollTop - offset2 + (height/2)) / ((height/3)*2.5);
		var top = offset - scrollTop;
			if ( calc > '1' ) {
				calc = 1;
			} else if ( calc < '0' ) {
				calc = 0;
			}
			TweenLite.to($this.children(), 0, {'opacity':calc});
	});
	
	if ( scrollTop > topH ) { 
		if ( $banner.hasClass( "open" ) ) { return true; } else {
			$banner.addClass( "bg" );
			if($("#projects.slider").length > 0) { $('.slider').slick('slickPause'); }
		}
	 } else {
		$banner.removeClass( "bg" );
		if($("#projects.slider").length > 0) { $('.slider').slick('slickPlay'); }
	}
	/*if ( $banner.hasClass( "open" ) ) { return true; } else {
		if($("#projects.slider").length > 0) {
			
			if( scrollTop < topS ) {
				if ($banner.attr("style")) {
					return true;
				} else {
					$banner.removeClass("invisible");
					$banner.css({"top": 0, "position" : "absolute"});
				}
			} else if ( (scrollTop < topS) && (scrollTop > (topS-barH)) ) {
				$banner.addClass("invisible");
			} else {
				if ( $banner.hasClass( "invisible" ) ) {
					$banner.removeAttr("style");
					$banner.removeClass("invisible");
				}
			}
			
			console.log(scrollTop+' d   '+topS+'    '+scrollTop > (topS-barH));
					
		}
		
	}*/
	
});


$(document).ready(ready);
$(window).resize(resize);