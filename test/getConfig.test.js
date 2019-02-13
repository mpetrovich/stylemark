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

describe('getConfig loads the configuration', () => {
	it('No input will not get config', () => expect(getConfig()).to.deep.equal({}));
	var configPath = path.resolve('test', '.stylemark.yml');
	it('Loads config from defined config file path', () => expect(getConfig(configPath)).to.deep.equal(expectedConfig));
});
