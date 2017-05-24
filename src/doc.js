var _ = require('lodash');

/**
 * @constructs
 */
function Doc() {}

/* ---------------------------------------------------------------------
 * Public
 * --------------------------------------------------------------------- */

/**
 * @static
 * @param {Array} docs
 * @return {Array}
 */
Doc.merge = function(docs) {
	var docsGroupedByName = _.groupBy(docs, 'name');

	var docsMerged = _.map(docsGroupedByName, function(docsToMerge) {
		var docMerged = new Doc();

		_.forEach(docsToMerge, function(doc) {
			docMerged.import(doc);
		});

		return docMerged;
	});

	return docsMerged;
};

/**
 * @return {String}
 */
Doc.prototype.getName = function() {
	return this.name;
};

/**
 * @param {String} name
 */
Doc.prototype.setName = function(name) {
	this.name = name;
};

/**
 * @return {String}
 */
Doc.prototype.getCategory = function() {
	return this.category;
};

/**
 * @param {String} category
 */
Doc.prototype.setCategory = function(category) {
	this.category = category;
};

/**
 * @return {String}
 */
Doc.prototype.getDescription = function() {
	return this.description;
};

/**
 * @param {String} description
 */
Doc.prototype.setDescription = function(description) {
	this.description = description;
};

/**
 * @return {Object}
 */
Doc.prototype.getExamples = function() {
	return this.examples || {};
};

/**
 * @param {String} name
 * @param {Array.<Object>} codeBlocks
 * @param {String} codeBlocks[name].syntax
 * @param {String} codeBlocks[name].code
 * @param {Boolean} [codeBlocks[name].hidden]
 * @param {Object} [options]
 * @param {Number} [options.height]
 */
Doc.prototype.addExample = function(name, codeBlocks, options) {
	this.examples = this.examples || {};
	this.examples[name] = {
		codeBlocks: codeBlocks,
		options: options || {},
	};
};

/**
 * @return {Object} Set of key-value pairs
 */
Doc.prototype.getMeta = function() {
	return this.meta || {};
};

/**
 * @param {String} key
 * @param {*} value
 */
Doc.prototype.addMeta = function(key, value) {
	this.meta = this.meta || {};

	if (this.meta[key]) {
		this.meta[key].push(value);
	}
	else {
		this.meta[key] = [value];
	}
};

/**
 * @return {String}
 */
Doc.prototype.getSource = function() {
	return this.source;
};

/**
 * @param {String} source
 */
Doc.prototype.setSource = function(source) {
	this.source = source;
};

/**
 * @return {String}
 */
Doc.prototype.getFilepath = function() {
	return this.filepath;
};

/**
 * @param {String} filepath
 */
Doc.prototype.setFilepath = function(filepath) {
	this.filepath = filepath;
};

/**
 * @param {Doc} doc
 */
Doc.prototype.import = function(doc) {
	var self = this;

	this.name = doc.name;
	this.category = doc.category || this.category;
	this.source = doc.source || this.source;
	this.filepath = doc.filepath || this.filepath;

	if (doc.description) {
		var description = this.description ? this.description + '\n' : '';
		this.description = description + doc.description;
	}

	_.each(doc.getExamples(), function(example, name) {
		self.addExample(name, example.codeBlocks, example.options);
	});
	_.each(doc.getMeta(), function(meta, key) {
		_.each(meta, function(value) {
			self.addMeta(key, value);
		});
	});
};

module.exports = Doc;
