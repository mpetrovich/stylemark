'use strict';

var rfr = require('rfr');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var path = require('path');
var Handlebars = rfr('src/handlebars');
var marked = rfr('src/marked');
var babel = require('babel-core');

var docTemplate = fs.readFileSync(path.join(__dirname, 'template/doc.handlebars'), 'utf8');
var exampleTemplate = fs.readFileSync(path.join(__dirname, 'template/example.handlebars'), 'utf8');
var indexTemplate = fs.readFileSync(path.join(__dirname, 'template/index.handlebars'), 'utf8');

class Generator {

	generate(docs, destination, options = {}) {
		mkdirp(destination, error => {
			if (error) {
				console.error(`Unable to create destination directory: ${error}`);
				return;
			}

			docs = _(docs)
				.sortBy('name')
				.map(doc => {
					doc.html = this.generateDoc(doc, destination, options);
					return doc;
				})
				.value();

			let groups = _(docs)
				.groupBy(doc => doc.category || 'Other')
				.map((docs, category) => {
					var categoryOrder = _.isEmpty(options.categoryOrder) ? ['-Other'] : options.categoryOrder;
					var normalizedCategoryOrder = _.map(categoryOrder, category => category.replace(/^-/, ''));
					var orderIndex = _.indexOf(normalizedCategoryOrder, category);
					var isLast = (orderIndex !== -1) ? categoryOrder[orderIndex].startsWith('-') : null;

					// Lower ranks will be listed first
					var rank;

					// Explicit category order
					if (orderIndex !== -1) {
						if (isLast) {
							// rank > 0 for explicit categories to list last
							rank = orderIndex + 1;
						}
						else {
							// rank < 0 for explicit categories to list first
							rank = orderIndex - categoryOrder.length;
						}
					}
					// Unspecified category order
					else {
						rank = 0;
					}

					return {
						rank: rank,
						key: category,
						docs: docs,
					};
				})
				.sortBy(['rank', 'key'])
				.value();

			// Copies static assets
			fs.copy(path.join(__dirname, 'asset'), destination, error => error ? console.log(error) : null);

			// Copies logo asset
			let logo;
			if (options.logo && options.logo.startsWith('http')) {
				logo = options.logo;
			}
			else if (options.logo) {
				logo = path.join(destination, 'asset', 'img', path.basename(options.logo));

				fs.copy(
					path.join(options.input, options.logo),
					logo,
					error => error ? console.log(error) : null
				);
			}
			else {
				logo = '';
			}

			let html = Handlebars.compile(indexTemplate)({
				name: options.name,
				logo: logo,
				sidebar: options.sidebar,
				groups
			});

			let filepath = path.join(destination, 'index.html');
			fs.writeFile(filepath, html, 'utf8', error => error ? console.log(error) : null);
		});
	}

	generateDoc(doc, destination, options = {}) {
		doc.slug = _.kebabCase(doc.name);

		if (doc.description) {
			// Replaces <example> tags with <iframe> tags
			doc.description = doc.description.replace(
				/<example name="([^"]+)"( height="\d+")?><\/example>/g,
				`<div class="i-example">
					<h5 class="i-example__heading">
						Example
						<a
							href="html/${doc.slug}-$1.html"
							target="_blank"
							class="fa fa-external-link"
							data-toggle="tooltip"
							data-placement="top"
							title="View in its own window"
						></a>
					</h5>
					<div
						class="i-example__iframe"
						lazyframe
						data-src="html/${doc.slug}-$1.html"
						data-initinview="true"
						data-title="Loading…"
						$2
					></div>
				</div>\n`
			);

				// Adds 'table' class to <table> tags
			doc.description = doc.description.replace(
				/<table/g,
				'<table class="table"'
			);

			// Replaces <info|success|warning|danger> tags with alert divs
			doc.description = doc.description.replace(
				/<(info|success|warning|danger)>([\s\S]*?)<\/\1>/g,
				function(match, tag, content) {
					var html = marked(content);
					var icon = {
						info: 'fa fa-info-circle',
						success: 'fa fa-check-circle',
						warning: 'fa fa-exclamation-triangle',
						danger: 'fa fa-exclamation-circle',
					}[tag];

					return `<div class="alert alert-${tag}"><i class="${icon}" style="float: left; margin-right: 7px;"></i>${html}</div>`;
				}
			);
		}

		// Transpiles JSX examples into vanilla JS React calls
		var webpackAppPath = options.webpackAppPath ? options.webpackAppPath + '.' : '';

		_.forEach(doc.examples, example => {
			example.blocks = _.map(example.blocks, block => {
				if (block.language === 'jsx') {
					var preset = path.join(__dirname, '../node_modules/babel-preset-react');
					block.content = babel.transform(block.content, { presets: [preset] }).code;

					// Prefixes React.createElement(Component) component names with the exported library name (ie. Library.Component)
					block.content = block.content.replace(
						/React\.createElement\(\s*([A-Z][^,]+),/g,
						'React.createElement(' + webpackAppPath + '$1,'
					);
				}
				return block;
			});
		});

		_.forEach(doc.examples, example => this.generateExample(doc, example, destination, options));

		var output = Handlebars.compile(docTemplate)({ doc });
		return output;
	}

	generateExample(doc, example, destination, options = {}) {
		example.slug = _.kebabCase(example.name);

		var output = Handlebars.compile(exampleTemplate)({ doc, example, options });
		var directory = path.join(destination, 'html');
		var filepath = path.join(directory, `${doc.slug}-${example.slug}.html`);

		mkdirp(directory, (error) => {
			if (error) {
				console.error(error);
			}
			else {
				fs.writeFile(filepath, output, 'utf8', error => error ? console.log(error) : null);
			}
		});
	}
}

module.exports = new Generator();
