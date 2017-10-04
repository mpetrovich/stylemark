var rfr = require('rfr');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var parser = rfr('src/parser');
var generator = rfr('src/generator');

function generate(params) {
	var input = params.input;
	var output = params.output;
	var configPath = params.configPath || path.join(params.input, '.stylemark.yml');
	var options = configPath ? getConfig(configPath) : {};

	options.input = input;
	options.output = output;

	parser.parseDir(input, options, (error, docs) => {
		if (error) {
			console.error(error);
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
