/** 
 *	Tippy Popup
 *
 *	Written by Adam Passey
 *	https://github.com/adampassey/Tippy-Popup
 *
 *	By default, Tippy will show when the object is clicked,
 *	and hide when the user clicks 'off the object.' Tippy
 *	can also be used to act as a tooltip on input fields
 *	by setting the showEvent to 'focus' and hideEvent to 'blur.'
 *
 *	Example of tooltip usage on an input field (note: Tippy
 *	will not be interactable with this implementation, but 
 *	will act only as a tooltip popup).
 *
 *	jQuery('.searchField').tippy({
 *		showEvent: 'focus',
 *		hideEvent: 'blur',
 *		message: 'Just type in some keywords and search away my friend!',
 *		topOffset: 30,
 *		leftOffset: 20
 *	});
 */

(function(jQuery) {
	jQuery.fn.tippy = function(options) {
	
		//defaults
		var defaults = {
			followMouse: false,
			showEvent: 'click',
			hideEvent: 'clickOff',
			topOffset: 20,
			leftOffset: -20,
			fadeTopOffset: 10,
			fadeLeftOffset: 0,
			speed: 200,
			opacity: 1.0,
			useAltAsMsg: true,
			message: 'This is the default tooltip message.',
			popupClass: 'default',
		};
		
		//extend options	
		var options = jQuery.extend(defaults, options);
			
		return this.each(function() {
		
			//get the object
			var obj = jQuery(this);
			
			//get the popup
			var pop = jQuery("#tippyPopup");
			
			//this will be called regardless of
			//whether or not followMouse is set
			obj.bind(options.showEvent,function(e) {
		
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
				
				//	set the binding for the hide
				if( options.hideEvent == 'clickOff' ) {
					//	if they click off of the window,
					//	hide the popup
					jQuery('html').bind('click',function() {
					  jQuery.fn.tippy.hide();
					});
				} else {
					jQuery('html').unbind('click');
					obj.bind( options.hideEvent, function(e) {
						jQuery.fn.tippy.hide();
					});	
				}
				//	stop the bubbling
				e.stopPropagation();
				
				//	prevent default
				e.preventDefault();
			
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
				jQuery('#tippyPopup').removeClass().addClass(options.popupClass);
			}
			
			//udpate the message displayed by the popup
			obj.updateMsg = function(options) {
			
				if( options.useAltAsMsg == true ) {
					msg = jQuery(obj).attr("title");
					if( !msg ) {
						msg = options.message;
					}
				} else {
					msg = options.message;
				}	
			
				jQuery('#tippyPopup').find(".msg span").html(msg);	
			}
			
			//update the popups position and fade it in
			obj.updatePos = function(top,left,options) {
				
				//place the tooltip in the 'fade offset' position
				jQuery('#tippyPopup').css({
				    top: top + options.topOffset + options.fadeTopOffset,
				    left: left + options.leftOffset + options.fadeLeftOffset
				});
				
				//animate it to the proper position
				jQuery('#tippyPopup').stop().animate({
					top: top + options.topOffset + 'px',
					left: left + options.leftOffset + 'px',
					opacity: options.opacity
				}, options.speed);
				
			}
			
			//fade the popup out
			obj.hidePopup = function(options) {
				
				//get the popups current position
				var pos = jQuery('#tippyPopup').offset();
				
				jQuery('#tippyPopup').stop().animate({
					top: pos.top + options.fadeTopOffset + 'px',
					left: pos.left + options.fadeLeftOffset + 'px',
					opacity: 0
				}, options.speed, function() {
					jQuery('#tippyPopup').css({
						top: 0,
						left: -9999
					});
				});
			}

			
		}); //end fo return this.each
	};
}) (jQuery);

//	for external use
jQuery.fn.tippy.hide = function() {
	jQuery('#tippyPopup').stop().animate({
	 	opacity: 0
	 }, 200);
	 jQuery('#tippyPopup').css({
	 	top: '-100px',
	 	left: '-100px'
	 });
};

jQuery(document).ready(function() {

	jQuery("body").append('<div id="tippyPopup" class="default"><div class="msg"><span></span></div></div>');
	
	jQuery("a").each(function() {
		if( jQuery(this).attr("rel") == 'tippy' ) {
			jQuery(this).tippy();
		}
	});
});