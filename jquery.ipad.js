jQuery.fn.ipad = function(options){
	var clicking = false;
	var downX = 0;
	var marginLeft;
	var slideWidth = jQuery(this).find(':first-child').width();
	var parent = jQuery(this);
	var nextSlide;
	var noSlides = jQuery(this).children().length;
	var slideSpeed = 1000;
	var downTime, velocityStart, velocity;
	
	var isIpad, clickevent, moveevent, upevent, cssAnimations, vedorPref;
	
	if(!this.find(':first-child').hasClass('current'))
		this.find(':first-child').addClass('current');
	
	getAgent();
	getSlides();
	
	this.children().each(function(){
	
		jQuery(this).bind(clickevent, function(e){
			clicking=true;
			downX = e.pageX;
			velocityStart = downX;
			console.log("VV!!! " + velocityStart);
			marginLeft = parseInt(parent.css('marginLeft'));
			downTime = +new Date();
		});
		
		jQuery(this).bind(moveevent, function(e){
			if(!clicking)
				return false;
			e.preventDefault();
			
			if(+new Date() - downTime > 1000){
				velocityStart = e.pageX;
				console.log("VV!!! " + velocityStart);
				downTime = +new Date();
			}
			
			//If it's an ipad, we have to use the original event to get access to touch info
			if(isIpad){  e = e.originalEvent.touches[0]; }
			
			var moveLeft = getLeftMargin() + parseInt(e.pageX - downX)/5;
			if(cssAnimations){
				parent.css(vendorPref+"transition-duration", "0s");
				parent.css(vendorPref+"transform", "translate3d("+ moveLeft +"px, 0, 0)");
			} else{
				parent.animate({'marginLeft': moveLeft}, 0);
			}
		});
		
		jQuery(this).bind(upevent, function(e){
			clicking = false;
			
			if(e.pageX < downX){
				if(nextSlide.position())
					gotoNextSlide();
				else
					gotoSlide(1);
			}else if(e.pageX > downX){
				if(previousSlide.position())
					gotoPreviousSlide();
				else
					gotoSlide(noSlides);
			}else{
				gotoCurrentSlide();
			}
		});
	
	});
	
	function gotoNextSlide(){
		parent.children('.current').removeClass('current').addClass('inactive');
		nextSlide.removeClass('inactive').addClass('current');

		var moveLeft = 0-nextSlide.position().left;		
		if(cssAnimations){
			parent.css(vendorPref+"transition-duration", slideSpeed+"ms");
			parent.css(vendorPref+"transform", "translate3d("+moveLeft +"px, 0, 0)");			
		}
		else parent.animate({'marginLeft':marginLeft + slideWidth * -1}, 1000);
		
		getSlides();
	}
	function gotoPreviousSlide(){
		parent.children('.current').removeClass('current').addClass('inactive');
		previousSlide.removeClass('inactive').addClass('current');
		
		var moveLeft = previousSlide.position().left * -1;
		
		if(cssAnimations){
			parent.css(vendorPref+"transition-duration", slideSpeed+"ms");
			parent.css(vendorPref+"transform", "translate3d("+ moveLeft +"px, 0, 0)");
		}
		else parent.animate({'marginLeft': moveLeft}, 1000);
		
		getSlides();
	}
	
	function gotoCurrentSlide(){
		if(cssAnimations){
			parent.css(vendorPref+"transition-duration", "500ms");
			parent.css(vendorPref+"transform", "translate3d("+0-currentSlide.position() +"px,0, 0)");
		}
		else parent.animate({ 'marginLeft' : moveLeft});
		
		getSlides();

	}
	
	function gotoSlide(num){
	
		var thisSlide = parent.find(':nth-child('+num+')');
		
		jQuery('.current').removeClass('current').addClass('inactive');
		thisSlide.removeClass('inactive').addClass('current');
		
		moveLeft =  0 - thisSlide.position().left;
		
		if(cssAnimations){
			parent.css(vendorPref+"transition-duration", "1000ms");
			parent.css(vendorPref+"transform", "translate3d("+moveLeft +"px,0, 0)");
		} else
			parent.animate({ 'marginLeft' : moveLeft});
		
		getSlides();
	}

	
	function getAgent(){
		var ua = navigator.userAgent;
		isIpad = (ua.match(/(iPad|iPhone|iPad|Android)/i));
		
	    clickevent = (isIpad) ? "touchstart" : "mousedown";
	    moveevent = (isIpad) ? "touchmove" : "mousemove";
	    upevent = (isIpad) ? "touchend" : "mouseup";
	}
	
	var supports = (function() {  
		var div = document.createElement('div'),  
	      vendors = 'Khtml Ms Webkit'.split(' '),  
	      len = vendors.length;  
	  
	   return function(prop) {  
	      if ( prop in div.style ) return true;  
	  
	      prop = prop.replace(/^[a-z]/, function(val) {  
	         return val.toUpperCase();  
	      });  
	  
	      while(len--) {  
	         if ( vendors[len] + prop in div.style ) {    
	         	vendorPref = "-" + vendors[len].toLowerCase() + "-";
	            return true;  
	         }  
	      }  
	      return false;  
	   };  
	})(); 
	
	
	//Fix weird flash on first move
	if ( supports('transform') ) { 
		console.log(vendorPref);
		cssAnimations = true;
		parent.css(
			vendorPref+"transform", "translate3d(-1px, 0, 0)"
		).css(vendorPref+"transition-property", 'translate3d');
	} 
	
	function getSlides(){
		currentSlide = $('.current');
		nextSlide = $('.current').next();
		previousSlide = $('.current').prev();	
	}
	
	function getLeftMargin(){
		if(cssAnimations){
			left = parent.css('-webkit-transform');
			left = left.replace('translate3d(', '');
			left = left.replace('px, 0px, 0px','');
			if(left == 'none') left = -1;
			else left = parseFloat(left);
		} else
			left = parseInt(parent.css('marginLeft'));
		
		console.log(left);
		
		return left;
	}

	return( this );
}