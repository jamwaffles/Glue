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

	function glue(target) {
		var $el = target.$el;
		var options = target.options;

		if($el.hasClass('glue-fixed')) {
			var $element = $el.next('.glue-clone');
		} else {
			var $element = $el;
		}

		var element = $element[0];
		var top = element.getBoundingClientRect().top;

		var stuckTop = top <= 0;
		var stuckBottom = top - document.documentElement.clientHeight > 0;

		var left = $el.offset().left;

		if(stuckBottom || stuckTop) {
			if(!$el.next('.glue-clone').length) {
				var clone = $el.clone();

				clone.addClass('glue-clone').css({
					width: $el.width(),
					height: $el.height()
				}).empty();

				$el.after(clone);
			}

			target.stuck = true;
		}

		var fixedClass = 'glue-fixed' + (options.style ? ' glue-style' : '');

		var properties = {
			left: left
		};

		if(options.style) {
			properties.width = target.$container.width();
		}

		if(stuckTop && target.stickToTop) {
			properties.top = options.offsetTop;

			$el.css(properties).addClass(fixedClass);
		} else if(stuckBottom && target.stickToBottom) {
			properties.bottom = 0;

			$el.css(properties).addClass(fixedClass);
		} else if(target.stuck === true) {
			$el.removeClass('glue-fixed').css({ width: '', height: '' });
			$el.next('.glue-clone').remove();

			target.stuck = false;
		}
	}

	$.fn.glue = function(options) {
		options = $.extend({}, defaults, options);

		return this.each(function() {
			if($.inArray(this, glueTargets) == -1) {
				var target = {
					$el: $(this),
					$container: $(this).closest('.glue-container').length ? $(this).closest('.glue-container') : $('body'),
					options: options,
					stickToTop: $(this).hasClass('glue-top'),
					stickToBottom: $(this).hasClass('glue-bottom')
				};

				glueTargets.push(target);

				glue(target);
			}
		});
	}

	$(window).on('scroll.glue', function() {
		for(var i = 0; i < glueTargets.length; i++) {
			glue(glueTargets[i]);
		}
	});
}));