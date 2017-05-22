var rfr = require('rfr');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');

describe('Parser.parse() with a Handlebars example', function() {
	var content = fs.readFileSync('test/handlebars/input.txt', 'utf8');
	var parser = new Parser();
	var docs = parser.parse(content);
	var doc = docs[0];

	it('should return the correct number of docs', function() {
		expect(docs.length).to.equal(1);
	});
	it('should have the correct doc name', function() {
		expect(doc.getName()).to.equal('Button');
	});
	it('should have the correct doc description', function() {
		expect(doc.getDescription()).to.equal(
			fs.readFileSync('test/handlebars/expected.md', 'utf8')
		);
	});
});
