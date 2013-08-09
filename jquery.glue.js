// Stick to top/bottom of screen on scroll
// .glue
// .glue-container
// .glue-bottom

// RequireJS support
(function(factory) {
	if(typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	var glueTargets = [];

	var defaults = {
		offsetTop: 0,
		style: true
	}

	function glue(el, options) {
		if(el.hasClass('glue-fixed')) {
			var element = el.next('.glue-clone');
		} else {
			var element = el;
		}

		var parent = element.closest('.glue-container').length ? el.closest('.glue-container') : $('body');

		var stuckTop = element.offset().top <= $(window).scrollTop() + options.offsetTop + parseInt(element.css('margin-top'), 10);
		var stuckBottom = element.offset().top >= $(window).scrollTop() + $(window).height() - element.outerHeight(false) + 10;

		var left = el.offset().left;

		if(stuckBottom || stuckTop) {
			if(!el.next('.glue-clone').length) {
				var clone = el.clone();

				clone.addClass('glue-clone').css({
					width: el.width(),
					height: el.height()
				}).empty();

				el.after(clone);
			}
		}

		var fixedClass = 'glue-fixed' + (options.style ? ' glue-style' : '');

		var properties = {
			left: left
		};

		if(options.style) {
			properties.width = parent.width();
		}

		if(stuckTop && el.hasClass('glue-top')) {
			properties.top = options.offsetTop;

			el.css(properties).addClass(fixedClass);
		} else if(stuckBottom && el.hasClass('glue-bottom')) {
			properties.bottom = 0;

			el.css(properties).addClass(fixedClass);
		} else {
			el.removeClass('glue-fixed').css({ width: '', height: '' });
			el.next('.glue-clone').remove();
		}
	}

	$.fn.glue = function(options) {
		options = $.extend({}, defaults, options);

		return this.each(function() {
			if($.inArray(this, glueTargets) == -1) {
				this.glueOptions = options;

				glueTargets.push(this);

				glue($(this), options);
			}
		});
	}

	$(window).on('scroll.glue', function() {
		$.each(glueTargets, function() {
			glue($(this), this.glueOptions);
		});
	});
}));