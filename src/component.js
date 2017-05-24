'use strict';

var _ = require('lodash');

class Component {

	/**
	 * @static
	 * @param {Array} docs
	 * @return {Array}
	 */
	static merge(docs) {
		var docsGroupedByName = _.groupBy(docs, 'name');

		var docsMerged = _.map(docsGroupedByName, function(docsToMerge) {
			var docMerged = new Component();

			_.forEach(docsToMerge, function(doc) {
				docMerged.import(doc);
			});

			return docMerged;
		});

		return docsMerged;
	}

	/**
	 * @return {String}
	 */
	getName() {
		return this.name;
	}

	/**
	 * @param {String} name
	 */
	setName(name) {
		this.name = name;
	}

	/**
	 * @return {String}
	 */
	getCategory() {
		return this.category;
	}

	/**
	 * @param {String} category
	 */
	setCategory(category) {
		this.category = category;
	}

	/**
	 * @return {String}
	 */
	getDescription() {
		return this.description;
	}

	/**
	 * @param {String} description
	 */
	setDescription(description) {
		this.description = description;
	}

	/**
	 * @return {Object}
	 */
	getExamples() {
		return this.examples || {};
	}

	/**
	 * @param {String} name
	 * @param {Array.<Object>} codeBlocks
	 * @param {String} codeBlocks[name].syntax
	 * @param {String} codeBlocks[name].code
	 * @param {Boolean} [codeBlocks[name].hidden]
	 * @param {Object} [options]
	 * @param {Number} [options.height]
	 */
	addExample(name, codeBlocks, options) {
		this.examples = this.examples || {};
		this.examples[name] = {
			codeBlocks: codeBlocks,
			options: options || {},
		};
	}

	/**
	 * @return {Object} Set of key-value pairs
	 */
	getMeta() {
		return this.meta || {};
	}

	/**
	 * @param {String} key
	 * @param {*} value
	 */
	addMeta(key, value) {
		this.meta = this.meta || {};

		if (this.meta[key]) {
			this.meta[key].push(value);
		}
		else {
			this.meta[key] = [value];
		}
	}

	/**
	 * @return {String}
	 */
	getSource() {
		return this.source;
	}

	/**
	 * @param {String} source
	 */
	setSource(source) {
		this.source = source;
	}

	/**
	 * @return {String}
	 */
	getFilepath() {
		return this.filepath;
	}

	/**
	 * @param {String} filepath
	 */
	setFilepath(filepath) {
		this.filepath = filepath;
	}

	/**
	 * @param {Component} doc
	 */
	import(doc) {
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
	}
}

module.exports = Component;
