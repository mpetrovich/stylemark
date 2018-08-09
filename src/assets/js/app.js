(function($) {
	$(function() {

		// Highlight.js syntax highlighting
		hljs.configure({
			tabReplace: '    ',
		});
		hljs.initHighlighting();

		// Bootstrap tooltips
		$('[data-toggle="tooltip"]').tooltip();

		// Click-to-copy
		(function() {
			var elements = document.querySelectorAll('[data-clipboard-text]');
			var clipboard = new Clipboard(elements);

			clipboard.on('success', function(e) {
				setText($(e.trigger), 'Copied!');
			});
			clipboard.on('error', function(e) {
				setText($(e.trigger), 'Error!');
			});

			function setText(element, text) {
				element.text(text);
				window.setTimeout(function() {
					element.text('Copy');
				}, 3000);
			}
		})();

		// Search filter
		$('.i-sidebar-item-filter').keyup(function(event) {
			var $input = $(this);
			var query = $input.val().trim();
			var selector = query ? '[data-filter-value*="' + query + '" i]' : '[data-filter-value]';

			if (event.keyCode === 27) {
				// Escape key pressed
				resetSearch($input);
			}

			$input.parent('.i-search-input').toggleClass('has-value', !!query);

			$('.i-page__sidebar [data-filter-value]').css('display', 'none');
			$('.i-page__sidebar ' + selector).css('display', 'block');
		});

		// Search filter reset
		function resetSearch($input) {
			$input.siblings('.i-sidebar-item-filter').val('');
			$input.parent('.i-search-input').removeClass('has-value');
			$('.i-page__sidebar [data-filter-value]').css('display', 'block');
		}

		$('.i-search-input-reset').click(function() {
			resetSearch($(this));
		});

		// Lazy-loaded iframes
		lazyframe('[lazyframe]', {
			lazyload: false,
			onAppend: function(iframe) {
				// delay the iFrameResize call to allow the iframeResizer.contentWindow.min.js script
				// to load in the iframe first
				setTimeout(function() {
					$(iframe)
						.attr('id', 'frame-' + Math.random().toString().substr(2))
						.iFrameResize({
							heightCalculationMethod: 'lowestElement',
							warningTimeout: 10000,
						});
				}, 100);
			},
		});

		// Only loads iframes once they're visible
		inView('[lazyframe]').on('enter', function(elem) {
			$(elem).click();
		});

		// Prefixes all section links with the element name
		$('.i-library').each(function() {
			var $library = $(this);
			var librarySlug = $library.attr('id');

			$library.find('[id]').attr('id', function(index, id) {
				return librarySlug + '-' + id;
			});

			$library.find('a[href^="#"]').attr('href', function(index, href) {
				if (href.startsWith('#category-')) {
					// Preserve hash
					return href;
				}
				else {
					// Prefix hash
					return href.replace(/^#(.*)/, '#' + librarySlug + '-$1');
				}
			});
		});

		// Mobile nav select
		$('.i-nav-select').change(function() {
			var slug = $(this).find('option:selected').val();
			window.location.hash = slug;
		});

		// Code block toggle
		$('.i-code-block__lang.-collapsible').click(function() {
			var $lang = $(this);
			$lang.find('i').toggleClass('fa-caret-right').toggleClass('fa-caret-down');
			$lang.siblings('.i-code-block__content').toggleClass('hidden');
		});

	});
})(jQuery);
