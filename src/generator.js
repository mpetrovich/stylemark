'use strict';

var rfr = require('rfr');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var path = require('path');
var Handlebars = rfr('src/handlebars');
var marked = rfr('src/marked');
var babel = require('babel-core');

var docTemplate = fs.readFileSync(path.join(__dirname, 'templates/doc.handlebars'), 'utf8');
var exampleTemplate = fs.readFileSync(path.join(__dirname, 'templates/example.handlebars'), 'utf8');
var indexTemplate = fs.readFileSync(path.join(__dirname, 'templates/index.handlebars'), 'utf8');

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
					var order = _.isEmpty(options.order) ? ['-Other'] : options.order;
					var normalizedCategoryOrder = _.map(order, category => category.replace(/^[-+]/, ''));
					var orderIndex = _.indexOf(normalizedCategoryOrder, category);
					var isLast = (orderIndex !== -1) ? order[orderIndex].startsWith('-') : null;

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
							rank = orderIndex - order.length;
						}
					}
					// Unspecified category order
					else {
						rank = 0;
					}

					return {
						rank: rank,
						key: category,
						slug: category.toLowerCase(),
						docs: docs,
					};
				})
				.sortBy(['rank', 'key'])
				.value();

			// Copies stylemark assets
			fs.copy(
				path.join(__dirname, 'assets'),
				path.join(destination, '_stylemark'),
				error => error ? console.log(error) : null
			);

			// Copies logo asset
			let logo = options.logo || '';
			if (logo && !logo.startsWith('http')) {
				fs.copy(
					path.join(options.input, logo),
					path.join(options.output, logo),
					error => error ? console.log(error) : null
				);
			}

			// Copies favicon asset
			let favicon = options.favicon || '';
			if (favicon && !favicon.startsWith('http')) {
				fs.copy(
					path.join(options.input, favicon),
					path.join(options.output, favicon),
					error => error ? console.log(error) : null
				);
			}

			// Copies user-defined assets
			if (options.assets) {
				_.forEach(options.assets, (asset) => {
					fs.copy(
						path.join(options.input, asset),
						path.join(options.output, asset),
						error => error ? console.log(error) : null
					);
				});
			}

			let html = Handlebars.compile(indexTemplate)({
				name: options.name,
				sidebar: options.sidebar,
				logo,
				favicon,
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
						<a
							href="${doc.slug}-$1.html"
							target="_blank"
							class="fa fa-external-link-square fa-fw plain-link"
							title="Open in a new window"
						></a>
						Example
					</h5>
					<div class="i-example__body">
						<div
							class="i-example__iframe"
							lazyframe
							data-src="${doc.slug}-$1.html"
							data-initinview="true"
							data-title="Loading…"
							$2
						></div>
					</div>
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
					block.content = babel.transform(block.content, { presets: ['babel-preset-react'] }).code;

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
		var filepath = path.join(destination, `${doc.slug}-${example.slug}.html`);

		fs.writeFile(filepath, output, 'utf8', error => error ? console.log(error) : null);
	}
}

module.exports = new Generator();
