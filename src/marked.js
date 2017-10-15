var marked = require('marked', {
	gfm: true,
	breaks: true,
});
var renderer = new marked.Renderer();
var _ = require('lodash');

renderer.table = function(header, body) {
	return '<table class="table">'
		+ '<thead>' + header + '</thead>'
		+ '<tbody>' + body + '</tbody>'
		+ '</table>';
};

renderer.heading = function(text, level) {
	var html;

	if (level <= 2) {
		var slug = _.kebabCase(text);
		var link = '<a href="#' + slug + '" class="icon-link i-section__link -heading"></a>';

		html = '<div id="' + slug + '" class="i-pad-top-5 i-section">'
			+ '<h' + level + ' class="i-pad-top-3 i-position-container">'
			+ link + text
			+ '</h' + level + '>'
			+ '</div>';
	}
	else {
		html = '<h' + level + '>'
			+ text
			+ '</h' + level + '>';
	}

	return html;
};

renderer.code = function(code, name) {
	name = name || '';
	var parts = name.split('.');
	var lang = parts.pop();
	var name = parts.pop();
	var escaped = _.escape(code);
	var initialState = name ? 'hidden' : '';
	var icon = name ? '<i class="fa fa-caret-right fa-fw"></i>' : '';
	var collapsible = name ? '-collapsible' : '';
	var highlightLang = getHighlightLang(lang);
	return `
<div class="i-code-block">
	<button type="button" class="i-code-block__lang ${collapsible}">${icon} ${lang}</button>
	<div class="i-code-block__content ${initialState}">
		<button type="button" class="btn btn-outline-primary btn-sm i-copy-button" data-clipboard-text="${escaped}" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Copy</button>
		<pre class="mb-0"><code class="lang-${highlightLang}">${escaped}</code></pre>
	</div>
</div>`;
};

function getHighlightLang(lang) {
	return {
		angularjs: 'js',
	}[lang] || '';
}

module.exports = function(markdown) {
	markdown = (markdown || '').toString();
	return marked(markdown, { renderer: renderer });
};
