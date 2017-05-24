'use strict';

var rfr = require('rfr');
var _ = require('lodash');
var Component = rfr('src/component');
var matter = require('gray-matter');

class Parser {

	/**
	 * Parses components from source content.
	 *
	 * @param {String} source
	 * @param {String} [extension]
	 * @return {Array.<Component>}
	 */
	parse(content, extension) {
		var components = _(getDocBlocks(content, extension))
			.map(parseDocBlock)
			.filter()
			.thru(Component.merge)
			.value();

		return components;
	}
}

function getDocBlocks(fileContent, fileExtension) {
	return isMarkdown(fileExtension)
		? getMarkdownDocBlocks(fileContent)
		: getSourceCodeDocBlocks(fileContent);
}

function isMarkdown(fileExtension) {
	return _.includes(['markdown', 'mdown', 'md'], fileExtension);
}

function getMarkdownDocBlocks(fileContent) {
	return [fileContent];
}

function getSourceCodeDocBlocks(fileContent) {
	var docBlocks = fileContent.match(/\/\*([\s\S]+?)\*\//g);

	// Removes extraneous asterisks from the start & end of comment blocks
	docBlocks = _.map(docBlocks, (docBlock) => /\/\*[\s\*]*([\s\S]+?)?[ \t\*]*\*\//g.exec(docBlock)[1]);

	return docBlocks;
}

// @todo Refactor below

function parseDocBlock(docBlock) {
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
	_.forEach(blocks, function(block) {
		var matches = block.match(/```\s*([^\.\s]+)\.(\w+)(.*)\n/);
		var name = matches ? matches[1] : null;
		var extension = matches ? matches[2] : null;
		var optionsString = matches ? matches[3] : '';

		if (!name) {
			// Unnamed examples are not renderable
			return;
		}

		var content = block
			.replace(/```.*\n/m, '')  // Removes leading ```[extension]
			.replace(/\n```.*/m, '');  // Removes trailing ```

		var options = _(optionsString)
			.split(' ')
			.transform(function(options, optionStr) {
				var parts = optionStr.split('=');
				var name = parts[0];
				var value = parts[1];
				options[name] = value;
			}, {})
			.value();

		var block = {
			extension: extension,
			content: content,
			hidden: _.has(options, 'hidden'),
		};

		if (options.height) {
			block.height = options.height;
		}

		blocksByExample[name] = blocksByExample[name] || [];
		blocksByExample[name].push(block);
		optionsByExample[name] = optionsByExample[name] || {};

		var height = optionsByExample[name].height || options.height;
		if (height) {
			optionsByExample[name].height = height;
		}
	});

	_.forEach(blocksByExample, function(blocks, exampleName) {
		var options = optionsByExample[exampleName];
		component.addExample(exampleName, blocks, options);
	});

	var hasExample = {};

	// Adds <example> tags for renderable HTML examples
	_.forEach(component.getExamples(), function(example, name) {
		var exampleHtml = example.options.height
			? '<example name="' + name + '" height="' + example.options.height + '"></example>\n'
			: '<example name="' + name + '"></example>\n';

		description = description.replace(
			new RegExp('```\\s*' + name + '\\.(html|jsx|handlebars|hbs)', 'gm'),
			function(match, extension) {
				if (hasExample[name]) {
					return '```' + extension;
				}
				else {
					hasExample[name] = true;
					return exampleHtml + '```' + extension;
				}
			}
		);
	});

	// Removes hidden blocks
	description = description.replace(/\n?```[^\n]+hidden(?:.*\n)+?```/g, '');

	// Removes custom block annotations
	description = description.replace(/```([^\.\s,]+)\.(\w+)(?:,(\S+))?/g, '```$2');

	return description;
}

module.exports = Parser;
