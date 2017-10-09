var rfr = require('rfr');
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var marked = rfr('src/marked');
var _ = require('lodash');
var moment = require('moment');

var helpers = {
	date: function(date, format) {
		return moment(date).format(format);
	},
	timeago: function(date) {
		return moment(date).fromNow();
	},
	math: function(lvalue, operator, rvalue, options) {
		lvalue = parseFloat(lvalue);
		rvalue = parseFloat(rvalue);
		// @todo Use switch with options.fn() and options.inverse()
		return {
			'+': lvalue + rvalue,
			'-': lvalue - rvalue,
			'*': lvalue * rvalue,
			'/': lvalue / rvalue,
			'%': lvalue % rvalue,
		}[operator];
	},
	compare: function(lvalue, operator, rvalue, options) {
		// @todo Use switch with options.fn() and options.inverse()
		return {
			'===': lvalue === rvalue,
			'!==': lvalue !== rvalue,
			'==': lvalue == rvalue,
			'!=': lvalue != rvalue,
			'<=': lvalue <= rvalue,
			'>=': lvalue >= rvalue,
			'<': lvalue < rvalue,
			'>': lvalue > rvalue,
			'||': (lvalue || rvalue) ? true : false,
			'&&': (lvalue && rvalue) ? true : false,
		}[operator];
	},
	limit: function(value, limit) {
		value = value || '';
		return value.substr(0, limit);
	},
	markdown: function(markdown) {
		markdown = markdown || '';

		// Escapes '<object>'
		markdown = markdown
			.replace(/<Object>/g, '&lt;Object&gt;')
			.replace(/<object>/g, '&lt;object&gt;');

		return new Handlebars.SafeString(marked(markdown));
	},
	isArray: function(value) {
		return _.isArray(value);
	},
	matches: function(value, element) {
		value = value ? value.toString() : '';
		var regex = new RegExp(element);
		return regex.test(value);
	},
	or: function() {
		return _(arguments)
			.slice(0, -1)
			.filter()
			.first();
	},
	and: function() {
		return _.reduce(arguments, (result, arg) => result && arg, true);
	},
	join: function(value, delimiter) {
		return _.join(value, delimiter);
	},
	odd: function(value) {
		return value % 2 !== 0;
	},
	even: function(value) {
		return value % 2 === 0;
	},
	quote: function(string) {
		return '"' + string + '"';
	},
};

var partials = {
	sidebar: 'templates/sidebar.handlebars',
	doc: 'templates/doc.handlebars',
};

_.forEach(helpers, (func, name) => Handlebars.registerHelper(name, func));
_.forEach(partials, (filepath, name) => Handlebars.registerPartial(name, fs.readFileSync(path.join(__dirname, filepath), 'utf8')));

module.exports = Handlebars;
