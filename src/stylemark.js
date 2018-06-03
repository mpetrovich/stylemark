var rfr = require('rfr');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var Parser = rfr('src/parser');
var generator = rfr('src/generator');
var _ = require('lodash');

var jsExtensions = require('common-js-file-extensions');
var markdownExtensions = require('markdown-extensions');
var cssExtensions = ['css', 'less', 'scss', 'sass'];
var defaultMatchExtensions = _(jsExtensions.code)
	.concat(markdownExtensions)
	.concat(cssExtensions)
	.thru(exts => new RegExp('\\.(' + exts.join('|') + ')$'))
	.value();

var defaultExcludeDirectories = ['.git', 'node_modules'];

function generate(params) {
	var input = path.resolve(params.input);
	var output = path.resolve(params.output);
	var configPath = params.configPath ? path.resolve(params.configPath) : path.resolve(input, '.stylemark.yml');
	var options = getConfig(configPath);

	options.input = input;
	options.output = output;
	options.match = options.match || defaultMatchExtensions;
	options.excludeDir = defaultExcludeDirectories.concat(options.excludeDir);
	options.configDir = fs.existsSync(configPath) ? path.dirname(configPath) : throw 'Missing configuration file';

	['match', 'excludeDir'].forEach(name => {
		options[name] = _.isString(options[name]) ? new RegExp(options[name]) : options[name];
	});

	var parser = new Parser(options);

	parser.parseDir(input, (error, docs) => {
		if (error) {
			console.error(error, error.stack);
			return;
		}
		generator.generate(docs, output, options);
	});
}

function getConfig(filepath) {
	if (!fs.existsSync(filepath)) {
		return {};
	}
	var contents = fs.readFileSync(filepath, 'utf8');
	var config = yaml.safeLoad(contents);
	return config;
}

module.exports = generate;
