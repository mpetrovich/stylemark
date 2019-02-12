'use strict';

var path = require('path');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var path = require('path');
var Handlebars = require('./handlebars');
var marked = require('./marked');
var babel = require('babel-core');

var docTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/doc.handlebars'), 'utf8');
var exampleTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/example.handlebars'), 'utf8');
var indexTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/index.handlebars'), 'utf8');

class Generator {

	generate(docs, destination, options = {}) {
		mkdirp(destination, error => {
			if (error) {
				console.error(`Unable to create destination directory: ${error}`, error.stack);
				return;
			}

			// Copies stylemark assets
			fs.copySync(
				path.resolve(__dirname, 'assets'),
				path.resolve(destination, '_stylemark')
			);

			// Copies logo asset
			let logo = _.get(options, 'theme.logo', '');
			if (logo && !logo.startsWith('http')) {
				fs.copySync(
					path.resolve(options.baseDir, logo),
					path.resolve(options.output, logo)
				);
			}

			// Copies favicon asset
			let favicon = options.favicon || '';
			if (favicon && !favicon.startsWith('http')) {
				fs.copySync(
					path.resolve(options.baseDir, favicon),
					path.resolve(options.output, favicon)
				);
			}

			// Copies user assets
			if (options.assets) {
				_.forEach(options.assets, (asset) => {
					fs.copySync(
						path.resolve(options.baseDir, asset),
						path.resolve(options.output, asset)
					);
				});
			}

			// Copies theme css
			if (_.has(options, 'theme.css')) {
				_(options.theme.css)
					.reject(asset => asset.startsWith('http'))
					.forEach(asset => {
						fs.copySync(
							path.resolve(options.baseDir, asset),
							path.resolve(options.output, asset)
						);
					});
			}

			// Copies theme js
			if (_.has(options, 'theme.js')) {
				_(options.theme.js)
					.reject(asset => asset.startsWith('http'))
					.forEach(asset => {
						fs.copySync(
							path.resolve(options.baseDir, asset),
							path.resolve(options.output, asset)
						);
					});
			}

			// Copies example css
			if (_.has(options, 'examples.css')) {
				_(options.examples.css)
					.reject(asset => asset.startsWith('http'))
					.forEach(asset => {
						fs.copySync(
							path.resolve(options.baseDir, asset),
							path.resolve(options.output, asset)
						);
					});
			}

			// Copies example js
			if (_.has(options, 'examples.js')) {
				_(options.examples.js)
					.reject(asset => asset.startsWith('http'))
					.forEach(asset => {
						fs.copySync(
							path.resolve(options.baseDir, asset),
							path.resolve(options.output, asset)
						);
					});
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

			let html = Handlebars.compile(indexTemplate)({
				name: options.name,
				sidebar: _.get(options, 'theme.sidebar', {}),
				logo,
				favicon,
				groups,
				options,
			});

			let filepath = path.resolve(destination, 'index.html');
			fs.writeFile(filepath, html, 'utf8', error => error ? console.error(error, error.stack) : null);
		});
	}

	generateDoc(doc, destination, options = {}) {
		doc.slug = _.kebabCase(doc.name);
		doc.filepathRelativeToInput = path.relative(options.input, doc.filepath);

		if (doc.description) {
			// Replaces <example> tags with <iframe> tags
			doc.description = doc.description.replace(
				/<example name="([^"]+)"( height="\d+")?><\/example>/g,
				`<div class="i-example">
					<h5 class="i-example__heading">
						<a
							href="${doc.slug}-$1.html"
							target="_blank"
							class="plain-link"
							data-toggle="tooltip"
							data-placement="top"
							title="Open in a new window"
						>
							<i class="fa fa-external-link-square fa-fw"></i>
							Example
						</a>
					</h5>
					<div class="i-example__body">
						<div
							class="i-example__iframe"
							lazyframe
							data-src="${doc.slug}-$1.html"
							data-initinview="true"
							data-title="Loading..." $2
						></div>
					</div>
				</div>\n`
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
		var filepath = path.resolve(destination, `${doc.slug}-${example.slug}.html`);

		fs.writeFile(filepath, output, 'utf8', error => error ? console.error(error, error.stack) : null);
	}
}

module.exports = new Generator();
