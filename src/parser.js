var rfr = require('rfr');
var _ = require('lodash');
var Doc = rfr('src/doc');
var matter = require('gray-matter');

/**
 * @constructs
 */
function Parser() {}

/* ---------------------------------------------------------------------
 * Public
 * --------------------------------------------------------------------- */

/**
 * Parses docs from source content.
 *
 * @param {String} source
 * @param {String} [syntax]
 * @return {Array.<Doc>}
 */
Parser.prototype.parse = function(content, syntax) {
	var commentBlocks = getCommentBlocks(content, syntax);
	var docs = _.map(commentBlocks, function(commentBlock) {
		return parseMarkdown(commentBlock);
	});
	docs = _.flatten(docs);
	docs = Doc.merge(docs);

	return docs;
};

/* ---------------------------------------------------------------------
 * Private
 * --------------------------------------------------------------------- */

function getCommentBlocks(content, syntax) {
	var commentBlocks;

	if (syntax === 'markdown') {
		commentBlocks = [content];
	}
	else {
		commentBlocks = getJsCommentBlocks(content);
	}

	return commentBlocks;
}

function getJsCommentBlocks(content) {
	var commentBlockRegex = /\/\*([\s\S]+?)\*\//g;
	var commentBlocks = content.match(commentBlockRegex);

	commentBlocks = _.map(commentBlocks, function(commentBlock) {
		// Removes comment block start/end dividers such as ***
		return /\/\*[\s\*]*([\s\S]+?)\n?[\s\*]*\*\//g.exec(commentBlock)[1];
	});

	return commentBlocks;
}

function parseMarkdown(content) {
	var docs = [];
	var doc = new Doc();
	var parsed = matter(content);
	var name;

	if (parsed.data.name) {
		name = parsed.data.name;
	}
	else {
		// No name available or inferrable, so bailing
		return docs;
	}

	doc.setName(name);
	doc.setCategory(parsed.data.category);

	var metas = _.omit(parsed.data, ['name', 'category'])

	_.forEach(metas, function(meta, key) {
		if (_.isArray(meta)) {
			_.forEach(meta, function(value) {
				doc.addMeta(key, value);
			});
		}
		else {
			doc.addMeta(key, meta);
		}
	});

	var description = parseDescriptionMarkdown(parsed.content, doc);
	doc.setDescription(description);

	docs = [doc];

	return docs;
}

function parseDescriptionMarkdown(markdown, doc) {
	var description = markdown;

	description = description.trim();

	// Unescapes leading escaped @ symbols
	description = description.replace(/^\\@/gm, '@');

	// Replaces escaped pipes '\|' with '&#124;' to allow pipe characters in Markdown table cells
	// @see http://stackoverflow.com/questions/17319940/how-to-escape-a-pipe-char-in-a-code-statement-in-a-markdown-table/17320389#17320389
	description = description.replace(/\\\|/g, '&#124;');

	// Replaces escaped '\<' with 'lt;'
	description = description.replace(/\\</g, '&lt;');

	// Extracts blocks from description
	var blocks = description.match(/```(.*\n)+?```/g);

	var codeBlocksByExample = {};
	var optionsByExample = {};

	// Extracts examples from description blocks
	_.forEach(blocks, function(block) {
		var matches = block.match(/```([^\.\s]+)\.(\w+)(.*)\n/);
		var name = matches ? matches[1] : null;
		var syntax = matches ? matches[2] : null;
		var optionsString = matches ? matches[3] : '';

		if (!name) {
			// Unnamed examples are not renderable
			return;
		}

		var code = block
			.replace(/```\S*\n/m, '')  // Removes leading ```[syntax]
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

		codeBlocksByExample[name] = codeBlocksByExample[name] || [];
		codeBlocksByExample[name].push({
			syntax: syntax,
			code: code,
			hidden: _.has(options, 'hidden'),
			height: options.height,
		});
		optionsByExample[name] = optionsByExample[name] || {};
		optionsByExample[name].height = optionsByExample[name].height || options.height;
	});

	_.forEach(codeBlocksByExample, function(codeBlocks, exampleName) {
		var options = optionsByExample[exampleName];
		doc.addExample(exampleName, codeBlocks, options);
	});

	var hasExample = {};

	// Adds <example> tags for renderable HTML examples
	_.forEach(doc.getExamples(), function(example, name) {
		var exampleHtml = example.options.height
			? '<example name="' + name + '" height="' + example.options.height + '"></example>\n'
			: '<example name="' + name + '"></example>\n';

		description = description.replace(
			new RegExp('```' + name + '\.(html|jsx|handlebars|hbs)', 'gm'),
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
