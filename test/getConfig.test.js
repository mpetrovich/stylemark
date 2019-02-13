'use strict';

var path = require('path');
var expect = require('chai').expect;
var getConfig = require('../src/stylemark').getConfig;
var expectedConfig = {
	"assets": [
		"img"
	],
	"baseDir": "input",
	"examples": {
		"bodyHtml": "<div style=\"padding: 20px\">\n    {html}\n</div>\n",
		"bodyTag": "<body class=\"acme-body\">",
		"css": null,
		"doctypeTag": "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">",
		"headHtml": "<meta name=\"google-site-verification\" content=\"52cae…\">\n<script>\n    window.disableRouting = true;\n</script>\n",
		"htmlTag": "<html id=\"acme\">",
		"js": null,
	},
	"fileWatchPaths": [ 'input/A', 'input/B' ],
	"browserSyncOptions": {
		files: [ './output/**/*.*' ]
	},
	"excludeDir": [
		"excludedDirectory"
	],
	"name": "Acme Design",
	"order": null,
	"theme": {
		"css": null,
		"js": null,
		"sidebar": {
			"background": "#3b2a55",
			"textColor": "#fff"
		}
	}
}

describe('The config file', () => {
	var configPath = path.resolve('test', '.stylemark.yml');
	var config = getConfig(configPath);
	it('should not be loaded if no config path is given', () => expect(getConfig()).to.be.empty);
	it('should load the config behind the given config file path', () => expect(config).to.not.be.empty);
	it('should match with the test config example', () => expect(config).to.deep.equal(expectedConfig));
});
