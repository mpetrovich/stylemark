(function($) {
	$(function() {

		// Highlight.js syntax highlighting
		hljs.configure({
			tabReplace: '    ',
		});
		hljs.initHighlighting();

		// Bootstrap tooltips
		$('[data-toggle="tooltip"]').tooltip();

		// Sidebar search filter
		var $elements = $('.i-sidebar-list-item');

		$('.i-sidebar-item-filter').keyup(function() {
			var $filter = $(this);
			var searchText = $filter.val();
			var searchRegex = new RegExp(searchText, 'i');

			$filter.toggleClass('has-value', !!searchText);

			if (!searchText) {
				$('.i-sidebar-list-group').removeClass('i-filtered i-hidden-by-filter i-shown-by-filter');
				return;
			}

			$('.i-sidebar-list-group').each(function() {
				var $group = $(this);
				var isEmpty = true;

				$group.addClass('i-filtered');

				$group.find('.i-sidebar-list-item').each(function() {
					var $element = $(this);
					var isMatch = ($element.attr('data-element-name').search(searchRegex) !== -1);

					$element.toggleClass('i-hidden-by-filter', !isMatch);
					$element.toggleClass('i-shown-by-filter', isMatch);

					isEmpty = isEmpty && !isMatch;
				});

				$group.toggleClass('i-hidden-by-filter', isEmpty);
				$group.toggleClass('i-shown-by-filter', !isEmpty);
			});
		});

		// i-search-input-reset
		$('.i-search-input-reset').click(function() {
			$(this).siblings('input').val('').removeClass('has-value');
			$('.i-sidebar-list-group, .i-sidebar-list-item').removeClass('i-filtered i-hidden-by-filter i-shown-by-filter');
		});

		// Lazy-loaded iframes
		lazyframe('[lazyframe]', {
			lazyload: true,
			debounce: 50,
			onAppend: function(iframe) {
				$(iframe)
					.attr('id', 'frame-' + Math.random().toString().substr(2))
					.iFrameResize({
						heightCalculationMethod: 'lowestElement',
						warningTimeout: 10000,
					});
			},
		});

		// Prefixes all section links with the element name
		$('.i-library').each(function() {
			var $library = $(this);
			var librarySlug = $library.attr('id');

			$library.find('[id]').attr('id', function(index, id) {
				return librarySlug + '-' + id;
			});

			$library.find('a[href*="#"]').attr('href', function(index, href) {
				return href.replace(/^#(.*)/, '#' + librarySlug + '-$1');
			});
		});

	});
})(jQuery);
