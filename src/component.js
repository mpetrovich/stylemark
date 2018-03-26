'use strict';

var _ = require('lodash');

class Component {

	/**
	 * @static
	 * @param {Array} components
	 * @return {Array}
	 */
	static merge(components) {
		var componentsGroupedByName = _.groupBy(components, 'name');

		var mergedComponents = _.map(componentsGroupedByName, (componentsToMerge) => {
			var mergedComponent = new Component();

			_.forEach(componentsToMerge, (component) => component.importInto(mergedComponent));

			return mergedComponent;
		});

		return mergedComponents;
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
	getHead() {
		return this.head;
	}

	/**
	 * @param {String} head
	 */
	setHead(head) {
		this.head = head;
	}


	/**
	 * @return {String}
	 */
	getHeadHtml() {
		return this.headHtml;
	}

	/**
	 * @param {String} headHtml
	 */
	setHeadHtml(headHtml) {
		this.headHtml = headHtml;
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
	 * @param {Array.<Object>} blocks
	 * @param {String} blocks[name].syntax
	 * @param {String} blocks[name].content
	 * @param {Boolean} [blocks[name].hidden]
	 * @param {Object} [options]
	 * @param {Number} [options.height]
	 */
	addExample(name, blocks, options, head, headHtml) {
		this.examples = this.examples || {};
		this.examples[name] = {
			name: name,
			blocks: blocks,
			options: options || {},
		};

		if (headHtml) {
			this.examples[name].headHtml = headHtml;
		}

		if (head) {
			this.examples[name].head = head;
		}
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
			// List
			this.meta[key] = _.isArray(this.meta[key]) ? this.meta[key] : [this.meta[key]];
			value = _.isArray(value) ? value : [value];
			this.meta[key] = this.meta[key].concat(value);
		}
		else {
			// Single
			this.meta[key] = value;
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
	 * Adds data from this component into a given one.
	 *
	 * If set on this component, these fields will be overwritten in the given component:
	 * - name
	 * - head
	 * - headHtml
	 * - category
	 * - source
	 * - filepath
	 *
	 * These fields will be merged with those in the given component:
	 * - description
	 * - examples
	 * - meta
	 *
	 * @param {Component} to
	 */
	importInto(to) {
		var from = this;

		to.name = from.name;
		to.head = from.head || to.head;
		to.headHtml = from.headHtml || to.headHtml;
		to.category = from.category || to.category;
		to.source = from.source || to.source;
		to.filepath = from.filepath || to.filepath;


		if (from.description) {
			let description = to.description ? to.description + '\n' : '';
			to.description = description + from.description;
		}

		_.each(from.getExamples(), (example, name) => {
			to.addExample(name, example.blocks, example.options, to.head, to.headHtml);
		});

		_.each(from.getMeta(), (value, key) => {
			if (_.isArray(value)) {
				// List
				_.each(value, (item) => {
					to.addMeta(key, item);
				});
			}
			else {
				// Single
				to.addMeta(key, value);
			}
		});
	}
}

module.exports = Component;
