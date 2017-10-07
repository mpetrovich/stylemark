'use strict';

var rfr = require('rfr');
var _ = require('lodash');
var Component = rfr('src/component');
var matter = require('gray-matter');
var dir = require('node-dir');
var path = require('path');

class Parser {

	/**
	 * @param {string} dirpath
	 * @param {object} options
	 * @param {Function} callback
	 * @param {Array} options.filesToIgnore List of file pattern regexes to ignore
	 */
	parseDir(dirpath, options = {}, callback = _.noop) {
		var docs = [];

		var filesToIgnore = [
			'.git/',
			'node_modules/',
		].concat(options.filesToIgnore || []);

		dir.readFiles(
			dirpath,
			(error, content, filepath, next) => {
				if (error) {
					console.error(error);
					return next();
				}

				let isIgnoredFile = _.some(filesToIgnore, pattern => (new RegExp(pattern)).test(filepath));
				if (isIgnoredFile) {
					return next();
				}

				try {
					let language = path.extname(filepath).substr(1);
					docs = docs.concat(this.parse(content, language));
				}
				catch (e) {
					console.error(`Error parsing "${filepath}": ${e}`);
				}

				next();
			},
			error => {
				callback(error, docs);
			}
		);
	}

	/**
	 * Parses components from source content.
	 *
	 * @param {String} source
	 * @param {String} [language]
	 * @return {Array.<Component>}
	 */
	parse(content, language) {
		var components = _(getDocBlocks(content, language))
			.map(parseDocBlock)
			.filter()
			.thru(Component.merge)
			.value();

		return components;
	}
}

function getDocBlocks(content, language) {
	return isMarkdown(language)
		? getMarkdownDocBlocks(content)
		: getSourceCodeDocBlocks(content);
}

function isMarkdown(language) {
	return _.includes(['markdown', 'mdown', 'md'], language);
}

function getMarkdownDocBlocks(content) {
	return [content];
}

function getSourceCodeDocBlocks(content) {
	var docBlocks = content.match(/\/\*([\s\S]+?)\*\//g);

	// Removes extraneous asterisks from the start & end of comment blocks
	docBlocks = _.map(docBlocks, (docBlock) => /\/\*[\s\*]*([\s\S]+?)?[ \t\*]*\*\//g.exec(docBlock)[1]);

	return docBlocks;
}

// @todo Refactor below

function parseDocBlock(docBlock) {

	if (!_.isString(docBlock)) {
		// Malformed docblock
		return null;
	}

	var markdown = matter(docBlock);

	if (!markdown.data.name) {
		// A component must have a name
		return null;
	}

	var component = new Component();
	component.setName(markdown.data.name);
	component.setCategory(markdown.data.category);

	var metadata = _.omit(markdown.data, ['name', 'category']);

	_.forEach(metadata, (value, key) => {
		if (_.isArray(value)) {
			// List
			_.forEach(value, (item) => component.addMeta(key, item));
		}
		else {
			// Single
			component.addMeta(key, value);
		}
	});

	var description = parseDescriptionMarkdown(markdown.content, component);
	component.setDescription(description);

	return component;
}

function parseDescriptionMarkdown(markdown, component) {
	var description = markdown;

	// Extracts blocks from description
	var blocks = description.match(/```(.*\n)+?```/g);

	var blocksByExample = {};
	var optionsByExample = {};

	// Extracts examples from description blocks
	_.forEach(blocks, (block) => {
		var matches = block.match(/```\s*([^\.\s]+)\.(\w+)(.*)\n/);
		var name = matches ? matches[1] : null;
		var language = matches ? matches[2] : null;
		var optionsString = matches ? matches[3] : '';

		if (!name) {
			// Unnamed examples are not renderable
			return;
		}

		var content = block
			.replace(/```.*\n/m, '')  // Removes leading ```[language]
			.replace(/\n```.*/m, '');  // Removes trailing ```

		var options = _(optionsString)
			.split(' ')
			.transform((options, optionStr) => {
				var parts = optionStr.split('=');
				var name = parts[0];
				var value = parts[1];
				options[name] = value;
			}, {})
			.value();

		var block = {
			language: language,
			content: content,
			hidden: _.has(options, 'hidden'),
		};

		blocksByExample[name] = blocksByExample[name] || [];
		blocksByExample[name].push(block);
		optionsByExample[name] = optionsByExample[name] || {};

		var height = optionsByExample[name].height || options.height;
		if (height) {
			optionsByExample[name].height = height;
		}
	});

	_.forEach(blocksByExample, (blocks, exampleName) => {
		var options = optionsByExample[exampleName];
		component.addExample(exampleName, blocks, options);
	});

	var hasExample = {};

	// Adds <example> tags for renderable HTML examples
	_.forEach(component.getExamples(), (example, name) => {
		var exampleHtml = example.options.height
			? '<example name="' + name + '" height="' + example.options.height + '"></example>\n'
			: '<example name="' + name + '"></example>\n';

		description = description.replace(
			new RegExp('```\\s*' + name + '\\.(html|jsx|handlebars|hbs)', 'gm'),
			(match, language) => {
				if (hasExample[name]) {
					return '```' + name + '.' + language;
				}
				else {
					hasExample[name] = true;
					return exampleHtml + '```' + name + '.' + language;
				}
			}
		);
	});

	// Removes hidden blocks
	description = description.replace(/\n?```[^\n]+hidden(?:.*\n)+?```/g, '');

	// Removes custom block annotations
	description = description.replace(/```([^\.\s,]+)\.(\w+)(?:,(\S+))?/g, '```$1.$2');

	return description;
}

module.exports = new Parser();
