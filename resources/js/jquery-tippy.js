(function($) {
	$.fn.tippy = function(options) {
	
		//defaults
		var defaults = {
			followMouse: false,
			topOffset: 20,
			leftOffset: -20,
			fadeTopOffset: 10,
			fadeLeftOffset: 0,
			speed: 200,
			opacity: 1.0,
			useAltAsMsg: true,
			message: 'This is the default tooltip message.',
			popupClass: 'default'
		};
		
		//extend options	
		var options = $.extend(defaults, options);
			
		return this.each(function() {
		
			//get the object
			var obj = $(this);
			
			//get the popup
			var pop = $("#tippyPopup");
			
			//on hover
			//this will be called regardless of
			//whether or not followMouse is set
			obj.mouseover(function(e) {
		
				//update the popup class
				obj.updateClass(options);
			
				//update the msg
				obj.updateMsg(options);

				//if the popup doesn't follow the mouse
				if( !options.followMouse ) {
				
					//get the position of the object
					pos = obj.offset();
				
					//update the position
					obj.updatePos(pos.top,pos.left,options);
				} else {
					//update with mouse position
					obj.updatePos(e.PageY,e.pageX,options);
				}
			
			//on hover out	
			});
			
			obj.mouseout(function() {
			
				//hide the popup
				obj.hidePopup(options);
			});
			
			//if followMouse is set to true, the popups position
			//will be updated when the mouse is moving over
			//the object.
			if( options.followMouse == true ) {
				obj.mousemove(function(e) {
					pop.animate({
						top: e.pageY + options.topOffset + 'px',
						left: e.pageX + options.leftOffset + 'px'
					},10);				
				});
			}
			
			obj.updateClass = function(options) {
				$('#tippyPopup').removeClass().addClass(options.popupClass);
			}
			
			//udpate the message displayed by the popup
			obj.updateMsg = function(options) {
			
				if( options.useAltAsMsg == true ) {
					msg = $(obj).attr("title");
					if( !msg ) {
						msg = options.message;
					}
				} else {
					msg = options.message;
				}	
			
				$('#tippyPopup').find(".msg span").text(msg);	
			}
			
			//update the popups position and fade it in
			obj.updatePos = function(top,left,options) {
				
				//place the tooltip in the 'fade offset' position
				$('#tippyPopup').css({
				    top: top + options.topOffset + options.fadeTopOffset,
				    left: left + options.leftOffset + options.fadeLeftOffset
				});
				
				//animate it to the proper position
				$('#tippyPopup').stop().animate({
					top: top + options.topOffset + 'px',
					left: left + options.leftOffset + 'px',
					opacity: options.opacity
				}, options.speed);
				
			}
			
			//fade the popup out
			obj.hidePopup = function(options) {
				
				//get the popups current position
				var pos = $('#tippyPopup').offset();
				
				$('#tippyPopup').stop().animate({
					top: pos.top + options.fadeTopOffset + 'px',
					left: pos.left + options.fadeLeftOffset + 'px',
					opacity: 0
				}, options.speed, function() {
					$('#tippyPopup').css({
						top: 0,
						left: -9999
					});
				});
			}

			
		}); //end fo return this.each
	};
}) (jQuery);

$(document).ready(function() {

	$("body").append('<div id="tippyPopup" class="default"><div class="msg"><span></span></div></div>');
	
	$("a").each(function() {
		if( $(this).attr("rel") == 'tippy' ) {
			$(this).tippy();
		}
	});
});